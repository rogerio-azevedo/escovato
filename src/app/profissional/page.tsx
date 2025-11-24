'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { FilaEspecialidade, RodizioProfissionalDetalhado } from '@/types/rodizio';

export default function ProfissionalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rodizioId, setRodizioId] = useState<string>('');
  const [minhasFilas, setMinhasFilas] = useState<{
    especialidade: string;
    cor: string;
    status: string;
    rodizioProfissionalId: string;
    posicao: number;
  }[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/profissional/login');
      return;
    }

    if (status === 'authenticated') {
      carregarMinhasFilas();
      const interval = setInterval(carregarMinhasFilas, 10000); // Auto-refresh
      return () => clearInterval(interval);
    }
  }, [status, router]);

  async function carregarMinhasFilas() {
    try {
      const response = await fetch('/api/rodizios/hoje');
      if (!response.ok) throw new Error('Erro ao carregar rodízio');

      const data = await response.json();
      setRodizioId(data.rodizio.id);

      // Filtrar apenas as filas onde o profissional logado está
      const minhasFilasData: typeof minhasFilas = [];

      data.filas.forEach((fila: FilaEspecialidade) => {
        const todosProfs = [
          ...fila.profissionais_aguardando,
          ...fila.profissionais_atendendo,
        ];

        todosProfs.forEach((prof: RodizioProfissionalDetalhado) => {
          if (prof.profissional.email === session?.user?.email) {
            minhasFilasData.push({
              especialidade: fila.especialidade_nome,
              cor: fila.especialidade_cor,
              status: prof.status,
              rodizioProfissionalId: prof.id,
              posicao: prof.posicao,
            });
          }
        });
      });

      setMinhasFilas(minhasFilasData);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  async function concluirAtendimento(rodizioProfissionalId: string) {
    if (!confirm('Confirmar conclusão do atendimento?')) return;

    try {
      const response = await fetch(
        `/api/rodizios/profissionais/${rodizioProfissionalId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'aguardando' }),
        }
      );

      if (!response.ok) throw new Error('Erro ao atualizar status');

      carregarMinhasFilas();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao concluir atendimento');
    }
  }

  async function mudarStatus(rodizioProfissionalId: string, novoStatus: string) {
    try {
      const response = await fetch(
        `/api/rodizios/profissionais/${rodizioProfissionalId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) throw new Error('Erro ao atualizar status');

      carregarMinhasFilas();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status');
    }
  }

  function getStatusIcon(status: string) {
    const icons: Record<string, string> = {
      aguardando: '🕐',
      atendendo: '💇',
      almoco: '🍽️',
      indisponivel: '🚫',
      finalizado: '✅',
    };
    return icons[status] || '❓';
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      aguardando: 'Aguardando',
      atendendo: 'Atendendo',
      almoco: 'Almoço',
      indisponivel: 'Indisponível',
      finalizado: 'Finalizado',
    };
    return labels[status] || status;
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      aguardando: 'bg-blue-100 text-blue-700 border-blue-300',
      atendendo: 'bg-green-100 text-green-700 border-green-300',
      almoco: 'bg-orange-100 text-orange-700 border-orange-300',
      indisponivel: 'bg-gray-100 text-gray-700 border-gray-300',
      finalizado: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Rodízio</h1>
              <p className="text-sm text-gray-600 mt-1">
                Olá, {session?.user?.name}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/profissional/login' })}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-center text-gray-600">
            📅 {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        {minhasFilas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <span className="text-6xl mb-4 block">😴</span>
            <p className="text-gray-600 text-lg">
              Você não está em nenhuma fila hoje
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Peça para a recepcionista adicionar você ao rodízio
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {minhasFilas.map((fila, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${
                  fila.status === 'atendendo' ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: fila.cor }}
                    >
                      {fila.especialidade.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {fila.especialidade}
                      </h3>
                      {fila.status === 'aguardando' && (
                        <p className="text-sm text-gray-600">
                          Posição na fila: {fila.posicao}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      fila.status
                    )}`}
                  >
                    {getStatusIcon(fila.status)} {getStatusLabel(fila.status)}
                  </span>
                </div>

                {/* Ações */}
                {fila.status === 'atendendo' && (
                  <button
                    onClick={() => concluirAtendimento(fila.rodizioProfissionalId)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    ✓ Concluir Atendimento
                  </button>
                )}

                {fila.status === 'aguardando' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => mudarStatus(fila.rodizioProfissionalId, 'almoco')}
                      className="w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-semibold hover:bg-orange-200 transition"
                    >
                      🍽️ Ir para Almoço
                    </button>
                    <button
                      onClick={() =>
                        mudarStatus(fila.rodizioProfissionalId, 'indisponivel')
                      }
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                      🚫 Marcar Indisponível
                    </button>
                  </div>
                )}

                {(fila.status === 'almoco' || fila.status === 'indisponivel') && (
                  <button
                    onClick={() => mudarStatus(fila.rodizioProfissionalId, 'aguardando')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    🔄 Voltar para Fila
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

