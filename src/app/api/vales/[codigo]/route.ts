import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    const result = await sql`
      SELECT * FROM vales_presente 
      WHERE codigo_hash = ${codigo}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Vale não encontrado' },
        { status: 404 }
      );
    }

    const vale = result.rows[0];

    return NextResponse.json({ vale });
  } catch (error) {
    console.error('Erro ao buscar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vale' },
      { status: 500 }
    );
  }
}

