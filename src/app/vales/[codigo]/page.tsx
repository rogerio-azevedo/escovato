"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import type { Vale } from "@/types/vale";
import { formatarValor } from "@/lib/vales";
import React from "react";

export default function ValePublicoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const [codigo, setCodigo] = useState<string>("");
  const [vale, setVale] = useState<Vale | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const valeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setCodigo(resolvedParams.codigo);
    };
    init();
  }, [params]);

  const carregarVale = useCallback(async () => {
    try {
      const response = await fetch(`/api/vales/${codigo}`);
      if (!response.ok) throw new Error("Vale não encontrado");
      const data = await response.json();
      setVale(data.vale);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }, [codigo]);

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
    if (codigo) {
      carregarVale();
    }
  }, [codigo, carregarVale]);

  useEffect(() => {
    if (vale) {
      gerarQRCode();
    }
  }, [vale, gerarQRCode]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#903a19] mx-auto mb-4"></div>
          <p>Carregando seu vale...</p>
        </div>
      </div>
    );
  }

  if (!vale) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Vale não encontrado
          </h1>
          <p className="text-gray-600">
            O código informado não corresponde a nenhum vale.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-3">
      <div className="flex justify-center px-4">
        <div className="max-w-md w-full">
          <ValePresente vale={vale} qrCodeUrl={qrCodeUrl} ref={valeRef} />
        </div>
      </div>
    </div>
  );
}

// Vale Presente - Componente Público (sem botões de admin)
const ValePresente = React.forwardRef<
  HTMLDivElement,
  { vale: Vale; qrCodeUrl: string }
>(({ vale, qrCodeUrl }, ref) => (
  <div
    ref={ref}
    className="relative shadow-2xl overflow-hidden w-full mx-auto"
    style={{ maxWidth: "430px", aspectRatio: "9/16" }}
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
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(144, 58, 25, 0.4), rgba(144, 58, 25, 0.3), rgba(144, 58, 25, 0.25))",
        }}
      />
    </div>

    {/* Laço no canto superior esquerdo */}
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
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#903a19] py-2 z-20"
        style={{ backgroundColor: "rgba(144, 58, 25, 0.95)" }}
      >
        <p className="text-center text-base font-semibold text-[#fcf3e6]">
          www.escovato.com.br
        </p>
      </div>
    </div>
  </div>
));
ValePresente.displayName = "ValePresente";
