import { NextResponse } from 'next/server';
import { initDatabase, initRodizioDatabase, createInitialAdmin } from '@/lib/db';

// Rota para inicializar o banco de dados
// ATENÇÃO: Esta rota deve ser protegida ou removida em produção
export async function GET() {
  try {
    // Inicializar tabelas principais
    await initDatabase();
    
    // Inicializar tabelas do rodízio
    await initRodizioDatabase();

    // Criar usuário admin inicial (apenas se não existir)
    // IMPORTANTE: Altere estas credenciais!
    const admin = await createInitialAdmin(
      'admin@escovato.com.br',
      'escovato2025', // MUDE ESTA SENHA!
      'Administrador',
      'admin'
    );

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso (incluindo rodízio)',
      admin: admin ? { email: admin.email, nome: admin.nome, role: admin.role } : null,
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar banco de dados' },
      { status: 500 }
    );
  }
}

