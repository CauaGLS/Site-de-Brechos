"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

type Expositor = {
  id: number;
  nome: string;
  descricao?: string | null;
  rede_social?: string | null;
};

interface ExpositorCardProps {
  expositor: Expositor;
}

export const ExpositorCard: FC<ExpositorCardProps> = ({ expositor }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/expositor/${expositor.id}`);
  };

  return (
    <div
    onClick={handleClick}
    className="relative z-10 cursor-pointer rounded-xl border p-4 shadow hover:bg-muted/30 transition-colors"
    >
      <h2 className="text-lg font-semibold">{expositor.nome}</h2>
      {expositor.descricao && (
        <p className="text-sm text-muted-foreground mt-1">
          {expositor.descricao}
        </p>
      )}
      {expositor.rede_social && (
        <a
          href={expositor.rede_social}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline mt-2 inline-block"
          onClick={(e) => e.stopPropagation()} // evita redirecionamento duplo
        >
          Ver rede social
        </a>
      )}
    </div>
  );
};
