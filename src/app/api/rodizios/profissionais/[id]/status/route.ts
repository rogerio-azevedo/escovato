import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { atualizarStatusProfissional } from '@/lib/rodizios';

// PUT - Atualizar status do profissional no rodízio
export async function PUT(
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
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'status é obrigatório' },
        { status: 400 }
      );
    }

    const statusValidos = ['aguardando', 'atendendo', 'almoco', 'indisponivel', 'finalizado'];
    if (!statusValidos.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    const rodizioProfissional = await atualizarStatusProfissional(id, {
      status,
      usuario_id: session.user.id,
    });

    if (!rodizioProfissional) {
      return NextResponse.json(
        { error: 'Profissional no rodízio não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rodizioProfissional);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status' },
      { status: 500 }
    );
  }
}

