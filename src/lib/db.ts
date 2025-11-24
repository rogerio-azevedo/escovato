import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export { sql };

// Função para inicializar o banco de dados
export async function initDatabase() {
  try {
    // Criar tabela de usuários admin (com role)
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios_admin (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'recepcionista',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Adicionar coluna role se não existir (para bancos existentes)
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='usuarios_admin' AND column_name='role'
        ) THEN
          ALTER TABLE usuarios_admin ADD COLUMN role VARCHAR(50) DEFAULT 'recepcionista';
        END IF;
      END $$;
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

    // Criar índices para melhorar performance (vales)
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

// Função para inicializar o banco de dados do rodízio
export async function initRodizioDatabase() {
  try {
    // 1. Criar tabela de especialidades
    await sql`
      CREATE TABLE IF NOT EXISTS especialidades (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        cor VARCHAR(7) NOT NULL DEFAULT '#6366f1',
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Criar tabela de profissionais
    await sql`
      CREATE TABLE IF NOT EXISTS profissionais (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Criar tabela pivot profissionais_especialidades
    await sql`
      CREATE TABLE IF NOT EXISTS profissionais_especialidades (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
        especialidade_id UUID NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(profissional_id, especialidade_id)
      )
    `;

    // 4. Criar tabela de rodizios
    await sql`
      CREATE TABLE IF NOT EXISTS rodizios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data DATE UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'aberto',
        aberto_por UUID NOT NULL REFERENCES usuarios_admin(id),
        aberto_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fechado_em TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 5. Criar tabela rodizios_profissionais
    await sql`
      CREATE TABLE IF NOT EXISTS rodizios_profissionais (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rodizio_id UUID NOT NULL REFERENCES rodizios(id) ON DELETE CASCADE,
        especialidade_id UUID NOT NULL REFERENCES especialidades(id),
        profissional_id UUID NOT NULL REFERENCES profissionais(id),
        posicao INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'aguardando',
        adicionado_por UUID NOT NULL REFERENCES usuarios_admin(id),
        adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(rodizio_id, especialidade_id, profissional_id)
      )
    `;

    // 6. Criar tabela de atendimentos (histórico)
    await sql`
      CREATE TABLE IF NOT EXISTS rodizios_atendimentos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rodizio_profissional_id UUID NOT NULL REFERENCES rodizios_profissionais(id) ON DELETE CASCADE,
        inicio_atendimento TIMESTAMP NOT NULL,
        fim_atendimento TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 7. Criar tabela de logs (auditoria)
    await sql`
      CREATE TABLE IF NOT EXISTS rodizios_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rodizio_id UUID NOT NULL REFERENCES rodizios(id) ON DELETE CASCADE,
        usuario_id UUID NOT NULL,
        usuario_tipo VARCHAR(20) NOT NULL,
        acao VARCHAR(50) NOT NULL,
        detalhes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar índices para otimização
    await sql`CREATE INDEX IF NOT EXISTS idx_especialidades_ativo ON especialidades(ativo)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profissionais_ativo ON profissionais(ativo)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profissionais_cpf ON profissionais(cpf)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profissionais_email ON profissionais(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_prof_esp_profissional ON profissionais_especialidades(profissional_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_prof_esp_especialidade ON profissionais_especialidades(especialidade_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_data ON rodizios(data)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_status ON rodizios(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_prof_rodizio ON rodizios_profissionais(rodizio_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_prof_status ON rodizios_profissionais(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_prof_posicao ON rodizios_profissionais(posicao)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_atend_prof ON rodizios_atendimentos(rodizio_profissional_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_logs_rodizio ON rodizios_logs(rodizio_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rodizios_logs_created ON rodizios_logs(created_at)`;

    console.log("✅ Rodizio database initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error initializing rodizio database:", error);
    throw error;
  }
}

// Função para criar usuário admin inicial (executar uma vez)
export async function createInitialAdmin(
  email: string,
  senha: string,
  nome: string,
  role: 'admin' | 'recepcionista' = 'admin'
) {
  const senha_hash = await bcrypt.hash(senha, 10);

  try {
    const result = await sql`
      INSERT INTO usuarios_admin (email, senha_hash, nome, role)
      VALUES (${email}, ${senha_hash}, ${nome}, ${role})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, nome, role
    `;

    return result.rows[0];
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}
