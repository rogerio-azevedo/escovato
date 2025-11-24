'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface MenuCard {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  roles: string[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'recepcionista';

  const menuCards: MenuCard[] = [
    {
      href: '/admin/rodizio',
      icon: '🔄',
      title: 'Rodízio',
      description: 'Gerenciar filas e atendimentos de profissionais',
      color: 'from-purple-500 to-purple-700',
      roles: ['admin', 'recepcionista'],
    },
    {
      href: '/admin/vales',
      icon: '🎁',
      title: 'Vales',
      description: 'Gerenciar vales-presente e promoções',
      color: 'from-pink-500 to-pink-700',
      roles: ['admin', 'recepcionista'],
    },
    {
      href: '/admin/profissionais',
      icon: '👤',
      title: 'Profissionais',
      description: 'Cadastro e gerenciamento de profissionais',
      color: 'from-blue-500 to-blue-700',
      roles: ['admin'],
    },
    {
      href: '/admin/especialidades',
      icon: '⭐',
      title: 'Especialidades',
      description: 'Cadastro de especialidades e serviços',
      color: 'from-amber-500 to-amber-700',
      roles: ['admin'],
    },
    {
      href: '/admin/usuarios',
      icon: '👥',
      title: 'Usuários',
      description: 'Gerenciar admins e recepcionistas',
      color: 'from-green-500 to-green-700',
      roles: ['admin'],
    },
  ];

  const filteredCards = menuCards.filter((card) => card.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {session?.user?.name}!
          </h1>
          <p className="text-gray-600">
            Selecione uma opção abaixo para começar
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 text-3xl shadow-md`}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-purple-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Acessar
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
            </Link>
          ))}
        </div>

        {/* Quick Stats (opcional - pode adicionar depois) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rodízio de Hoje</p>
                <p className="text-2xl font-bold text-gray-900">Ativo</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cargo</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {userRole}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Módulos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCards.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

