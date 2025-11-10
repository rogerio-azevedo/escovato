# 🎁 Setup Rápido - Sistema de Vale Presente

## ✅ Checklist de Configuração

### 1️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp env.example .env.local
```

Edite `.env.local` e preencha:

#### a) NEXTAUTH_SECRET
Gere uma chave secreta:
```bash
openssl rand -base64 32
```

Copie o resultado e cole em `.env.local`:
```env
NEXTAUTH_SECRET=cola-aqui-o-resultado
NEXTAUTH_URL=http://localhost:3000
```

#### b) Vercel Postgres

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto "escovato"
3. Clique em **Storage** → **Create Database**
4. Selecione **Postgres**
5. Clique em **Continue** e **Create**
6. Vá em **.env.local** e copie todas as variáveis
7. Cole no seu arquivo `.env.local`

#### c) Base URL

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Iniciar Servidor

```bash
npm run dev
```

### 4️⃣ Inicializar Banco de Dados

Com o servidor rodando, acesse no navegador:

```
http://localhost:3000/api/init-db
```

Você verá uma mensagem de sucesso. Isso cria:
- ✅ Tabelas do banco de dados
- ✅ Usuário admin inicial

**Credenciais padrão:**
- Email: `admin@escovato.com.br`
- Senha: `escovato2025`

### 5️⃣ Fazer Login

Acesse:
```
http://localhost:3000/admin/login
```

Use as credenciais acima para entrar.

### 6️⃣ Criar Primeiro Vale

1. Clique em **"+ Novo Vale"**
2. Preencha os dados:
   - Nome: Teste Silva
   - CPF: 111.111.111-11 (teste)
   - Valor: 100
   - Descrição: Corte e escova
   - Para: Cliente Teste
3. Clique em **"Criar Vale Presente"**

### 7️⃣ Testar PDF e QR Code

Na página de detalhes do vale:
- Clique em **"📄 Download PDF"** → Baixa o PDF com QR Code
- Clique em **"💬 Compartilhar WhatsApp"** → Abre mensagem formatada
- Clique em **"✓ Marcar como Usado"** → Marca o vale como utilizado

### 8️⃣ Testar Validação

1. Vá em **"Validar Vale"** no menu
2. Teste os 3 métodos:
   - **Código Manual**: Cole o código do vale
   - **CPF**: Digite 11111111111
   - **QR Code**: Use a câmera (precisa de HTTPS em produção)

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint:fix
```

---

## 🚀 Deploy na Vercel

### 1. Conectar Repositório

```bash
git add .
git commit -m "feat: sistema de vale presente completo"
git push origin main
```

### 2. Configure na Vercel

1. Acesse https://vercel.com
2. Importe seu repositório
3. Em **Environment Variables**, adicione:
   - `NEXTAUTH_SECRET` (use o mesmo do .env.local)
   - `NEXTAUTH_URL` (https://escovato.com.br)
   - `NEXT_PUBLIC_BASE_URL` (https://escovato.com.br)
   
   ⚠️ **NÃO precisa** adicionar as variáveis POSTGRES_* pois o banco já está vinculado ao projeto

### 3. Deploy

Clique em **"Deploy"** e aguarde.

### 4. Inicializar Banco em Produção

Após deploy, acesse:
```
https://escovato.com.br/api/init-db
```

### 5. IMPORTANTE - Segurança

Após inicializar o banco em produção, você DEVE:

1. **Alterar a senha do admin**
   - Ou criar um novo usuário e deletar o padrão

2. **Proteger ou remover a rota /api/init-db**
   
   Edite `/src/app/api/init-db/route.ts` e adicione no início:
   ```typescript
   export async function GET() {
     return NextResponse.json(
       { error: 'Rota desabilitada' },
       { status: 403 }
     );
   }
   ```

---

## 📱 Como Usar no Dia a Dia

### Vender um Vale:

1. Cliente solicita vale
2. Abra `/admin/vales/novo`
3. Preencha dados do cliente
4. Defina valor e serviço
5. Salve e compartilhe via WhatsApp ou baixe o PDF
6. Imprima ou envie digitalmente ao cliente

### Usar um Vale:

1. Cliente apresenta o vale
2. Abra `/admin/vales/validar`
3. Escaneie QR Code ou digite código
4. Verifique informações
5. Confirme o uso
6. Vale é automaticamente marcado como usado

---

## 🆘 Problemas Comuns

### "Cannot connect to database"

**Solução**: Verifique as variáveis POSTGRES_* no .env.local

### "Unauthorized" ao acessar /admin/vales

**Solução**: Faça login em /admin/login primeiro

### QR Scanner não abre câmera

**Solução**: 
- Em produção, use HTTPS (obrigatório)
- Dê permissão de câmera no navegador
- Use "Código Manual" como alternativa

### PDF não baixa

**Solução**: 
- Verifique console do navegador (F12)
- Confirme que NEXT_PUBLIC_BASE_URL está configurado

---

## ✅ Tudo Pronto!

Sistema completo e funcional! 🎉

**Documentação completa**: Veja `VALE_PRESENTE_README.md`

**Dúvidas?** Revise os arquivos criados ou entre em contato com o desenvolvedor.

