"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const result = await signIn("credentials", {
        email,
        password: senha,
        redirect: false,
      });

      if (result?.error) {
        setErro("Email ou senha inválidos");
        setCarregando(false);
      } else {
        // Login bem-sucedido - força refresh da página para atualizar sessão
        window.location.href = "/admin";
      }
    } catch {
      setErro("Erro ao fazer login. Tente novamente.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="Escovato"
              width={180}
              height={60}
              priority
            />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Área Administrativa
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sistema de Gerenciamento Escovato
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-gray-900"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-gray-900"
                placeholder="••••••••"
              />
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2025 Escovato - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
