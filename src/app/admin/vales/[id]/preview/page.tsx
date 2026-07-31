"use client";

import { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
import QRCode from "qrcode";
import type { Vale } from "@/types/vale";
import { Toast } from "@/components/Toast";
import ValePresente from "@/components/vales/ValePresente";

export default function ValePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [valeId, setValeId] = useState<string>("");
  const [vale, setVale] = useState<Vale | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const valeRef = useRef<HTMLDivElement>(null);
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

  const carregarVale = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/vales/${valeId}`);
      if (!response.ok) throw new Error("Vale não encontrado");
      const data = await response.json();
      setVale(data.vale);
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Erro ao carregar vale",
        type: "error",
      });
    } finally {
      setCarregando(false);
    }
  }, [valeId]);

  const gerarQRCode = useCallback(async () => {
    if (!vale) return;
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://escovato.com.br"
    }/vales/status?code=${vale.codigo_hash}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 1,
    });
    setQrCodeUrl(qrDataUrl);
  }, [vale]);

  useEffect(() => {
    if (valeId) {
      carregarVale();
    }
  }, [valeId, carregarVale]);

  useEffect(() => {
    if (vale) {
      gerarQRCode();
    }
  }, [vale, gerarQRCode]);

  // const handleDownloadImagem = async () => {
  //   if (!valeRef.current) return;

  //   const canvas = await html2canvas(valeRef.current, {
  //     scale: 2,
  //     backgroundColor: null,
  //     logging: false,
  //   });

  //   const link = document.createElement("a");
  //   link.download = `vale-presente-${vale?.codigo_hash}.png`;
  //   link.href = canvas.toDataURL();
  //   link.click();
  // };

  // const handleDownloadPDF = async () => {
  //   if (!valeRef.current) return;

  //   const canvas = await html2canvas(valeRef.current, {
  //     scale: 2,
  //     backgroundColor: "#ffffff",
  //     logging: false,
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   // Formato mobile portrait
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //   });

  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`vale-presente-${vale?.codigo_hash}.pdf`);
  // };

  if (carregando || !vale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-3">
      {/* Controles */}
      {/* <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <Link
            href={`/admin/vales/${valeId}`}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Voltar
          </Link>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadImagem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              💾 Baixar PNG
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              📄 Baixar PDF
            </button>
          </div>
        </div>
      </div> */}

      {/* Preview do Vale */}
      <div className="flex justify-center px-4">
        <div className="max-w-md w-full">
          <ValePresente
            vale={vale}
            qrCodeUrl={qrCodeUrl}
            maxWidth="1080px"
            ref={valeRef}
          />
        </div>
      </div>

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
