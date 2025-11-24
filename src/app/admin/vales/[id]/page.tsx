"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Vale } from "@/types/vale";
import { formatarCPF, formatarValor } from "@/lib/vales";
import {
  gerarPDFVale,
  downloadPDF,
  gerarImagemWhatsApp,
  downloadImage,
} from "@/lib/pdf-generator";
import StatusBadge from "@/components/admin/StatusBadge";
import Modal from "@/components/Modal";
import { Toast } from "@/components/Toast";

export default function ValeDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [valeId, setValeId] = useState<string>("");
  const [vale, setVale] = useState<Vale | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setValeId(resolvedParams.id);
    };
    init();
  }, [params]);

  useEffect(() => {
    if (valeId) {
      carregarVale();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valeId]);

  const carregarVale = async () => {
    try {
      const response = await fetch(`/api/admin/vales/${valeId}`);

      if (!response.ok) {
        throw new Error("Vale não encontrado");
      }

      const data = await response.json();
      setVale(data.vale);
    } catch (error) {
      setErro("Erro ao carregar vale");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleValidarVale = async () => {
    setModalAberto(false);
    setProcessando(true);

    try {
      const response = await fetch(`/api/admin/vales/${valeId}/validar`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao validar vale");
      }

      setToast({
        show: true,
        message: "Vale marcado como usado com sucesso!",
        type: "success",
      });
      carregarVale();
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Erro ao validar vale",
        type: "error",
      });
    } finally {
      setProcessando(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!vale) return;

    setProcessando(true);
    try {
      const pdfBlob = await gerarPDFVale(vale);
      const nomeArquivo = `vale-presente-${vale.codigo_hash}.pdf`;
      downloadPDF(pdfBlob, nomeArquivo);
      setToast({
        show: true,
        message: "PDF gerado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Erro ao gerar PDF",
        type: "error",
      });
    } finally {
      setProcessando(false);
    }
  };

  const handleDownloadImagemWhatsApp = async () => {
    if (!vale) return;

    setProcessando(true);
    try {
      const imagemDataUrl = await gerarImagemWhatsApp(vale);
      const nomeArquivo = `vale-whatsapp-${vale.codigo_hash}.png`;
      downloadImage(imagemDataUrl, nomeArquivo);
      setToast({
        show: true,
        message: "Imagem gerada com sucesso!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      setToast({
        show: true,
        message: `Erro ao gerar imagem: ${error.message || "Tente novamente"}`,
        type: "error",
      });
    } finally {
      setProcessando(false);
    }
  };

  const handleCopiarLinkPublico = async () => {
    if (!vale) return;

    const linkPublico = `${window.location.origin}/vales/${vale.codigo_hash}`;

    try {
      await navigator.clipboard.writeText(linkPublico);
      setToast({
        show: true,
        message: "Link copiado para a área de transferência!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Erro ao copiar link",
        type: "error",
      });
    }
  };

  const handleCompartilharWhatsApp = async () => {
    if (!vale) return;

    const linkPublico = `${window.location.origin}/vales/${vale.codigo_hash}`;

    const mensagem =
      `*Vale Presente Escovato*\n\n` +
      `Olá ${vale.para}!\n\n` +
      `Você ganhou um vale presente de *${formatarValor(
        vale.valor
      )}* para usar no Escovato Salão de Beleza!\n\n` +
      `*Serviço:* ${vale.descricao}\n` +
      `*Validade:* ${new Date(vale.validade).toLocaleDateString("pt-BR")}\n\n` +
      `${vale.mensagem ? `_"${vale.mensagem}"_\n\n` : ""}` +
      `Veja seu vale aqui: ${linkPublico}\n\n` +
      `Agende já seu horário!\n` +
      `www.escovato.com.br`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (erro || !vale) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{erro}</h2>
          <Link
            href="/admin/vales"
            className="text-amber-600 hover:text-amber-700"
          >
            Voltar para listagem
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/vales"
              className="text-gray-600 hover:text-gray-800"
            >
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Detalhes do Vale Presente
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Principais */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {vale.nome_completo}
                  </h2>
                  <p className="text-gray-600">CPF: {formatarCPF(vale.cpf)}</p>
                </div>
                <StatusBadge vale={vale} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Valor
                  </label>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatarValor(vale.valor)}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Validade
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(vale.validade).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">De</label>
                  <p className="text-gray-800 font-medium">{vale.de}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Para
                  </label>
                  <p className="text-gray-800 font-medium">{vale.para}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <label className="text-sm text-gray-600 block mb-2">
                  Descrição do Serviço
                </label>
                <p className="text-gray-800">{vale.descricao}</p>
              </div>

              {vale.mensagem && (
                <div className="mt-4 pt-4 border-t">
                  <label className="text-sm text-gray-600 block mb-2">
                    Mensagem Personalizada
                  </label>
                  <p className="text-gray-800 italic">
                    &quot;{vale.mensagem}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Informações de Uso */}
            {vale.usado && vale.data_uso && (
              <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informações de Uso
                </h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">✓</span>
                  <span>
                    Vale utilizado em{" "}
                    {new Date(vale.data_uso).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Código e QR Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Código de Validação
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 mb-2">Código do Vale</p>
                <p className="text-2xl font-mono font-bold text-gray-800 select-all">
                  {vale.codigo_hash}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar de Ações */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Ações</h3>

              <div className="space-y-3">
                <Link
                  href={`/admin/vales/${valeId}/preview`}
                  className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
                >
                  👁️ Ver Preview e Exportar
                </Link>

                <button
                  onClick={handleCopiarLinkPublico}
                  className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
                >
                  🔗 Copiar Link Público
                </button>

                <button
                  onClick={handleCompartilharWhatsApp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  💬 Compartilhar WhatsApp
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={processando}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                >
                  📄 Download PDF (Antigo)
                </button>

                <button
                  onClick={handleDownloadImagemWhatsApp}
                  disabled={processando}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  📱 Download Imagem (Antigo)
                </button>

                {!vale.usado && (
                  <button
                    onClick={() => setModalAberto(true)}
                    disabled={processando}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    ✓ Marcar como Usado
                  </button>
                )}
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                Informações do Sistema
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="font-mono break-all">{vale.id}</p>
                </div>
                <div>
                  <span className="font-medium">Criado em:</span>
                  <p>
                    {new Date(vale.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleValidarVale}
        title="Marcar Vale como Usado"
        message="Tem certeza que deseja marcar este vale como usado? Esta ação não pode ser desfeita."
        confirmText="Sim, marcar como usado"
        cancelText="Cancelar"
        confirmColor="blue"
        isLoading={processando}
      />

      {/* Toast de Notificação */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          duration={3000}
        />
      )}
    </div>
  );
}
