# Confirmação de presença · 1 ano do Escovato

## Acesso

- Formulário público: `/aniversario`.
- Endereço de divulgação e conteúdo do QR: `https://www.escovato.com.br/aniversario`.
- Lista protegida: `/admin/presencas` (administradores e recepcionistas).
- QR para download: `/aniversario-qr.png` e `/aniversario-qr.svg`.

O formulário solicita somente nome e WhatsApp. Após a gravação, mostra a confirmação e a rota para o salão. Não envia mensagens de WhatsApp automaticamente.

## Banco de dados

Usa o PostgreSQL já configurado pelo projeto (`POSTGRES_URL`). A tabela `confirmacoes_presenca` possui `id`, `evento`, `nome`, `whatsapp` e `created_at`. O WhatsApp é normalizado com país e DDD. A chave única `(evento, whatsapp)` impede duplicações inclusive em requisições simultâneas. Reenvios mantêm a confirmação original.

A migração aditiva está em `migrations/20261029_confirmacoes_presenca.sql`. A aplicação também garante a criação dessa tabela no primeiro uso, sem chamar a rota de inicialização dos outros módulos nem criar usuários administrativos. A conta do banco deve poder executar `CREATE TABLE IF NOT EXISTS`, ou a migração deve ser aplicada antes do deploy.

## Evento

Os dados, o link e o prazo ficam em `src/lib/aniversario.ts`. Este formulário é específico para `escovato-1-ano-2026`. O evento será em **7 de novembro de 2026, das 17h às 22h, em Cuiabá**. As confirmações são aceitas até o fim de **6 de novembro**, conforme o convite, e se encerram à meia-noite do início de 7 de novembro no fuso de Cuiabá. Uma futura edição precisa de outro identificador de evento e da atualização de seus dados.

## Verificação e publicação

```sh
npm run test:presencas
npx tsc --noEmit
npm run build
```

Os testes cobrem normalização, validação, limites do formulário, origem do envio, encerramento, falhas de gravação e autorização da consulta. O QR deve continuar apontando ao endereço público acima e ser conferido novamente se o caminho mudar.

Publicar as alterações pelo fluxo Vercel deste repositório. Antes de distribuir o convite, conferir o formulário no endereço público e o acesso à lista pelo painel. A prévia local e a geração do QR, por si só, não publicam a página.
