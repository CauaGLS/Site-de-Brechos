"use client";

import { BrechoService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface QRCodeDisplayProps {
  ingressoId: string;
}

export function QRCodeDisplay({ ingressoId }: { ingressoId: string }) {
  const { data: qrCode, isLoading, error } = useQuery({
    queryKey: ['qrcode', ingressoId],
    queryFn: async () => {
      const response = await BrechoService.appApiGerarQrcode({
        ingressoId: ingressoId
      });
      return response;
    },
    retry: 2
  });

  if (isLoading) return <div>Gerando QR Code...</div>;
  if (error) return <div>Erro ao gerar QR Code</div>;

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Seu Ingresso</h2>
      <img 
        src={qrCode} 
        alt="QR Code do ingresso" 
        className="mx-auto w-64 h-64 border rounded-lg"
      />
      <p className="mt-4 text-sm text-gray-600">
        Apresente este QR Code na entrada do evento
      </p>
    </div>
  );
}