import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getProfissionalById,
  updateProfissional,
  deleteProfissional,
} from '@/lib/profissionais';

// GET - Buscar profissional por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const profissional = await getProfissionalById(id);

    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(profissional);
  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar profissional' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar profissional
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode atualizar profissionais
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nome, telefone, cpf, email, senha, ativo } = body;

    const profissional = await updateProfissional(id, {
      nome,
      telefone,
      cpf,
      email,
      senha,
      ativo,
    });

    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(profissional);
  } catch (error: any) {
    console.error('Erro ao atualizar profissional:', error);

    // Verificar se é erro de duplicação
    if (error?.message?.includes('duplicate') || error?.code === '23505') {
      return NextResponse.json(
        { error: 'CPF ou email já cadastrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar profissional' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar profissional (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode deletar profissionais
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { id } = await params;
    const sucesso = await deleteProfissional(id);

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar profissional' },
      { status: 500 }
    );
  }
}

