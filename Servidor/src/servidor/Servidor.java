package servidor;

import java.io.IOException;
import java.net.ServerSocket;

// Servidor que aguarda conexões e as delega para threads.
public class Servidor {
    private static final int PORTA_PADRAO = 3001;

    public static void main(String[] args) {
        int porta = PORTA_PADRAO;
        // Configura a porta do servidor, usando argumento ou padrão.
        if (args.length > 0) {
            try {
                porta = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("A porta deve ser um número. Usando a porta padrão: " + porta);
            }
        }

        try {
            // Cria o socket do servidor.
            ServerSocket servidorSocket = new ServerSocket(porta);
            System.out.println("Servidor manual iniciado na porta " + porta);

            // Inicia a thread que aceita conexões de clientes.
            AceitadoraDeConexao aceitadora = new AceitadoraDeConexao(servidorSocket);
            aceitadora.start();

            System.out.println("Pressione Ctrl+C para parar o servidor.");

        } catch (IOException e) {
            System.err.println("Erro ao iniciar o servidor na porta " + porta + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
