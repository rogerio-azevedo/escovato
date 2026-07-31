"use client";

import React from "react";
import Image from "next/image";
import type { Vale } from "@/types/vale";
import { formatarValor } from "@/lib/vales";

type ValePresenteProps = {
  vale: Vale;
  qrCodeUrl: string;
  maxWidth?: string;
};

const ValePresente = React.forwardRef<HTMLDivElement, ValePresenteProps>(
  ({ vale, qrCodeUrl, maxWidth = "430px" }, ref) => (
    <div
      ref={ref}
      className="relative shadow-2xl overflow-hidden w-full mx-auto"
      style={{ maxWidth, aspectRatio: "9/16" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/vales/modelo.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#903a19]/40 via-[#903a19]/30 to-[#903a19]/25" />
      </div>

      <div className="absolute top-0 left-0 w-[100%] h-[40%]">
        <Image
          src="/images/vales/laco.png"
          alt="Laço"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative h-full flex flex-col z-10">
        <div className="relative z-30 pt-[10%] px-6 pb-14">
          <div className="border-[2px] border-[#af7751] rounded-lg p-4 shadow-lg">
            <div className="text-center mb-3">
              <h1
                className="text-6xl text-[#fcf3e6] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "var(--font-parisienne)" }}
              >
                Vale
              </h1>
              <h2 className="text-3xl -mt-2 font-bold text-[#fcf3e6] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                PRESENTE
              </h2>
            </div>

            <p className="text-center text-sm text-[#fcf3e6] mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Você ganhou um momento de beleza
            </p>
            <p className="text-center text-sm mb-3">
              <span className="text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                no salão{" "}
              </span>
              <span className="font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Escovato.
              </span>
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
                <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  De:
                </span>
                <span className="text-sm text-[#fcf3e6] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {vale.de.substring(0, 25)}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
                <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Para:
                </span>
                <span className="text-sm text-[#fcf3e6] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {vale.para}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
                <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Valor:
                </span>
                <span className="text-lg text-[#fcf3e6] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {formatarValor(vale.valor)}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-[#af7751] pb-1">
                <span className="text-sm font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Validade:
                </span>
                <span className="text-sm text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {new Date(vale.validade).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-md font-bold text-[#fcf3e6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {vale.descricao}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {qrCodeUrl && (
              <Image src={qrCodeUrl} alt="QR Code" width={120} height={120} />
            )}
          </div>
          <div className="text-center mt-2">
            <p className="text-[12px] text-[#fcf3e6] font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {vale.codigo_hash}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#903a19]/95 py-2 z-20 backdrop-blur-sm">
          <p className="text-center text-base font-semibold text-[#fcf3e6]">
            www.escovato.com.br
          </p>
        </div>
      </div>
    </div>
  )
);

ValePresente.displayName = "ValePresente";

export default ValePresente;
