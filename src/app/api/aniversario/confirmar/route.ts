import { NextRequest, NextResponse } from "next/server";
import { confirmarPresenca } from "@/lib/presencas";
import { validarPresenca } from "@/lib/presencas-validacao";
import { inscricoesEncerradas } from "@/lib/aniversario";

export const runtime = "nodejs";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  // Next pode reconstruir a URL interna com localhost atrás de um proxy.
  // O Host da requisição mantém o endereço que o navegador realmente acessou.
  const host = request.headers.get("host") || request.nextUrl.host;
  const protocolo = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || request.nextUrl.protocol.replace(":", "");
  let origemValida = !origin;
  try {
    if (origin) origemValida = new URL(origin).origin === `${protocolo}://${host}`;
  } catch {
    origemValida = false;
  }
  if (!origemValida || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Envie a confirmação pelo formulário do convite." }, { status: 403, headers });
  }
  if (inscricoesEncerradas()) {
    return NextResponse.json({ error: "As confirmações para este evento foram encerradas." }, { status: 410, headers });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Formato de envio inválido." }, { status: 415, headers });
  }
  if (Number(request.headers.get("content-length")) > 2048) {
    return NextResponse.json({ error: "O formulário excedeu o tamanho permitido." }, { status: 413, headers });
  }

  let body: unknown;
  try {
    // Limita inclusive requisições sem Content-Length antes de carregar todo o corpo.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Corpo vazio");
    const chunks: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 2048) {
        await reader.cancel();
        return NextResponse.json({ error: "O formulário excedeu o tamanho permitido." }, { status: 413, headers });
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Não foi possível ler o formulário. Tente novamente." }, { status: 400, headers });
  }

  // Campo invisível para reduzir envios automatizados. Não armazena o conteúdo.
  if (body && typeof body === "object" && "website" in body && body.website) {
    return NextResponse.json({ success: true }, { status: 201, headers });
  }
  const validacao = validarPresenca(body);
  if (!validacao.ok) {
    return NextResponse.json({ error: validacao.erro, campo: validacao.campo }, { status: 400, headers });
  }
  try {
    await confirmarPresenca(validacao.dados);
    // Mesma resposta em um reenvio; a API pública nunca expõe a lista ou dados anteriores.
    return NextResponse.json({ success: true }, { status: 201, headers });
  } catch {
    console.error("Não foi possível salvar uma confirmação de presença.");
    return NextResponse.json({ error: "Não conseguimos salvar agora. Tente novamente em instantes." }, { status: 503, headers });
  }
}
