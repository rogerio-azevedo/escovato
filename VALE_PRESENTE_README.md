# Sistema de Gerenciamento de Vale Presente - Escovato

## 📋 Visão Geral

Sistema completo para gerenciar vales presente do salão Escovato, incluindo:
- ✅ Criação e gerenciamento de vales
- ✅ Autenticação segura com NextAuth
- ✅ Geração de PDF personalizado
- ✅ QR Code para validação
- ✅ Scanner de QR Code via câmera
- ✅ Validação por código ou CPF
- ✅ Compartilhamento via WhatsApp
- ✅ Dashboard com estatísticas

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados Vercel Postgres

1. Acesse seu projeto na [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em "Storage" → "Create Database" → "Postgres"
3. Copie as variáveis de ambiente geradas
4. Cole no arquivo `.env.local` (crie baseado no `.env.local.example`)

### 3. Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Cole o resultado em `.env.local`:

```env
NEXTAUTH_SECRET=resultado-do-comando-acima
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Inicializar Banco de Dados

Após configurar as variáveis de ambiente, acesse:

```
http://localhost:3000/api/init-db
```

Isso criará as tabelas e um usuário admin inicial:
- **Email**: admin@escovato.com.br
- **Senha**: escovato2025

⚠️ **IMPORTANTE**: Altere a senha padrão no arquivo `/src/lib/db.ts` antes de executar em produção!

### 5. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000/admin/login

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth endpoints
│   │   ├── admin/vales/            # APIs de gerenciamento
│   │   ├── vales/validar/          # API pública de validação
│   │   └── init-db/                # Inicialização do banco
│   └── admin/
│       ├── login/                  # Página de login
│       └── vales/
│           ├── page.tsx            # Dashboard
│           ├── novo/               # Criar vale
│           ├── [id]/               # Detalhes do vale
│           └── validar/            # Validação de vales
├── components/
│   └── admin/
│       ├── StatusBadge.tsx         # Badge de status
│       ├── ValeCard.tsx            # Card de vale
│       ├── ValeFilters.tsx         # Filtros
│       └── QRScanner.tsx           # Scanner de QR Code
├── lib/
│   ├── auth.ts                     # Configuração NextAuth
│   ├── db.ts                       # Conexão e migrations
│   ├── vales.ts                    # Funções de negócio
│   └── pdf-generator.ts            # Geração de PDF
└── types/
    ├── vale.ts                     # Tipos do vale
    └── auth.ts                     # Tipos de autenticação
```

## 🎯 Funcionalidades

### Dashboard Admin

- Visualização de estatísticas (total, ativos, usados, expirados)
- Listagem de todos os vales
- Filtros por status e busca
- Acesso rápido para criar e validar vales

### Criar Vale Presente

1. Preencher informações do cliente (nome, CPF)
2. Definir valor e descrição do serviço
3. Adicionar mensagem personalizada (opcional)
4. Configurar validade (padrão: 90 dias)
5. Sistema gera código único e QR Code automaticamente

### Validar Vale

Três métodos de validação:

1. **Código Manual**: Digite o código do vale
2. **Buscar por CPF**: Encontre o vale pelo CPF do cliente
3. **QR Code**: Use a câmera para escanear

### Geração de PDF

- Design profissional baseado nas artes do Canva
- QR Code integrado para validação
- Informações completas do vale
- Pronto para impressão ou compartilhamento

### Compartilhar WhatsApp

- Mensagem formatada automaticamente
- Inclui todas as informações do vale
- Link direto para abertura no WhatsApp

## 🔐 Segurança

- ✅ Autenticação obrigatória para área admin
- ✅ Senhas hasheadas com bcrypt
- ✅ Middleware de proteção de rotas
- ✅ Validação de CPF no backend
- ✅ Códigos únicos gerados com UUID
- ✅ API de validação com rate limiting (recomendado)

## 🌐 Deploy na Vercel

### 1. Configure o Banco de Dados

```bash
vercel env add POSTGRES_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_BASE_URL
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Inicializar Banco

Após deploy, acesse:
```
https://seu-dominio.vercel.app/api/init-db
```

### 4. Remover Rota de Inicialização

⚠️ **Importante**: Após inicializar o banco, remova ou proteja a rota `/api/init-db` para segurança.

## 📱 Uso no Salão

### Fluxo de Venda:

1. Cliente compra vale presente
2. Atendente acessa `/admin/vales/novo`
3. Preenche dados e cria o vale
4. Download do PDF ou compartilha via WhatsApp
5. Cliente recebe vale com QR Code

### Fluxo de Uso:

1. Cliente apresenta vale (físico ou digital)
2. Recepcionista acessa `/admin/vales/validar`
3. Escolhe método (QR Code, código ou CPF)
4. Sistema valida e mostra informações
5. Confirma uso do vale
6. Vale é marcado como usado

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **NextAuth.js** - Autenticação
- **Vercel Postgres** - Banco de dados
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **jsPDF** - Geração de PDF
- **QRCode** - Geração de QR Codes
- **jsQR** - Leitura de QR Codes

## 📝 Próximas Melhorias (Opcional)

- [ ] Relatórios de vendas e uso
- [ ] Exportação de dados (CSV, Excel)
- [ ] Sistema de notificações (vale próximo do vencimento)
- [ ] Histórico de alterações
- [ ] Multi-usuários com permissões
- [ ] API para integração com sistema de caixa
- [ ] Dashboard com gráficos
- [ ] Impressão térmica direta

## 🐛 Solução de Problemas

### Erro de Autenticação

- Verifique se `NEXTAUTH_SECRET` está configurado
- Confirme que `NEXTAUTH_URL` está correto

### Erro no Banco de Dados

- Verifique as variáveis `POSTGRES_*` no `.env.local`
- Certifique-se que executou `/api/init-db`
- Verifique logs do Vercel Dashboard

### QR Scanner não funciona

- O scanner precisa de HTTPS em produção
- Verifique permissões de câmera do navegador
- Use código manual como alternativa

### PDF não gera

- Verifique console do navegador
- Confirme que `NEXT_PUBLIC_BASE_URL` está configurado
- Teste com dados simples primeiro

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para Escovato Salão de Beleza**

