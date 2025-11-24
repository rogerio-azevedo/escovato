import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { fecharRodizio } from '@/lib/rodizios';

// GET - Fechar rodízio do dia anterior (executado por Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    // Verificar autorização do cron (Vercel envia header especial)
    const authHeader = request.headers.get('authorization');
    
    // Em produção, verificar se vem do Vercel Cron
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    // Buscar rodízios abertos do dia anterior ou mais antigos
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().split('T')[0];

    const rodiziosAbertos = await sql`
      SELECT id FROM rodizios 
      WHERE status = 'aberto' 
      AND data <= ${dataOntem}
    `;

    let fechados = 0;

    for (const rodizio of rodiziosAbertos.rows) {
      await fecharRodizio(rodizio.id);
      fechados++;
    }

    return NextResponse.json({
      success: true,
      message: `${fechados} rodízio(s) fechado(s)`,
      fechados,
    });
  } catch (error) {
    console.error('Erro ao fechar rodízios:', error);
    return NextResponse.json(
      { error: 'Erro ao fechar rodízios' },
      { status: 500 }
    );
  }
}

