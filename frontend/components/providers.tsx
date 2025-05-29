"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}