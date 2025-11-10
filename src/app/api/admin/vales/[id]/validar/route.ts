import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buscarValePorId, marcarValeComoUsado, validarVale } from '@/lib/vales';

// POST - Marcar vale como usado
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const vale = await buscarValePorId(id);

    if (!vale) {
      return NextResponse.json({ error: 'Vale não encontrado' }, { status: 404 });
    }

    // Validar antes de marcar como usado
    const validacao = await validarVale(vale.codigo_hash);

    if (!validacao.valido) {
      return NextResponse.json(
        { error: validacao.mensagem, motivo: validacao.motivo },
        { status: 400 }
      );
    }

    const valeAtualizado = await marcarValeComoUsado(id);

    return NextResponse.json({
      vale: valeAtualizado,
      mensagem: 'Vale marcado como usado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao validar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao validar vale' },
      { status: 500 }
    );
  }
}

