import { sql } from './db';
import type { 
  Especialidade, 
  CreateEspecialidadeInput, 
  UpdateEspecialidadeInput 
} from '@/types/especialidade';

// Listar todas as especialidades
export async function getEspecialidades(apenasAtivas = false): Promise<Especialidade[]> {
  try {
    const query = apenasAtivas
      ? sql`SELECT * FROM especialidades WHERE ativo = true ORDER BY nome ASC`
      : sql`SELECT * FROM especialidades ORDER BY nome ASC`;

    const result = await query;
    return result.rows as Especialidade[];
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    throw error;
  }
}

// Buscar especialidade por ID
export async function getEspecialidadeById(id: string): Promise<Especialidade | null> {
  try {
    const result = await sql`
      SELECT * FROM especialidades WHERE id = ${id}
    `;

    return result.rows[0] as Especialidade || null;
  } catch (error) {
    console.error('Erro ao buscar especialidade:', error);
    throw error;
  }
}

// Criar nova especialidade
export async function createEspecialidade(
  data: CreateEspecialidadeInput
): Promise<Especialidade> {
  try {
    const { nome, descricao, cor } = data;

    const result = await sql`
      INSERT INTO especialidades (nome, descricao, cor)
      VALUES (${nome}, ${descricao || null}, ${cor})
      RETURNING *
    `;

    return result.rows[0] as Especialidade;
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    throw error;
  }
}

// Atualizar especialidade
export async function updateEspecialidade(
  id: string,
  data: UpdateEspecialidadeInput
): Promise<Especialidade | null> {
  try {
    const { nome, descricao, cor, ativo } = data;

    // Construir query dinamicamente baseado nos campos fornecidos
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (nome !== undefined) {
      updates.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (descricao !== undefined) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(descricao);
    }
    if (cor !== undefined) {
      updates.push(`cor = $${paramIndex++}`);
      values.push(cor);
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
      UPDATE especialidades 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql.query(query, values);
    return result.rows[0] as Especialidade || null;
  } catch (error) {
    console.error('Erro ao atualizar especialidade:', error);
    throw error;
  }
}

// Deletar especialidade (soft delete)
export async function deleteEspecialidade(id: string): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE especialidades 
      SET ativo = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao deletar especialidade:', error);
    throw error;
  }
}

// Verificar se especialidade tem profissionais associados
export async function especialidadeTemProfissionais(id: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM profissionais_especialidades 
      WHERE especialidade_id = ${id}
    `;

    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Erro ao verificar profissionais da especialidade:', error);
    throw error;
  }
}

