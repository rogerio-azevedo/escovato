import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUsuarios, createUsuario, emailJaExiste } from '@/lib/usuarios';

// GET - Listar todos os usuários
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode listar usuários
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const usuarios = await getUsuarios();

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admin pode criar usuários
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const body = await request.json();
    const { email, senha, nome, role } = body;

    if (!email || !senha || !nome || !role) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['admin', 'recepcionista'].includes(role)) {
      return NextResponse.json(
        { error: 'Role inválido' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existe = await emailJaExiste(email);
    if (existe) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const usuario = await createUsuario(email, senha, nome, role);

    return NextResponse.json(usuario, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);

    if (error?.message?.includes('duplicate') || error?.code === '23505') {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}


