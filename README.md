# SoundBridge Project

SoundBridge é uma plataforma completa projetada para conectar músicos talentosos a contratantes de eventos. A aplicação permite que músicos criem perfis, exibam seu trabalho e sejam contratados, enquanto os contratantes podem buscar artistas por gênero e gerenciar contratos.

## Arquitetura Geral

O projeto é construído sobre uma arquitetura moderna de 3 camadas, garantindo separação de responsabilidades, escalabilidade e manutenibilidade.

`Frontend (Porta 3000)` <-> `Proxy Server (Porta 3001)` <-> `Backend API (Porta 8080)` <-> `Banco de Dados (PostgreSQL)`

1.  **Frontend:** A interface do usuário, com a qual músicos e contratantes interagem.
2.  **Servidor Proxy:** Um intermediário que recebe todas as requisições do frontend e as encaminha para o backend. Ele resolve problemas de CORS e serve como um ponto de entrada único para a API.
3.  **Backend API:** O cérebro da aplicação, onde toda a lógica de negócios, segurança e comunicação com o banco de dados acontece.

---

## Componentes do Projeto

### 1. Frontend (`soundbridge-front/`)

Interface de usuário rica e interativa para a plataforma.

-   **Tecnologia:** Next.js, React, TypeScript.
-   **Responsabilidades:** Renderizar a interface, gerenciar o estado do lado do cliente e enviar requisições HTTP para o Servidor Proxy.

### 2. Servidor Proxy (`Servidor/`)

Um servidor proxy HTTP leve, construído em Java puro, que atua como uma ponte entre o frontend e o backend.

-   **Tecnologia:** Java 11, `HttpServer` nativo, Maven.
-   **Responsabilidades:**
    -   Receber requisições da porta `3001`.
    -   Gerenciar o CORS para permitir a comunicação com o frontend.
    -   Encaminhar as requisições de forma transparente para a API Backend na porta `8080`.
    -   Retornar as respostas do backend para o frontend.

### 3. Backend API (`servidor-spring/`)

A API RESTful que implementa toda a lógica de negócios e persistência de dados do SoundBridge.

-   **Tecnologia:** Java 21, Spring Boot, Spring Data JPA, Spring Security, Hibernate.
-   **Banco de Dados:** PostgreSQL.
-   **Responsabilidades:**
    -   Expor endpoints REST para operações como login, gerenciamento de usuários, contratos, etc.
    -   Validar dados e regras de negócio.
    -   Autenticar e autorizar usuários usando tokens JWT.
    -   Persistir todos os dados da aplicação no banco de dados PostgreSQL.

---

## Como Executar a Aplicação Completa

Siga os passos abaixo para configurar e executar todo o ambiente de desenvolvimento local.

### Pré-requisitos

-   **Java (JDK):** Versão 11 ou superior.
-   **Node.js e npm:** Para executar o projeto frontend.
-   **Maven:** Para compilar e executar o Servidor Proxy.
-   **PostgreSQL:** Um servidor de banco de dados rodando localmente.

### Passo 1: Configurar o Banco de Dados

1.  Certifique-se de que seu servidor PostgreSQL esteja ativo.
2.  Crie um banco de dados chamado `servidor-spring`.
3.  Verifique as credenciais de acesso (`username`, `password`) no arquivo `servidor-spring/src/main/resources/application.properties` e ajuste-as conforme a sua configuração local.

### Passo 2: Executar o Backend API

Abra um terminal e execute os seguintes comandos:

```bash
cd servidor-spring
./mvnw spring-boot:run
```
> O backend estará rodando em `http://localhost:8080`.

### Passo 3: Executar o Servidor Proxy

Abra um **novo terminal** e execute os seguintes comandos:

```bash
cd Servidor
mvn compile exec:java
```
> O proxy estará rodando em `http://localhost:3001`.

### Passo 4: Executar o Frontend

Abra um **terceiro terminal** e execute os seguintes comandos:

```bash
cd soundbridge-front
npm install
npm run dev
```
> O frontend estará rodando em `http://localhost:3000`.

### Passo 5: Acessar a Aplicação

Abra seu navegador e acesse **`http://localhost:3000`**. Agora você pode interagir com a aplicação completa.

