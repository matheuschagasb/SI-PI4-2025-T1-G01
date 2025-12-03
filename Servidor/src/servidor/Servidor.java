package servidor;

import comunicacao.ComunicadoDeDesligamento;
import comunicacao.Parceiro;

import java.io.*;
import java.util.*;

public class Servidor {
    public static String PORTA_PADRAO = "3000";
    private static Set<String> ipsPermitidos = new HashSet<>();

    public static void main(String[] args) {
        System.out.println("=== SERVIDOR SOUNDBRIDGE - TCP SOCKET ===\n");

        // Carregar IPs permitidos
        carregarWhitelist();

        // Solicitar configurações
        String porta = solicitarPorta();
        String host = solicitarHost();

        ArrayList<Parceiro> usuarios = new ArrayList<>();

        AceitadoraDeConexao aceitadoraDeConexao = null;
        try {
            aceitadoraDeConexao = new AceitadoraDeConexao(porta, host, usuarios, ipsPermitidos);
            aceitadoraDeConexao.start();
        } catch (Exception erro) {
            System.err.println("Erro ao iniciar servidor: " + erro.getMessage());
            System.err.println("Escolha uma porta apropriada e liberada para uso!\n");
            return;
        }

        System.out.println("\n✅ Servidor ativo em " + host + ":" + porta);
        System.out.println("📋 IPs permitidos: " + ipsPermitidos.size() + " endereços carregados");

        // Loop principal
        for (;;) {
            System.out.println("\n==========================================");
            System.out.println("O servidor esta ativo!");
            System.out.println("Comandos disponiveis:");
            System.out.println("  - 'desativar' : Desliga o servidor");
            System.out.println("  - 'status'    : Mostra usuarios conectados");
            System.out.println("==========================================");
            System.out.print("> ");

            String comando = null;
            try {
                comando = Teclado.getUmString();
            } catch (Exception erro) {
            }

            if (comando == null || comando.trim().isEmpty()) {
                continue;
            }

            comando = comando.toLowerCase().trim();

            if (comando.equals("desativar")) {
                System.out.println("\n🔄 Encerrando servidor...");
                synchronized (usuarios) {
                    ComunicadoDeDesligamento comunicadoDeDesligamento = new ComunicadoDeDesligamento();

                    System.out.println("📤 Notificando " + usuarios.size() + " cliente(s) conectado(s)...");
                    for (Parceiro usuario : usuarios) {
                        try {
                            usuario.receba(comunicadoDeDesligamento);
                            usuario.adeus();
                        } catch (Exception erro) {
                            System.err.println("⚠️  Erro ao notificar cliente: " + erro.getMessage());
                        }
                    }
                }

                System.out.println("✅ O servidor foi desativado!\n");
                System.exit(0);
            } else if (comando.equals("status")) {
                synchronized (usuarios) {
                    System.out.println("\n📊 STATUS DO SERVIDOR");
                    System.out.println("Usuários conectados: " + usuarios.size());
                    if (usuarios.isEmpty()) {
                        System.out.println("(Nenhum cliente conectado no momento)");
                    }
                }
            } else {
                System.err.println("❌ Comando invalido! Use 'desativar' ou 'status'\n");
            }
        }
    }

    private static void carregarWhitelist() {
        try {
            File arquivo = new File("resources/whitelist.txt");
            if (!arquivo.exists()) {
                System.out.println("⚠️  Arquivo whitelist.txt não encontrado. Criando com valores padrão...");
                // Adiciona IPs padrão
                ipsPermitidos.add("127.0.0.1");
                ipsPermitidos.add("0:0:0:0:0:0:0:1"); // IPv6 localhost
                return;
            }

            BufferedReader reader = new BufferedReader(new FileReader(arquivo));
            String linha;
            while ((linha = reader.readLine()) != null) {
                linha = linha.trim();
                if (!linha.isEmpty() && !linha.startsWith("#")) {
                    ipsPermitidos.add(linha);
                    if (linha.equals("localhost")) {
                        ipsPermitidos.add("127.0.0.1");
                        ipsPermitidos.add("0:0:0:0:0:0:0:1");
                    }
                }
            }
            reader.close();
            System.out.println("✅ Whitelist carregada: " + ipsPermitidos.size() + " IPs permitidos");
        } catch (IOException e) {
            System.err.println("⚠️  Erro ao carregar whitelist: " + e.getMessage());
            System.out.println("Usando apenas localhost como padrão.");
            ipsPermitidos.add("127.0.0.1");
            ipsPermitidos.add("0:0:0:0:0:0:0:1");
        }
    }

    private static String solicitarPorta() {
        System.out.print("Digite a porta do servidor [" + PORTA_PADRAO + "]: ");
        String porta = Teclado.getUmString();
        if (porta == null || porta.trim().isEmpty()) {
            porta = PORTA_PADRAO;
        }
        return porta.trim();
    }

    private static String solicitarHost() {
        System.out.print("Digite o host do servidor [localhost]: ");
        String host = Teclado.getUmString();
        if (host == null || host.trim().isEmpty()) {
            host = "localhost";
        }
        return host.trim();
    }
}
