// create-expositores.tsx
"use client";

import { BrechoService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusIcon, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";

// Definindo o schema com tipos explícitos
const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string(),
  rede_social: z.string(),
});

// Tipo inferido do schema
type FormValues = {
  nome: string;
  descricao: string;
  rede_social: string;
};

interface CriarExpositorProps {
  expositorExistente?: {
    id?: number;
    nome: string;
    descricao?: string;
    rede_social?: string;
  };
  onSuccess?: () => void;
  onDelete?: () => void;
}

export function CriarExpositor({ 
  expositorExistente, 
  onSuccess, 
  onDelete 
}: CriarExpositorProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Definindo o tipo explicitamente para useForm
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      rede_social: "",
    },
  });

  useEffect(() => {
    if (expositorExistente) {
      form.reset({
        nome: expositorExistente.nome,
        descricao: expositorExistente.descricao || "",
        rede_social: expositorExistente.rede_social || "",
      });
    }
  }, [expositorExistente, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => 
      BrechoService.appApiCriarExpositor({ 
        requestBody: {
          nome: data.nome,
          descricao: data.descricao,
          rede_social: data.rede_social
        } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expositores"] });
      setOpen(false);
      onSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!expositorExistente?.id) throw new Error("ID do expositor é necessário");
      return BrechoService.appApiAtualizarExpositor({
        expositorId: expositorExistente.id,
        requestBody: {
          nome: data.nome,
          descricao: data.descricao,
          rede_social: data.rede_social
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expositores"] });
      queryClient.invalidateQueries({ queryKey: ["expositor", expositorExistente?.id] });
      setOpen(false);
      onSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!expositorExistente?.id) throw new Error("ID do expositor é necessário");
      return BrechoService.appApiDeletarExpositor({
        expositorId: expositorExistente.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expositores"] });
      onDelete?.();
    },
  });

 const onSubmit = async (data: FormValues) => {
    try {
      if (expositorExistente?.id) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      alert("Você não tem permissão para esta ação");
    }
  };
  

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {expositorExistente ? (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                try {
                  if (confirm("Tem certeza que deseja excluir este expositor?")) {
                    deleteMutation.mutate();
                } 
              }
              catch (error) {
                alert("Você não tem permissão para esta ação");
              }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button>
            <PlusIcon className="size-4" strokeWidth={2.5} /> Expositor
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expositorExistente ? "Editar Expositor" : "Criar Expositor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do expositor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rede_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rede Social</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              {expositorExistente && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir este expositor?")) {
                      deleteMutation.mutate();
                    }
                  }}
                  disabled={isPending || deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Excluir"
                  )}
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}