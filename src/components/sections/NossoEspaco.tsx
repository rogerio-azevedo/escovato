"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "../SectionTitle";

const NossoEspaco = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/images/espaco/espaco1.jpg",
    "/images/espaco/espaco2.jpg",
    "/images/espaco/espaco3.jpg",
    "/images/espaco/espaco4.jpg",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="nosso-espaco" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nosso Espaço"
          subtitle="Conheça o ambiente sofisticado e acolhedor que preparamos para você"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`Espaço Escovato ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority={index === 0}
                />
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Imagem anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Próxima imagem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-pink-500"
                      : "bg-slate-200/90 hover:bg-white"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : "false"}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Ambiente Exclusivo
              </h3>
              <p className="text-gray-700">
                Nosso salão foi projetado para proporcionar uma experiência
                única de beleza e bem-estar. Com decoração sofisticada e
                ambiente climatizado, você se sentirá especial desde o momento
                em que entrar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Equipamentos Modernos
              </h3>
              <p className="text-gray-700">
                Utilizamos apenas equipamentos de última geração e produtos de
                alta qualidade para garantir os melhores resultados em todos os
                nossos serviços.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Conforto e Bem-estar
              </h3>
              <p className="text-gray-700">
                Cada detalhe foi pensado para seu conforto. Desde as cadeiras
                ergonômicas até o café especial que servimos, queremos que sua
                experiência seja memorável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NossoEspaco;
