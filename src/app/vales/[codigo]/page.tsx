"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import QRCode from "qrcode";
import type { Vale } from "@/types/vale";
import ValePresente from "@/components/vales/ValePresente";

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
