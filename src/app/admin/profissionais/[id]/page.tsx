'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { ProfissionalComEspecialidades } from '@/types/profissional';
import type { Especialidade } from '@/types/especialidade';
import { showToast } from '@/components/Toast';

export default function EditarProfissionalPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profissional, setProfissional] = useState<ProfissionalComEspecialidades | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    senha: '',
    ativo: true,
    especialidades_ids: [] as string[],
  });

  useEffect(() => {
    carregarDados();
  }, [params.id]);

  async function carregarDados() {
    try {
      // Carregar profissional
      const respProf = await fetch(`/api/admin/profissionais/${params.id}`);
      if (!respProf.ok) throw new Error('Erro ao carregar profissional');
      const profData: ProfissionalComEspecialidades = await respProf.json();

      // Carregar especialidades disponíveis
      const respEsp = await fetch('/api/admin/especialidades?ativas=true');
      if (respEsp.ok) {
        const espData = await respEsp.json();
        setEspecialidades(espData);
      }

      setProfissional(profData);
      setFormData({
        nome: profData.nome,
        telefone: profData.telefone,
        cpf: profData.cpf,
        email: profData.email,
        senha: '',
        ativo: profData.ativo,
        especialidades_ids: profData.especialidades.map((e) => e.id),
      });
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar profissional', 'error');
      router.push('/admin/profissionais');
    } finally {
      setLoading(false);
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

    if (!formData.nome.trim() || !formData.cpf || !formData.email) {
      showToast('Campos obrigatórios devem ser preenchidos', 'error');
      return;
    }

    if (formData.especialidades_ids.length === 0) {
      showToast('Selecione ao menos uma especialidade', 'error');
      return;
    }

    try {
      setSaving(true);

      // Atualizar dados básicos
      const updateData: any = {
        nome: formData.nome,
        telefone: formData.telefone,
        cpf: formData.cpf,
        email: formData.email,
        ativo: formData.ativo,
      };

      // Só incluir senha se foi preenchida
      if (formData.senha) {
        updateData.senha = formData.senha;
      }

      const response = await fetch(`/api/admin/profissionais/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar profissional');
      }

      // Atualizar especialidades
      const respEsp = await fetch(
        `/api/admin/profissionais/${params.id}/especialidades`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ especialidades_ids: formData.especialidades_ids }),
        }
      );

      if (!respEsp.ok) {
        throw new Error('Erro ao atualizar especialidades');
      }

      showToast('Profissional atualizado com sucesso!', 'success');
      router.push('/admin/profissionais');
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao atualizar profissional', 'error');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </div>
    );
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
            Editar Profissional
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

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
              </div>
            </div>

            {/* Especialidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Especialidades *
              </label>
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
                    <span className="font-medium text-gray-900">{esp.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ativo */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Profissional ativo
                </span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6">
              <Link
                href="/admin/profissionais"
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-center font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

