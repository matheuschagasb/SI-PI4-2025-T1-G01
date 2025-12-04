# 🧪 Guia de Testes - Servidor SoundBridge

## 🚀 Como Executar

### Opção 1: Scripts Automáticos

**Servidor:**
```bash
# Windows CMD
executar-servidor.bat

# PowerShell
.\executar-servidor.ps1
```

**Cliente de Teste:**
```bash
# Windows CMD
executar-cliente.bat

# PowerShell
.\executar-cliente.ps1
```

### Opção 2: Linha de Comando

**Terminal 1 - Servidor:**
```bash
cd Servidor\bin
java -cp ".;..\lib\postgresql-42.2.23.jar;..\lib\jbcrypt-0.4.jar" servidor.Servidor
```

**Terminal 2 - Cliente:**
```bash
cd Servidor\bin
java -cp ".;..\lib\postgresql-42.2.23.jar;..\lib\jbcrypt-0.4.jar" test.ClienteTeste
```

## 📋 Pré-requisitos para Testes

1. **PostgreSQL rodando** na porta 5432
2. **Banco `servidor-spring`** criado e populado
3. **Servidor iniciado** antes de executar clientes

## 🎭 Cenários de Teste

### 1️⃣ Teste de Login

#### Login como Músico
```
Email: [email do músico no banco]
Senha: [senha do músico]
Role: musico
```

**Resultado esperado:**
- ✅ Sucesso: true
- 📦 Retorna objeto Musico com todos os dados

#### Login como Contratante
```
Email: [email do contratante no banco]
Senha: [senha do contratante]
Role: contratante
```

**Resultado esperado:**
- ✅ Sucesso: true
- 📦 Retorna objeto Contratante com todos os dados

#### Login Inválido
```
Email: invalido@test.com
Senha: senhaerrada
Role: musico
```

**Resultado esperado:**
- ❌ Sucesso: false
- 📝 Mensagem: "Credenciais inválidas"

### 2️⃣ Teste de Busca de Músicos

#### Buscar Todos os Músicos
```
Gênero musical: [deixar vazio, apertar ENTER]
```

**Resultado esperado:**
- ✅ Retorna lista com TODOS os músicos do banco
- 📊 Cada músico com: ID, nome, gênero, cidade, preço

#### Buscar por Gênero
```
Gênero musical: Rock
```

**Resultado esperado:**
- ✅ Retorna apenas músicos do gênero "Rock"
- 📊 Lista filtrada

#### Buscar Gênero Inexistente
```
Gênero musical: Sertanejo Universitário do Interior
```

**Resultado esperado:**
- ✅ Sucesso: true
- 📝 Mensagem: "Nenhum músico encontrado"

### 3️⃣ Teste de Criação de Contrato

#### Cenário 1: Contrato Válido
```
ID do músico: [ID obtido na busca anterior]
Email do contratante: [email válido do banco]
Data do evento: 2025-12-25
Hora do evento: 20:00
Duração em horas: 3
Local do evento: Praça Central
Observações: Show de Natal
```

**Resultado esperado:**
- ✅ Sucesso: true
- 📝 Contrato criado com status PENDENTE
- 💰 Valor calculado automaticamente (preço_musico × duração)

#### Cenário 2: Conflito de Horário

**Passo 1:** Crie um contrato para um músico
**Passo 2:** Tente criar OUTRO contrato para o MESMO músico, MESMA data/hora

```
ID do músico: [mesmo ID do contrato anterior]
Email do contratante: [outro email]
Data do evento: 2025-12-25  [mesma data]
Hora do evento: 21:00        [dentro das 3h do primeiro]
Duração em horas: 2
Local do evento: Outro local
Observações: Teste conflito
```

**Resultado esperado:**
- ❌ Sucesso: false
- 📝 Mensagem: "Músico já possui contrato confirmado neste horário"

#### Cenário 3: Músico Inexistente
```
ID do músico: 99999999-9999-9999-9999-999999999999
Email do contratante: [email válido]
Data: 2025-12-25
Hora: 20:00
Duração: 3
Local: Teste
Observações: -
```

**Resultado esperado:**
- ❌ Sucesso: false
- 📝 Mensagem: "Músico não encontrado"

#### Cenário 4: Contratante Inexistente
```
ID do músico: [ID válido]
Email do contratante: inexistente@test.com
Data: 2025-12-25
Hora: 20:00
Duração: 3
Local: Teste
Observações: -
```

**Resultado esperado:**
- ❌ Sucesso: false
- 📝 Mensagem: "Contratante não encontrado"

### 4️⃣ Teste de Busca de Contratos

#### Buscar Contratos de um Músico
```
ID do usuário: [ID do músico que tem contratos]
Tipo: musico
```

**Resultado esperado:**
- ✅ Lista todos os contratos do músico
- 📋 Ordenados por data (mais recentes primeiro)

#### Buscar Contratos de um Contratante
```
ID do usuário: [ID do contratante]
Tipo: contratante
```

**Resultado esperado:**
- ✅ Lista todos os contratos do contratante
- 📋 Ordenados por data

#### Buscar de Usuário sem Contratos
```
ID do usuário: [ID válido mas sem contratos]
Tipo: musico
```

**Resultado esperado:**
- ✅ Sucesso: true
- 📝 Mensagem: "Nenhum contrato encontrado"

## 🔒 Teste de Segurança

### Validação de IP

1. **Conectar de IP autorizado:**
   - Adicione seu IP em `resources/whitelist.txt`
   - Execute o cliente
   - ✅ Conexão aceita

2. **Conectar de IP não autorizado:**
   - Remova seu IP da whitelist
   - Tente conectar
   - ❌ Conexão recusada no log do servidor

### Teste de Concorrência (Mutex)

**Objetivo:** Verificar que múltiplas requisições simultâneas para o mesmo músico não causam conflitos

1. Abra **2 clientes** ao mesmo tempo
2. Em ambos, tente criar contrato para o **mesmo músico**, **mesma data/hora**
3. Execute os dois comandos **simultaneamente**

**Resultado esperado:**
- ✅ Apenas 1 contrato criado (o que chegou primeiro)
- ❌ O segundo recebe erro de conflito de horário
- 🔒 Mutex preveniu race condition

## 📊 Validação no Banco de Dados

Após criar contratos, valide no PostgreSQL:

```sql
-- Ver todos os contratos
SELECT c.id, m.nome as musico, ct.nome as contratante, 
       c.data_evento, c.status, c.valor_total
FROM contrato c
JOIN musico m ON c.musico_id = m.id
JOIN contratante ct ON c.contratante_id = ct.id
ORDER BY c.data_evento DESC;

-- Ver contratos de um músico específico
SELECT * FROM contrato 
WHERE musico_id = '[ID_DO_MUSICO]'
ORDER BY data_evento;

-- Ver status de todos os contratos
SELECT status, COUNT(*) as total 
FROM contrato 
GROUP BY status;
```

## 🐛 Troubleshooting

### "Connection refused"
- ✅ Servidor está rodando?
- ✅ Porta correta (3000)?
- ✅ Firewall bloqueando?

### "IP não autorizado"
- ✅ Seu IP está em `whitelist.txt`?
- ✅ Servidor foi reiniciado após alterar whitelist?

### "Credenciais inválidas"
- ✅ Email existe no banco?
- ✅ Senha está correta?
- ✅ Role correto (musico/contratante)?

### "Erro ao conectar ao banco"
- ✅ PostgreSQL rodando?
- ✅ Credenciais em `database.properties` corretas?
- ✅ Banco `servidor-spring` existe?

## 📝 Checklist de Testes Completos

- [ ] Login de músico com sucesso
- [ ] Login de contratante com sucesso
- [ ] Login com credenciais inválidas
- [ ] Buscar todos os músicos
- [ ] Buscar músicos por gênero
- [ ] Criar contrato válido
- [ ] Tentar criar contrato com conflito de horário
- [ ] Tentar criar contrato com músico inexistente
- [ ] Tentar criar contrato com contratante inexistente
- [ ] Buscar contratos de músico
- [ ] Buscar contratos de contratante
- [ ] Conectar de IP autorizado
- [ ] Comandos do servidor (status/desativar)
- [ ] Teste de concorrência com 2 clientes

## 🎯 Exemplo de Fluxo Completo

```
1. Iniciar servidor → Porta 3000
2. Iniciar cliente 1 → Login como contratante
3. Cliente 1 → Buscar músicos de Rock
4. Cliente 1 → Criar contrato com músico escolhido
5. Iniciar cliente 2 → Login como músico
6. Cliente 2 → Buscar seus contratos
7. Cliente 2 → Ver contrato criado pelo cliente 1
8. Servidor → Digitar "status" (2 clientes conectados)
9. Cliente 1 → Sair (opção 0)
10. Servidor → Digitar "status" (1 cliente conectado)
11. Servidor → Digitar "desativar"
12. Cliente 2 → Recebe notificação de desligamento
```

---

**🎵 Bons testes! Se encontrar algum bug, anote o cenário exato para debug.**
