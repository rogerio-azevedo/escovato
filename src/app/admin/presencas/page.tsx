"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { aniversario } from "@/lib/aniversario";
import { formatarWhatsApp } from "@/lib/presencas-validacao";
import type { ConfirmacaoPresenca } from "@/types/presenca";

const formatarData = (data: string) => new Date(data).toLocaleString("pt-BR", {
  timeZone: "America/Cuiaba", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
});

async function buscarPresencas(signal?: AbortSignal): Promise<ConfirmacaoPresenca[]> {
  const resposta = await fetch("/api/admin/presencas", { cache: "no-store", signal });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.error || "Não foi possível carregar as confirmações.");
  return dados;
}

export default function PresencasPage() {
  const { data: session, status } = useSession();
  const [presencas, setPresencas] = useState<ConfirmacaoPresenca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState(false);
  const autorizado = ["admin", "recepcionista"].includes(session?.user?.role || "");

  useEffect(() => {
    if (!autorizado) return;
    const controller = new AbortController();
    buscarPresencas(controller.signal)
      .then(setPresencas)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setErro(error instanceof Error ? error.message : "Não foi possível carregar as confirmações.");
      })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [autorizado]);

  async function atualizar() {
    setCarregando(true);
    setErro("");
    try {
      setPresencas(await buscarPresencas());
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível carregar as confirmações.");
    } finally {
      setCarregando(false);
    }
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(aniversario.url);
      setCopiado(true);
    } catch {
      setErro("Não foi possível copiar automaticamente. Selecione o link abaixo para copiar.");
    }
  }

  if (status === "loading") return <p className="p-8 text-gray-600">Carregando…</p>;
  if (!autorizado) return <p className="p-8 text-gray-800">Você não tem permissão para consultar os convidados.</p>;

  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const filtradas = presencas.filter((p) => p.nome.toLocaleLowerCase("pt-BR").includes(termo) || p.whatsapp.includes(termo.replace(/\D/g, "")) && /\d/.test(termo));

  return <div className="mx-auto max-w-6xl px-4 py-8 text-gray-900">
    <Link href="/admin" className="text-sm text-[#903A19] hover:underline">← Voltar ao painel</Link>
    <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Presenças · 1 ano</h1><p className="mt-2 text-gray-600">7 de novembro, das {aniversario.horario} · Escovato</p></div>
      <button onClick={atualizar} disabled={carregando} className="rounded-lg bg-[#903A19] px-5 py-3 font-medium text-white hover:bg-[#561A07] disabled:opacity-60">{carregando ? "Atualizando…" : "Atualizar lista"}</button>
    </div>
    <div className="mb-6 grid gap-4 md:grid-cols-[1fr_2fr]">
      <div className="rounded-xl border border-[#AF7751]/20 bg-white p-6"><p className="text-sm text-gray-600">Pessoas confirmadas</p><p className="mt-2 text-4xl font-bold text-[#903A19]">{carregando || erro ? "—" : presencas.length}</p></div>
      <div className="rounded-xl border border-[#AF7751]/20 bg-white p-6">
        <p className="font-semibold">Link do convite</p>
        <a href={aniversario.url} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-sm text-[#903A19] underline">{aniversario.url}</a>
        <div className="mt-4 flex flex-wrap gap-4 text-sm"><button onClick={copiarLink} className="font-medium text-[#903A19] underline">{copiado ? "Link copiado ✓" : "Copiar link"}</button><a href="/aniversario-qr.png" download className="font-medium text-[#903A19] underline">Baixar QR Code</a><Link href="/aniversario" target="_blank" className="font-medium text-[#903A19] underline">Ver formulário ↗</Link></div>
      </div>
    </div>
    {erro && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-red-800">{erro}</p>}
    <label htmlFor="buscar-presenca" className="mb-2 block text-sm font-medium">Buscar por nome ou WhatsApp</label>
    <input id="buscar-presenca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} className="mb-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 sm:max-w-md" placeholder="Digite para filtrar os convidados" />
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm"><caption className="sr-only">Lista de confirmações para o aniversário de 1 ano do Escovato</caption>
        <thead className="bg-[#EFDECE]/50"><tr><th scope="col" className="px-5 py-4">Nome</th><th scope="col" className="px-5 py-4">WhatsApp</th><th scope="col" className="px-5 py-4">Confirmado em (Cuiabá)</th></tr></thead>
        <tbody className="divide-y divide-gray-100">
          {carregando ? <tr><td colSpan={3} className="p-8 text-center text-gray-500">Carregando confirmações…</td></tr> : erro ? <tr><td colSpan={3} className="p-8 text-center text-gray-500">A lista não pôde ser atualizada. Tente novamente.</td></tr> : filtradas.length === 0 ? <tr><td colSpan={3} className="p-8 text-center text-gray-500">{busca ? "Nenhum convidado encontrado para esta busca." : "As confirmações aparecerão aqui assim que os convidados responderem."}</td></tr> : filtradas.map((p) => <tr key={p.id}><td className="px-5 py-4 font-medium">{p.nome}</td><td className="whitespace-nowrap px-5 py-4">{formatarWhatsApp(p.whatsapp)}</td><td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatarData(p.created_at)}</td></tr>)}
        </tbody>
      </table>
    </div>
    {!carregando && !erro && <p className="mt-3 text-sm text-gray-500">{filtradas.length} de {presencas.length} confirmações</p>}
  </div>;
}
