"use client";

import { BrechoService, PecaSchema } from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Adicionado useQueryClient
import { useRouter, useParams } from "next/navigation";
import { CriarPeca } from "@/components/create-peca";
import { CriarExpositor } from "@/components/create-expositores";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { PecaCard } from "@/components/peca-card";

export default function ExpositorPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient(); // Adicionado
  
  const [expositorId, setExpositorId] = useState<number>(0);

  useEffect(() => {
    if (params?.id) {
      setExpositorId(Number(params.id));
    }
  }, [params]);

  const { data: expositor } = useQuery({
    queryKey: ["expositor", expositorId],
    queryFn: () => BrechoService.appApiObterExpositor({ expositorId }),
    enabled: expositorId > 0
  });

  const { data: pecas } = useQuery({
    queryKey: ["pecas", expositorId],
    queryFn: () => BrechoService.appApiListarPecas({ expositorId }),
    enabled: expositorId > 0
  });

  if (!expositorId) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar className="fixed left-0 top-0 z-10 h-screen w-64 border-r" />

      <div className="ml-64 flex w-[calc(100%-16rem)] flex-col p-6">
        <header className="flex h-16 items-center gap-4 border-b px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto">
            <CriarPeca expositorId={expositorId.toString()} />
          </div>
        </header>

        <main className="flex-1 mt-4 overflow-auto">
          {/* Banner do expositor */}
          <div className="mb-8 rounded-lg border p-6 shadow-sm relative">
            <h1 className="text-2xl font-bold">{expositor?.nome}</h1>
            {expositor?.descricao && (
              <p className="mt-2 text-muted-foreground">{expositor.descricao}</p>
            )}
            {expositor?.rede_social && (
              <a
                href={expositor.rede_social}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 underline"
              >
                Visitar rede social
              </a>
            )}
            
            {/* Botões de editar/excluir */}
            {expositor && (
              <CriarExpositor
                expositorExistente={{
                  id: expositor.id,
                  nome: expositor.nome,
                  descricao: expositor.descricao || undefined,
                  rede_social: expositor.rede_social || undefined,
                }}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["expositor", expositorId] });
                }}
                onDelete={() => {
                  router.push("/");
                }}
              />
            )}
          </div>

          {/* Listagem de peças */}
          <h2 className="mb-4 text-xl font-semibold">Peças disponíveis</h2>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {pecas?.map((peca: PecaSchema) => (
              <PecaCard 
                key={peca.id} 
                peca={peca}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}