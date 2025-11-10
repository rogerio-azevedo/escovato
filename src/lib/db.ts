import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export { sql };

// Função para inicializar o banco de dados
export async function initDatabase() {
  try {
    // Criar tabela de usuários admin
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios_admin (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de vales presente
    await sql`
      CREATE TABLE IF NOT EXISTS vales_presente (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo_hash VARCHAR(255) UNIQUE NOT NULL,
        nome_completo VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        descricao TEXT NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        mensagem TEXT,
        de VARCHAR(255) NOT NULL,
        para VARCHAR(255) NOT NULL,
        validade DATE NOT NULL,
        usado BOOLEAN DEFAULT FALSE,
        data_uso TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar índices para melhorar performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_vales_codigo_hash 
      ON vales_presente(codigo_hash)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_vales_cpf 
      ON vales_presente(cpf)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_vales_usado 
      ON vales_presente(usado)
    `;

    console.log("✅ Database initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Função para criar usuário admin inicial (executar uma vez)
export async function createInitialAdmin(
  email: string,
  senha: string,
  nome: string
) {
  const senha_hash = await bcrypt.hash(senha, 10);

  try {
    const result = await sql`
      INSERT INTO usuarios_admin (email, senha_hash, nome)
      VALUES (${email}, ${senha_hash}, ${nome})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, nome
    `;

    return result.rows[0];
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}
