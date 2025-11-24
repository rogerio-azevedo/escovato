import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { atualizarPosicaoProfissional } from '@/lib/rodizios';

// PUT - Atualizar posição do profissional na fila (reordenar)
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
    const { nova_posicao } = body;

    if (nova_posicao === undefined || nova_posicao < 1) {
      return NextResponse.json(
        { error: 'nova_posicao é obrigatória e deve ser maior que 0' },
        { status: 400 }
      );
    }

    const sucesso = await atualizarPosicaoProfissional(id, {
      nova_posicao,
      usuario_id: session.user.id,
    });

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Profissional no rodízio não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar posição:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar posição' },
      { status: 500 }
    );
  }
}


