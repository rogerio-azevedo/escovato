import SessionProvider from '@/components/SessionProvider';

export default function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

