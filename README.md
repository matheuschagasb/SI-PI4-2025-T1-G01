# Backend SoundBridge (Servidor Java)

Este documento fornece uma visão geral do servidor backend do projeto SoundBridge, incluindo sua arquitetura, como executá-lo e o padrão para adicionar novas funcionalidades.

## Visão Geral

Este servidor é responsável por toda a lógica de negócio da aplicação SoundBridge. Ele expõe uma API RESTful que o frontend (e outros clientes) pode consumir para realizar ações como login, cadastro, busca de dados, etc.

## Arquitetura

Para manter a simplicidade e evitar dependências externas, o servidor foi construído utilizando apenas bibliotecas nativas do Java (Java SE).

- **Servidor HTTP:** Utiliza a classe `com.sun.net.httpserver.HttpServer`, que faz parte do JDK padrão. É um servidor leve e robusto para lidar com requisições HTTP.
- **Roteamento:** O roteamento é feito manualmente no arquivo `Servidor/src/Main.java`, associando caminhos de URL (ex: `/api/login`) a classes `HttpHandler` específicas.
- **Manipulação de JSON:** Para ler e escrever JSON sem bibliotecas externas (como Gson ou Jackson), utilizamos o motor de JavaScript embutido no Java (Nashorn/GraalVM JS) para executar `JSON.parse()` e para criar strings JSON manualmente.

## Pré-requisitos

- **Java Development Kit (JDK)**: Versão 8 ou superior.
  - **Atenção:** O motor de JavaScript Nashorn foi removido no JDK 15. Se estiver usando JDK 15 ou superior, pode ser necessário garantir que um motor de script compatível com JavaScript (como o GraalVM JS) esteja disponível no seu ambiente, ou o servidor falhará ao tentar processar JSON.

## Como Executar o Servidor

1.  **Navegue até a pasta do servidor:**
    ```bash
    cd /home/marcos-junior/Documentos/PUC/airane/Servidor
    ```

2.  **Compile todos os arquivos `.java`:**
    ```bash
    javac src/*.java
    ```
    *Se aparecerem avisos de "unchecked cast", você pode ignorá-los ou usar a flag `-Xlint:unchecked` para ver os detalhes. Eles são esperados devido à forma como o JSON é processado.*

3.  **Execute a classe principal:**
    ```bash
    java src.Main
    ```
    Por padrão, o servidor iniciará na porta `8080`.

4.  **Para especificar uma porta diferente:**
    ```bash
    java src.Main 9000
    ```

5.  **Para parar o servidor:**
    Digite `desativar` no terminal onde o servidor está rodando e pressione Enter.

## Criando Novos Endpoints

Siga este padrão para garantir a consistência do projeto.

### 1. Crie a Classe Handler

Para cada novo endpoint (ex: `/api/cadastro`), crie uma nova classe em `Servidor/src/` que implemente a interface `HttpHandler`. Use o `LoginHandler.java` como modelo.

**Exemplo de esqueleto para `CadastroHandler.java`:**

```java
package src;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
// ... outros imports

public class CadastroHandler implements HttpHandler {

    @Override
    @SuppressWarnings("unchecked")
    public void handle(HttpExchange exchange) throws IOException {
        // 1. Configurar CORS e tratar requisições OPTIONS
        // (Copie esta parte do LoginHandler)

        // 2. Verificar se o método é POST (ou o que for apropriado)
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            // Enviar erro 405 Method Not Allowed
            return;
        }

        try {
            // 3. Ler e parsear o corpo da requisição JSON
            // (Use o motor de JavaScript como no LoginHandler)

            // 4. Extrair os dados do Map
            // String nome = (String) dadosDoCadastro.get("nome");
            
            // 5. APLICAR SUA LÓGICA DE NEGÓCIO AQUI
            // (Ex: salvar o usuário no banco de dados)

            // 6. Enviar uma resposta de sucesso ou erro em JSON
            
        } catch (Exception e) {
            // Tratar exceções e enviar erro 500
        }
    }
    
    // Copie o método sendResponse do LoginHandler para cá
    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        // ...
    }
}
```

### 2. Registre o Handler no `Main.java`

No arquivo `Servidor/src/Main.java`, dentro do método `main`, adicione uma linha para registrar seu novo handler, associando-o a um caminho de URL.

```java
// ...
server.createContext("/api/login", new LoginHandler());
server.createContext("/api/cadastro", new CadastroHandler()); // Nova linha
// ...
```

## Testando os Endpoints

Endpoints `GET` podem ser testados no navegador. Para endpoints `POST`, `PUT`, ou `DELETE`, você precisa de uma ferramenta de API como [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), ou o comando `curl`.

**Exemplo de teste para o endpoint de login com `curl`:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"user@puc.com", "senha":"1234"}' \
  http://localhost:8080/api/login
```
