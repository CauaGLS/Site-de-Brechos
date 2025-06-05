import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ao Desapego",
  description: "A maior feira de brechós de Brasília",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-lt-installed="true" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-svh flex-col overflow-hidden antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}