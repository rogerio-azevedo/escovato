"use client";

import { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
import Image from "next/image";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { Vale } from "@/types/vale";
import { formatarValor } from "@/lib/vales";
import { Toast } from "@/components/Toast";

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
          <ValePresente vale={vale} qrCodeUrl={qrCodeUrl} ref={valeRef} />
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

// Vale Presente - Layout Único (Mobile-friendly - Portrait)
const ValePresente = React.forwardRef<
  HTMLDivElement,
  { vale: Vale; qrCodeUrl: string }
>(({ vale, qrCodeUrl }, ref) => (
  <div
    ref={ref}
    className="relative shadow-2xl overflow-hidden w-full"
    style={{ maxWidth: "1080px", aspectRatio: "9/16" }}
  >
    {/* Background com imagem da modelo */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/vales/modelo.png"
        alt="Background"
        fill
        className="object-cover"
      />
      {/* Overlay com cor primary para melhorar legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#903a19]/40 via-[#903a19]/30 to-[#903a19]/25" />
    </div>

    {/* Sem barras - apenas a modelo de fundo */}

    {/* Laço no canto superior esquerdo - MENOR */}
    <div className="absolute top-0 left-0 w-[100%] h-[40%]">
      <Image
        src="/images/vales/laco.png"
        alt="Laço"
        fill
        className="object-contain"
      />
    </div>

    {/* Container principal */}
    <div className="relative h-full flex flex-col z-10">
      {/* Área de conteúdo superior */}
      <div className="relative z-30 pt-[10%] px-6 pb-14">
        {/* Borda decorativa */}
        <div className="border-[2px] border-[#af7751] rounded-lg p-4 shadow-lg">
          {/* Título */}
          <div className="text-center mb-3">
            <h1
              className="text-6xl text-[#fcf3e6] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "var(--font-parisienne)" }}
            >
              Vale
            </h1>
            <h2 className="text-3xl -mt-2 font-bold text-[#fcf3e6] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              PRESENTE
            </h2>
          </div>

          {/* Subtítulo */}
          <p className="text-center text-sm text-[#fcf3e6] mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Você ganhou um momento de beleza
          </p>
          <p className="text-center text-sm mb-3">
            <span className="text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              no salão{" "}
            </span>
            <span className="font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Escovato.
            </span>
          </p>

          {/* Informações */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
              <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                De:
              </span>
              <span className="text-sm text-[#fcf3e6] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {vale.de.substring(0, 25)}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
              <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Para:
              </span>
              <span className="text-sm text-[#fcf3e6] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {vale.para}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
              <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Valor:
              </span>
              <span className="text-lg text-[#fcf3e6] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {formatarValor(vale.valor)}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
              <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Validade:
              </span>
              <span className="text-sm text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {new Date(vale.validade).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-3 text-center">
            <p className="text-md font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {vale.descricao}
            </p>
          </div>

          {/* QR Code centralizado */}
          <div className="flex justify-center mt-3">
            {qrCodeUrl && (
              <Image src={qrCodeUrl} alt="QR Code" width={130} height={130} />
            )}
          </div>
          <div className="text-center mt-1">
            <p className="text-[12px] text-[#fcf3e6] font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {vale.codigo_hash}
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#903a19]/95 py-2 z-20 backdrop-blur-sm">
        <p className="text-center text-base font-semibold text-[#fcf3e6]">
          www.escovato.com.br
        </p>
      </div>
    </div>
  </div>
));
ValePresente.displayName = "ValePresente";

// Necessário para forwardRef
import React from "react";
