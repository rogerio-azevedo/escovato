'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Usuario } from '@/types/auth';
import { showToast } from '@/components/Toast';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/usuarios');

      if (!response.ok) throw new Error('Erro ao carregar usuários');

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Deseja realmente deletar o usuário "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar');
      }

      showToast('Usuário deletado com sucesso!', 'success');
      carregarUsuarios();
    } catch (error: any) {
      console.error('Erro:', error);
      showToast(error.message || 'Erro ao deletar usuário', 'error');
    }
  }

  function getRoleBadge(role: string) {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      recepcionista: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      admin: 'Administrador',
      recepcionista: 'Recepcionista',
    };
    return { style: styles[role as keyof typeof styles], label: labels[role as keyof typeof labels] };
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os usuários administrativos do sistema
            </p>
          </div>
          <Link
            href="/admin/usuarios/novo"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            + Novo Usuário
          </Link>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => {
                  const badge = getRoleBadge(usuario.role);
                  return (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {usuario.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nome}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.style}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/usuarios/${usuario.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(usuario.id, usuario.nome)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


