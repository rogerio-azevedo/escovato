import { NextRequest, NextResponse } from 'next/server';
import { validarVale } from '@/lib/vales';

// GET - Validar vale por código (rota pública para QR code)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;
    const validacao = await validarVale(codigo);

    if (!validacao.valido) {
      return NextResponse.json(
        {
          valido: false,
          motivo: validacao.motivo,
          mensagem: validacao.mensagem,
        },
        { status: 200 } // Retorna 200 mesmo se inválido, pois a validação foi processada
      );
    }

    // Retornar informações limitadas do vale (sem dados sensíveis completos)
    return NextResponse.json({
      valido: true,
      mensagem: validacao.mensagem,
      vale: {
        codigo: validacao.vale?.codigo_hash,
        valor: Number(validacao.vale?.valor),
        descricao: validacao.vale?.descricao,
        validade: validacao.vale?.validade,
        para: validacao.vale?.para,
      },
    });
  } catch (error) {
    console.error('Erro ao validar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao validar vale' },
      { status: 500 }
    );
  }
}

