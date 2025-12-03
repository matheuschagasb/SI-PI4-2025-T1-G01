# 🎵 Servidor TCP - SoundBridge

Servidor TCP multi-thread com integração PostgreSQL para gerenciamento de contratos entre músicos e contratantes.

## 📋 Características

- ✅ Comunicação via **Socket TCP** com serialização de objetos
- ✅ **Multi-threading** (AceitadoraDeConexao + SupervisoraDeConexao por cliente)
- ✅ **Validação de IP** via whitelist
- ✅ **Controle de concorrência** com Semaphore (Parceiro + MutexManager)
- ✅ **Integração PostgreSQL** com JDBC
- ✅ **Autenticação BCrypt** para senhas
- ✅ **Prevenção de race conditions** em criação de contratos

## 🏗️ Arquitetura

```
Cliente → Socket → AceitadoraDeConexao (valida IP)
                          ↓
                  SupervisoraDeConexao (thread por cliente)
                          ↓
                      Parceiro (Semaphore)
                          ↓
                    DAOs → PostgreSQL
```

### Componentes Principais

**Servidor** (`servidor/Servidor.java`)
- Carrega whitelist de IPs
- Configura porta/host
- Gerencia comandos admin (desativar/status)
- Notifica clientes no shutdown

**AceitadoraDeConexao** (`servidor/AceitadoraDeConexao.java`)
- Thread que aceita conexões
- Valida IP contra whitelist
- Cria SupervisoraDeConexao para cada cliente autorizado

**SupervisoraDeConexao** (`servidor/SupervisoraDeConexao.java`)
- Thread por cliente conectado
- Processa requisições (login, busca músicos, criação de contratos, etc.)
- Usa MutexManager para evitar condições de corrida

**Parceiro** (`comunicacao/Parceiro.java`)
- Encapsula Socket com ObjectInputStream/ObjectOutputStream
- Protege comunicação com Semaphore (mutEx)
- Métodos: `receba()`, `envie()`, `espie()`, `adeus()`

**MutexManager** (`servidor/MutexManager.java`)
- Gerencia locks por recurso (músico)
- ConcurrentHashMap<String, Semaphore>
- Previne múltiplos contratos simultâneos para mesmo músico

**Comunicados** (`comunicacao/`)
- `PedidoDeLogin`: email, senha, role (musico/contratante)
- `PedidoBuscarMusicos`: generoMusical (opcional)
- `PedidoCriarContrato`: musicoId, contratanteId, dataEvento, duracao, valorTotal, localEvento, observacoes
- `PedidoBuscarContratos`: usuarioId, tipoUsuario (musico/contratante)
- `Resultado`: resposta genérica (Object info)
- `ComunicadoDeDesligamento`: notificação de shutdown
- `PedidoParaSair`: solicitação de desconexão

**DAOs** (`bd/`)
- `MusicoDAO`: buscarPorEmail, buscarPorId, buscarTodos (com filtro de gênero), validarSenha
- `ContratanteDAO`: buscarPorEmail, buscarPorId, validarSenha
- `ContratoDAO`: criar, buscarPorId, buscarPorMusicoId, buscarPorContratanteId, verificarConflito
- `ConexaoBD`: gerencia conexão com PostgreSQL
- `BCryptUtil`: valida/gera hashes BCrypt

## 🔧 Configuração

### 1. Banco de Dados

Edite `Servidor/resources/database.properties`:

```properties
url=jdbc:postgresql://localhost:5432/servidor-spring
username=servidor-spring
password=123qwe
driver=org.postgresql.Driver
```

### 2. Whitelist de IPs

Edite `Servidor/resources/whitelist.txt`:

```
# IPs autorizados (um por linha)
127.0.0.1
localhost
192.168.0.1
192.168.1.1
```

### 3. Dependências

O `pom.xml` já inclui:
- **PostgreSQL JDBC Driver** (42.2.23)
- **jBCrypt** (0.4)

## 🚀 Compilação e Execução

### Compilar com Maven

```bash
cd Servidor
mvn clean compile
```

### Executar

```bash
mvn exec:java -Dexec.mainClass="servidor.Servidor"
```

Ou compile e execute manualmente:

```bash
mvn package
java -cp target/Servidor-1.0-SNAPSHOT.jar servidor.Servidor
```

### Uso Interativo

O servidor solicitará:
1. **Porta** (ex: 3000)
2. **Localhost** (ex: localhost ou 127.0.0.1)

Comandos disponíveis:
- `desativar` - encerra o servidor e notifica clientes
- `status` - exibe quantidade de clientes conectados

## 📡 Protocolo de Comunicação

### Login

**Cliente envia:**
```java
PedidoDeLogin login = new PedidoDeLogin("email@example.com", "senha123", "musico");
```

**Servidor responde:**
```java
Resultado resultado = (Resultado) receba();
if (resultado.getInfo() instanceof Musico) {
    Musico musico = (Musico) resultado.getInfo();
    // Login bem-sucedido
} else {
    String erro = (String) resultado.getInfo();
    // "Credenciais inválidas"
}
```

### Buscar Músicos

**Cliente envia:**
```java
PedidoBuscarMusicos busca = new PedidoBuscarMusicos("Rock"); // ou null para todos
```

**Servidor responde:**
```java
Resultado resultado = (Resultado) receba();
if (resultado.getInfo() instanceof List) {
    List<Musico> musicos = (List<Musico>) resultado.getInfo();
} else {
    String mensagem = (String) resultado.getInfo(); // "Nenhum músico encontrado"
}
```

### Criar Contrato

**Cliente envia:**
```java
PedidoCriarContrato pedido = new PedidoCriarContrato(
    "musico-id",
    "contratante-id",
    LocalDateTime.of(2025, 12, 25, 20, 0), // data do evento
    3,        // duração em horas
    1500.00,  // valor total
    "Praça Central",
    "Show de Natal"
);
```

**Servidor responde:**
```java
Resultado resultado = (Resultado) receba();
if (resultado.getInfo() instanceof Contrato) {
    Contrato contrato = (Contrato) resultado.getInfo();
    // Contrato criado com sucesso
} else {
    String erro = (String) resultado.getInfo();
    // "Músico já possui contrato confirmado neste horário"
}
```

### Buscar Contratos

**Cliente envia:**
```java
PedidoBuscarContratos busca = new PedidoBuscarContratos("usuario-id", "musico");
```

**Servidor responde:**
```java
Resultado resultado = (Resultado) receba();
if (resultado.getInfo() instanceof List) {
    List<Contrato> contratos = (List<Contrato>) resultado.getInfo();
}
```

## 🔒 Segurança

### IP Whitelist
Apenas IPs listados em `whitelist.txt` podem conectar. IPv6 localhost (`0:0:0:0:0:0:0:1`) é automaticamente tratado como `127.0.0.1`.

### Senhas BCrypt
Senhas são validadas com BCrypt (matching com hashes do banco). Nunca armazene senhas em texto plano.

### Concorrência Segura
- **Parceiro**: Semaphore protege I/O do socket
- **MutexManager**: Lock exclusivo por músico durante criação de contratos

## 🧪 Testando Conexão

### Teste de Banco de Dados

No `ConexaoBD.java` há método `testarConexao()`. Adicione no `main` do Servidor:

```java
public static void main(String[] args) {
    // Testar BD antes de iniciar servidor
    ConexaoBD.testarConexao();
    
    // ... resto do código
}
```

### Cliente de Teste Simples

```java
Socket socket = new Socket("localhost", 3000);
ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
ObjectInputStream in = new ObjectInputStream(socket.getInputStream());

// Login
PedidoDeLogin login = new PedidoDeLogin("teste@email.com", "senha", "musico");
out.writeObject(login);
out.flush();

Resultado resultado = (Resultado) in.readObject();
System.out.println(resultado.getInfo());

// Sair
out.writeObject(new PedidoParaSair());
out.flush();

socket.close();
```

## 📊 Estrutura do Banco

### Tabelas Principais

**musico**
- id (UUID)
- nome, biografia, cidade, estado, genero_musical
- email, telefone, cpf, senha (BCrypt)
- preco, chave_pix
- foto_perfil

**musico_fotos**
- musico_id (FK)
- foto_banda (URL)

**contratante**
- id (UUID)
- nome, email, telefone, senha (BCrypt)
- nome_estabelecimento, tipo_estabelecimento
- foto_perfil

**contrato**
- id (UUID)
- musico_id (FK), contratante_id (FK)
- data_evento, duracao (horas)
- valor_total, status (PENDENTE/CONFIRMADO/CANCELADO/CONCLUIDO)
- local_evento, observacoes
- data_pagamento, comprovante_pagamento_url

## 🐛 Troubleshooting

### "Porta já em uso"
```
Exception: Address already in use
```
Troque a porta ou encerre o processo usando a porta:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### "IP não autorizado"
```
⚠️ Tentativa de conexão bloqueada: 192.168.x.x
```
Adicione o IP em `resources/whitelist.txt`

### "Connection refused"
```
java.net.ConnectException: Connection refused
```
Verifique se o servidor está rodando e a porta/host estão corretos

### "Unable to connect to PostgreSQL"
```
PSQLException: Connection refused
```
1. Verifique se PostgreSQL está rodando
2. Confirme credenciais em `database.properties`
3. Teste: `ConexaoBD.testarConexao()`

## 📝 Logs

O servidor exibe logs coloridos:
- 🚀 Servidor iniciado
- 🔗 Cliente conectado
- ✅ Login bem-sucedido
- 📝 Contrato criado
- 🎵 Busca realizada
- 📋 Busca de contratos
- ⚠️ Erros/avisos
- 🔌 Cliente desconectado

## 🔄 Comandos Admin

Durante execução, digite:

**`status`**
```
==== STATUS DO SERVIDOR ====
✅ Servidor ativo
👥 Clientes conectados: 3
```

**`desativar`**
```
🛑 Encerrando servidor...
📢 Notificando 3 cliente(s) sobre desligamento...
✅ Servidor encerrado com sucesso
```

## 🎯 Requisitos Atendidos

- ✅ Servidor TCP seguindo modelo wash_it_now_java_server
- ✅ Integração com PostgreSQL do projeto SI-PI4-2025-T1-G1
- ✅ Mutex/Semaphore para controle de concorrência
- ✅ Validação de IP com whitelist
- ✅ Porta e localhost configuráveis
- ✅ Arquitetura multi-thread
- ✅ Autenticação segura (BCrypt)
- ✅ Prevenção de race conditions

## 👨‍💻 Desenvolvido em

Integração entre:
- **wash_it_now_java_server** (arquitetura TCP socket)
- **SI-PI4-2025-T1-G1** (modelo de dados PostgreSQL)

---

**Desenvolvido com ☕ e 🎵 para SoundBridge**
