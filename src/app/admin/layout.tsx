'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SessionProvider from '@/components/SessionProvider';
import { ToastContainer } from '@/components/Toast';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se definitivamente não autenticado e não está carregando
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      // Pequeno delay para evitar conflito com redirect do NextAuth
      const timer = setTimeout(() => {
        router.push('/admin/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status, pathname, router]);

  // Se não estiver logado e não estiver na página de login, não renderizar nada
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Redirecionando para login...</p>
      </div>
    );
  }

  // Se estiver na página de login, renderizar sem menu
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { href: '/admin/rodizio', label: '🔄 Rodízio', roles: ['admin', 'recepcionista'] },
    { href: '/admin/profissionais', label: '👤 Profissionais', roles: ['admin'] },
    { href: '/admin/especialidades', label: '⭐ Especialidades', roles: ['admin'] },
    { href: '/admin/usuarios', label: '👥 Usuários', roles: ['admin'] },
    { href: '/admin/vales', label: '🎁 Vales', roles: ['admin', 'recepcionista'] },
  ];

  const userRole = session?.user?.role || 'recepcionista';
  const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Menu */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Escovato Admin</h1>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {filteredMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  pathname.startsWith(item.href)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main>{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastContainer />
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

