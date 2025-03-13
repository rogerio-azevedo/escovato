"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const slides = [
    {
      image: "/images/hero/hero-1.jpg",
      title: "Ambiente Moderno",
      description:
        "Um espaço pensado para proporcionar conforto e sofisticação",
    },
    {
      image: "/images/hero/hero-2.jpg",
      title: "Profissionais Qualificados",
      description: "Nossa equipe está pronta para realçar sua beleza natural",
    },
    {
      image: "/images/hero/hero-3.png",
      title: "Serviços de Excelência",
      description: "Tratamentos capilares, estéticos e muito mais",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Controla a visibilidade do indicador de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const featuresSection = document.getElementById("servicos");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              {slide.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="https://wa.me/5565998135353?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20do%20Escovato."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-full transition-colors inline-flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Fale Conosco
              </a>
              <button
                onClick={scrollToNextSection}
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-8 rounded-full transition-colors"
              >
                Nossos Serviços
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores de slide */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-pink-500"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicador de scroll no canto direito */}
      <div
        className={`fixed right-8 bottom-16 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center bg-pink-500/80 hover:bg-pink-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          aria-label="Rolar para baixo"
        >
          <span className="text-xs font-medium mb-1">Rolar</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
