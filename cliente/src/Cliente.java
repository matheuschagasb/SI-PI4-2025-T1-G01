package src;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Cliente {
    public static final String HOST_PADRAO = "localhost";
    public static final int PORTA_PADRAO = 8080;

    public static void main(String[] args) {

        String host = HOST_PADRAO;
        int porta = PORTA_PADRAO;

        if (args.length > 0) host = args[0];
        if (args.length == 2) porta = Integer.parseInt(args[1]);

        chamarEndpointTeste(host, porta);
    }

    private static void chamarEndpointTeste(String host, int porta) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://" + host + ":" + porta + "/api/teste"))
                .build();

        try {
            System.out.println("Fazendo uma requisição GET para http://" + host + ":" + porta + "/api/teste");
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Status da Resposta: " + response.statusCode());
            System.out.println("Corpo da Resposta: " + response.body());

        } catch (IOException | InterruptedException e) {
            System.err.println("Erro ao tentar se comunicar com o servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
}