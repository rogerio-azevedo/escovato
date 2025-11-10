'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ValeValidacao } from '@/types/vale';
import { formatarValor } from '@/lib/vales';
import QRScanner from '@/components/admin/QRScanner';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

function ValidarValeContent() {
  const searchParams = useSearchParams();
  const codigoUrl = searchParams.get('code');

  const [metodo, setMetodo] = useState<'codigo' | 'cpf' | 'qrcode'>('codigo');
  const [codigo, setCodigo] = useState(codigoUrl || '');
  const [cpf, setCpf] = useState('');
  const [validacao, setValidacao] = useState<ValeValidacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const validarVale = async (codigoParaValidar: string) => {
    setCarregando(true);
    setValidacao(null);

    try {
      const response = await fetch(`/api/vales/validar/${codigoParaValidar}`);
      const data = await response.json();

      setValidacao(data);
    } catch (error) {
      console.error('Erro ao validar vale:', error);
      setValidacao({
        valido: false,
        mensagem: 'Erro ao validar vale. Tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const buscarPorCPF = async () => {
    setCarregando(true);
    setValidacao(null);

    try {
      const response = await fetch(
        `/api/admin/vales?search=${cpf.replace(/[^\d]/g, '')}`
      );
      const data = await response.json();

      if (data.vales && data.vales.length > 0) {
        const vale = data.vales[0];
        await validarVale(vale.codigo_hash);
      } else {
        setValidacao({
          valido: false,
          mensagem: 'Nenhum vale encontrado para este CPF',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar vale:', error);
      setValidacao({
        valido: false,
        mensagem: 'Erro ao buscar vale. Tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const marcarComoUsado = async () => {
    if (!validacao?.vale) return;

    setModalAberto(false);
    setProcessando(true);

    try {
      const response = await fetch(
        `/api/admin/vales/${validacao.vale.id}/validar`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao marcar vale como usado');
      }

      setToast({
        show: true,
        message: 'Vale utilizado com sucesso!',
        type: 'success',
      });
      
      // Limpar após 2 segundos
      setTimeout(() => {
        setValidacao(null);
        setCodigo('');
        setCpf('');
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: (error as Error).message || 'Erro ao processar vale',
        type: 'error',
      });
    } finally {
      setProcessando(false);
    }
  };

  const handleQRScan = (data: string) => {
    // Extrair código do QR (pode ser URL ou código direto)
    const urlMatch = data.match(/code=([A-Z0-9-]+)/);
    const codigoExtraido = urlMatch ? urlMatch[1] : data;
    
    setCodigo(codigoExtraido);
    validarVale(codigoExtraido);
  };

  const handleSubmitCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim()) {
      validarVale(codigo.trim());
    }
  };

  const handleSubmitCPF = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.trim()) {
      buscarPorCPF();
    }
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
              Validar Vale Presente
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Seletor de Método */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setMetodo('codigo')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                metodo === 'codigo'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Código Manual
            </button>
            <button
              onClick={() => setMetodo('cpf')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                metodo === 'cpf'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Buscar por CPF
            </button>
            <button
              onClick={() => setMetodo('qrcode')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                metodo === 'qrcode'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Escanear QR Code
            </button>
          </div>

          {/* Método: Código Manual */}
          {metodo === 'codigo' && (
            <form onSubmit={handleSubmitCodigo} className="space-y-4">
              <div>
                <label
                  htmlFor="codigo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Código do Vale
                </label>
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX-XXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-lg"
                  disabled={carregando}
                />
              </div>

              <button
                type="submit"
                disabled={carregando || !codigo.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Validando...' : 'Validar Vale'}
              </button>
            </form>
          )}

          {/* Método: CPF */}
          {metodo === 'cpf' && (
            <form onSubmit={handleSubmitCPF} className="space-y-4">
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CPF do Cliente
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/[^\d]/g, '');
                    const cpfFormatado = valor
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    setCpf(cpfFormatado);
                  }}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-lg"
                  disabled={carregando}
                />
              </div>

              <button
                type="submit"
                disabled={carregando || !cpf.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Buscando...' : 'Buscar Vale'}
              </button>
            </form>
          )}

          {/* Método: QR Code */}
          {metodo === 'qrcode' && (
            <QRScanner
              onScan={handleQRScan}
              onError={(error) => {
                setValidacao({
                  valido: false,
                  mensagem: error,
                });
              }}
            />
          )}

          {/* Resultado da Validação */}
          {validacao && (
            <div className="mt-8 pt-8 border-t">
              {validacao.valido ? (
                <div className="space-y-6">
                  {/* Vale Válido */}
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">✓</div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      Vale Válido!
                    </h3>
                    <p className="text-green-700">{validacao.mensagem}</p>
                  </div>

                  {/* Informações do Vale */}
                  {validacao.vale && (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">
                        Informações do Vale
                      </h4>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-bold text-2xl text-amber-700">
                            {formatarValor(validacao.vale.valor)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Para:</span>
                          <span className="font-semibold text-gray-800">
                            {validacao.vale.para}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Descrição:</span>
                          <span className="font-semibold text-gray-800">
                            {validacao.vale.descricao}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Validade:</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(
                              validacao.vale.validade
                            ).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Código:</span>
                          <span className="font-mono text-sm text-gray-800">
                            {validacao.vale.codigo_hash}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalAberto(true)}
                        disabled={processando}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                      >
                        ✓ Confirmar Uso do Vale
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-4">✗</div>
                  <h3 className="text-2xl font-bold text-red-800 mb-2">
                    Vale Inválido
                  </h3>
                  <p className="text-red-700">{validacao.mensagem}</p>
                  
                  {validacao.motivo === 'usado' && validacao.vale && (
                    <div className="mt-4 p-4 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">
                        Este vale já foi utilizado anteriormente
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={marcarComoUsado}
        title="Confirmar Uso do Vale"
        message={`Confirma o uso deste vale de ${validacao?.vale ? formatarValor(validacao.vale.valor) : ''} por ${validacao?.vale?.para || 'este cliente'}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, confirmar uso"
        cancelText="Cancelar"
        confirmColor="green"
        isLoading={processando}
      />

      {/* Toast de Notificação */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </div>
  );
}

export default function ValidarValePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <ValidarValeContent />
    </Suspense>
  );
}

