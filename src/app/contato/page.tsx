"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContatoPage() {
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Configurações do estabelecimento
  const config = {
    nome: "Escovato - Salão de Beleza",
    telefone: "+5565998135353",
    email: "contato@escovato.com.br",
    instagram: "escovato.oficial",
    facebookUrl: "https://web.facebook.com/profile.php?id=61581144957772",
    googleMapsUrl: "https://maps.google.com/?q=Escovato+Salão",
    googleReviewUrl: "https://g.page/r/CV7oSqbrRMHcEAI/review", // Substitua pela URL real do Google Reviews
    pixKey: "contato@escovato.com.br", // Substitua pela chave PIX real
    catalogoUrl: "/servicos", // ou link externo
    wifi: {
      ssid: "Escovato_5G",
      password: "escovato2025",
    },
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(config.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar PIX:", err);
    }
  };

  const handleCopyWifi = async () => {
    try {
      await navigator.clipboard.writeText(config.wifi.password);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar senha WiFi:", err);
    }
  };

  const handleSaveContact = () => {
    // Gera vCard
    const vcard = `BEGIN:VCARD
    VERSION:3.0
    FN:${config.nome}
    TEL;TYPE=WORK,VOICE:${config.telefone}
    EMAIL:${config.email}
    URL:https://instagram.com/${config.instagram}
    END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "escovato-contato.vcf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#903A19] to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Header com Logo */}
        <div className="bg-primary text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#561A07]/30 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-48 mx-auto mb-4">
              <Image
                src="/logo-white.svg"
                alt="Escovato Logo"
                width={192}
                height={96}
                className="w-full h-auto"
              />
            </div>
            <p className="text-white/90 text-sm">Salão de Beleza Premium</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* WiFi Section */}
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
                <h3 className="font-bold text-lg text-gray-900">WiFi Grátis</h3>
              </div>
              <button
                onClick={handleCopyWifi}
                className="text-xs font-bold bg-primary/15 text-primary px-3 py-1.5 rounded-full hover:bg-primary/25 transition-colors"
              >
                {copiedWifi ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-gray-900 font-medium">
                <span className="font-bold">Rede:</span> {config.wifi.ssid}
              </p>
              <p className="text-gray-900 font-medium">
                <span className="font-bold">Senha:</span> {config.wifi.password}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${config.telefone.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366] text-white rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-semibold text-base">WhatsApp</p>
                <p className="text-xs text-white/95 font-medium">
                  Fale conosco
                </p>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* Salvar Contato */}
            <button
              onClick={handleSaveContact}
              className="w-full flex items-center gap-4 bg-primary text-white rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-semibold text-base">Salvar Contato</p>
                <p className="text-xs text-white/95 font-medium">
                  Adicionar à agenda
                </p>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Instagram */}
            <a
              href={`https://instagram.com/${config.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-semibold text-base">Instagram</p>
                <p className="text-xs text-white/95 font-medium">
                  @{config.instagram}
                </p>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={config.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#1877F2] text-white rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-semibold text-base">Facebook</p>
                <p className="text-xs text-white/95 font-medium">
                  Curta nossa página
                </p>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* Google Reviews */}
            <a
              href={config.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border-2 border-gray-200 text-foreground rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6 text-[#4285F4]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-bold text-base text-gray-900">
                  Avalie no Google
                </p>
                <p className="text-xs text-gray-700 font-semibold">
                  Deixe sua opinião
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* PIX */}
            <div className="bg-[#00A868] text-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.3 21h3.9c.3 0 .5-.1.7-.3l5.8-5.8c.4-.4 1-.4 1.4 0l.9.9c.4.4 1 .4 1.4 0l2.8-2.8c.4-.4.4-1 0-1.4l-.9-.9c-.4-.4-.4-1 0-1.4l5.8-5.8c.2-.2.3-.4.3-.7V3c0-.6-.4-1-1-1h-3.9c-.3 0-.5.1-.7.3L15 8.1c-.4.4-1 .4-1.4 0l-.9-.9c-.4-.4-1-.4-1.4 0L8.5 10c-.4.4-.4 1 0 1.4l.9.9c.4.4.4 1 0 1.4l-5.8 5.8c-.2.2-.3.4-.3.7v3.9c0 .5.4.9 1 .9z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-base">Chave PIX</p>
                  <p className="text-xs text-white/95 font-medium break-all">
                    {config.pixKey}
                  </p>
                </div>
                <button
                  onClick={handleCopyPix}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  {copiedPix ? "✓ Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Catálogo */}
            <a
              href={config.catalogoUrl}
              className="flex items-center gap-4 bg-secondary text-white rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-semibold text-base">Catálogo</p>
                <p className="text-xs text-white/95 font-medium">
                  Serviços e produtos
                </p>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* Localização */}
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border-2 border-gray-200 text-foreground rounded-2xl p-4 hover:shadow-lg transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="flex-1 text-left">
                <p className="font-bold text-base text-gray-900">Como Chegar</p>
                <p className="text-xs text-gray-700 font-semibold">
                  Ver no Google Maps
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 text-center">
          <p className="text-xs text-foreground/60 font-medium">
            Escaneie novamente para acessar estas informações
          </p>
        </div>
      </div>
    </div>
  );
}
