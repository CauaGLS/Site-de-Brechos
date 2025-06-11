"use client";

import { FC, useState } from "react";
import { CheckCircle2, Circle, Loader2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrechoService, PecaSchema } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CriarPeca } from "./create-peca";
import { Peca } from "@/types/pecas";



interface PecaCardProps {
  peca: PecaSchema;
}

export const PecaCard: FC<PecaCardProps> = ({ peca }) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
   const pecaConvertida: Peca = {
    id: peca.id,
    nome: peca.nome,
    preco: peca.preco,
    descricao: peca.descricao || undefined,
    reservada: peca.reservada ?? false, // Garante boolean
    //@ts-ignore
    expositor_id: peca.expositor_id ?? Number(peca.expositor?.id), 
    // Adicione outros campos se necessário
  };

 const toggleReserva = useMutation({
    mutationFn: () => 
      BrechoService.appApiAtualizarPeca({
        pecaId: pecaConvertida.id,
        requestBody: {
          reservada: !pecaConvertida.reservada,
          nome: pecaConvertida.nome,
          preco: pecaConvertida.preco,
          descricao: pecaConvertida.descricao || "",
          expositor_id: pecaConvertida.expositor_id
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas", peca.expositor_id] });
    },
  });

  const deletePeca = useMutation({
    mutationFn: () =>
      BrechoService.appApiDeletarPeca({
        pecaId: peca.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas", peca.expositor_id] });
    },
  });

  const handleCardClick = () => {
    setEditMode(true);
  };

  return (
    <>
      <div 
        className="rounded-xl border p-4 shadow hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{peca.nome}</h3>
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-muted-foreground" />
            {peca.reservada ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Reservada
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <Circle className="h-3 w-3" />
                Disponível
              </Badge>
            )}
          </div>
        </div>

        <p className="mt-2 text-lg font-bold text-primary">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(peca.preco)}
        </p>

        {peca.descricao && (
          <p className="mt-2 text-sm text-muted-foreground">{peca.descricao}</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleReserva.mutate();
            }}
            disabled={toggleReserva.isPending || deletePeca.isPending}
          >
            {toggleReserva.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : peca.reservada ? (
              "Cancelar Reserva"
            ) : (
              "Reservar"
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deletePeca.mutate();
            }}
            disabled={toggleReserva.isPending || deletePeca.isPending}
          >
            {deletePeca.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Remover"
            )}
          </Button>
        </div>
      </div>

      {/* Modal de edição */}
      {editMode && (
        <CriarPeca 
          expositorId={pecaConvertida.expositor_id.toString()}
          pecaExistente={pecaConvertida}
          onClose={() => setEditMode(false)}
        />
      )}
    </>
  );
};