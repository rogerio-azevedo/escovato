'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { FilaEspecialidade } from '@/types/rodizio';
import type { Profissional } from '@/types/profissional';
import { showToast } from '@/components/Toast';

export default function RodizioPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [rodizioId, setRodizioId] = useState<string>('');
  const [filas, setFilas] = useState<FilaEspecialidade[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string>('');
  const [modalAberto, setModalAberto] = useState(false);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<Profissional[]>([]);

  useEffect(() => {
    carregarRodizio();
    const interval = setInterval(carregarRodizio, 10000); // Auto-refresh a cada 10s
    return () => clearInterval(interval);
  }, []);

  async function carregarRodizio() {
    try {
      const response = await fetch('/api/rodizios/hoje');
      if (!response.ok) throw new Error('Erro ao carregar rodízio');

      const data = await response.json();
      setRodizioId(data.rodizio.id);
      setFilas(data.filas);

      // Selecionar primeira especialidade por padrão
      if (!especialidadeSelecionada && data.filas.length > 0) {
        setEspecialidadeSelecionada(data.filas[0].especialidade_id);
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar rodízio', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function abrirModalAdicionar() {
    if (!especialidadeSelecionada) return;

    try {
      const response = await fetch(
        `/api/rodizios/${rodizioId}/profissionais?especialidade_id=${especialidadeSelecionada}`
      );

      if (!response.ok) throw new Error('Erro ao carregar profissionais');

      const data = await response.json();
      setProfissionaisDisponiveis(data);
      setModalAberto(true);
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar profissionais disponíveis', 'error');
    }
  }

  async function adicionarProfissional(profissionalId: string) {
    try {
      const response = await fetch(`/api/rodizios/${rodizioId}/profissionais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          especialidade_id: especialidadeSelecionada,
          profissional_id: profissionalId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao adicionar profissional');
      }

      setModalAberto(false);
      carregarRodizio();
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao adicionar profissional', 'error');
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

      carregarRodizio();
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao atualizar status', 'error');
    }
  }

  async function removerProfissional(rodizioProfissionalId: string, nome: string) {
    if (!confirm(`Remover ${nome} da fila?`)) return;

    try {
      const response = await fetch(
        `/api/rodizios/profissionais/${rodizioProfissionalId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Erro ao remover profissional');

      carregarRodizio();
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao remover profissional', 'error');
    }
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      aguardando: 'bg-blue-100 text-blue-700',
      atendendo: 'bg-green-100 text-green-700',
      almoco: 'bg-orange-100 text-orange-700',
      indisponivel: 'bg-gray-100 text-gray-700',
      finalizado: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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

  const filaAtual = filas.find((f) => f.especialidade_id === especialidadeSelecionada);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando rodízio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rodízio de Hoje</h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        {/* Tabs de Especialidades */}
        <div className="px-4 overflow-x-auto">
          <div className="flex gap-2 pb-4 min-w-max">
            {filas.map((fila) => (
              <button
                key={fila.especialidade_id}
                onClick={() => setEspecialidadeSelecionada(fila.especialidade_id)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  especialidadeSelecionada === fila.especialidade_id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor:
                    especialidadeSelecionada === fila.especialidade_id
                      ? fila.especialidade_cor
                      : undefined,
                }}
              >
                {fila.especialidade_nome}
                <span className="ml-2 text-xs opacity-75">
                  ({fila.profissionais_aguardando.length + fila.profissionais_atendendo.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {filaAtual && (
        <div className="px-4 py-6 space-y-6">
          {/* Aguardando */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                🕐 Aguardando ({filaAtual.profissionais_aguardando.length})
              </h2>
            </div>

            {filaAtual.profissionais_aguardando.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                Nenhum profissional aguardando
              </div>
            ) : (
              <div className="space-y-3">
                {filaAtual.profissionais_aguardando.map((prof, index) => (
                  <div
                    key={prof.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {prof.profissional.nome}
                          </p>
                          <p className="text-sm text-gray-600">
                            {prof.profissional.telefone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removerProfissional(prof.id, prof.profissional.nome)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => mudarStatus(prof.id, 'atendendo')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        Iniciar Atendimento
                      </button>
                      <select
                        onChange={(e) => {
                          if (e.target.value) mudarStatus(prof.id, e.target.value);
                          e.target.value = '';
                        }}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Status...</option>
                        <option value="almoco">Almoço</option>
                        <option value="indisponivel">Indisponível</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atendendo */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              💇 Em Atendimento ({filaAtual.profissionais_atendendo.length})
            </h2>

            {filaAtual.profissionais_atendendo.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                Nenhum atendimento em andamento
              </div>
            ) : (
              <div className="space-y-3">
                {filaAtual.profissionais_atendendo.map((prof) => (
                  <div
                    key={prof.id}
                    className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {prof.profissional.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prof.profissional.telefone}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Atendendo
                      </span>
                    </div>

                    <button
                      onClick={() => mudarStatus(prof.id, 'aguardando')}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Concluir Atendimento
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão Flutuante Adicionar */}
      <button
        onClick={abrirModalAdicionar}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* Modal Adicionar Profissional */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Adicionar Profissional</h3>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {profissionaisDisponiveis.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Todos os profissionais já estão na fila
                </p>
              ) : (
                <div className="space-y-2">
                  {profissionaisDisponiveis.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => adicionarProfissional(prof.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition"
                    >
                      <p className="font-semibold text-gray-900">{prof.nome}</p>
                      <p className="text-sm text-gray-600">{prof.telefone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

