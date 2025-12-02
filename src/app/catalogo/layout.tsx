import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Serviços | Escovato Salão de Beleza",
  description:
    "Confira todos os nossos serviços: mechas, coloração, sobrancelhas, lashes, unhas, escova, depilação e muito mais!",
  openGraph: {
    title: "Catálogo de Serviços | Escovato Salão de Beleza",
    description:
      "Confira todos os nossos serviços: mechas, coloração, sobrancelhas, lashes, unhas, escova, depilação e muito mais!",
    images: [
      {
        url: "/og-catalogo-image.png",
        width: 1200,
        height: 630,
        alt: "Escovato - Catálogo Digital de Serviços",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Serviços | Escovato Salão de Beleza",
    description:
      "Confira todos os nossos serviços: sobrancelhas, lashes, unhas, escova, coloração e muito mais!",
    images: ["/og-catalogo-image.png"],
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
