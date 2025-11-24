import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRodizioHoje, getFilasRodizio } from '@/lib/rodizios';

// GET - Buscar rodízio de hoje (cria se não existir)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const rodizio = await getRodizioHoje(session.user.id);

    // Buscar filas do rodízio
    const filas = await getFilasRodizio(rodizio.id);

    return NextResponse.json({
      rodizio,
      filas,
    });
  } catch (error) {
    console.error('Erro ao buscar rodízio de hoje:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar rodízio de hoje' },
      { status: 500 }
    );
  }
}

