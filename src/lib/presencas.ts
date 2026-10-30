import { sql } from "./db";
import { aniversario } from "./aniversario";
import type { PresencaInput } from "./presencas-validacao";
import type { ConfirmacaoPresenca } from "@/types/presenca";

let inicializacao: Promise<void> | undefined;

// Apenas a tabela deste módulo; não executa a inicialização de usuários do sistema.
// O SQL também está disponível em migrations/20261029_confirmacoes_presenca.sql.
export function initPresencasDatabase(): Promise<void> {
  if (!inicializacao) {
    inicializacao = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS confirmacoes_presenca (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          evento VARCHAR(80) NOT NULL,
          nome VARCHAR(120) NOT NULL CHECK (char_length(trim(nome)) >= 2),
          whatsapp VARCHAR(13) NOT NULL CHECK (whatsapp ~ '^55[1-9][0-9]{9,10}$'),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (evento, whatsapp)
        )
      `;
    })().catch((error: unknown) => {
      inicializacao = undefined;
      throw error;
    });
  }
  return inicializacao;
}

export async function confirmarPresenca(dados: PresencaInput): Promise<void> {
  await initPresencasDatabase();
  // A restrição no banco também protege contra envios simultâneos.
  // Reenvios não duplicam o convidado nem alteram dados de outra confirmação.
  await sql`
    INSERT INTO confirmacoes_presenca (evento, nome, whatsapp)
    VALUES (${aniversario.evento}, ${dados.nome}, ${dados.whatsapp})
    ON CONFLICT (evento, whatsapp) DO NOTHING
  `;
}

export async function listarPresencas(): Promise<ConfirmacaoPresenca[]> {
  await initPresencasDatabase();
  const result = await sql`
    SELECT id, nome, whatsapp, created_at
    FROM confirmacoes_presenca
    WHERE evento = ${aniversario.evento}
    ORDER BY created_at DESC, id DESC
  `;
  return result.rows as ConfirmacaoPresenca[];
}
