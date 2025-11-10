import Link from 'next/link';
import { formatarValor, formatarCPF } from '@/lib/vales';
import type { Vale } from '@/types/vale';
import StatusBadge from './StatusBadge';

interface ValeCardProps {
  vale: Vale;
}

export default function ValeCard({ vale }: ValeCardProps) {
  return (
    <Link href={`/admin/vales/${vale.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              {vale.nome_completo}
            </h3>
            <p className="text-sm text-gray-600">CPF: {formatarCPF(vale.cpf)}</p>
          </div>
          <StatusBadge vale={vale} />
        </div>

        {/* Conteúdo */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Valor:</span>
            <span className="font-bold text-amber-700">
              {formatarValor(vale.valor)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Para:</span>
            <span className="text-sm font-medium text-gray-800">{vale.para}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Validade:</span>
            <span className="text-sm font-medium text-gray-800">
              {new Date(vale.validade).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <div className="border-t pt-3">
          <p className="text-sm text-gray-700 line-clamp-2">{vale.descricao}</p>
        </div>

        {/* Código */}
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-gray-500 font-mono">
            #{vale.codigo_hash}
          </span>
        </div>
      </div>
    </Link>
  );
}

