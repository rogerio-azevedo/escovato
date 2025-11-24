'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/components/Toast';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'recepcionista' as 'admin' | 'recepcionista',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha) {
      showToast('Todos os campos são obrigatórios', 'error');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    if (formData.senha.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar usuário');
      }

      showToast('Usuário criado com sucesso!', 'success');
      router.push('/admin/usuarios');
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao criar usuário', 'error');
      setLoading(false);
    }
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
            Novo Usuário
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
                placeholder="Ex: João Silva"
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
                placeholder="joao@escovato.com"
                required
              />
            </div>

            {/* Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
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
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha *
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
                  required
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
                    checked={formData.role === 'recepcionista'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'recepcionista',
                      })
                    }
                    className="mt-1 w-4 h-4 text-indigo-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Recepcionista</div>
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
                    checked={formData.role === 'admin'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'admin',
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
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

