"use client";

import { BrechoService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { CriarExpositor } from "@/components/create-expositores";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Home() {
  const { data: expositores } = useQuery({
    queryKey: ["expositores"],
    queryFn: BrechoService.appApiListarExpositores,
  });

  return (
      <SidebarInset>
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
              <div
                key={expositor.id}
                className="bg-muted/50 rounded-xl p-4 aspect-video"
              >
                <h2 className="text-lg font-semibold">{expositor.nome}</h2>
                {expositor.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {expositor.descricao}
                  </p>
                )}
                {expositor.rede_social && (
                  <a
                    href={expositor.rede_social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    Ver link
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
  );
}
