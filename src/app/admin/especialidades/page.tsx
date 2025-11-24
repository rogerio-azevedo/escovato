/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Especialidade } from "@/types/especialidade";
import { showToast } from "@/components/Toast";

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todas" | "ativas">("ativas");

  useEffect(() => {
    carregarEspecialidades();
  }, [filtro]);

  async function carregarEspecialidades() {
    try {
      setLoading(true);
      const url = `/api/admin/especialidades?ativas=${filtro === "ativas"}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Erro ao carregar especialidades");

      const data = await response.json();
      setEspecialidades(data);
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao carregar especialidades", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Deseja realmente desativar a especialidade "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/especialidades/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao deletar");
      }

      showToast("Especialidade desativada com sucesso!", "success");
      carregarEspecialidades();
    } catch (error: any) {
      console.error("Erro:", error);
      showToast(error.message || "Erro ao deletar especialidade", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Especialidades</h1>
            <p className="text-gray-600 mt-1">
              Gerencie as especialidades dos profissionais
            </p>
          </div>
          <Link
            href="/admin/especialidades/nova"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            + Nova Especialidade
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro("ativas")}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === "ativas"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFiltro("todas")}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === "todas"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : especialidades.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhuma especialidade encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {especialidades.map((esp) => (
              <div
                key={esp.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: esp.cor }}
                  >
                    {esp.nome.charAt(0)}
                  </div>
                  {!esp.ativo && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      Inativa
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {esp.nome}
                </h3>
                {esp.descricao && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {esp.descricao}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/especialidades/${esp.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-center text-sm font-medium"
                  >
                    Editar
                  </Link>
                  {esp.ativo && (
                    <button
                      onClick={() => handleDelete(esp.id, esp.nome)}
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
