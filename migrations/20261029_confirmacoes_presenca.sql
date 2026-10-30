-- Migração aditiva e idempotente. Não modifica tabelas existentes.
CREATE TABLE IF NOT EXISTS confirmacoes_presenca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento VARCHAR(80) NOT NULL,
  nome VARCHAR(120) NOT NULL CHECK (char_length(trim(nome)) >= 2),
  whatsapp VARCHAR(13) NOT NULL CHECK (whatsapp ~ '^55[1-9][0-9]{9,10}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (evento, whatsapp)
);
