import { sql } from './db';
import bcrypt from 'bcryptjs';
import type { Usuario } from '@/types/auth';

// Listar todos os usuários
export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const result = await sql`
      SELECT id, email, nome, role, created_at 
      FROM usuarios_admin 
      ORDER BY created_at DESC
    `;

    return result.rows as Usuario[];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

// Buscar usuário por ID
export async function getUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const result = await sql`
      SELECT id, email, nome, role, created_at 
      FROM usuarios_admin 
      WHERE id = ${id}
    `;

    return result.rows[0] as Usuario || null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

// Criar novo usuário
export async function createUsuario(
  email: string,
  senha: string,
  nome: string,
  role: 'admin' | 'recepcionista'
): Promise<Usuario> {
  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    const result = await sql`
      INSERT INTO usuarios_admin (email, senha_hash, nome, role)
      VALUES (${email}, ${senha_hash}, ${nome}, ${role})
      RETURNING id, email, nome, role, created_at
    `;

    return result.rows[0] as Usuario;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// Atualizar usuário
export async function updateUsuario(
  id: string,
  data: {
    email?: string;
    nome?: string;
    role?: 'admin' | 'recepcionista';
    senha?: string;
  }
): Promise<Usuario | null> {
  try {
    const { email, nome, role, senha } = data;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (nome !== undefined) {
      updates.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(role);
    }
    if (senha !== undefined) {
      const senha_hash = await bcrypt.hash(senha, 10);
      updates.push(`senha_hash = $${paramIndex++}`);
      values.push(senha_hash);
    }

    if (updates.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    values.push(id);

    const query = `
      UPDATE usuarios_admin 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, email, nome, role, created_at
    `;

    const result = await sql.query(query, values);
    return result.rows[0] as Usuario || null;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

// Deletar usuário
export async function deleteUsuario(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM usuarios_admin 
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

// Verificar se email já existe
export async function emailJaExiste(email: string, excludeId?: string): Promise<boolean> {
  try {
    const query = excludeId
      ? sql`SELECT id FROM usuarios_admin WHERE email = ${email} AND id != ${excludeId}`
      : sql`SELECT id FROM usuarios_admin WHERE email = ${email}`;

    const result = await query;
    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    throw error;
  }
}

