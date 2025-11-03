package src;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.Scanner;
import java.util.concurrent.Executors;

public class Main {
    private static final int PORTA_PADRAO = 8080;
    private static HttpServer server;

    public static void main(String[] args) throws IOException {
        int porta = PORTA_PADRAO;

        if (args.length > 0) {
            try {
                porta = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("A porta deve ser um número. Usando a porta padrão: " + PORTA_PADRAO);
            }
        }

        server = HttpServer.create(new InetSocketAddress(porta), 0);

        server.createContext("/", new RootHandler());

        server.createContext("/api/teste", new TesteHandler());
        server.createContext("/api/login", new src.LoginHandler());

        server.setExecutor(Executors.newCachedThreadPool());
        server.start();

        System.out.println("Servidor HTTP iniciado na porta " + porta);
        System.out.println("Digite 'desativar' para parar o servidor.");

        new Thread(() -> {
            Scanner scanner = new Scanner(System.in);
            while (true) {
                if (scanner.hasNextLine()) {
                    String input = scanner.nextLine();
                    if ("desativar".equalsIgnoreCase(input)) {
                        System.out.println("Parando o servidor...");
                        server.stop(1);
                        System.out.println("Servidor parado.");
                        System.exit(0);
                    }
                }
            }
        }).start();
    }

    static class RootHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "Servidor está no ar! Use rotas como /api/login para interagir.";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class TesteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            
            String response = "Olá do endpoint de teste!";

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}
