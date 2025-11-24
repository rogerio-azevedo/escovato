import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProfissionais, createProfissional } from '@/lib/profissionais';

// GET - Listar todos os profissionais
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apenasAtivos = searchParams.get('ativos') === 'true';

    const profissionais = await getProfissionais(apenasAtivos);

    return NextResponse.json(profissionais);
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar profissionais' },
      { status: 500 }
    );
  }
}

// POST - Criar novo profissional
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode criar profissionais
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const body = await request.json();
    const { nome, telefone, cpf, email, senha, especialidades_ids } = body;

    if (!nome || !telefone || !cpf || !email || !senha) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const profissional = await createProfissional({
      nome,
      telefone,
      cpf,
      email,
      senha,
      especialidades_ids,
    });

    return NextResponse.json(profissional, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar profissional:', error);

    // Verificar se é erro de duplicação
    if (error?.message?.includes('duplicate') || error?.code === '23505') {
      return NextResponse.json(
        { error: 'CPF ou email já cadastrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar profissional' },
      { status: 500 }
    );
  }
}


