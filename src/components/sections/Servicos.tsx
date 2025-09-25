"use client";

import React, { useState } from "react";
import SectionTitle from "../SectionTitle";

type Servico = {
  nome: string;
  descricao: string;
  preco: string;
};

type ServicosData = {
  cabelo: Servico[];
  unhas: Servico[];
  maquiagem: Servico[];
  tratamentos: Servico[];
};

type Categoria = {
  id: "cabelo" | "unhas" | "maquiagem" | "tratamentos";
  nome: string;
  icone: React.ReactNode;
};

const Servicos = () => {
  const categorias: Categoria[] = [
    {
      id: "cabelo",
      nome: "Cabelo",
      icone: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="M13 7h-2v6h6v-2h-4z" />
        </svg>
      ),
    },
    {
      id: "unhas",
      nome: "Unhas",
      icone: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="M13 7h-2v6h6v-2h-4z" />
        </svg>
      ),
    },
    {
      id: "maquiagem",
      nome: "Maquiagem",
      icone: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="M13 7h-2v6h6v-2h-4z" />
        </svg>
      ),
    },
    {
      id: "tratamentos",
      nome: "Tratamentos",
      icone: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="M13 7h-2v6h6v-2h-4z" />
        </svg>
      ),
    },
  ];

  const servicos: ServicosData = {
    cabelo: [
      {
        nome: "Corte Feminino",
        descricao:
          "Corte personalizado de acordo com seu tipo de rosto e estilo",
        preco: "A partir de R$ 80,00",
      },
      {
        nome: "Coloração",
        descricao: "Tintura profissional com produtos de alta qualidade",
        preco: "A partir de R$ 150,00",
      },
      {
        nome: "Mechas/Luzes",
        descricao: "Técnicas variadas como balayage, ombré, californianas",
        preco: "A partir de R$ 200,00",
      },
      {
        nome: "Escova",
        descricao: "Modelagem com escova para todos os tipos de cabelo",
        preco: "A partir de R$ 60,00",
      },
      {
        nome: "Penteado",
        descricao: "Penteados para festas, casamentos e eventos especiais",
        preco: "A partir de R$ 120,00",
      },
      {
        nome: "Hidratação",
        descricao: "Tratamentos capilares para recuperar a saúde dos fios",
        preco: "A partir de R$ 90,00",
      },
    ],
    unhas: [
      {
        nome: "Manicure",
        descricao: "Cuidado completo para suas mãos e unhas",
        preco: "R$ 40,00",
      },
      {
        nome: "Pedicure",
        descricao: "Tratamento completo para pés e unhas",
        preco: "R$ 50,00",
      },
      {
        nome: "Esmaltação em Gel",
        descricao: "Esmalte em gel de longa duração",
        preco: "R$ 70,00",
      },
      {
        nome: "Unhas de Fibra",
        descricao: "Alongamento de unhas com fibra de vidro",
        preco: "R$ 120,00",
      },
      {
        nome: "Unhas de Gel",
        descricao: "Alongamento ou cobertura com gel",
        preco: "R$ 150,00",
      },
      {
        nome: "Nail Art",
        descricao: "Decoração artística para suas unhas",
        preco: "A partir de R$ 20,00",
      },
    ],
    maquiagem: [
      {
        nome: "Maquiagem Social",
        descricao: "Maquiagem para eventos sociais e ocasiões especiais",
        preco: "R$ 120,00",
      },
      {
        nome: "Maquiagem para Noivas",
        descricao: "Maquiagem completa para o dia do seu casamento",
        preco: "R$ 250,00",
      },
      {
        nome: "Design de Sobrancelhas",
        descricao: "Modelagem e design personalizado para suas sobrancelhas",
        preco: "R$ 50,00",
      },
      {
        nome: "Extensão de Cílios",
        descricao: "Aplicação de cílios fio a fio ou volume russo",
        preco: "A partir de R$ 180,00",
      },
      {
        nome: "Limpeza de Pele",
        descricao: "Tratamento completo para limpeza e revitalização da pele",
        preco: "R$ 120,00",
      },
      {
        nome: "Curso de Auto-Maquiagem",
        descricao: "Aprenda a se maquiar com técnicas profissionais",
        preco: "R$ 200,00",
      },
    ],
    tratamentos: [
      {
        nome: "Botox Capilar",
        descricao:
          "Tratamento para recuperar a fibra capilar e reduzir o frizz",
        preco: "A partir de R$ 150,00",
      },
      {
        nome: "Cauterização",
        descricao: "Selamento da cutícula para cabelos danificados",
        preco: "A partir de R$ 120,00",
      },
      {
        nome: "Reconstrução",
        descricao: "Tratamento intensivo para cabelos muito danificados",
        preco: "A partir de R$ 140,00",
      },
      {
        nome: "Hidratação Profunda",
        descricao:
          "Tratamento de hidratação intensiva para todos os tipos de cabelo",
        preco: "A partir de R$ 100,00",
      },
      {
        nome: "Detox Capilar",
        descricao: "Limpeza profunda do couro cabeludo",
        preco: "R$ 90,00",
      },
      {
        nome: "Nutrição",
        descricao: "Reposição de nutrientes essenciais para a saúde dos fios",
        preco: "A partir de R$ 110,00",
      },
    ],
  };

  const [categoriaAtiva, setCategoriaAtiva] = useState<
    "cabelo" | "unhas" | "maquiagem" | "tratamentos"
  >("cabelo");

  return (
    <section id="servicos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossos Serviços"
          subtitle="Conheça os serviços que oferecemos para realçar sua beleza"
        />

        <div className="flex flex-wrap justify-center mb-12">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaAtiva(categoria.id)}
              className={`flex items-center px-6 py-3 m-2 rounded-full transition-colors ${
                categoriaAtiva === categoria.id
                  ? "bg-orange-700 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              <span className="mr-2">{categoria.icone}</span>
              {categoria.nome}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos[categoriaAtiva].map((servico, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {servico.nome}
              </h3>
              <p className="text-gray-600 mb-4">{servico.descricao}</p>
              <p className="text-orange-700 font-bold">{servico.preco}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Todos os nossos serviços são realizados por profissionais
            qualificados e com produtos de alta qualidade. Agende seu horário e
            venha se cuidar conosco!
          </p>
          <a
            href="https://wa.me/5565998135353"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            Agendar Horário
          </a>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
