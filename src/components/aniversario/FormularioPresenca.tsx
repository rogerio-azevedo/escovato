"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { aniversario } from "@/lib/aniversario";
import { validarPresenca } from "@/lib/presencas-validacao";

export default function FormularioPresenca({ encerrado }: { encerrado: boolean }) {
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [erro, setErro] = useState("");
  const [campo, setCampo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const envioEmAndamento = useRef(false);

  async function confirmar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (envioEmAndamento.current) return;
    setErro("");
    setCampo("");
    const form = new FormData(event.currentTarget);
    const dados = { nome: form.get("nome"), whatsapp: form.get("whatsapp") };
    const validacao = validarPresenca(dados);
    if (!validacao.ok) {
      setErro(validacao.erro);
      setCampo(validacao.campo);
      formRef.current?.querySelector<HTMLInputElement>(`[name="${validacao.campo}"]`)?.focus();
      return;
    }
    envioEmAndamento.current = true;
    setEnviando(true);
    try {
      const response = await fetch("/api/aniversario/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validacao.dados, website: form.get("website") }),
      });
      const resultado = await response.json();
      if (!response.ok) {
        setCampo(typeof resultado.campo === "string" ? resultado.campo : "");
        throw new Error(resultado.error || "Não foi possível confirmar. Tente novamente.");
      }
      setConfirmado(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Confira sua conexão e tente novamente.");
    } finally {
      envioEmAndamento.current = false;
      setEnviando(false);
    }
  }

  if (encerrado) {
    return <div className="rounded-2xl bg-[#EFDECE]/60 p-6 text-[#561A07]" role="status">
      <h2 className="text-xl font-semibold">Obrigado por fazer parte dessa história.</h2>
      <p className="mt-3 text-sm leading-relaxed">As confirmações para a festa de 1 ano foram encerradas.</p>
      <Link href="/" className="mt-5 inline-block font-medium underline underline-offset-4">Conheça o Escovato</Link>
    </div>;
  }

  if (confirmado) {
    return <div className="rounded-2xl border border-[#AF7751]/30 bg-white/80 p-7 text-[#561A07]" role="status" aria-live="polite">
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFDECE] text-2xl" aria-hidden="true">✓</span>
      <h2 className="font-serif text-3xl">Sua presença está confirmada!</h2>
      <p className="mt-4 leading-relaxed text-[#561A07]/80">Esperamos você no dia <strong>7 de novembro, às 17h</strong>, para celebrar com a gente.</p>
      <a href={aniversario.mapa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#903A19] px-6 py-3 font-medium text-white transition hover:bg-[#561A07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#903A19]">Como chegar ao salão ↗</a>
    </div>;
  }

  return <form ref={formRef} onSubmit={confirmar} className="space-y-5" aria-busy={enviando}>
    <div>
      <label htmlFor="nome" className="mb-2 block text-sm font-medium text-[#561A07]">Seu nome</label>
      <input id="nome" name="nome" type="text" autoComplete="name" required minLength={2} maxLength={120} disabled={enviando} aria-invalid={campo === "nome"} aria-describedby={campo === "nome" ? "erro-presenca" : undefined} placeholder="Como podemos chamar você?" className="w-full rounded-xl border border-[#AF7751]/40 bg-white/90 px-4 py-3.5 text-base outline-none transition focus:border-[#903A19] focus:ring-2 focus:ring-[#903A19]/15 disabled:opacity-60" />
    </div>
    <div>
      <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-[#561A07]">WhatsApp com DDD</label>
      <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required maxLength={25} disabled={enviando} aria-invalid={campo === "whatsapp"} aria-describedby={campo === "whatsapp" ? "whatsapp-dica erro-presenca" : "whatsapp-dica"} placeholder="(65) 99999-9999" className="w-full rounded-xl border border-[#AF7751]/40 bg-white/90 px-4 py-3.5 text-base outline-none transition focus:border-[#903A19] focus:ring-2 focus:ring-[#903A19]/15 disabled:opacity-60" />
      <p id="whatsapp-dica" className="mt-2 text-xs text-[#561A07]/65">Usaremos seus dados apenas para organizar esta comemoração.</p>
    </div>
    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Deixe este campo em branco</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
    {erro && <p id="erro-presenca" role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
    <button type="submit" disabled={enviando} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#903A19] px-6 py-3.5 font-semibold text-white transition hover:bg-[#561A07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#903A19] disabled:cursor-wait disabled:opacity-70">
      {enviando ? "Confirmando sua presença…" : "Confirmar minha presença"}
      {!enviando && <span aria-hidden="true">↗</span>}
    </button>
  </form>;
}
