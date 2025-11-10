import type { Vale } from '@/types/vale';

interface StatusBadgeProps {
  vale: Vale;
}

export default function StatusBadge({ vale }: StatusBadgeProps) {
  const getStatus = () => {
    if (vale.usado) {
      return {
        label: 'Usado',
        className: 'bg-gray-100 text-gray-700 border-gray-300',
      };
    }

    const hoje = new Date();
    const validade = new Date(vale.validade);

    if (validade < hoje) {
      return {
        label: 'Expirado',
        className: 'bg-red-100 text-red-700 border-red-300',
      };
    }

    return {
      label: 'Ativo',
      className: 'bg-green-100 text-green-700 border-green-300',
    };
  };

  const status = getStatus();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}
    >
      {status.label}
    </span>
  );
}

