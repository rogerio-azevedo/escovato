"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Tipos
interface Servico {
  nome: string;
  preco?: string;
  descricao?: string;
  observacao?: string;
  destaque?: boolean;
}

interface Categoria {
  id: string;
  nome: string;
  titulo: string;
  subtitulo: string;
  imagem: string;
  cor: string;
  corTexto: string;
  servicos: Servico[];
  adicionais?: Servico[];
  pacotes?: Servico[];
}

// Dados dos serviços com visual impactante
const categorias: Categoria[] = [
  {
    id: "dry",
    nome: "Cabelos",
    titulo: "ESCOVA",
    subtitulo: "Cabelos impecáveis",
    imagem: "/images/catalogo/escova.png",
    cor: "#561A07",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Escova lisa",
        preco: "R$ 79",
        destaque: true,
        observacao: "adicional para megahair e extralongo",
      },
      {
        nome: "Escova modelada",
        preco: "R$ 99",
        destaque: false,
        observacao: "adicional para megahair e extralongo",
      },
      {
        nome: "Escova + Babyliss",
        preco: "R$ 149",
        destaque: false,
        observacao: "adicional para megahair e extralongo",
      },
    ],
    adicionais: [
      { nome: "Chapinha", preco: "R$ 19" },
      { nome: "Serviços em Mega Hair", preco: "R$ 30" },
      { nome: "Grampos", preco: "R$ 8" },
      { nome: "Bob (unidade)", preco: "R$ 10" },
    ],
    pacotes: [
      {
        nome: "05 escovas lisas",
        preco: "R$ 390",
        destaque: false,
      },
      {
        nome: "10 escovas lisas",
        preco: "R$ 760",
        destaque: false,
        observacao: "Inclui 01 hidratação",
      },
      {
        nome: "20 escovas lisas",
        preco: "R$ 1.480",
        destaque: false,
        observacao: "Inclui 02 hidratações",
      },
      {
        nome: "30 escovas lisas",
        preco: "R$ 2.160",
        destaque: true,
        observacao: "Inclui 03 hidratações",
      },
    ],
  },
  {
    id: "coloracao",
    nome: "Cabelos",
    titulo: "COLORAÇÃO",
    subtitulo: "Transforme seu visual",
    imagem: "/images/catalogo/coloracao.png",
    cor: "#AF7751",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Retoque de Raiz",
        preco: "R$ 220",
        destaque: true,
      },
      {
        nome: "Tonalização",
        preco: "R$ 220",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Matização",
        preco: "R$ 220",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Coloração cabelo total",
        preco: "R$ 280",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Traga seu produto",
        preco: "R$ 180",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
    ],
  },
  {
    id: "mechas",
    nome: "Cabelos",
    titulo: "MECHAS",
    subtitulo: "Mechas e luzes",
    imagem: "/images/catalogo/mechas.png",
    cor: "#903A19",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Morena Iluminada",
        preco: "R$ 550",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Loiro Iluminado",
        preco: "R$ 700",
        destaque: true,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Loiro Tradicional",
        preco: "R$ 750",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
      {
        nome: "Loiro Total Blond",
        preco: "R$ 900",
        destaque: false,
        observacao: "* sujeito a avaliação do profissional",
      },
    ],
  },
  {
    id: "cortes",
    nome: "Cabelos",
    titulo: "CORTES",
    subtitulo: "Estilo e personalidade",
    imagem: "/images/catalogo/corte.png",
    cor: "#561A07",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Corte personalizado",
        preco: "R$ 150",
        destaque: false,
      },
      {
        nome: "Corte com finalização",
        preco: "R$ 200",
        destaque: true,
        observacao: "Inclui escova",
      },
      {
        nome: "Corte bordado",
        preco: "R$ 220",
        destaque: false,
        observacao: "Inclui escova",
      },
    ],
  },
  {
    id: "tratamentos",
    nome: "Cabelos",
    titulo: "TRATAMENTOS",
    subtitulo: "Escova redutora ou botox",
    imagem: "/images/catalogo/tratamentos.png",
    cor: "#903A19",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Tratamento (produto nacional)",
        preco: "R$ 140",
        destaque: false,
        observacao: "Hidratação, reconstrução ou detox com finalização",
      },
      {
        nome: "Tratamento (produto importado)",
        preco: "R$ 180",
        destaque: false,
        observacao: "Hidratação, reconstrução ou detox com finalização",
      },
      {
        nome: "Tratamento (produto super premium)",
        preco: "R$ 199",
        destaque: true,
        observacao: "Hidratação, reconstrução ou detox com finalização",
      },
    ],
  },
  {
    id: "unhas",
    nome: "Unhas",
    titulo: "MANICURE E PEDICURE",
    subtitulo: "Mãos e pés impecáveis",
    imagem: "/images/catalogo/unhas.png",
    cor: "#AF7751",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Manicure + Pedicure",
        preco: "R$ 79",
        destaque: true,
        observacao: "de segunda a quinta-feira (sexta-feira e sábado R$ 85)",
      },
      { nome: "Manicure ou Pedicure", preco: "R$ 45" },
      { nome: "Esmaltação", preco: "R$ 32" },
      { nome: "Manicure + Pedicure em Gel", preco: "R$ 130", destaque: true },
      { nome: "Manicure ou Pedicure em Gel", preco: "R$ 70" },
      { nome: "Esmaltação em Gel", preco: "R$ 42" },
    ],
    adicionais: [
      { nome: "Francesinha", preco: "R$ 7" },
      //   { nome: "Spa Express (esfoliação e hidratação)", preco: "R$ 25" },
      //   { nome: "Spa Express Especial (remoção de calos)", preco: "R$ 45" },
      //   { nome: "Chinelinho", preco: "R$ 10" },
      //   { nome: "Aplicação de Unha Postiça", preco: "R$ 28" },
      //   { nome: "Nail Art", preco: "R$ 35" },
    ],
  },
  {
    id: "maquiagem",
    nome: "Maquiagem",
    titulo: "MAQUIAGEM E PENTEADOS",
    subtitulo: "Para momentos especiais",
    imagem: "/images/catalogo/make.png",
    cor: "#AF7751",
    corTexto: "#FFFFFF",
    servicos: [
      {
        nome: "Make Up Truque",
        preco: "R$ 120",
        destaque: false,
      },
      {
        nome: "Make Up Express",
        preco: "R$ 180",
        destaque: false,
        observacao: "Inclui cílios",
      },
      {
        nome: "Make Up Social",
        preco: "R$ 230",
        destaque: true,
        observacao: "Inclui cílios, blindagem da pele. Ideal para eventos.",
      },
      {
        nome: "Penteado tradicional",
        preco: "R$ 200",
        destaque: true,
        observacao: "não inclui acessórios",
      },
      {
        nome: "Penteado com acessórios",
        preco: "R$ 220",
        destaque: true,
        observacao: "* sujeito a avaliação do profissional",
      },
    ],
  },
  //   {
  //     id: "brows-lashes",
  //     nome: "Olhos",
  //     titulo: "SOBRANCELHAS & CÍLIOS",
  //     subtitulo: "Design completo para realçar seu olhar",
  //     imagem: "/images/catalogo/lashes.png",
  //     cor: "#561A07",
  //     corTexto: "#FFFFFF",
  //     servicos: [
  //       { nome: "Design de Sobrancelhas", preco: "R$ 65", destaque: true },
  //       { nome: "Design + Coloração", preco: "R$ 69" },
  //       { nome: "Design + Coloração Especial", preco: "R$ 75" },
  //       { nome: "Coloração de Sobrancelhas Simples", preco: "R$ 55" },
  //       { nome: "Coloração de Sobrancelhas Especial", preco: "R$ 59" },
  //       { nome: "Brow Lamination", preco: "R$ 105", destaque: true },
  //       {
  //         nome: "Lash Lifting",
  //         preco: "R$ 135",
  //         destaque: true,
  //         descricao:
  //           "Técnica perfeita para um olhar natural e expressivo. Não utiliza fios artificiais, apenas cria o efeito de cílios alongados, curvados e coloridos.",
  //         observacao: "Inclui coloração de cílios",
  //       },
  //       {
  //         nome: "Coloração de Cílios",
  //         preco: "R$ 85",
  //         descricao:
  //           "Destaque o olhar com aspecto natural, mesmo sem lash lifting.",
  //       },
  //     ],
  //   },
  //   {
  //     id: "unhas",
  //     nome: "Unhas",
  //     titulo: "UNHAS",
  //     subtitulo: "Mãos e pés impecáveis",
  //     imagem: "/images/catalogo/unhas.png",
  //     cor: "#AF7751",
  //     corTexto: "#FFFFFF",
  //     servicos: [
  //       { nome: "Manicure + Pedicure", preco: "R$ 69", destaque: true },
  //       { nome: "Manicure ou Pedicure", preco: "R$ 42" },
  //       { nome: "Esmaltação", preco: "R$ 32" },
  //       { nome: "Manicure + Pedicure em Gel", preco: "R$ 105", destaque: true },
  //       { nome: "Manicure ou Pedicure em Gel", preco: "R$ 60" },
  //       { nome: "Esmaltação em Gel", preco: "R$ 42" },
  //     ],
  //     adicionais: [
  //       { nome: "Francesinha", preco: "R$ 7" },
  //       { nome: "Spa Express (esfoliação e hidratação)", preco: "R$ 25" },
  //       { nome: "Spa Express Especial (remoção de calos)", preco: "R$ 45" },
  //       { nome: "Chinelinho", preco: "R$ 10" },
  //       { nome: "Aplicação de Unha Postiça", preco: "R$ 28" },
  //       { nome: "Nail Art", preco: "R$ 35" },
  //     ],
  //   },
  //   {
  //     id: "unhas-gel",
  //     nome: "Unhas",
  //     titulo: "UNHAS EM GEL",
  //     subtitulo: "Durabilidade e beleza",
  //     imagem: "/images/catalogo/unhas-gel.png",
  //     cor: "#903A19",
  //     corTexto: "#FFFFFF",
  //     servicos: [
  //       { nome: "Alongamento em Gel", preco: "R$ 175", destaque: true },
  //       { nome: "Manutenção Unhas em Gel", preco: "R$ 159" },
  //       { nome: "Banho de Gel", preco: "R$ 159" },
  //     ],
  //     adicionais: [
  //       { nome: "Remoção da Unha em Gel", preco: "R$ 49" },
  //       { nome: "Remoção Top Coat de Esmaltação em Gel", preco: "R$ 20" },
  //       { nome: "Aplicação em Gel (unidade)", preco: "R$ 25" },
  //       { nome: "Blindagem (top coat)", preco: "R$ 25" },
  //       { nome: "Encapsulamento", preco: "R$ 49" },
  //       { nome: "Polimento", preco: "R$ 55" },
  //     ],
  //   },
  //   {
  //     id: "depilacao",
  //     nome: "Rosto",
  //     titulo: "DEPILAÇÃO",
  //     subtitulo: "Depilação facial à linha",
  //     imagem: "/images/profissionais/mariana.png",
  //     cor: "#903A19",
  //     corTexto: "#FFFFFF",
  //     servicos: [
  //       {
  //         nome: "Testa, Buço, Queixo ou Nariz",
  //         preco: "R$ 22",
  //         observacao: "Maçã do rosto e lateral da face",
  //       },
  //       { nome: "Axilas", preco: "R$ 49" },
  //       { nome: "Face Completa", preco: "R$ 75", destaque: true },
  //     ],
  //   },
  //   {
  //     id: "extras",
  //     nome: "Diversos",
  //     titulo: "SERVIÇOS EXTRAS",
  //     subtitulo: "Completando seu visual",
  //     imagem: "/images/profissionais/carlos.png",
  //     cor: "#561A07",
  //     corTexto: "#FFFFFF",
  //     servicos: [
  //       { nome: "Retoque de Raiz", preco: "R$ 105" },
  //       { nome: "Retoque de Raiz (trazendo coloração)", preco: "R$ 79" },
  //       { nome: "Aplicação - Curto (traga seu produto)", preco: "R$ 115" },
  //       { nome: "Aplicação - Médio (traga seu produto)", preco: "R$ 125" },
  //       { nome: "Aplicação - Longo (traga seu produto)", preco: "R$ 145" },
  //       { nome: "Aplicação - Extra Longo (traga seu produto)", preco: "R$ 165" },
  //     ],
  //   },
];

export default function CatalogoPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [compartilhado, setCompartilhado] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = (categoria?: string, servico?: string) => {
    let texto = "Olá! Vi o catálogo e gostaria de agendar";
    if (categoria && servico) {
      texto += ` ${servico} (${categoria})`;
    }
    texto += ".";
    window.open(
      `https://wa.me/5565998135353?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  };

  const handleCompartilhar = async () => {
    const url = window.location.href;

    // Verifica se o navegador suporta compartilhamento nativo
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Catálogo Escovato",
          text: "Confira os serviços do Escovato Salão de Beleza! 💅",
          url: url,
        });
        // Sucesso - mostra feedback
        setCompartilhado(true);
        setTimeout(() => setCompartilhado(false), 2000);
      } catch (error) {
        // Se o usuário cancelou, apenas retorna
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        // Se deu outro erro, mostra mensagem
        console.error("Erro ao compartilhar:", error);
        alert("Não foi possível compartilhar. Copie o link: " + url);
      }
    } else {
      // Fallback para desktop: copia o link
      try {
        await navigator.clipboard.writeText(url);
        setCompartilhado(true);
        setTimeout(() => setCompartilhado(false), 2000);
      } catch {
        alert("Copie este link: " + url);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCF3E6] via-[#EFDECE] to-[#FCF3E6]">
      {/* Header Fixo Elegante */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor:
            scrollY > 50 ? "rgba(86, 26, 7, 0.95)" : "rgba(86, 26, 7, 0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-white.svg"
                alt="Escovato"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <button
              onClick={handleCompartilhar}
              className={`p-2.5 rounded-xl transition-all relative ${
                compartilhado
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              aria-label="Compartilhar catálogo"
            >
              {compartilhado ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Grid de Categorias - Estilo Magazine */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categorias.map((categoria, index) => (
            <div
              key={categoria.id}
              className="group cursor-pointer"
              onClick={() =>
                setCategoriaAtiva(
                  categoriaAtiva === categoria.id ? null : categoria.id
                )
              }
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Card Principal */}
              <div className="relative h-[220px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(86,26,7,0.3)] group-hover:scale-[1.02]">
                {/* Imagem de Fundo */}
                <Image
                  src={categoria.imagem}
                  alt={categoria.nome}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradiente */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${categoria.cor}dd 0%, ${categoria.cor}99 50%, ${categoria.cor}cc 100%)`,
                  }}
                />

                {/* Conteúdo */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-2">
                      {categoria.nome}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-bold mb-1 tracking-tight"
                      style={{ color: categoria.corTexto }}
                    >
                      {categoria.titulo}
                    </h3>
                    <p
                      className="text-sm mb-3 opacity-90"
                      style={{ color: categoria.corTexto }}
                    >
                      {categoria.subtitulo}
                    </p>

                    {/* Indicador de Expandir */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-xs font-medium">
                        {categoriaAtiva === categoria.id
                          ? "Fechar"
                          : "Ver serviços"}
                      </span>
                      <svg
                        className={`w-4 h-4 text-white transition-transform duration-300 ${
                          categoriaAtiva === categoria.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Serviços Expandível */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  categoriaAtiva === categoria.id
                    ? "max-h-[2000px] opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white rounded-3xl p-5 shadow-lg">
                  {/* Serviços Principais */}
                  <div className="space-y-2.5 mb-5">
                    {categoria.servicos.map((servico, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl transition-all hover:scale-[1.01] cursor-pointer ${
                          servico.destaque
                            ? "bg-gradient-to-r from-[#561A07] to-[#903A19] text-white shadow-md"
                            : "bg-[#FCF3E6] hover:bg-[#EFDECE]"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(categoria.nome, servico.nome);
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h4
                                className={`font-bold text-base ${
                                  servico.destaque
                                    ? "text-white"
                                    : "text-[#561A07]"
                                }`}
                              >
                                {servico.nome}
                              </h4>
                              {servico.destaque && (
                                <span className="text-yellow-300 text-xs">
                                  ★
                                </span>
                              )}
                            </div>
                            {servico.descricao && (
                              <p
                                className={`text-xs mb-1.5 leading-relaxed ${
                                  servico.destaque
                                    ? "text-white/90"
                                    : "text-[#903A19]"
                                }`}
                              >
                                {servico.descricao}
                              </p>
                            )}
                            {servico.observacao && (
                              <p
                                className={`text-xs italic ${
                                  servico.destaque
                                    ? "text-white/75"
                                    : "text-[#AF7751]"
                                }`}
                              >
                                {servico.observacao}
                              </p>
                            )}
                          </div>
                          {servico.preco && (
                            <div className="text-right flex-shrink-0">
                              <span
                                className={`text-xl font-bold ${
                                  servico.destaque
                                    ? "text-white"
                                    : "text-[#561A07]"
                                }`}
                              >
                                {servico.preco}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adicionais */}
                  {categoria.adicionais && categoria.adicionais.length > 0 && (
                    <div className="pt-3.5 border-t border-[#EFDECE]/40">
                      <h4 className="text-[#561A07] font-bold text-base mb-2.5 flex items-center gap-1.5">
                        <span className="text-sm">+</span>
                        <span>Adicionais</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {categoria.adicionais.map((adicional, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-[#FCF3E6] rounded-lg hover:bg-[#EFDECE] transition-colors"
                          >
                            <div className="flex-1">
                              <span className="text-[#561A07] font-semibold text-sm">
                                {adicional.nome}
                              </span>
                              {adicional.observacao && (
                                <span className="text-[#AF7751] text-xs ml-1.5">
                                  ({adicional.observacao})
                                </span>
                              )}
                            </div>
                            {adicional.preco && (
                              <span className="text-[#903A19] font-bold text-sm">
                                {adicional.preco}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pacotes */}
                  {categoria.pacotes && categoria.pacotes.length > 0 && (
                    <div className="pt-4 border-t border-[#EFDECE]/40 mt-5">
                      <h4 className="text-[#561A07] font-bold text-base mb-3 flex items-center gap-1.5">
                        <span className="text-sm">📦</span>
                        <span>Pacotes</span>
                      </h4>
                      <div className="space-y-2.5">
                        {categoria.pacotes.map((pacote, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl transition-all hover:scale-[1.01] cursor-pointer ${
                              pacote.destaque
                                ? "bg-gradient-to-r from-[#561A07] to-[#903A19] text-white shadow-md"
                                : "bg-[#FCF3E6] hover:bg-[#EFDECE]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(categoria.nome, pacote.nome);
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <h4
                                    className={`font-bold text-base ${
                                      pacote.destaque
                                        ? "text-white"
                                        : "text-[#561A07]"
                                    }`}
                                  >
                                    {pacote.nome}
                                  </h4>
                                  {pacote.destaque && (
                                    <span className="text-yellow-300 text-xs">
                                      ★
                                    </span>
                                  )}
                                </div>
                                {pacote.descricao && (
                                  <p
                                    className={`text-xs mb-1.5 leading-relaxed ${
                                      pacote.destaque
                                        ? "text-white/90"
                                        : "text-[#903A19]"
                                    }`}
                                  >
                                    {pacote.descricao}
                                  </p>
                                )}
                                {pacote.observacao && (
                                  <p
                                    className={`text-xs italic ${
                                      pacote.destaque
                                        ? "text-white/75"
                                        : "text-[#AF7751]"
                                    }`}
                                  >
                                    {pacote.observacao}
                                  </p>
                                )}
                              </div>
                              {pacote.preco && (
                                <div className="text-right flex-shrink-0">
                                  <span
                                    className={`text-xl font-bold ${
                                      pacote.destaque
                                        ? "text-white"
                                        : "text-[#561A07]"
                                    }`}
                                  >
                                    {pacote.preco}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão WhatsApp Flutuante */}
      <button
        onClick={() => handleWhatsApp()}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 active:scale-95 group ${
          scrollY > 200 ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        aria-label="Agendar pelo WhatsApp"
      >
        <svg
          className="w-7 h-7 transition-transform group-hover:rotate-12"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Agendar pelo WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
