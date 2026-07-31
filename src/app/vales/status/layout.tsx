import type { Metadata } from "next";
import { Suspense } from "react";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://escovato.com.br";
}

const baseUrl = getBaseUrl();
const ogImageUrl = `${baseUrl}/og-vale-presente-image.png`;
const ogUrl = `${baseUrl}/vales/status`;

export const metadata: Metadata = {
  title: "Vale Presente | Escovato Salão de Beleza",
  description:
    "Valide seu vale presente Escovato. Apresente o código na recepção do salão para utilizar seu momento de beleza.",
  openGraph: {
    title: "Vale Presente | Escovato Salão de Beleza",
    description:
      "Valide seu vale presente Escovato. Apresente o código na recepção do salão para utilizar seu momento de beleza.",
    url: ogUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Escovato - Vale Presente",
      },
    ],
    type: "website",
    locale: "pt_BR",
    siteName: "Escovato Salão de Beleza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vale Presente | Escovato Salão de Beleza",
    description:
      "Valide seu vale presente Escovato. Apresente o código na recepção do salão para utilizar seu momento de beleza.",
    images: [ogImageUrl],
  },
};

export default function ValeStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>;
}
