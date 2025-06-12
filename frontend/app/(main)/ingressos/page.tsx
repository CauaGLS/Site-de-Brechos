"use client";

import { CriarIngresso } from "@/components/create-ingresso";
import { ValidarIngresso } from "@/components/validar-ingresso";

export default function IngressosPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Ingressos para a Feira de Brechós</h1>
          <p className="text-muted-foreground">
            Preencha seus dados para gerar seu ingresso
          </p>
        </div>

        <CriarIngresso />

        <div className="mt-12">
          <ValidarIngresso />
        </div>
      </div>
    </div>
  );
}