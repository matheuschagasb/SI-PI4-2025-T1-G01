package servidor;

import comunicacao.*;
import bd.*;
import model.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class SupervisoraDeConexao extends Thread {
    private Parceiro parceiro;
    private boolean ativa;

    public SupervisoraDeConexao(Parceiro parceiro) throws Exception {
        if (parceiro == null) {
            throw new Exception("Parceiro ausente");
        }
        this.parceiro = parceiro;
        this.ativa = true;
    }

    public void run() {
        try {
            System.out.println("🔗 Cliente conectado");

            while (ativa) {
                Comunicado comunicado = (Comunicado) parceiro.espie();

                if (comunicado == null) {
                    continue;
                } else if (comunicado instanceof PedidoParaSair) {
                    parceiro.envie();
                    ativa = false;
                } else if (comunicado instanceof PedidoDeLogin) {
                    tratarLogin();
                } else if (comunicado instanceof PedidoBuscarMusicos) {
                    tratarBuscaMusicos();
                } else if (comunicado instanceof PedidoCriarContrato) {
                    tratarCriacaoContrato();
                } else if (comunicado instanceof PedidoBuscarContratos) {
                    tratarBuscaContratos();
                } else {
                    parceiro.envie();
                    parceiro.receba(new Resultado(false, "Comando desconhecido"));
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️  Erro na supervisão: " + e.getMessage());
        } finally {
            try {
                parceiro.adeus();
                System.out.println("🔌 Cliente desconectado");
            } catch (Exception e) {
                System.err.println("⚠️  Erro ao encerrar conexão: " + e.getMessage());
            }
        }
    }

    private void tratarLogin() {
        try {
            PedidoDeLogin pedido = (PedidoDeLogin) parceiro.envie();
            String email = pedido.getEmail();
            String senha = pedido.getSenha();
            String role = pedido.getRole();

            if (role == null || (!role.equalsIgnoreCase("musico") && !role.equalsIgnoreCase("contratante"))) {
                parceiro.receba(new Resultado(false, "Role inválida. Use 'musico' ou 'contratante'"));
                return;
            }

            boolean autenticado = false;
            Object usuario = null;

            if (role.equalsIgnoreCase("musico")) {
                autenticado = MusicoDAO.validarSenha(email, senha);
                if (autenticado) {
                    usuario = MusicoDAO.buscarPorEmail(email);
                }
            } else if (role.equalsIgnoreCase("contratante")) {
                autenticado = ContratanteDAO.validarSenha(email, senha);
                if (autenticado) {
                    usuario = ContratanteDAO.buscarPorEmail(email);
                }
            }

            if (autenticado && usuario != null) {
                parceiro.receba(new Resultado(true, "Login bem-sucedido", usuario));
                System.out.println("✅ Login bem-sucedido: " + email + " (" + role + ")");
            } else {
                parceiro.receba(new Resultado(false, "Credenciais inválidas"));
                System.out.println("❌ Login falhou: " + email + " (" + role + ")");
            }

        } catch (Exception e) {
            try {
                parceiro.receba(new Resultado(false, "Erro ao processar login: " + e.getMessage()));
            } catch (Exception ex) {
                System.err.println("⚠️  Erro ao enviar resposta de erro: " + ex.getMessage());
            }
        }
    }

    private void tratarBuscaMusicos() {
        try {
            PedidoBuscarMusicos pedido = (PedidoBuscarMusicos) parceiro.envie();
            String generoMusical = pedido.getGeneroMusical();

            List<Musico> musicos = MusicoDAO.buscarTodos(generoMusical);

            if (musicos.isEmpty()) {
                parceiro.receba(new Resultado(true, "Nenhum músico encontrado"));
            } else {
                parceiro.receba(new Resultado(true, "Músicos encontrados", musicos));
                System.out.println("🎵 Busca realizada: " + musicos.size() + " músico(s) encontrado(s)" +
                        (generoMusical != null ? " (gênero: " + generoMusical + ")" : ""));
            }

        } catch (Exception e) {
            try {
                parceiro.receba(new Resultado(false, "Erro ao buscar músicos: " + e.getMessage()));
            } catch (Exception ex) {
                System.err.println("⚠️  Erro ao enviar resposta de erro: " + ex.getMessage());
            }
        }
    }

    private void tratarCriacaoContrato() {
        String musicoId = null;
        try {
            PedidoCriarContrato pedido = (PedidoCriarContrato) parceiro.envie();

            // Validações básicas
            if (pedido.getMusicoId() == null || pedido.getEmailContratante() == null) {
                parceiro.receba(new Resultado(false, "IDs de músico e email do contratante são obrigatórios"));
                return;
            }

            if (pedido.getData() == null || pedido.getHora() == null) {
                parceiro.receba(new Resultado(false, "Data e hora do evento são obrigatórias"));
                return;
            }

            if (pedido.getDuracao() <= 0) {
                parceiro.receba(new Resultado(false, "Duração deve ser maior que zero"));
                return;
            }

            musicoId = pedido.getMusicoId();

            // 🔒 ADQUIRE LOCK EXCLUSIVO DO MÚSICO (previne race conditions)
            MutexManager.adquirirLock(musicoId);

            try {
                // Verifica se músico existe
                Musico musico = MusicoDAO.buscarPorId(musicoId);
                if (musico == null) {
                    parceiro.receba(new Resultado(false, "Músico não encontrado"));
                    return;
                }

                // Busca contratante por email
                Contratante contratante = ContratanteDAO.buscarPorEmail(pedido.getEmailContratante());
                if (contratante == null) {
                    parceiro.receba(new Resultado(false, "Contratante não encontrado"));
                    return;
                }

                // Converte data/hora para LocalDateTime
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                LocalDateTime dataEvento = LocalDateTime.parse(pedido.getData() + " " + pedido.getHora(), formatter);
                LocalDateTime fimEvento = dataEvento.plusHours(pedido.getDuracao());
                
                // Verifica conflito de horário (dentro do lock!)
                boolean temConflito = ContratoDAO.verificarConflito(musicoId, dataEvento, fimEvento);
                if (temConflito) {
                    parceiro.receba(new Resultado(false, "Músico já possui contrato confirmado neste horário"));
                    return;
                }

                // Calcula valor total baseado no preço do músico
                double valorTotal = Double.parseDouble(musico.getPreco()) * pedido.getDuracao();

                // Cria o contrato (dentro do lock!)
                Contrato contrato = ContratoDAO.criar(
                    musicoId,
                    contratante.getId(),
                    dataEvento,
                    pedido.getDuracao(),
                    valorTotal,
                    pedido.getLocalEvento(),
                    pedido.getObservacoes()
                );

                parceiro.receba(new Resultado(true, "Contrato criado com sucesso", contrato));
                System.out.println("📝 Contrato criado: " + contrato.getId() + 
                        " (Músico: " + musico.getNome() + ", Contratante: " + contratante.getNome() + ")");

            } finally {
                // 🔓 SEMPRE LIBERA O LOCK
                MutexManager.liberarLock(musicoId);
            }

        } catch (Exception e) {
            if (musicoId != null) {
                MutexManager.liberarLock(musicoId);
            }
            try {
                parceiro.receba(new Resultado(false, "Erro ao criar contrato: " + e.getMessage()));
            } catch (Exception ex) {
                System.err.println("⚠️  Erro ao enviar resposta de erro: " + ex.getMessage());
            }
        }
    }

    private void tratarBuscaContratos() {
        try {
            PedidoBuscarContratos pedido = (PedidoBuscarContratos) parceiro.envie();
            String usuarioId = pedido.getUsuarioId();
            String tipoUsuario = pedido.getTipoUsuario();

            if (usuarioId == null || tipoUsuario == null) {
                parceiro.receba(new Resultado(false, "ID e tipo de usuário são obrigatórios"));
                return;
            }

            List<Contrato> contratos;

            if (tipoUsuario.equalsIgnoreCase("musico")) {
                contratos = ContratoDAO.buscarPorMusicoId(usuarioId);
            } else if (tipoUsuario.equalsIgnoreCase("contratante")) {
                contratos = ContratoDAO.buscarPorContratanteId(usuarioId);
            } else {
                parceiro.receba(new Resultado(false, "Tipo de usuário inválido. Use 'musico' ou 'contratante'"));
                return;
            }

            if (contratos.isEmpty()) {
                parceiro.receba(new Resultado(true, "Nenhum contrato encontrado"));
            } else {
                parceiro.receba(new Resultado(true, "Contratos encontrados", contratos));
                System.out.println("📋 Busca de contratos: " + contratos.size() + " encontrado(s) (" + tipoUsuario + ")");
            }

        } catch (Exception e) {
            try {
                parceiro.receba(new Resultado(false, "Erro ao buscar contratos: " + e.getMessage()));
            } catch (Exception ex) {
                System.err.println("⚠️  Erro ao enviar resposta de erro: " + ex.getMessage());
            }
        }
    }

    public void desativar() {
        this.ativa = false;
    }
}
