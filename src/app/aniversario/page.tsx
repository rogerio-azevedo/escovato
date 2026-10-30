import type { Metadata } from "next";
import Image from "next/image";
import FormularioPresenca from "@/components/aniversario/FormularioPresenca";
import { aniversario, inscricoesEncerradas } from "@/lib/aniversario";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "1 ano de Escovato | Confirme sua presença",
  description: "Vamos celebrar! 7 de novembro, às 17h, no Escovato. Confirme sua presença até 06/11.",
  alternates: { canonical: aniversario.url },
  openGraph: {
    title: "Você faz parte do nosso primeiro ano. Vamos celebrar?",
    description: "7 de novembro, às 17h · Escovato · Jardim Itália, Cuiabá. Confirme sua presença até 06/11.",
    url: aniversario.url,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://www.escovato.com.br/images/aniversario/convite-presente-salao-v8.jpg", width: 1080, height: 1080, alt: "Escovato faz 1 ano. 7 de novembro, às 17h. Confirme sua presença até 06/11 pelo QR Code." }],
  },
};

export default function AniversarioPage() {
  return <main className="min-h-screen bg-[#FCF3E6] px-5 py-8 text-[#561A07] sm:px-8 sm:py-12">
    <div className="mx-auto max-w-5xl">
      <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div>
          <a href="#confirmar-presenca" className="mx-auto block w-full max-w-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#903A19]" aria-label="Convite de 1 ano do Escovato. Confirme sua presença até 06/11 pelo QR Code ou clique para preencher o formulário.">
            <Image src="/images/aniversario/convite-presente-salao-v8.jpg" alt="Convite com presente e foto suave do salão ao fundo: Escovato faz 1 ano. 07/11 às 17h. Av. Érico Gonçalvez Preza Filho, 362, Jardim Itália. Confirme até 06/11 pelo QR Code." width={1080} height={1080} priority className="block h-auto w-full" />
          </a>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center text-sm text-[#903A19]">
            <a href="/images/aniversario/convite-presente-salao-v8.jpg" download="convite-escovato-1-ano-whatsapp.jpg" className="inline-flex min-h-11 items-center font-medium underline underline-offset-4">Baixar convite para WhatsApp</a>
            <a href={aniversario.mapa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Ver localização ↗</a>
          </div>
        </div>
        <div id="confirmar-presenca" className="scroll-mt-6 rounded-[2rem] border border-[#AF7751]/20 bg-white/60 p-6 shadow-[0_12px_50px_-30px_#561A0740] sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#903A19]">Nosso primeiro ano</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Vamos celebrar<br />com você.</h1>
          <p className="mb-7 mt-4 text-sm leading-relaxed text-[#561A07]/75">Confirme a sua presença até <strong>06/11</strong>.</p>
          <FormularioPresenca encerrado={inscricoesEncerradas()} />
        </div>
      </div>
      <footer className="mt-10 text-center text-xs text-[#561A07]/60">Um ano de cuidado, beleza e boas histórias.</footer>
    </div>
  </main>;
}
