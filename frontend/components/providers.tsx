"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { toast } from "sonner";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
          mutations: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              let msg: string = error?.body?.message || error.message;
              if (!msg) return toast.error("Erro", { position: "top-center" });
  
              if (msg.includes("status code 403")) {
                msg = "Você não tem permissão para fazer esta ação";
              } else if (msg.includes("status code 401")) {
                msg = "Você precisa estar logado para fazer esta ação";
              } else if (msg.includes("status code 500")) {
                msg = "Erro interno";
              }
              toast.error("Erro", { description: msg, position: "top-center" });
            },
          },
        },
      })
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SidebarProvider>
      <ReactQueryDevtools initialIsOpen={false} position="right" />
    </QueryClientProvider>
  );
}