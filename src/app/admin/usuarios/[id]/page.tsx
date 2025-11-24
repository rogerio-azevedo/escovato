/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Usuario } from "@/types/auth";
import { showToast } from "@/components/Toast";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    role: "recepcionista" as "admin" | "recepcionista",
  });

  useEffect(() => {
    carregarUsuario();
  }, [params.id]);

  async function carregarUsuario() {
    try {
      const response = await fetch(`/api/admin/usuarios/${params.id}`);

      if (!response.ok) throw new Error("Erro ao carregar usuário");

      const data: Usuario = await response.json();
      setFormData({
        nome: data.nome,
        email: data.email,
        senha: "",
        confirmarSenha: "",
        role: data.role as "admin" | "recepcionista",
      });
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao carregar usuário", "error");
      router.push("/admin/usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      showToast("Nome e email são obrigatórios", "error");
      return;
    }

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      showToast("As senhas não coincidem", "error");
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      showToast("A senha deve ter no mínimo 6 caracteres", "error");
      return;
    }

    try {
      setSaving(true);

      const updateData: any = {
        nome: formData.nome,
        email: formData.email,
        role: formData.role,
      };

      // Só incluir senha se foi preenchida
      if (formData.senha) {
        updateData.senha = formData.senha;
      }

      const response = await fetch(`/api/admin/usuarios/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar usuário");
      }

      showToast("Usuário atualizado com sucesso!", "success");
      router.push("/admin/usuarios");
    } catch (error: any) {
      console.error("Erro:", error);
      showToast(error.message || "Erro ao atualizar usuário", "error");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/usuarios"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Editar Usuário
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha (deixe vazio para manter)
                </label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmarSenha: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Usuário *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="recepcionista"
                    checked={formData.role === "recepcionista"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "recepcionista",
                      })
                    }
                    className="mt-1 w-4 h-4 text-indigo-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      Recepcionista
                    </div>
                    <p className="text-sm text-gray-600">
                      Pode gerenciar rodízio e vales. Não pode criar/editar
                      profissionais, especialidades ou usuários.
                    </p>
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "admin",
                      })
                    }
                    className="mt-1 w-4 h-4 text-indigo-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      Administrador
                    </div>
                    <p className="text-sm text-gray-600">
                      Acesso total ao sistema. Pode gerenciar tudo incluindo
                      usuários.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6">
              <Link
                href="/admin/usuarios"
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-center font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
