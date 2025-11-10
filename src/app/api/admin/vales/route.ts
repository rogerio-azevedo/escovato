import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { criarVale, listarVales, validarCPF } from '@/lib/vales';
import type { CreateValeInput, ValeFilters, ValeStatus } from '@/types/vale';

// GET - Listar vales
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const filters: ValeFilters = {
      status: statusParam ? (statusParam as ValeStatus) : undefined,
      search: searchParams.get('search') || undefined,
    };

    const vales = await listarVales(filters);

    return NextResponse.json({ vales });
  } catch (error) {
    console.error('Erro ao listar vales:', error);
    return NextResponse.json(
      { error: 'Erro ao listar vales' },
      { status: 500 }
    );
  }
}

// POST - Criar novo vale
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validar e processar a data de validade
    let validade: Date;
    try {
      if (!body.validade) {
        return NextResponse.json(
          { error: 'A data de validade é obrigatória' },
          { status: 400 }
        );
      }
      validade = new Date(body.validade + 'T00:00:00');
      if (isNaN(validade.getTime())) {
        throw new Error('Data inválida');
      }
    } catch {
      return NextResponse.json(
        { error: 'Data de validade inválida' },
        { status: 400 }
      );
    }

    // Validar se a data é futura
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (validade < hoje) {
      return NextResponse.json(
        { error: 'A data de validade deve ser hoje ou uma data futura' },
        { status: 400 }
      );
    }

    const data: CreateValeInput = {
      nome_completo: body.nome_completo,
      cpf: body.cpf ? body.cpf.replace(/[^\d]/g, '') : '',
      descricao: body.descricao,
      valor: parseFloat(body.valor),
      mensagem: body.mensagem,
      de: body.de,
      para: body.para,
      validade: validade,
    };

    // Validações
    if (!data.nome_completo || !data.descricao || !data.valor) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // CPF é opcional, mas se fornecido deve ser válido
    if (data.cpf && !validarCPF(data.cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    }

    if (isNaN(data.valor) || data.valor <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    const vale = await criarVale(data);

    return NextResponse.json({ vale }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar vale:', error);
    return NextResponse.json(
      { error: 'Erro ao criar vale' },
      { status: 500 }
    );
  }
}

