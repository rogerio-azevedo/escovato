import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Serviços | Escovato Salão de Beleza",
  description:
    "Confira todos os nossos serviços: sobrancelhas, lashes, unhas, escova, coloração e muito mais!",
  openGraph: {
    title: "Catálogo de Serviços | Escovato Salão de Beleza",
    description:
      "Confira todos os nossos serviços: sobrancelhas, lashes, unhas, escova, coloração e muito mais!",
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

