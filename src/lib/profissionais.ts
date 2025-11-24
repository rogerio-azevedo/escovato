import { sql } from './db';
import bcrypt from 'bcryptjs';
import type {
  Profissional,
  ProfissionalComEspecialidades,
  CreateProfissionalInput,
  UpdateProfissionalInput,
} from '@/types/profissional';

// Listar todos os profissionais
export async function getProfissionais(apenasAtivos = false): Promise<Profissional[]> {
  try {
    const query = apenasAtivos
      ? sql`SELECT id, nome, telefone, cpf, email, ativo, created_at, updated_at 
            FROM profissionais WHERE ativo = true ORDER BY nome ASC`
      : sql`SELECT id, nome, telefone, cpf, email, ativo, created_at, updated_at 
            FROM profissionais ORDER BY nome ASC`;

    const result = await query;
    return result.rows as Profissional[];
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
}

// Buscar profissional por ID com especialidades
export async function getProfissionalById(id: string): Promise<ProfissionalComEspecialidades | null> {
  try {
    const profissionalResult = await sql`
      SELECT id, nome, telefone, cpf, email, ativo, created_at, updated_at 
      FROM profissionais 
      WHERE id = ${id}
    `;

    if (profissionalResult.rows.length === 0) {
      return null;
    }

    const profissional = profissionalResult.rows[0] as Profissional;

    // Buscar especialidades do profissional
    const especialidadesResult = await sql`
      SELECT e.id, e.nome, e.cor
      FROM especialidades e
      INNER JOIN profissionais_especialidades pe ON e.id = pe.especialidade_id
      WHERE pe.profissional_id = ${id}
      ORDER BY e.nome ASC
    `;

    return {
      ...profissional,
      especialidades: especialidadesResult.rows,
    } as ProfissionalComEspecialidades;
  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    throw error;
  }
}

// Buscar profissional por email (para login)
export async function getProfissionalByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM profissionais WHERE email = ${email}
    `;

    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar profissional por email:', error);
    throw error;
  }
}

// Criar novo profissional
export async function createProfissional(
  data: CreateProfissionalInput
): Promise<Profissional> {
  try {
    const { nome, telefone, cpf, email, senha, especialidades_ids } = data;

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Criar profissional
    const result = await sql`
      INSERT INTO profissionais (nome, telefone, cpf, email, senha_hash)
      VALUES (${nome}, ${telefone}, ${cpf}, ${email}, ${senha_hash})
      RETURNING id, nome, telefone, cpf, email, ativo, created_at, updated_at
    `;

    const profissional = result.rows[0] as Profissional;

    // Associar especialidades se fornecidas
    if (especialidades_ids && especialidades_ids.length > 0) {
      await associarEspecialidades(profissional.id, especialidades_ids);
    }

    return profissional;
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    throw error;
  }
}

// Atualizar profissional
export async function updateProfissional(
  id: string,
  data: UpdateProfissionalInput
): Promise<Profissional | null> {
  try {
    const { nome, telefone, cpf, email, senha, ativo } = data;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (nome !== undefined) {
      updates.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (telefone !== undefined) {
      updates.push(`telefone = $${paramIndex++}`);
      values.push(telefone);
    }
    if (cpf !== undefined) {
      updates.push(`cpf = $${paramIndex++}`);
      values.push(cpf);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (senha !== undefined) {
      const senha_hash = await bcrypt.hash(senha, 10);
      updates.push(`senha_hash = $${paramIndex++}`);
      values.push(senha_hash);
    }
    if (ativo !== undefined) {
      updates.push(`ativo = $${paramIndex++}`);
      values.push(ativo);
    }

    if (updates.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE profissionais 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, nome, telefone, cpf, email, ativo, created_at, updated_at
    `;

    const result = await sql.query(query, values);
    return result.rows[0] as Profissional || null;
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    throw error;
  }
}

// Deletar profissional (soft delete)
export async function deleteProfissional(id: string): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE profissionais 
      SET ativo = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    throw error;
  }
}

// Associar especialidades ao profissional
export async function associarEspecialidades(
  profissionalId: string,
  especialidadesIds: string[]
): Promise<void> {
  try {
    // Remover todas as associações existentes
    await sql`
      DELETE FROM profissionais_especialidades 
      WHERE profissional_id = ${profissionalId}
    `;

    // Inserir novas associações
    if (especialidadesIds.length > 0) {
      const values = especialidadesIds
        .map((espId) => `('${profissionalId}', '${espId}')`)
        .join(', ');

      await sql.query(`
        INSERT INTO profissionais_especialidades (profissional_id, especialidade_id)
        VALUES ${values}
      `);
    }
  } catch (error) {
    console.error('Erro ao associar especialidades:', error);
    throw error;
  }
}

// Remover especialidade específica do profissional
export async function removerEspecialidade(
  profissionalId: string,
  especialidadeId: string
): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM profissionais_especialidades 
      WHERE profissional_id = ${profissionalId} 
      AND especialidade_id = ${especialidadeId}
      RETURNING id
    `;

    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao remover especialidade:', error);
    throw error;
  }
}

// Listar profissionais por especialidade
export async function getProfissionaisByEspecialidade(
  especialidadeId: string,
  apenasAtivos = true
): Promise<Profissional[]> {
  try {
    const query = apenasAtivos
      ? sql`
          SELECT p.id, p.nome, p.telefone, p.cpf, p.email, p.ativo, p.created_at, p.updated_at
          FROM profissionais p
          INNER JOIN profissionais_especialidades pe ON p.id = pe.profissional_id
          WHERE pe.especialidade_id = ${especialidadeId} AND p.ativo = true
          ORDER BY p.nome ASC
        `
      : sql`
          SELECT p.id, p.nome, p.telefone, p.cpf, p.email, p.ativo, p.created_at, p.updated_at
          FROM profissionais p
          INNER JOIN profissionais_especialidades pe ON p.id = pe.profissional_id
          WHERE pe.especialidade_id = ${especialidadeId}
          ORDER BY p.nome ASC
        `;

    const result = await query;
    return result.rows as Profissional[];
  } catch (error) {
    console.error('Erro ao buscar profissionais por especialidade:', error);
    throw error;
  }
}

