// Marcos Junior - 24010753
package servidor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ProxyService {
    private final HttpClient client = HttpClient.newBuilder().build();
    private final Gson gson;
    private static final String BASE_URL = "http://localhost:3001";

    // Initializes HttpClient and configures Gson for LocalDateTime deserialization.
    public ProxyService() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>) (json, typeOfT, context) -> {
            return LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_DATE_TIME);
        });
        this.gson = gsonBuilder.create();
    }

    // Handles user login by sending a POST request to the /login endpoint.
    public HttpResponse<String> login(String requestBody) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Retrieves a list of musicians, optionally filtered by genre.
    public HttpResponse<String> getMusicos(String genero) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/musico";
        if (genero != null && !genero.isEmpty()) {
            url += "?genero=" + genero;
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
    
    // Retrieves a single musician by their ID.
    public HttpResponse<String> getMusicoById(String id) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/musico/" + id;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Creates a new contract, requiring a bearer token for authorization.
    public HttpResponse<String> criarContrato(String requestBody, String token) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/v1/contratos"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Retrieves contracts associated with a specific musician ID, requiring a bearer token.
    public HttpResponse<String> getContratosByMusico(String musicoId, String token) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/contratos?musicoId=" + musicoId;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Retrieves contracts associated with the current contractor (identified by the token).
    public HttpResponse<String> getContratosByContratante(String token) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/contratos/contratante";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
    
    // Forwards an HTTP request to a specified path with dynamic method, body, and optional token.
    public HttpResponse<String> forwardRequest(String path, String method, String requestBody, String token) throws IOException, InterruptedException {
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + path));

        if (token != null && !token.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + token);
        }

        if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
            requestBuilder.header("Content-Type", "application/json");
            requestBuilder.method(method, HttpRequest.BodyPublishers.ofString(requestBody));
        } else {
            requestBuilder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        return client.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
    }
}
