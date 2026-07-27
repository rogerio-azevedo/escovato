"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useMemo, useEffect } from "react";
import SectionTitle from "../SectionTitle";

const profissionais = [
  {
    nome: "Juliana Cabeça",
    cargo: "Cabeleireira",
    foto: "/images/profissionais/juliana.jpg",
    descricao:
      "Especialista em alisamento, megahair e cuidados capilares personalizados.",
    instagram: "https://www.instagram.com/fiosdajuul/",
  },
  {
    nome: "Edna Reis",
    cargo: "Cabeleireira",
    foto: "/images/profissionais/edna.jpeg",
    descricao:
      "Especialista em cortes, tratamentos e cuidados capilares com atendimento personalizado.",
    instagram: "https://www.instagram.com/ednacabelos/",
  },
  {
    nome: "Chiley Silva",
    cargo: "Cabeleireira",
    foto: "/images/profissionais/chiley.jpeg",
    descricao:
      "Especialista em coloração e loiros, com técnicas que realçam a beleza natural dos fios.",
    instagram:
      "https://www.instagram.com/chileysilva_loiros?igsh=Z2EydWdiMm5qYmNj",
  },
  {
    nome: "Leandro França",
    cargo: "Cabeleireiro",
    foto: "/images/profissionais/leandro.jpeg",
    descricao:
      "Tratamentos capilares e escovas impecáveis, com fios alinhados, brilhantes e sem frizz.",
    instagram: "https://www.instagram.com/euleandrofranca/",
  },
  {
    nome: "Carol Leite",
    cargo: "Maquiadora",
    foto: "/images/profissionais/carol.jpg",
    descricao:
      "Maquiagens sociais e para eventos, valorizando os traços naturais de cada cliente.",
    instagram: "https://www.instagram.com/carolleitebeauty_/",
  },
  {
    nome: "Kelli Gomes",
    cargo: "Depiladora",
    foto: "/images/profissionais/kely.jpg",
    descricao:
      "Depilação com técnica humanizada e cera hidrossolúvel para todos os tipos de pele.",
    instagram: "https://www.instagram.com/kellydepill27/",
  },
  {
    nome: "Emanuela Amorim",
    cargo: "Manicure",
    foto: "/images/profissionais/manu.jpg",
    descricao:
      "Manicure e pedicure com acabamento impecável e foco na saúde das unhas.",
    instagram: "https://www.instagram.com/emanuelaamorimc/",
  },
  {
    nome: "Monique Neves",
    cargo: "Manicure",
    foto: "/images/profissionais/monique.jpeg",
    descricao:
      "Alongamento de unhas e esmaltação em gel com acabamento duradouro e elegante.",
    instagram: "https://www.instagram.com/monique.silva38/",
  },
  {
    nome: "Mere Silva",
    cargo: "Manicure",
    foto: "/images/profissionais/mere.jpg",
    descricao:
      "Cabeleireira e Manicure com técnicas atuais e atendimento cuidadoso.",
    instagram: "https://www.instagram.com/merehair.53/",
  },
  {
    nome: "Marina Alves",
    cargo: "Micropigmentação",
    foto: "/images/profissionais/marina.PNG",
    descricao:
      "Micropigmentação de lábios e sobrancelhas com resultado natural e harmonioso.",
    instagram: "https://www.instagram.com/marinaalves.beauty/",
  },
];

const getInstagramHandle = (instagram: string) => {
  const segment = instagram.replace(/\/$/, "").split("/").pop() ?? instagram;
  return segment.split("?")[0];
};

const Profissionais = () => {
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", duration: 25, dragThreshold: 5 },
    [autoplayPlugin],
  );

  useEffect(() => {
    if (!emblaApi) return;
    autoplayPlugin.play();
  }, [emblaApi, autoplayPlugin]);

  return (
    <section id="profissionais" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossa Equipe"
          subtitle="Conheça os profissionais que farão você se sentir ainda mais bonita"
        />

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-8 items-stretch">
            {profissionais.map((profissional) => {
              const handle = getInstagramHandle(profissional.instagram);

              return (
                <div
                  key={profissional.nome}
                  className="min-w-0 shrink-0 grow-0 basis-full pl-8 md:basis-1/2 lg:basis-1/4 flex"
                >
                  <div className="flex h-full w-full flex-col bg-gray-50 rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                    <div className="relative h-80 shrink-0">
                      <Image
                        src={profissional.foto}
                        alt={`Foto de ${profissional.nome}`}
                        fill
                        draggable={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {profissional.nome}
                      </h3>
                      <p className="text-orange-700 font-medium mb-3">
                        {profissional.cargo}
                      </p>
                      <p className="text-gray-700 mb-4 flex-1">
                        {profissional.descricao}
                      </p>
                      <a
                        href={profissional.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-700 hover:text-orange-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        @{handle}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profissionais;
