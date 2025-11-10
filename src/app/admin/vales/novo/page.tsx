'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validarCPF, formatarCPF } from '@/lib/vales';

export default function NovoValePage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Calcular data padrão inicial (12 meses a partir de hoje)
  const getDataPadraoInicial = () => {
    const data = new Date();
    data.setFullYear(data.getFullYear() + 1);
    return data.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    descricao: '',
    valor: '',
    mensagem: '',
    de: 'Escovato Salão de Beleza',
    para: '',
    validade: getDataPadraoInicial(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      // Formatar CPF enquanto digita
      const cpfNumeros = value.replace(/[^\d]/g, '');
      const cpfFormatado = cpfNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setFormData({ ...formData, cpf: cpfFormatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setCarregando(true);

    // Validações
    // CPF é opcional, mas se fornecido deve ser válido
    if (formData.cpf && !validarCPF(formData.cpf)) {
      setErro('CPF inválido');
      setCarregando(false);
      return;
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      setErro('Valor inválido');
      setCarregando(false);
      return;
    }

    // Validar data de validade
    if (!formData.validade) {
      setErro('A data de validade é obrigatória');
      setCarregando(false);
      return;
    }

    const validade = new Date(formData.validade + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (isNaN(validade.getTime())) {
      setErro('Data de validade inválida');
      setCarregando(false);
      return;
    }

    if (validade < hoje) {
      setErro('A data de validade deve ser hoje ou uma data futura');
      setCarregando(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/vales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          valor: valor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar vale');
      }

      setSucesso(true);
      setTimeout(() => {
        router.push(`/admin/vales/${data.vale.id}`);
      }, 2000);
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar vale. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Data mínima permitida (hoje)
  const getDataMinima = () => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/vales"
              className="text-gray-600 hover:text-gray-800"
            >
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Criar Novo Vale Presente
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Cliente */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Informações do Cliente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nome_completo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome_completo"
                    name="nome_completo"
                    value={formData.nome_completo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cpf"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    CPF (opcional)
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Informações do Vale */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Informações do Vale
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="valor"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Valor (R$) *
                    </label>
                    <input
                      type="number"
                      id="valor"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="validade"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Validade *
                    </label>
                    <input
                      type="date"
                      id="validade"
                      name="validade"
                      value={formData.validade}
                      onChange={handleChange}
                      min={getDataMinima()}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Padrão: 12 meses a partir de hoje
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descrição do Serviço *
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Corte de cabelo e escova"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="de"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      De *
                    </label>
                    <input
                      type="text"
                      id="de"
                      name="de"
                      value={formData.de}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="para"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Para *
                    </label>
                    <input
                      type="text"
                      id="para"
                      name="para"
                      value={formData.para}
                      onChange={handleChange}
                      required
                      placeholder="Nome do presenteado"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mensagem"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mensagem Personalizada (opcional)
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Digite uma mensagem especial..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Mensagens */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✓ Vale criado com sucesso! Redirecionando...
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={carregando}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Criando...' : 'Criar Vale Presente'}
              </button>

              <Link
                href="/admin/vales"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

