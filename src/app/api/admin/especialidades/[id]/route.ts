import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getEspecialidadeById,
  updateEspecialidade,
  deleteEspecialidade,
  especialidadeTemProfissionais,
} from '@/lib/especialidades';

// GET - Buscar especialidade por ID
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
    const especialidade = await getEspecialidadeById(id);

    if (!especialidade) {
      return NextResponse.json(
        { error: 'Especialidade não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(especialidade);
  } catch (error) {
    console.error('Erro ao buscar especialidade:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar especialidade' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar especialidade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode atualizar especialidades
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nome, descricao, cor, ativo } = body;

    const especialidade = await updateEspecialidade(id, {
      nome,
      descricao,
      cor,
      ativo,
    });

    if (!especialidade) {
      return NextResponse.json(
        { error: 'Especialidade não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(especialidade);
  } catch (error) {
    console.error('Erro ao atualizar especialidade:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar especialidade' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar especialidade (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode deletar especialidades
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { id } = await params;
    // Verificar se tem profissionais associados
    const temProfissionais = await especialidadeTemProfissionais(id);

    if (temProfissionais) {
      return NextResponse.json(
        {
          error:
            'Não é possível deletar especialidade com profissionais associados',
        },
        { status: 400 }
      );
    }

    const sucesso = await deleteEspecialidade(id);

    if (!sucesso) {
      return NextResponse.json(
        { error: 'Especialidade não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar especialidade:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar especialidade' },
      { status: 500 }
    );
  }
}

