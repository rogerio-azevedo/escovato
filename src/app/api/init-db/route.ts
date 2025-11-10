import { NextResponse } from 'next/server';
import { initDatabase, createInitialAdmin } from '@/lib/db';

// Rota para inicializar o banco de dados
// ATENÇÃO: Esta rota deve ser protegida ou removida em produção
export async function GET() {
  try {
    // Inicializar tabelas
    await initDatabase();

    // Criar usuário admin inicial (apenas se não existir)
    // IMPORTANTE: Altere estas credenciais!
    const admin = await createInitialAdmin(
      'admin@escovato.com.br',
      'escovato2025', // MUDE ESTA SENHA!
      'Administrador'
    );

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso',
      admin: admin ? { email: admin.email, nome: admin.nome } : null,
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar banco de dados' },
      { status: 500 }
    );
  }
}

