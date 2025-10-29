"use client";

import Image from "next/image";
import SectionTitle from "../SectionTitle";

const Profissionais = () => {
  const profissionais = [
    {
      nome: "Ana Vasconcelos",
      cargo: "Maquiadora e Designer de Sobrancelhas",
      foto: "/images/profissionais/ana.png",
      descricao:
        "Especialista em maquiagem e design de sobrancelhas, com mais de 7 anos de experiência.",
      instagram: "anavasconcelossbeauty",
    },
    {
      nome: "Luciana Felix",
      cargo: "Cabeleireira e Terapeuta Capilar",
      foto: "/images/profissionais/luciana.png",
      descricao:
        "Especialista em cortes, coloração e tratamentos capilares, com mais de 10 anos de experiência.",
      instagram: "lucianafelixcoiffeur",
    },
    {
      nome: "Vanessa Gonçalo",
      cargo: "Cabeleireira Especialista em Mechas",
      foto: "/images/profissionais/vanessa.png",
      descricao:
        "Especialista em loiros de alto padrão e design de cortes personalizados, com mais de 25 anos de experiência.",
      instagram: "vanessagoncalofc",
    },
    {
      nome: "Claudineia Martins",
      cargo: "Depiladora",
      foto: "/images/profissionais/claudineia.png",
      descricao:
        "Especialista em epilação com metodo humanizado e cera hidrossolúvel com mais de 10 anos de experiência.",
      instagram: "vanessagoncalofc",
    },
  ];

  // Função para rolagem suave
  // const scrollToSection = (sectionId: string) => {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     const offsetTop = section.offsetTop;
  //     window.scrollTo({
  //       top: offsetTop - 80, // Ajuste para compensar a altura do header
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <section id="profissionais" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossa Equipe"
          subtitle="Conheça os profissionais que farão você se sentir ainda mais bonita"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profissionais.map((profissional, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <div className="relative h-80">
                <Image
                  src={profissional.foto}
                  alt={`Foto de ${profissional.nome}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {profissional.nome}
                </h3>
                <p className="text-orange-700 font-medium mb-3">
                  {profissional.cargo}
                </p>
                <p className="text-gray-700 mb-4">{profissional.descricao}</p>
                <a
                  href={`https://instagram.com/${profissional.instagram}`}
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
                  @{profissional.instagram}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Nossa equipe está em constante atualização com as últimas tendências
            e técnicas do mercado da beleza para oferecer sempre o melhor
            serviço.
          </p>
          <button
            onClick={() => scrollToSection("servicos")}
            className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            Conheça Nossos Serviços
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Profissionais;
