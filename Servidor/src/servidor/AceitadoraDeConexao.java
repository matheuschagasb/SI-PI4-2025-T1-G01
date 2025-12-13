package servidor;

import java.net.ServerSocket;
import java.net.Socket;

public class AceitadoraDeConexao extends Thread {
    private final ServerSocket servidor;

    public AceitadoraDeConexao(ServerSocket servidor) {
        this.servidor = servidor;
    }

    @Override
    public void run() {
        System.out.println("Aguardando conexões de clientes...");

        while (true) {
            try {
                Socket cliente = this.servidor.accept();
                System.out.println("Cliente conectado: " + cliente.getInetAddress().getHostAddress());

                SupervisoraDeConexao supervisora = new SupervisoraDeConexao(cliente);
                supervisora.start();

            } catch (Exception e) {
                System.err.println("Erro ao aceitar conexão do cliente: " + e.getMessage());
            }
        }
    }
}
