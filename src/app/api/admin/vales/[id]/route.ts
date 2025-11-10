import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buscarValePorId, atualizarVale, validarCPF } from '@/lib/vales';

// GET - Buscar vale por ID
export async function GET(
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

    return NextResponse.json({ vale });
  } catch (error) {
    console.error('Erro ao buscar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vale' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar vale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, string | number | Date> = {};

    if (body.nome_completo) data.nome_completo = body.nome_completo;
    if (body.cpf) {
      const cpf = body.cpf.replace(/[^\d]/g, '');
      if (!validarCPF(cpf)) {
        return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
      }
      data.cpf = cpf;
    }
    if (body.descricao) data.descricao = body.descricao;
    if (body.valor !== undefined) {
      const valor = parseFloat(body.valor);
      if (valor <= 0) {
        return NextResponse.json(
          { error: 'Valor deve ser maior que zero' },
          { status: 400 }
        );
      }
      data.valor = valor;
    }
    if (body.mensagem !== undefined) data.mensagem = body.mensagem;
    if (body.de) data.de = body.de;
    if (body.para) data.para = body.para;
    if (body.validade) data.validade = new Date(body.validade);

    const vale = await atualizarVale(id, data);

    return NextResponse.json({ vale });
  } catch (error) {
    console.error('Erro ao atualizar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar vale' },
      { status: 500 }
    );
  }
}

