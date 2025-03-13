"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "../SectionTitle";

type Servico = {
  nome: string;
  descricao: string;
  preco: string;
  tempo: string;
  imagem: string;
};

type ServicosData = {
  cabelos: Servico[];
  unhas: Servico[];
  micropigmentacao: Servico[];
  cilios: Servico[];
  depilacao: Servico[];
};

type CategoriaId = keyof ServicosData;

const Servicos = () => {
  const [activeTab, setActiveTab] = useState("cabelo");

  const categorias = [
    { id: "cabelo", nome: "Cabelo" },
    { id: "barba", nome: "Barba" },
    { id: "unhas", nome: "Unhas" },
    { id: "estetica", nome: "Estética" },
  ];

  const servicos = {
    cabelo: [
      { nome: "Corte Feminino", preco: "A partir de R$ 70,00" },
      { nome: "Corte Masculino", preco: "A partir de R$ 50,00" },
      { nome: "Coloração", preco: "A partir de R$ 120,00" },
      { nome: "Mechas/Luzes", preco: "A partir de R$ 180,00" },
      { nome: "Hidratação Profunda", preco: "A partir de R$ 90,00" },
      { nome: "Escova", preco: "A partir de R$ 60,00" },
      { nome: "Penteado", preco: "A partir de R$ 120,00" },
      { nome: "Tratamento Capilar", preco: "A partir de R$ 150,00" },
    ],
    barba: [
      { nome: "Barba Completa", preco: "R$ 40,00" },
      { nome: "Aparar Barba", preco: "R$ 30,00" },
      { nome: "Barba com Toalha Quente", preco: "R$ 50,00" },
      { nome: "Desenho de Barba", preco: "R$ 45,00" },
    ],
    unhas: [
      { nome: "Manicure", preco: "R$ 35,00" },
      { nome: "Pedicure", preco: "R$ 45,00" },
      { nome: "Manicure e Pedicure", preco: "R$ 70,00" },
      { nome: "Esmaltação em Gel", preco: "R$ 60,00" },
      { nome: "Unhas de Gel (Alongamento)", preco: "R$ 120,00" },
      { nome: "Manutenção de Unhas", preco: "R$ 80,00" },
      { nome: "Nail Art", preco: "A partir de R$ 15,00" },
    ],
    estetica: [
      { nome: "Design de Sobrancelhas", preco: "R$ 40,00" },
      { nome: "Micropigmentação de Sobrancelhas", preco: "R$ 350,00" },
      { nome: "Limpeza de Pele", preco: "R$ 120,00" },
      { nome: "Maquiagem Social", preco: "R$ 120,00" },
      { nome: "Maquiagem para Noivas", preco: "R$ 250,00" },
      { nome: "Depilação Facial", preco: "A partir de R$ 30,00" },
      { nome: "Depilação Corporal", preco: "A partir de R$ 50,00" },
    ],
  };

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nossos Serviços"
          subtitle="Conheça os serviços que oferecemos para realçar sua beleza natural"
          light
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-wrap border-b">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className={`px-6 py-4 text-lg font-medium transition-colors ${
                  activeTab === categoria.id
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "text-gray-600 hover:text-pink-500"
                }`}
                onClick={() => setActiveTab(categoria.id)}
              >
                {categoria.nome}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicos[activeTab as keyof typeof servicos]?.map(
                (servico, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border-b border-gray-100"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {servico.nome}
                    </h3>
                    <span className="text-pink-500 font-semibold">
                      {servico.preco}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                Os preços podem variar de acordo com o comprimento e volume do
                cabelo, complexidade do serviço e produtos utilizados.
                Consulte-nos para um orçamento personalizado.
              </p>
              <a
                href="https://wa.me/5565998135353"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
              >
                Agendar Horário
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
