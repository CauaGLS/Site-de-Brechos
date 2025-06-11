"use client";

import { BrechoService } from "@/services"; // SDK do HeyAPI
import { useQuery } from "@tanstack/react-query";
import { CriarExpositor } from "@/components/create-expositores";
import { ExpositorCard } from "@/components/expositor-card";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { data: expositores } = useQuery({
    queryKey: ["expositor"],
    queryFn: BrechoService.appApiListarExpositores,
  });

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar fixa à esquerda com z-index garantido */}
      <AppSidebar className="fixed left-0 top-0 z-10 h-screen w-64 border-r" />

      {/* Conteúdo principal com margem para a sidebar */}
      <div className="ml-64 flex w-[calc(100%-16rem)] flex-col p-6">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="ml-auto">
            <CriarExpositor />
          </div>
        </header>

        <main className="flex-1 mt-4 overflow-auto">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {expositores?.map((expositor) => (
              <ExpositorCard key={expositor.id} expositor={expositor} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
