'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { Especialidade } from '@/types/especialidade';
import { showToast } from '@/components/Toast';

const CORES_PADRAO = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
];

export default function EditarEspecialidadePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [especialidade, setEspecialidade] = useState<Especialidade | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#6366f1',
    ativo: true,
  });

  useEffect(() => {
    carregarEspecialidade();
  }, [params.id]);

  async function carregarEspecialidade() {
    try {
      const response = await fetch(`/api/admin/especialidades/${params.id}`);

      if (!response.ok) throw new Error('Erro ao carregar especialidade');

      const data: Especialidade = await response.json();
      setEspecialidade(data);
      setFormData({
        nome: data.nome,
        descricao: data.descricao || '',
        cor: data.cor,
        ativo: data.ativo,
      });
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar especialidade', 'error');
      router.push('/admin/especialidades');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.nome.trim()) {
      showToast('Nome é obrigatório', 'error');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/especialidades/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar especialidade');
      }

      showToast('Especialidade atualizada com sucesso!', 'success');
      router.push('/admin/especialidades');
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao atualizar especialidade', 'error');
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
            href="/admin/especialidades"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Editar Especialidade
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Cabeleireiro"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Descrição opcional da especialidade"
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor *
              </label>
              <div className="grid grid-cols-8 gap-3 mb-3">
                {CORES_PADRAO.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor })}
                    className={`w-10 h-10 rounded-lg transition ${
                      formData.cor === cor
                        ? 'ring-2 ring-offset-2 ring-indigo-500'
                        : ''
                    }`}
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) =>
                  setFormData({ ...formData, cor: e.target.value })
                }
                className="w-20 h-10 rounded cursor-pointer"
              />
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
                  Especialidade ativa
                </span>
              </label>
            </div>

            {/* Preview */}
            <div className="border-t pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: formData.cor }}
                >
                  {formData.nome.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {formData.nome || 'Nome da Especialidade'}
                  </p>
                  {formData.descricao && (
                    <p className="text-sm text-gray-600">{formData.descricao}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-6">
              <Link
                href="/admin/especialidades"
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


