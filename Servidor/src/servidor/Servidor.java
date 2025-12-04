// Thiago Mauri - 24015357
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

// Esta classe é responsável por criar e configurar o servidor HTTP que atua como um proxy.
public class Servidor {
    // A porta padrão na qual o servidor será iniciado se nenhuma for especificada.
    private static final int PORTA_PADRAO = 3001;

    // O método principal que inicia o servidor.
    public static void main(String[] args) throws IOException {
        int porta = PORTA_PADRAO;
        // Verifica se uma porta foi fornecida como argumento de linha de comando.
        if (args.length > 0) {
            try {
                porta = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("A porta deve ser um número. Usando a porta padrão: " + porta);
            }
        }

        // Cria o servidor HTTP na porta especificada.
        HttpServer server = HttpServer.create(new InetSocketAddress(porta), 0);

        // Define o handler para o contexto raiz, que processará todas as requisições.
        server.createContext("/", new ProxyHandler());

        // Usa um pool de threads para lidar com as requisições de forma concorrente.
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();

        System.out.println("Servidor Proxy HTTP iniciado na porta " + porta);
        System.out.println("Pressione Ctrl+C para parar o servidor.");
    }

    // Handler que processa cada requisição HTTP recebida pelo servidor.
    static class ProxyHandler implements HttpHandler {
        private final ProxyService proxyService = new ProxyService();

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                // Adiciona cabeçalhos CORS para permitir requisições de diferentes origens.
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

                // Responde a requisições OPTIONS (pre-flight) para CORS.
                if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                
                // Monta o caminho completo da requisição, incluindo a query string.
                String path = exchange.getRequestURI().getPath();
                String query = exchange.getRequestURI().getQuery();
                if (query != null && !query.isEmpty()) {
                    path += "?" + query;
                }

                // Extrai informações da requisição original.
                String method = exchange.getRequestMethod();
                String requestBody = readRequestBody(exchange.getRequestBody());
                String authToken = extractAuthToken(exchange.getRequestHeaders().getFirst("Authorization"));
                
                System.out.println("Proxying request: " + method + " " + path);

                // Encaminha a requisição para o serviço de backend.
                HttpResponse<String> backendResponse = proxyService.forwardRequest(path, method, requestBody, authToken);

                // Copia os cabeçalhos da resposta do backend para a resposta do proxy.
                backendResponse.headers().map().forEach((key, values) -> {
                    if (!key.equalsIgnoreCase("Content-Encoding") && !key.equalsIgnoreCase("Transfer-Encoding")) {
                        for(String value : values) {
                            exchange.getResponseHeaders().add(key, value);
                        }
                    }
                });
                
                // Prepara e envia a resposta final para o cliente.
                int statusCode = backendResponse.statusCode();
                String responseBody = backendResponse.body();
                byte[] responseBytes = responseBody.getBytes("UTF-8");

                exchange.sendResponseHeaders(statusCode, responseBytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(responseBytes);
                os.close();

                System.out.println("Request proxied successfully with status " + statusCode);

            } catch (Exception e) {
                // Trata exceções e envia uma resposta de erro padronizada.
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

        // Lê o corpo da requisição e o converte para uma String.
        private String readRequestBody(InputStream is) {
            try (Scanner s = new Scanner(is).useDelimiter("\\A")) {
                return s.hasNext() ? s.next() : "";
            }
        }

        // Extrai o token de autenticação do cabeçalho "Authorization".
        private String extractAuthToken(String authHeader) {
            if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
                return authHeader.substring(7);
            }
            return null;
        }
    }
}
