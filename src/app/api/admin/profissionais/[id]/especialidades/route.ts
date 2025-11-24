import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  associarEspecialidades,
  removerEspecialidade,
} from "@/lib/profissionais";

// POST - Associar especialidades ao profissional
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Apenas admin pode gerenciar especialidades
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = await request.json();
    const { especialidades_ids } = body;

    if (!Array.isArray(especialidades_ids)) {
      return NextResponse.json(
        { error: "especialidades_ids deve ser um array" },
        { status: 400 }
      );
    }

    await associarEspecialidades(id, especialidades_ids);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao associar especialidades:", error);
    return NextResponse.json(
      { error: "Erro ao associar especialidades" },
      { status: 500 }
    );
  }
}

// DELETE - Remover especialidade específica do profissional
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Apenas admin pode gerenciar especialidades
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const especialidadeId = searchParams.get("especialidade_id");

    if (!especialidadeId) {
      return NextResponse.json(
        { error: "especialidade_id é obrigatório" },
        { status: 400 }
      );
    }

    const sucesso = await removerEspecialidade(id, especialidadeId);

    if (!sucesso) {
      return NextResponse.json(
        { error: "Associação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover especialidade:", error);
    return NextResponse.json(
      { error: "Erro ao remover especialidade" },
      { status: 500 }
    );
  }
}
