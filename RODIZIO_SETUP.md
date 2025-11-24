# ⚡ Setup Rápido - Sistema de Rodízio

## 🎯 Checklist de Instalação

### ✅ 1. Variáveis de Ambiente
Já configuradas no `.env.local` do projeto:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_BASE_URL`
- Variáveis do Vercel Postgres

### ✅ 2. Inicializar Banco de Dados

```bash
# 1. Garantir que o servidor está rodando
npm run dev

# 2. Acessar no navegador
http://localhost:3000/api/init-db
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso (incluindo rodízio)",
  "admin": {
    "email": "admin@escovato.com.br",
    "nome": "Administrador",
    "role": "admin"
  }
}
```

### ✅ 3. Fazer Login como Admin

```
URL: http://localhost:3000/admin/login
Email: admin@escovato.com.br
Senha: escovato2025
```

---

## 🚀 Primeiros Passos

### **1. Criar Especialidades**

Vá em: `/admin/especialidades` → `+ Nova Especialidade`

**Sugestões:**
```
Nome: Cabeleireiros
Cor: #6366f1 (Indigo)

Nome: Manicures  
Cor: #ec4899 (Pink)

Nome: Maquiadores
Cor: #8b5cf6 (Purple)
```

### **2. Criar Profissionais**

Vá em: `/admin/profissionais` → `+ Novo Profissional`

**Exemplo 1 - Especialista único:**
```
Nome: Ana Silva
Telefone: (11) 98888-1111
CPF: 111.111.111-11
Email: ana@escovato.com
Senha: 123456
Especialidades: ✅ Cabeleireiros
```

**Exemplo 2 - Multi-serviços:**
```
Nome: Maria Santos
Telefone: (11) 98888-2222
CPF: 222.222.222-22
Email: maria@escovato.com
Senha: 123456
Especialidades: ✅ Manicures, ✅ Maquiadores
```

### **3. Testar o Rodízio**

Vá em: `/admin/rodizio`

1. Escolha uma especialidade (ex: Cabeleireiros)
2. Clique no botão **"+"** (flutuante)
3. Selecione "Ana Silva"
4. Ana aparecerá na fila "Aguardando"
5. Clique em **"Iniciar Atendimento"**
6. Ana vai para "Em Atendimento"
7. Clique em **"Concluir Atendimento"**
8. Ana volta para o final da fila

### **4. Testar Login do Profissional**

1. Abra nova aba/janela anônima
2. Acesse: `http://localhost:3000/profissional/login`
3. Entre com credenciais do profissional:
   ```
   Email: ana@escovato.com
   Senha: 123456
   ```
4. Verá a interface do profissional com suas filas

---

## 📱 Testar em Dispositivo Móvel

### Opção 1: Usar ngrok
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000
```

Acesse a URL gerada no celular.

### Opção 2: Usar IP Local
```bash
# Descobrir seu IP
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig
```

Acesse `http://SEU_IP:3000` no celular (mesma rede Wi-Fi).

---

## 🎭 Criar Usuário Recepcionista

Para criar um usuário recepcionista (sem permissões de admin):

1. Conectar ao banco de dados
2. Executar:

```sql
INSERT INTO usuarios_admin (email, senha_hash, nome, role)
VALUES (
  'recepcionista@escovato.com',
  -- Hash de '123456' gerado com bcrypt
  '$2a$10$exemplo-hash-aqui',
  'Recepcionista',
  'recepcionista'
);
```

Ou criar via código no `init-db`:

```typescript
await createInitialAdmin(
  'recepcionista@escovato.com',
  '123456',
  'Recepcionista',
  'recepcionista'
);
```

---

## 🧪 Fluxo de Teste Completo

### Teste 1: Fluxo Básico
1. ✅ Login como admin
2. ✅ Criar especialidade "Cabeleireiros"
3. ✅ Criar profissional "Ana"
4. ✅ Ir ao rodízio
5. ✅ Adicionar Ana na fila
6. ✅ Iniciar atendimento
7. ✅ Concluir atendimento
8. ✅ Verificar que Ana voltou ao final da fila

### Teste 2: Multi-Especialidades
1. ✅ Criar especialidades: "Manicures" e "Depiladores"
2. ✅ Criar profissional "Maria" com ambas especialidades
3. ✅ Adicionar Maria em ambas as filas
4. ✅ Na fila de Manicures, colocar Maria "Atendendo"
5. ✅ Verificar que na fila de Depiladores, Maria ficou indisponível
6. ✅ Concluir atendimento em Manicures
7. ✅ Verificar que Maria voltou disponível em Depiladores

### Teste 3: Status do Profissional
1. ✅ Login como profissional
2. ✅ Verificar que vê suas filas
3. ✅ Admin coloca profissional "Atendendo"
4. ✅ Profissional vê botão "Concluir Atendimento"
5. ✅ Profissional clica e volta para aguardando
6. ✅ Profissional clica em "Ir para Almoço"
7. ✅ Admin vê status "Almoço"
8. ✅ Profissional volta da pausa

---

## 🔧 Comandos Úteis

```bash
# Rodar em desenvolvimento
npm run dev

# Verificar erros de linting
npm run lint:fix

# Build para produção
npm run build

# Iniciar produção
npm start
```

---

## 📊 Estrutura de Pastas (Novo Sistema)

```
src/
├── app/
│   ├── admin/
│   │   ├── especialidades/     # CRUD Especialidades
│   │   ├── profissionais/      # CRUD Profissionais
│   │   └── rodizio/            # Interface do Rodízio
│   ├── profissional/           # Área do Profissional
│   └── api/
│       ├── admin/
│       │   ├── especialidades/ # APIs Especialidades
│       │   └── profissionais/  # APIs Profissionais
│       ├── rodizios/           # APIs Rodízio
│       └── cron/               # Fechamento automático
├── lib/
│   ├── especialidades.ts       # Funções BD Especialidades
│   ├── profissionais.ts        # Funções BD Profissionais
│   ├── rodizios.ts             # Funções BD Rodízio
│   └── auth.ts                 # Autenticação (atualizada)
└── types/
    ├── especialidade.ts
    ├── profissional.ts
    ├── rodizio.ts
    └── next-auth.d.ts          # Types do NextAuth
```

---

## 🚨 Troubleshooting

### Erro: "Não autorizado"
- ✅ Fazer logout e login novamente
- ✅ Limpar cookies do navegador
- ✅ Verificar se NEXTAUTH_SECRET está configurado

### Erro: "Tabela não existe"
- ✅ Executar `/api/init-db` novamente
- ✅ Verificar conexão com Vercel Postgres

### Profissional não aparece na lista
- ✅ Verificar se profissional está **ativo**
- ✅ Verificar se especialidade está **ativa**
- ✅ Verificar se profissional tem a especialidade associada

---

## ✅ Sistema Pronto!

Agora você tem:
- ✅ Sistema de rodízio funcionando
- ✅ 3 tipos de usuários (Admin, Recepcionista, Profissional)
- ✅ Interface mobile-first
- ✅ Logs de auditoria
- ✅ Fechamento automático

**Próximo passo:** Deploy em produção na Vercel!

---

**Escovato Sistema de Rodízio** 🔄💜


