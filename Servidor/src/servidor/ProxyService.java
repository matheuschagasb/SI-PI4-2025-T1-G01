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

    // Encaminha uma requisição de login.
    public HttpResponse<String> login(String requestBody) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Busca músicos, opcionalmente filtrando por gênero.
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
    
    // Busca um músico específico pelo seu ID.
    public HttpResponse<String> getMusicoById(String id) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/musico/" + id;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Cria um novo contrato.
    public HttpResponse<String> criarContrato(String requestBody, String token) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/v1/contratos"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Busca os contratos de um músico específico.
    public HttpResponse<String> getContratosByMusico(String musicoId, String token) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/contratos?musicoId=" + musicoId;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    // Busca os contratos de um contratante.
    public HttpResponse<String> getContratosByContratante(String token) throws IOException, InterruptedException {
        String url = BASE_URL + "/v1/contratos/contratante";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .GET()
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
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
