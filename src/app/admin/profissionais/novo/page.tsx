'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Especialidade } from '@/types/especialidade';
import { showToast } from '@/components/Toast';

export default function NovoProfissionalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    senha: '',
    especialidades_ids: [] as string[],
  });

  useEffect(() => {
    carregarEspecialidades();
  }, []);

  async function carregarEspecialidades() {
    try {
      const response = await fetch('/api/admin/especialidades?ativas=true');
      if (response.ok) {
        const data = await response.json();
        setEspecialidades(data);
      }
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
    }
  }

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function formatTelefone(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  function toggleEspecialidade(id: string) {
    if (formData.especialidades_ids.includes(id)) {
      setFormData({
        ...formData,
        especialidades_ids: formData.especialidades_ids.filter((e) => e !== id),
      });
    } else {
      setFormData({
        ...formData,
        especialidades_ids: [...formData.especialidades_ids, id],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.cpf || !formData.email || !formData.senha) {
      showToast('Todos os campos obrigatórios devem ser preenchidos', 'error');
      return;
    }

    if (formData.especialidades_ids.length === 0) {
      showToast('Selecione ao menos uma especialidade', 'error');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/admin/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar profissional');
      }

      showToast('Profissional criado com sucesso!', 'success');
      router.push('/admin/profissionais');
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao criar profissional', 'error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/profissionais"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Novo Profissional
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
                className="admin-input w-full"
                placeholder="Ex: Maria Silva"
                required
              />
            </div>

            {/* Telefone e CPF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefone: formatTelefone(e.target.value),
                    })
                  }
                  className="admin-input w-full"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: formatCPF(e.target.value),
                    })
                  }
                  className="admin-input w-full"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            {/* Email e Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="admin-input w-full"
                  placeholder="maria@exemplo.com"
                  required
                />
              </div>

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
                  className="admin-input w-full"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Especialidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Especialidades * (selecione ao menos uma)
              </label>
              {especialidades.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Nenhuma especialidade cadastrada.{' '}
                  <Link
                    href="/admin/especialidades/nova"
                    className="text-indigo-600 hover:underline"
                  >
                    Criar especialidade
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {especialidades.map((esp) => (
                    <label
                      key={esp.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.especialidades_ids.includes(esp.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.especialidades_ids.includes(esp.id)}
                        onChange={() => toggleEspecialidade(esp.id)}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: esp.cor }}
                      >
                        {esp.nome.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {esp.nome}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6">
              <Link
                href="/admin/profissionais"
                className="admin-button-ghost flex-1 text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="admin-button-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Profissional'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

