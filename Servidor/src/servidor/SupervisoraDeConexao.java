package servidor;

import java.net.Socket;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class SupervisoraDeConexao extends Thread {
    private final Socket cliente;
    private final ProxyService proxyService;

    public SupervisoraDeConexao(Socket cliente) {
        this.cliente = cliente;
        this.proxyService = new ProxyService();
    }

    @Override
    public void run() {
        try (
            InputStream is = cliente.getInputStream();
            OutputStream os = cliente.getOutputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))
        ) {
            // 1. Ler a requisição HTTP
            String requestLine = reader.readLine();
            if (requestLine == null || requestLine.isEmpty()) {
                return; // Ignora requisições vazias
            }

            String[] requestParts = requestLine.split(" ");
            String method = requestParts[0];
            String path = requestParts[1];

            Map<String, String> headers = new HashMap<>();
            String headerLine;
            while ((headerLine = reader.readLine()) != null && !headerLine.isEmpty()) {
                String[] headerParts = headerLine.split(": ", 2);
                if (headerParts.length == 2) {
                    headers.put(headerParts[0], headerParts[1]);
                }
            }

            String requestBody = "";
            if (headers.containsKey("Content-Length")) {
                int contentLength = Integer.parseInt(headers.get("Content-Length"));
                char[] bodyChars = new char[contentLength];
                reader.read(bodyChars, 0, contentLength);
                requestBody = new String(bodyChars);
            }
            
            System.out.println("Requisição recebida: " + method + " " + path);

            // 2. Lidar com requisições OPTIONS (CORS pre-flight)
            if ("OPTIONS".equalsIgnoreCase(method)) {
                String response = "HTTP/1.1 204 No Content\r\n" +
                                  "Access-Control-Allow-Origin: *\r\n" +
                                  "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n" +
                                  "Access-Control-Allow-Headers: Content-Type, Authorization\r\n" +
                                  "Connection: close\r\n\r\n";
                os.write(response.getBytes(StandardCharsets.UTF_8));
                return;
            }

            // 3. Encaminhar a requisição para o backend
            String authToken = extractAuthToken(headers.get("Authorization"));
            HttpResponse<String> backendResponse = proxyService.forwardRequest(path, method, requestBody, authToken);

            // 4. Construir e enviar a resposta para o cliente
            int statusCode = backendResponse.statusCode();
            String responseBody = backendResponse.body();
            byte[] responseBodyBytes = responseBody.getBytes(StandardCharsets.UTF_8);

            StringBuilder responseBuilder = new StringBuilder();
            responseBuilder.append("HTTP/1.1 ").append(statusCode).append(" ").append(getStatusMessage(statusCode)).append("\r\n");
            
            // Adiciona cabeçalhos CORS
            responseBuilder.append("Access-Control-Allow-Origin: *\r\n");

            // Adiciona cabeçalhos da resposta do backend, exceto os problemáticos
            backendResponse.headers().map().forEach((key, values) -> {
                if (!key.equalsIgnoreCase("Content-Encoding") &&
                    !key.equalsIgnoreCase("Transfer-Encoding") &&
                    !key.equalsIgnoreCase("Connection")) {
                    responseBuilder.append(key).append(": ").append(String.join(", ", values)).append("\r\n");
                }
            });

            responseBuilder.append("Content-Length: ").append(responseBodyBytes.length).append("\r\n");
            responseBuilder.append("Connection: close\r\n");
            responseBuilder.append("\r\n"); // Fim dos cabeçalhos
            
            // Escreve os cabeçalhos
            os.write(responseBuilder.toString().getBytes(StandardCharsets.UTF_8));
            // Escreve o corpo da resposta
            os.write(responseBodyBytes);
            os.flush();

            System.out.println("Requisição para " + path + " processada com status " + statusCode);

        } catch (Exception e) {
            System.err.println("Erro na supervisora de conexão: " + e.getMessage());
            e.printStackTrace();
            // Tenta enviar uma resposta de erro para o cliente, se possível
            try {
                String errorResponse = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n{\"error\":\"Erro interno no servidor proxy.\"}";
                cliente.getOutputStream().write(errorResponse.getBytes(StandardCharsets.UTF_8));
            } catch (Exception ex) {
                // Ignora erros ao enviar a resposta de erro
            }
        } finally {
            try {
                cliente.close();
            } catch (Exception e) {
                System.err.println("Erro ao fechar o socket do cliente: " + e.getMessage());
            }
        }
    }

    private String extractAuthToken(String authHeader) {
        if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private String getStatusMessage(int statusCode) {
        // Mapeamento simples de códigos de status para mensagens
        switch (statusCode) {
            case 200: return "OK";
            case 201: return "Created";
            case 204: return "No Content";
            case 400: return "Bad Request";
            case 401: return "Unauthorized";
            case 403: return "Forbidden";
            case 404: return "Not Found";
            case 500: return "Internal Server Error";
            default: return "OK";
        }
    }
}
