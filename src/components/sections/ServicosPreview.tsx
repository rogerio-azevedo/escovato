"use client";

import Image from "next/image";
import Link from "next/link";
import SectionTitle from "../SectionTitle";

interface CategoriaPreview {
  id: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagem: string;
  cor: string;
  precoInicial: string;
}

const categoriasPreview: CategoriaPreview[] = [
  {
    id: "dry",
    nome: "Cabelos",
    titulo: "Escova",
    descricao: "Cabelos impecáveis com escova lisa ou modelada",
    imagem: "/images/catalogo/escova.png",
    cor: "#903A19",
    precoInicial: "R$ 79",
  },
  {
    id: "sobrancelhas",
    nome: "Olhos",
    titulo: "Sobrancelhas & Cílios",
    descricao: "Design completo para realçar seu olhar",
    imagem: "/images/catalogo/lashes.png",
    cor: "#AF7751",
    precoInicial: "R$ 70",
  },
  {
    id: "unhas",
    nome: "Unhas",
    titulo: "Manicure & Pedicure",
    descricao: "Mãos e pés sempre impecáveis",
    imagem: "/images/catalogo/unhas.png",
    cor: "#903A19",
    precoInicial: "R$ 79",
  },
  {
    id: "coloracao",
    nome: "Cabelos",
    titulo: "Coloração",
    descricao: "Transforme seu visual com cor",
    imagem: "/images/catalogo/coloracao.png",
    cor: "#AF7751",
    precoInicial: "R$ 220",
  },
  {
    id: "mechas",
    nome: "Cabelos",
    titulo: "Mechas & Luzes",
    descricao: "Iluminação perfeita para seu cabelo",
    imagem: "/images/catalogo/mechas.png",
    cor: "#903A19",
    precoInicial: "R$ 550",
  },
  {
    id: "maquiagem",
    nome: "Maquiagem",
    titulo: "Make & Penteados",
    descricao: "Para momentos especiais",
    imagem: "/images/catalogo/make.png",
    cor: "#AF7751",
    precoInicial: "R$ 120",
  },
];

export default function ServicosPreview() {
  return (
    <section
      id="servicos"
      className="py-20 bg-gradient-to-br from-[#FCF3E6] via-white to-[#FCF3E6]"
    >
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossos Serviços"
          subtitle="Explore nossa variedade de serviços especializados"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categoriasPreview.map((categoria, index) => (
            <Link
              key={categoria.id}
              href="/catalogo"
              className="group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative h-[320px] rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
                {/* Imagem de Fundo */}
                <Image
                  src={categoria.imagem}
                  alt={categoria.titulo}
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
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-3">
                      {categoria.nome}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                      {categoria.titulo}
                    </h3>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      {categoria.descricao}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/80 text-xs">
                          A partir de
                        </span>
                        <p className="text-2xl font-bold text-white">
                          {categoria.precoInicial}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-white">
                        <span className="text-sm font-medium">Ver mais</span>
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão Ver Catálogo Completo */}
        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-700 hover:from-orange-800 hover:to-primary text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Ver Catálogo Completo</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

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
    </section>
  );
}
