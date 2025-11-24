import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  adicionarProfissionalAoRodizio,
  getProfissionaisDisponiveis,
} from '@/lib/rodizios';

// POST - Adicionar profissional ao rodízio
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { especialidade_id, profissional_id } = body;

    if (!especialidade_id || !profissional_id) {
      return NextResponse.json(
        { error: 'especialidade_id e profissional_id são obrigatórios' },
        { status: 400 }
      );
    }

    const rodizioProfissional = await adicionarProfissionalAoRodizio(id, {
      especialidade_id,
      profissional_id,
      adicionado_por: session.user.id,
    });

    return NextResponse.json(rodizioProfissional, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao adicionar profissional ao rodízio:', error);

    if (error?.message?.includes('já está nesta fila') || 
        error?.message?.includes('não possui esta especialidade')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Erro ao adicionar profissional ao rodízio' },
      { status: 500 }
    );
  }
}

// GET - Buscar profissionais disponíveis para adicionar
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const especialidadeId = searchParams.get('especialidade_id');

    if (!especialidadeId) {
      return NextResponse.json(
        { error: 'especialidade_id é obrigatório' },
        { status: 400 }
      );
    }

    const profissionais = await getProfissionaisDisponiveis(
      id,
      especialidadeId
    );

    return NextResponse.json(profissionais);
  } catch (error) {
    console.error('Erro ao buscar profissionais disponíveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar profissionais disponíveis' },
      { status: 500 }
    );
  }
}

