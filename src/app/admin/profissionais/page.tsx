'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ProfissionalComEspecialidades } from '@/types/profissional';
import { showToast } from '@/components/Toast';

export default function ProfissionaisPage() {
  const router = useRouter();
  const [profissionais, setProfissionais] = useState<ProfissionalComEspecialidades[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'ativos'>('ativos');

  useEffect(() => {
    carregarProfissionais();
  }, [filtro]);

  async function carregarProfissionais() {
    try {
      setLoading(true);
      const url = `/api/admin/profissionais?ativos=${filtro === 'ativos'}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Erro ao carregar profissionais');

      const profissionaisData = await response.json();
      
      // Carregar especialidades de cada profissional
      const profissionaisComEspecialidades = await Promise.all(
        profissionaisData.map(async (prof: any) => {
          const respEsp = await fetch(`/api/admin/profissionais/${prof.id}`);
          if (respEsp.ok) {
            return await respEsp.json();
          }
          return { ...prof, especialidades: [] };
        })
      );

      setProfissionais(profissionaisComEspecialidades);
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar profissionais', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Deseja realmente desativar o profissional "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/profissionais/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar');
      }

      showToast('Profissional desativado com sucesso!', 'success');
      carregarProfissionais();
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao deletar profissional', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profissionais</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os profissionais do salão
            </p>
          </div>
          <Link
            href="/admin/profissionais/novo"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            + Novo Profissional
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('ativos')}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === 'ativos'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === 'todos'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : profissionais.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhum profissional encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionais.map((prof) => (
              <div
                key={prof.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {prof.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {prof.nome}
                      </h3>
                    </div>
                  </div>
                  {!prof.ativo && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      Inativo
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    📱 {prof.telefone}
                  </p>
                  <p className="text-sm text-gray-600">
                    📧 {prof.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    🆔 {prof.cpf}
                  </p>
                </div>

                {/* Especialidades */}
                {prof.especialidades && prof.especialidades.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Especialidades:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {prof.especialidades.map((esp) => (
                        <span
                          key={esp.id}
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: esp.cor }}
                        >
                          {esp.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/profissionais/${prof.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-center text-sm font-medium"
                  >
                    Editar
                  </Link>
                  {prof.ativo && (
                    <button
                      onClick={() => handleDelete(prof.id, prof.nome)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      Desativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

