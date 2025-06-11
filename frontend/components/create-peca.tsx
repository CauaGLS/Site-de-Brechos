"use client";

import { BrechoService } from "@/services";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Peca } from "@/types/pecas";
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
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  preco: z.number().min(0, "O preço deve ser positivo"),
  descricao: z.string().default(""),
  reservada: z.boolean().default(false),
  expositor_id: z.number(),
});

interface CriarPecaProps {
  expositorId: string;
  pecaExistente?: Peca;
  onClose?: () => void;
}

export function CriarPeca({ expositorId, pecaExistente, onClose }: CriarPecaProps) {
  const [open, setOpen] = useState(!!pecaExistente);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      preco: 0,
      descricao: "",
      reservada: false,
      expositor_id: Number(expositorId),
    },
  });

  // Preenche o formulário se for uma edição
  useEffect(() => {
    if (pecaExistente) {
      form.reset({
        nome: pecaExistente.nome,
        preco: pecaExistente.preco,
        descricao: pecaExistente.descricao || "",
        reservada: pecaExistente.reservada,
        expositor_id: pecaExistente.expositor_id,
      });
    }
  }, [pecaExistente, form]);

  const mutation = useMutation({
    mutationFn: (data: { nome: string; preco: number; descricao: string; reservada: boolean; expositor_id: number }) => 
      pecaExistente 
        ? BrechoService.appApiAtualizarPeca({
            pecaId: pecaExistente.id,
            requestBody: data
          })
        : BrechoService.appApiCriarPeca({ 
            requestBody: data
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pecas", expositorId] });
      setOpen(false);
      onClose?.();
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    try{
      mutation.mutate(data);
    } catch (error) {
      alert("Você não tem permissão para esta ação")
    }
  });

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" strokeWidth={2.5} /> Peça
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {pecaExistente ? "Editar Peça" : "Adicionar Peça"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Peça</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Vestido floral" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
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
                    <Textarea
                      placeholder="Detalhes sobre a peça..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reservada"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Peça reservada?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
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