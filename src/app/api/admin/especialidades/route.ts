import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getEspecialidades,
  createEspecialidade,
} from '@/lib/especialidades';

// GET - Listar todas as especialidades
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apenasAtivas = searchParams.get('ativas') === 'true';

    const especialidades = await getEspecialidades(apenasAtivas);

    return NextResponse.json(especialidades);
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar especialidades' },
      { status: 500 }
    );
  }
}

// POST - Criar nova especialidade
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode criar especialidades
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const body = await request.json();
    const { nome, descricao, cor } = body;

    if (!nome || !cor) {
      return NextResponse.json(
        { error: 'Nome e cor são obrigatórios' },
        { status: 400 }
      );
    }

    const especialidade = await createEspecialidade({ nome, descricao, cor });

    return NextResponse.json(especialidade, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    return NextResponse.json(
      { error: 'Erro ao criar especialidade' },
      { status: 500 }
    );
  }
}


