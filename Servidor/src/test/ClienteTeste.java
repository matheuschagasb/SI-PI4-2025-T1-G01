package test;

import comunicacao.*;
import model.*;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.List;
import java.util.Scanner;

public class ClienteTeste {
    private Socket socket;
    private ObjectOutputStream out;
    private ObjectInputStream in;
    private Scanner scanner;

    public ClienteTeste(String host, int porta) throws Exception {
        System.out.println("🔗 Conectando ao servidor " + host + ":" + porta + "...");
        this.socket = new Socket(host, porta);
        this.out = new ObjectOutputStream(socket.getOutputStream());
        this.in = new ObjectInputStream(socket.getInputStream());
        this.scanner = new Scanner(System.in);
        System.out.println("✅ Conectado com sucesso!\n");
    }

    private void enviar(Comunicado comunicado) throws Exception {
        out.writeObject(comunicado);
        out.flush();
    }

    private Resultado receber() throws Exception {
        return (Resultado) in.readObject();
    }

    public void testarLogin() {
        System.out.println("\n=== TESTE DE LOGIN ===");
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Senha: ");
        String senha = scanner.nextLine();
        System.out.print("Role (musico/contratante): ");
        String role = scanner.nextLine();

        try {
            PedidoDeLogin pedido = new PedidoDeLogin(email, senha, role);
            enviar(pedido);
            Resultado resultado = receber();

            System.out.println("\n📬 Resposta do servidor:");
            System.out.println("   Sucesso: " + resultado.isSucesso());
            System.out.println("   Mensagem: " + resultado.getMensagem());
            
            if (resultado.isSucesso() && resultado.getDados() != null) {
                if (resultado.getDados() instanceof Musico) {
                    Musico musico = (Musico) resultado.getDados();
                    System.out.println("   🎵 Músico logado: " + musico.getNome());
                    System.out.println("      ID: " + musico.getId());
                    System.out.println("      Gênero: " + musico.getGeneroMusical());
                    System.out.println("      Preço/hora: R$ " + musico.getPreco());
                } else if (resultado.getDados() instanceof Contratante) {
                    Contratante contratante = (Contratante) resultado.getDados();
                    System.out.println("   🏢 Contratante logado: " + contratante.getNome());
                    System.out.println("      ID: " + contratante.getId());
                    System.out.println("      Estabelecimento: " + contratante.getNomeEstabelecimento());
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erro no login: " + e.getMessage());
        }
    }

    public void testarBuscarMusicos() {
        System.out.println("\n=== TESTE DE BUSCA DE MÚSICOS ===");
        System.out.print("Gênero musical (ou ENTER para todos): ");
        String genero = scanner.nextLine();
        if (genero.trim().isEmpty()) {
            genero = null;
        }

        try {
            PedidoBuscarMusicos pedido = new PedidoBuscarMusicos(genero);
            enviar(pedido);
            Resultado resultado = receber();

            System.out.println("\n📬 Resposta do servidor:");
            System.out.println("   Sucesso: " + resultado.isSucesso());
            System.out.println("   Mensagem: " + resultado.getMensagem());

            if (resultado.getDados() instanceof List) {
                @SuppressWarnings("unchecked")
                List<Musico> musicos = (List<Musico>) resultado.getDados();
                System.out.println("\n   🎵 Músicos encontrados: " + musicos.size());
                for (int i = 0; i < musicos.size() && i < 5; i++) {
                    Musico m = musicos.get(i);
                    System.out.println("\n   " + (i+1) + ". " + m.getNome());
                    System.out.println("      ID: " + m.getId());
                    System.out.println("      Gênero: " + m.getGeneroMusical());
                    System.out.println("      Cidade: " + m.getCidade() + "/" + m.getEstado());
                    System.out.println("      Preço: R$ " + m.getPreco() + "/hora");
                }
                if (musicos.size() > 5) {
                    System.out.println("\n   ... e mais " + (musicos.size() - 5) + " músico(s)");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erro na busca: " + e.getMessage());
        }
    }

    public void testarCriarContrato() {
        System.out.println("\n=== TESTE DE CRIAÇÃO DE CONTRATO ===");
        System.out.print("ID do músico: ");
        String musicoId = scanner.nextLine();
        System.out.print("Email do contratante: ");
        String emailContratante = scanner.nextLine();
        System.out.print("Data do evento (YYYY-MM-DD): ");
        String data = scanner.nextLine();
        System.out.print("Hora do evento (HH:MM): ");
        String hora = scanner.nextLine();
        System.out.print("Duração em horas: ");
        int duracao = Integer.parseInt(scanner.nextLine());
        System.out.print("Local do evento: ");
        String local = scanner.nextLine();
        System.out.print("Observações: ");
        String obs = scanner.nextLine();

        try {
            PedidoCriarContrato pedido = new PedidoCriarContrato(
                musicoId, emailContratante, data, hora, duracao, local, obs
            );
            enviar(pedido);
            Resultado resultado = receber();

            System.out.println("\n📬 Resposta do servidor:");
            System.out.println("   Sucesso: " + resultado.isSucesso());
            System.out.println("   Mensagem: " + resultado.getMensagem());

            if (resultado.isSucesso() && resultado.getDados() instanceof Contrato) {
                Contrato contrato = (Contrato) resultado.getDados();
                System.out.println("\n   📝 Contrato criado:");
                System.out.println("      ID: " + contrato.getId());
                System.out.println("      Músico: " + contrato.getMusico().getNome());
                System.out.println("      Contratante: " + contrato.getContratante().getNome());
                System.out.println("      Data: " + contrato.getDataEvento());
                System.out.println("      Duração: " + contrato.getDuracao() + "h");
                System.out.println("      Valor: R$ " + contrato.getValorTotal());
                System.out.println("      Status: " + contrato.getStatus());
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar contrato: " + e.getMessage());
        }
    }

    public void testarBuscarContratos() {
        System.out.println("\n=== TESTE DE BUSCA DE CONTRATOS ===");
        System.out.print("ID do usuário: ");
        String usuarioId = scanner.nextLine();
        System.out.print("Tipo (musico/contratante): ");
        String tipo = scanner.nextLine();

        try {
            PedidoBuscarContratos pedido = new PedidoBuscarContratos(usuarioId, tipo);
            enviar(pedido);
            Resultado resultado = receber();

            System.out.println("\n📬 Resposta do servidor:");
            System.out.println("   Sucesso: " + resultado.isSucesso());
            System.out.println("   Mensagem: " + resultado.getMensagem());

            if (resultado.getDados() instanceof List) {
                @SuppressWarnings("unchecked")
                List<Contrato> contratos = (List<Contrato>) resultado.getDados();
                System.out.println("\n   📋 Contratos encontrados: " + contratos.size());
                for (int i = 0; i < contratos.size(); i++) {
                    Contrato c = contratos.get(i);
                    System.out.println("\n   " + (i+1) + ". Contrato #" + c.getId().substring(0, 8) + "...");
                    System.out.println("      Músico: " + c.getMusico().getNome());
                    System.out.println("      Contratante: " + c.getContratante().getNome());
                    System.out.println("      Data: " + c.getDataEvento());
                    System.out.println("      Status: " + c.getStatus());
                    System.out.println("      Valor: R$ " + c.getValorTotal());
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erro na busca: " + e.getMessage());
        }
    }

    public void fechar() {
        try {
            enviar(new PedidoParaSair());
            socket.close();
            System.out.println("\n👋 Desconectado do servidor");
        } catch (Exception e) {
            System.err.println("Erro ao fechar: " + e.getMessage());
        }
    }

    public void menu() {
        while (true) {
            System.out.println("\n" + "=".repeat(50));
            System.out.println("🎵 CLIENTE DE TESTE - SOUNDBRIDGE");
            System.out.println("=".repeat(50));
            System.out.println("1. Testar Login");
            System.out.println("2. Testar Buscar Músicos");
            System.out.println("3. Testar Criar Contrato");
            System.out.println("4. Testar Buscar Contratos");
            System.out.println("0. Sair");
            System.out.print("\nEscolha uma opção: ");

            String opcao = scanner.nextLine();

            switch (opcao) {
                case "1":
                    testarLogin();
                    break;
                case "2":
                    testarBuscarMusicos();
                    break;
                case "3":
                    testarCriarContrato();
                    break;
                case "4":
                    testarBuscarContratos();
                    break;
                case "0":
                    fechar();
                    return;
                default:
                    System.out.println("❌ Opção inválida!");
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.println("🎵 CLIENTE DE TESTE - SOUNDBRIDGE\n");
        System.out.println("⚠️  ATENÇÃO: Apenas pressione ENTER para usar os valores padrão!");
        System.out.println("   Host padrão: localhost");
        System.out.println("   Porta padrão: 3000\n");
        
        System.out.print("Host [localhost] ou ENTER: ");
        String host = sc.nextLine().trim();
        if (host.isEmpty()) host = "localhost";
        
        System.out.print("Porta [3000] ou ENTER: ");
        String portaStr = sc.nextLine().trim();
        int porta;
        
        if (portaStr.isEmpty()) {
            porta = 3000;
        } else {
            try {
                porta = Integer.parseInt(portaStr);
            } catch (NumberFormatException e) {
                System.err.println("❌ Porta inválida! Usando porta padrão 3000");
                porta = 3000;
            }
        }

        try {
            ClienteTeste cliente = new ClienteTeste(host, porta);
            cliente.menu();
        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar: " + e.getMessage());
            System.err.println("\n💡 Dica: Certifique-se de que o servidor está rodando!");
            System.err.println("   Execute em outro terminal: .\\executar-servidor.bat");
        }
    }
}
