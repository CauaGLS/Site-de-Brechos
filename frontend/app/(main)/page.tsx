"use client";

import { BrechoService } from "@/services"; // SDK do HeyAPI
import { useQuery } from "@tanstack/react-query";
import { CriarExpositor } from "@/components/create-expositores";
import { ExpositorCard } from "@/components/expositor-card"; // Novo componente de card

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Home() {
  const { data: expositores } = useQuery({
    queryKey: ["expositor"],
    queryFn: BrechoService.appApiListarExpositores,
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto">
          <CriarExpositor />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {expositores?.map((expositor) => (
            <ExpositorCard key={expositor.id} expositor={expositor} />
          ))}
        </div>
      </div>
    </>
  );
}
