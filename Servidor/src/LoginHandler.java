package src;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class LoginHandler implements HttpHandler {

    @Override
    @SuppressWarnings("unchecked")
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "{\"error\":\"Metodo nao permitido\"}");
            return;
        }

        try {
            InputStream requestBody = exchange.getRequestBody();
            String json = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8);

            ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");
            if (engine == null) {
                System.err.println("AVISO: Motor de JavaScript (Nashorn/GraalVM) não encontrado. Pode não estar incluído no seu JDK por padrão (comum em Java 15+).");
                sendResponse(exchange, 500, "{\"error\":\"Configuracao do servidor incompleta: motor de script ausente.\"}");
                return;
            }
            
            engine.put("json", json);
            Object parsed = engine.eval("JSON.parse(json)");
            Map<String, Object> loginData = (Map<String, Object>) parsed;

            String email = (String) loginData.get("email");
            String senha = (String) loginData.get("senha");

            if ("user@puc.com".equals(email) && "1234".equals(senha)) {
                String successResponse = "{\"success\":true, \"message\":\"Login bem-sucedido!\"}";
                sendResponse(exchange, 200, successResponse);
            } else {
                String errorResponse = "{\"success\":false, \"message\":\"Email ou senha invalidos\"}";
                sendResponse(exchange, 401, errorResponse);
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"Erro interno do servidor\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
    }
}