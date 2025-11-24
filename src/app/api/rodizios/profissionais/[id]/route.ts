import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { removerProfissionalDoRodizio } from '@/lib/rodizios';

// DELETE - Remover profissional do rodízio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const sucesso = await removerProfissionalDoRodizio(
      id,
      session.user.id
    );

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Profissional no rodízio não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao remover profissional' },
      { status: 500 }
    );
  }
}

