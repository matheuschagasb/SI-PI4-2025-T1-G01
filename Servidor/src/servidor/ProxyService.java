// Marcos Junior - 24010753
package servidor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

// Esta classe é responsável por encaminhar as requisições para o servidor de backend.
public class ProxyService {
    // Cliente HTTP para enviar as requisições.
    private final HttpClient client = HttpClient.newBuilder().build();
    // Objeto Gson para serialização/desserialização de JSON.
    private final Gson gson;
    // URL base do serviço de backend.
    private static final String BASE_URL = "http://localhost:3001";

    // Construtor que inicializa o Gson com um deserializador customizado para LocalDateTime.
    public ProxyService() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>) (json, typeOfT, context) -> {
            return LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_DATE_TIME);
        });
        this.gson = gsonBuilder.create();
    }
    
    // Método genérico para encaminhar requisições.
    public HttpResponse<String> forwardRequest(String path, String method, String requestBody, String token) throws IOException, InterruptedException {
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + path));

        // Adiciona o token de autorização se ele existir.
        if (token != null && !token.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + token);
        }

        // Configura o método da requisição e o corpo, se aplicável.
        if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
            requestBuilder.header("Content-Type", "application/json");
            requestBuilder.method(method, HttpRequest.BodyPublishers.ofString(requestBody));
        } else {
            requestBuilder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        return client.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
    }
}
