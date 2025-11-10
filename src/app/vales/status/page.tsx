"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type StatusVale = {
  valido: boolean;
  motivo?: "expirado" | "usado" | "nao_encontrado";
  mensagem: string;
  vale?: {
    codigo: string;
    valor: number;
    descricao: string;
    validade: string;
    para: string;
  };
};

export default function ValeStatusPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusVale | null>(null);
  const [carregando, setCarregando] = useState(true);
  const codigo = searchParams.get("code");

  useEffect(() => {
    if (!codigo) {
      setCarregando(false);
      return;
    }

    validarVale();
  }, [codigo]);

  const validarVale = async () => {
    try {
      const response = await fetch(`/api/vales/validar/${codigo}`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error(error);
      setStatus({
        valido: false,
        motivo: "nao_encontrado",
        mensagem: "Erro ao validar vale",
      });
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando vale presente...</p>
        </div>
      </div>
    );
  }

  if (!codigo || !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Código não informado
            </h1>
            <p className="text-gray-600">
              Nenhum código de vale foi fornecido para validação.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Ir para o site
          </Link>
        </div>
      </div>
    );
  }

  // Vale válido
  if (status.valido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Vale Válido!
            </h1>
            <p className="text-gray-600 text-lg mb-6">{status.mensagem}</p>

            {status.vale && (
              <div className="bg-green-50 rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-600 font-medium">Para:</span>
                  <span className="text-gray-900 font-semibold">
                    {status.vale.para}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-600 font-medium">Valor:</span>
                  <span className="text-green-600 font-bold text-xl">
                    R$ {status.vale.valor.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-600 font-medium">Serviço:</span>
                  <span className="text-gray-900">{status.vale.descricao}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Validade:</span>
                  <span className="text-gray-900">
                    {new Date(status.vale.validade).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500 bg-amber-50 p-4 rounded-lg">
              💡 Apresente este código na recepção do salão para utilizar seu
              vale presente!
            </p>
            <Link
              href="/"
              className="block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Ir para o site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vale inválido (expirado, usado, etc)
  const getIconeErro = () => {
    switch (status.motivo) {
      case "expirado":
        return "⏰";
      case "usado":
        return "✔️";
      case "nao_encontrado":
        return "❌";
      default:
        return "⚠️";
    }
  };

  const getTituloErro = () => {
    switch (status.motivo) {
      case "expirado":
        return "Vale Expirado";
      case "usado":
        return "Vale Já Utilizado";
      case "nao_encontrado":
        return "Vale Não Encontrado";
      default:
        return "Vale Inválido";
    }
  };

  const getCorFundo = () => {
    switch (status.motivo) {
      case "expirado":
        return "from-orange-50 via-white to-orange-50";
      case "usado":
        return "from-blue-50 via-white to-blue-50";
      default:
        return "from-red-50 via-white to-red-50";
    }
  };

  const getCorIcone = () => {
    switch (status.motivo) {
      case "expirado":
        return "bg-orange-100";
      case "usado":
        return "bg-blue-100";
      default:
        return "bg-red-100";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getCorFundo()} flex items-center justify-center p-4`}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div
            className={`w-20 h-20 ${getCorIcone()} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <span className="text-5xl">{getIconeErro()}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getTituloErro()}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{status.mensagem}</p>

          {status.motivo === "expirado" && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> Este vale presente atingiu a data
                de validade e não pode mais ser utilizado.
              </p>
            </div>
          )}

          {status.motivo === "usado" && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Atenção:</strong> Este vale presente já foi utilizado
                anteriormente e não pode ser usado novamente.
              </p>
            </div>
          )}

          {status.motivo === "nao_encontrado" && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Erro:</strong> O código informado não corresponde a
                nenhum vale presente cadastrado em nosso sistema.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Em caso de dúvidas, entre em contato conosco.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/5565998135353?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20meu%20vale%20presente."
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              💬 Falar no WhatsApp
            </a>
            <Link
              href="/"
              className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Ir para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
