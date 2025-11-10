'use client';

import { useState } from 'react';
import type { ValeStatus } from '@/types/vale';

interface ValeFiltersProps {
  onFilterChange: (status?: ValeStatus, search?: string) => void;
}

export default function ValeFilters({ onFilterChange }: ValeFiltersProps) {
  const [statusSelecionado, setStatusSelecionado] = useState<ValeStatus | ''>('');
  const [busca, setBusca] = useState('');

  const handleStatusChange = (status: ValeStatus | '') => {
    setStatusSelecionado(status);
    onFilterChange(status || undefined, busca || undefined);
  };

  const handleSearchChange = (search: string) => {
    setBusca(search);
    onFilterChange(statusSelecionado || undefined, search || undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Busca */}
        <div>
          <label
            htmlFor="busca"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buscar
          </label>
          <input
            type="text"
            id="busca"
            value={busca}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Nome, CPF ou código..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Filtro de Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={statusSelecionado}
            onChange={(e) => handleStatusChange(e.target.value as ValeStatus | '')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900"
          >
            <option value="">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="usado">Usados</option>
            <option value="expirado">Expirados</option>
          </select>
        </div>
      </div>
    </div>
  );
}

