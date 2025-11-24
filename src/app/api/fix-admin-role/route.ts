import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Rota para corrigir o role do usuário admin
// ATENÇÃO: Execute apenas uma vez para corrigir usuários antigos
export async function GET() {
  try {
    // Atualizar todos os usuários admin existentes sem role
    const result = await sql`
      UPDATE usuarios_admin 
      SET role = 'admin' 
      WHERE email = 'admin@escovato.com.br'
      RETURNING id, email, nome, role
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Usuário admin não encontrado',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Role do admin corrigido com sucesso!',
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao corrigir role:', error);
    return NextResponse.json(
      { error: 'Erro ao corrigir role do admin' },
      { status: 500 }
    );
  }
}


