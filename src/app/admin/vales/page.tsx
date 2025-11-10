'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Vale, ValeStatus } from '@/types/vale';
import ValeCard from '@/components/admin/ValeCard';
import ValeFilters from '@/components/admin/ValeFilters';

export default function ValesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vales, setVales] = useState<Vale[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarVales = async (statusFiltro?: ValeStatus, busca?: string) => {
    try {
      setCarregando(true);
      const params = new URLSearchParams();
      if (statusFiltro) params.set('status', statusFiltro);
      if (busca) params.set('search', busca);

      const response = await fetch(`/api/admin/vales?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar vales');
      }

      const data = await response.json();
      setVales(data.vales);
    } catch (error) {
      setErro('Erro ao carregar vales. Tente novamente.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      carregarVales();
    }
  }, [status, router]);

  const handleFilterChange = (statusFiltro?: ValeStatus, busca?: string) => {
    carregarVales(statusFiltro, busca);
  };

  if (status === 'loading' || carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Estatísticas
  const totalVales = vales.length;
  const valesAtivos = vales.filter(
    (v) => !v.usado && new Date(v.validade) >= new Date()
  ).length;
  const valesUsados = vales.filter((v) => v.usado).length;
  const valesExpirados = vales.filter(
    (v) => !v.usado && new Date(v.validade) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gerenciamento de Vales Presente
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Bem-vindo, {session.user?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/vales/validar"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Validar Vale
              </Link>
              <Link
                href="/admin/vales/novo"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
              >
                + Novo Vale
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Vales</p>
                <p className="text-3xl font-bold text-gray-800">{totalVales}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ativos</p>
                <p className="text-3xl font-bold text-green-600">{valesAtivos}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Usados</p>
                <p className="text-3xl font-bold text-gray-600">{valesUsados}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✔</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expirados</p>
                <p className="text-3xl font-bold text-red-600">{valesExpirados}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⨯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <ValeFilters onFilterChange={handleFilterChange} />

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {erro}
          </div>
        )}

        {/* Lista de vales */}
        {vales.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum vale encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro vale presente
            </p>
            <Link
              href="/admin/vales/novo"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
            >
              Criar Primeiro Vale
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vales.map((vale) => (
              <ValeCard key={vale.id} vale={vale} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

