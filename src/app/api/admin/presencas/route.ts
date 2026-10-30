import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listarPresencas } from "@/lib/presencas";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers });
    }
    if (!["admin", "recepcionista"].includes(session.user.role)) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403, headers });
    }
    return NextResponse.json(await listarPresencas(), { headers });
  } catch {
    console.error("Não foi possível consultar as confirmações de presença.");
    return NextResponse.json({ error: "Não foi possível carregar as confirmações." }, { status: 503, headers });
  }
}
