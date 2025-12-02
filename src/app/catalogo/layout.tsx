import type { Metadata } from "next";

// Função para obter a URL base (absoluta)
function getBaseUrl(): string {
  // Em produção, usar a variável de ambiente ou fallback
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback para produção na Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback padrão (funciona com e sem www)
  return "https://escovato.com.br";
}

const baseUrl = getBaseUrl();
const ogImageUrl = `${baseUrl}/og-catalogo-image.png`;
const ogUrl = `${baseUrl}/catalogo`;

export const metadata: Metadata = {
  title: "Catálogo de Serviços | Escovato Salão de Beleza",
  description:
    "Confira todos os nossos serviços: mechas, coloração, sobrancelhas, lashes, unhas, escova, depilação e muito mais!",
  openGraph: {
    title: "Catálogo de Serviços | Escovato Salão de Beleza",
    description:
      "Confira todos os nossos serviços: mechas, coloração, sobrancelhas, lashes, unhas, escova, depilação e muito mais!",
    url: ogUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Escovato - Catálogo Digital de Serviços",
      },
    ],
    type: "website",
    locale: "pt_BR",
    siteName: "Escovato Salão de Beleza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Serviços | Escovato Salão de Beleza",
    description:
      "Confira todos os nossos serviços: mechas, coloração, sobrancelhas, lashes, unhas, escova, depilação e muito mais!",
    images: [ogImageUrl],
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
