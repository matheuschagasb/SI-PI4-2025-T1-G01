package servidor;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.http.HttpResponse;
import java.util.Scanner;
import java.util.concurrent.Executors;

public class Servidor {
    private static final int PORTA_PADRAO = 3001;

    public static void main(String[] args) throws IOException {
        int porta = PORTA_PADRAO;
        if (args.length > 0) {
            try {
                porta = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("A porta deve ser um número. Usando a porta padrão: " + porta);
            }
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(porta), 0);

        server.createContext("/", new ProxyHandler());

        server.setExecutor(Executors.newCachedThreadPool());
        server.start();

        System.out.println("Servidor Proxy HTTP iniciado na porta " + porta);
        System.out.println("Pressione Ctrl+C para parar o servidor.");
    }

    static class ProxyHandler implements HttpHandler {
        private final ProxyService proxyService = new ProxyService();

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

                if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                
                String path = exchange.getRequestURI().getPath();
                String query = exchange.getRequestURI().getQuery();
                if (query != null && !query.isEmpty()) {
                    path += "?" + query;
                }

                String method = exchange.getRequestMethod();
                String requestBody = readRequestBody(exchange.getRequestBody());
                String authToken = extractAuthToken(exchange.getRequestHeaders().getFirst("Authorization"));
                
                System.out.println("Proxying request: " + method + " " + path);

                HttpResponse<String> backendResponse = proxyService.forwardRequest(path, method, requestBody, authToken);

                backendResponse.headers().map().forEach((key, values) -> {
                    if (!key.equalsIgnoreCase("Content-Encoding") && !key.equalsIgnoreCase("Transfer-Encoding")) {
                        for(String value : values) {
                            exchange.getResponseHeaders().add(key, value);
                        }
                    }
                });
                
                int statusCode = backendResponse.statusCode();
                String responseBody = backendResponse.body();
                byte[] responseBytes = responseBody.getBytes("UTF-8");

                exchange.sendResponseHeaders(statusCode, responseBytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(responseBytes);
                os.close();

                System.out.println("Request proxied successfully with status " + statusCode);

            } catch (Exception e) {
                System.err.println("Erro no handler do proxy: " + e.getMessage());
                e.printStackTrace();
                String errorResponse = "{\"error\":\"Erro interno no servidor proxy.\"}";
                byte[] responseBytes = errorResponse.getBytes("UTF-8");
                exchange.sendResponseHeaders(500, responseBytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(responseBytes);
                os.close();
            }
        }

        private String readRequestBody(InputStream is) {
            try (Scanner s = new Scanner(is).useDelimiter("\\A")) {
                return s.hasNext() ? s.next() : "";
            }
        }

        private String extractAuthToken(String authHeader) {
            if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
                return authHeader.substring(7);
            }
            return null;
        }
    }
}
