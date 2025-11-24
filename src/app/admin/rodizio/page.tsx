"use client";

import { useEffect, useState, useCallback } from "react";
import type { FilaEspecialidade } from "@/types/rodizio";
import type { Profissional } from "@/types/profissional";
import { showToast } from "@/components/Toast";

export default function RodizioPage() {
  const [loading, setLoading] = useState(true);
  const [rodizioId, setRodizioId] = useState<string>("");
  const [filas, setFilas] = useState<FilaEspecialidade[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<string>("");
  const [especialidadesVisiveis, setEspecialidadesVisiveis] = useState<
    Set<string>
  >(new Set());
  const [modalAberto, setModalAberto] = useState(false);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<
    Profissional[]
  >([]);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Carregar especialidade selecionada e especialidades visíveis do localStorage
  useEffect(() => {
    const especialidadeSalva = localStorage.getItem(
      "rodizio_especialidade_selecionada"
    );
    if (especialidadeSalva) {
      setEspecialidadeSelecionada(especialidadeSalva);
    }

    // Carregar especialidades visíveis para desktop
    const especialidadesVisiveisSalvas = localStorage.getItem(
      "rodizio_especialidades_visiveis"
    );
    if (especialidadesVisiveisSalvas) {
      try {
        const idsArray = JSON.parse(especialidadesVisiveisSalvas);
        setEspecialidadesVisiveis(new Set(idsArray));
      } catch (e) {
        console.error("Erro ao parsear especialidades visíveis:", e);
      }
    }
  }, []);

  // Salvar especialidade selecionada no localStorage quando mudar
  const handleEspecialidadeChange = (especialidadeId: string) => {
    setEspecialidadeSelecionada(especialidadeId);
    localStorage.setItem("rodizio_especialidade_selecionada", especialidadeId);
  };

  const carregarRodizio = useCallback(async () => {
    try {
      const response = await fetch("/api/rodizios/hoje");
      if (!response.ok) throw new Error("Erro ao carregar rodízio");

      const data = await response.json();
      setRodizioId(data.rodizio.id);
      setFilas(data.filas);

      // Inicializar especialidades visíveis (todas no desktop) SOMENTE se não tiver nada salvo
      if (especialidadesVisiveis.size === 0 && data.filas.length > 0) {
        const especialidadesVisiveisSalvas = localStorage.getItem(
          "rodizio_especialidades_visiveis"
        );
        if (!especialidadesVisiveisSalvas) {
          // Se não tem nada salvo, mostrar todas
          const todasIds = data.filas.map(
            (f: FilaEspecialidade) => f.especialidade_id
          );
          setEspecialidadesVisiveis(new Set(todasIds));
          localStorage.setItem(
            "rodizio_especialidades_visiveis",
            JSON.stringify(todasIds)
          );
        }
      }

      // Selecionar primeira especialidade SOMENTE na primeira carga E se não tiver nada salvo (mobile)
      if (!especialidadeSelecionada && data.filas.length > 0) {
        const especialidadeSalva = localStorage.getItem(
          "rodizio_especialidade_selecionada"
        );
        if (especialidadeSalva) {
          // Verificar se a especialidade salva ainda existe
          const existeNasFilas = data.filas.some(
            (f: FilaEspecialidade) => f.especialidade_id === especialidadeSalva
          );
          if (existeNasFilas) {
            setEspecialidadeSelecionada(especialidadeSalva);
          } else {
            // Se não existe mais, seleciona a primeira e atualiza o localStorage
            setEspecialidadeSelecionada(data.filas[0].especialidade_id);
            localStorage.setItem(
              "rodizio_especialidade_selecionada",
              data.filas[0].especialidade_id
            );
          }
        } else {
          setEspecialidadeSelecionada(data.filas[0].especialidade_id);
          localStorage.setItem(
            "rodizio_especialidade_selecionada",
            data.filas[0].especialidade_id
          );
        }
      }
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao carregar rodízio", "error");
    } finally {
      setLoading(false);
    }
  }, [especialidadesVisiveis, especialidadeSelecionada]);

  useEffect(() => {
    carregarRodizio();
    const interval = setInterval(carregarRodizio, 10000); // Auto-refresh a cada 10s
    return () => clearInterval(interval);
  }, [carregarRodizio]);

  const toggleEspecialidadeVisivel = (especialidadeId: string) => {
    const novasVisiveis = new Set(especialidadesVisiveis);
    if (novasVisiveis.has(especialidadeId)) {
      // Não permitir esconder se for a última visível
      if (novasVisiveis.size > 1) {
        novasVisiveis.delete(especialidadeId);
      }
    } else {
      novasVisiveis.add(especialidadeId);
    }
    setEspecialidadesVisiveis(novasVisiveis);
    // Salvar no localStorage
    localStorage.setItem(
      "rodizio_especialidades_visiveis",
      JSON.stringify(Array.from(novasVisiveis))
    );
  };

  async function abrirModalAdicionar(especialidadeId?: string) {
    const especialidadeParaAdicionar =
      especialidadeId || especialidadeSelecionada;
    if (!especialidadeParaAdicionar) return;

    try {
      // Se for diferente da selecionada, atualizar
      if (especialidadeId && especialidadeId !== especialidadeSelecionada) {
        setEspecialidadeSelecionada(especialidadeId);
      }

      const response = await fetch(
        `/api/rodizios/${rodizioId}/profissionais?especialidade_id=${especialidadeParaAdicionar}`
      );

      if (!response.ok) throw new Error("Erro ao carregar profissionais");

      const data = await response.json();
      setProfissionaisDisponiveis(data);
      setModalAberto(true);
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao carregar profissionais disponíveis", "error");
    }
  }

  async function adicionarProfissional(profissionalId: string) {
    try {
      const response = await fetch(`/api/rodizios/${rodizioId}/profissionais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          especialidade_id: especialidadeSelecionada,
          profissional_id: profissionalId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao adicionar profissional");
      }

      showToast("Profissional adicionado à fila com sucesso!", "success");
      setModalAberto(false);
      carregarRodizio();
    } catch (error: unknown) {
      console.error("Erro:", error);

      // Mensagem personalizada para erro de especialidade
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("não possui esta especialidade")) {
        showToast(
          "⚠️ Este profissional não pode ser adicionado a esta fila pois não possui a especialidade necessária",
          "warning"
        );
      } else if (errorMessage.includes("já está nesta fila")) {
        showToast("Este profissional já está nesta fila", "warning");
      } else {
        showToast(errorMessage || "Erro ao adicionar profissional", "error");
      }
    }
  }

  async function mudarStatus(
    rodizioProfissionalId: string,
    novoStatus: string
  ) {
    try {
      const response = await fetch(
        `/api/rodizios/profissionais/${rodizioProfissionalId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar status");

      // Feedback baseado no status
      const mensagens = {
        atendendo: "Atendimento iniciado",
        aguardando: "Profissional disponível novamente",
        almoco: "Profissional em almoço",
        indisponivel: "Profissional marcado como indisponível",
      };

      showToast(
        mensagens[novoStatus as keyof typeof mensagens] || "Status atualizado",
        "success"
      );
      carregarRodizio();
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao atualizar status", "error");
    }
  }

  async function removerProfissional(
    rodizioProfissionalId: string,
    nome: string
  ) {
    if (!confirm(`Remover ${nome} da fila?`)) return;

    try {
      const response = await fetch(
        `/api/rodizios/profissionais/${rodizioProfissionalId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Erro ao remover profissional");

      showToast(`${nome} removido da fila`, "success");
      carregarRodizio();
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao remover profissional", "error");
    }
  }

  const filaAtual = filas.find(
    (f) => f.especialidade_id === especialidadeSelecionada
  );

  // Componente para renderizar uma coluna de fila
  const renderFilaCard = (fila: FilaEspecialidade) => (
    <div
      key={fila.especialidade_id}
      className="flex-shrink-0 w-full lg:w-[380px] space-y-2"
    >
      {/* Header da Coluna */}
      <div
        className="rounded-lg p-3 text-white"
        style={{ backgroundColor: fila.especialidade_cor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">
              {fila.especialidade_nome}
            </h2>
            <p className="text-xs opacity-90">
              {
                fila.profissionais_aguardando.filter(
                  (p) => p.status === "aguardando"
                ).length
              }{" "}
              aguardando • {fila.profissionais_atendendo.length} atendendo
            </p>
          </div>
          {isDesktop && (
            <button
              onClick={() => abrirModalAdicionar(fila.especialidade_id)}
              className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold transition shrink-0 ml-2 shadow-md"
              style={{ color: fila.especialidade_cor }}
              title="Adicionar profissional"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* Aguardando */}
      <div className="bg-white rounded-lg shadow-sm p-2.5">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1 px-1">
          <span>
            🕐 Aguardando (
            {
              fila.profissionais_aguardando.filter(
                (p) => p.status === "aguardando"
              ).length
            }
            )
          </span>
          {fila.profissionais_aguardando.filter(
            (p) => p.status !== "aguardando"
          ).length > 0 && (
            <span className="text-xs text-gray-500">
              (+
              {
                fila.profissionais_aguardando.filter(
                  (p) => p.status !== "aguardando"
                ).length
              }
              )
            </span>
          )}
        </h3>

        {fila.profissionais_aguardando.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-3">
            Nenhum profissional
          </p>
        ) : (
          <div className="space-y-1.5">
            {fila.profissionais_aguardando.map((prof, index) => {
              const isIndisponivel =
                prof.status === "almoco" || prof.status === "indisponivel";
              const statusConfig = {
                almoco: {
                  label: "🍽️",
                  bg: "bg-orange-50",
                  border: "border-orange-300",
                  badge: "bg-orange-100 text-orange-700",
                },
                indisponivel: {
                  label: "⏸️",
                  bg: "bg-gray-50",
                  border: "border-gray-300",
                  badge: "bg-gray-100 text-gray-700",
                },
                aguardando: {
                  label: "",
                  bg: "bg-gray-50",
                  border: "border-transparent",
                  badge: "",
                },
              };
              const config =
                statusConfig[prof.status as keyof typeof statusConfig] ||
                statusConfig.aguardando;

              return (
                <div
                  key={prof.id}
                  className={`${config.bg} rounded p-2 border ${config.border}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 ${
                          isIndisponivel ? "bg-gray-400" : "bg-blue-500"
                        } rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-gray-900 text-xs truncate">
                            {prof.profissional.nome}
                          </p>
                          {isIndisponivel && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${config.badge} shrink-0`}
                            >
                              {config.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {prof.profissional.telefone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removerProfissional(prof.id, prof.profissional.nome)
                      }
                      className="text-red-600 hover:text-red-700 text-sm shrink-0 ml-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    {isIndisponivel ? (
                      <button
                        onClick={() => mudarStatus(prof.id, "aguardando")}
                        className="flex-1 bg-blue-600 text-white py-1 rounded text-xs font-medium hover:bg-blue-700 transition"
                      >
                        Disponível
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => mudarStatus(prof.id, "atendendo")}
                          className="flex-1 bg-green-600 text-white py-1 rounded text-xs font-medium hover:bg-green-700 transition"
                        >
                          Iniciar
                        </button>
                        <select
                          onChange={(e) => {
                            if (e.target.value)
                              mudarStatus(prof.id, e.target.value);
                            e.target.value = "";
                          }}
                          className="px-1.5 py-1 border rounded text-xs shrink-0"
                        >
                          <option value="">Status...</option>
                          <option value="almoco">🍽️ Almoço</option>
                          <option value="indisponivel">⏸️ Indisponível</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Atendendo */}
      <div className="bg-white rounded-lg shadow-sm p-2.5">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm px-1">
          💇 Atendendo ({fila.profissionais_atendendo.length})
        </h3>

        {fila.profissionais_atendendo.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-3">
            Nenhum atendimento
          </p>
        ) : (
          <div className="space-y-1.5">
            {fila.profissionais_atendendo.map((prof) => (
              <div
                key={prof.id}
                className="bg-green-50 rounded p-2 border-l-2 border-green-500"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-xs truncate">
                      {prof.profissional.nome}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {prof.profissional.telefone}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2">
                    ✓
                  </span>
                </div>
                <button
                  onClick={() => mudarStatus(prof.id, "aguardando")}
                  className="w-full bg-blue-600 text-white py-1 rounded text-xs font-medium hover:bg-blue-700 transition"
                >
                  Concluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
        <div className="px-4 py-2.5">
          <h1 className="text-xl font-bold text-gray-900">Rodízio de Hoje</h1>
          <p className="text-xs text-gray-600">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Botões/Tabs de Especialidades */}
        <div className="px-4">
          {isDesktop && (
            <p className="text-xs text-gray-600 mb-2">
              Clique nas especialidades para mostrar/esconder colunas
            </p>
          )}
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-3 min-w-max">
              {filas.map((fila) => {
                const isActive = isDesktop
                  ? especialidadesVisiveis.has(fila.especialidade_id)
                  : especialidadeSelecionada === fila.especialidade_id;

                return (
                  <button
                    key={fila.especialidade_id}
                    onClick={() => {
                      if (isDesktop) {
                        toggleEspecialidadeVisivel(fila.especialidade_id);
                      } else {
                        handleEspecialidadeChange(fila.especialidade_id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                      isActive
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? fila.especialidade_cor
                        : undefined,
                    }}
                  >
                    {fila.especialidade_nome}
                    <span className="ml-1.5 text-xs opacity-75">
                      (
                      {fila.profissionais_aguardando.length +
                        fila.profissionais_atendendo.length}
                      )
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Mobile (Tabs) */}
      {filaAtual && (
        <div className="lg:hidden px-4 py-3">{renderFilaCard(filaAtual)}</div>
      )}

      {/* Conteúdo Principal - Desktop (Colunas) */}
      <div className="hidden lg:block px-4 py-3">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filas
            .filter((fila) => especialidadesVisiveis.has(fila.especialidade_id))
            .map((fila) => renderFilaCard(fila))}
        </div>
      </div>

      {/* Botão Flutuante Adicionar (Mobile apenas) */}
      <button
        onClick={() => abrirModalAdicionar()}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center text-2xl z-40"
      >
        +
      </button>

      {/* Modal Adicionar Profissional */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Adicionar Profissional
                </h3>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {profissionaisDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-700 font-medium mb-2">
                    Nenhum profissional disponível
                  </p>
                  <p className="text-gray-500 text-sm">
                    Todos os profissionais com esta especialidade já estão na
                    fila
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {profissionaisDisponiveis.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => adicionarProfissional(prof.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border-2 border-transparent rounded-lg text-left transition"
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
