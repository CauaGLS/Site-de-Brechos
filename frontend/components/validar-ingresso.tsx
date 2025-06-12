"use client";

import { BrechoService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useState } from "react";

const formSchema = z.object({
  ingresso_id: z.string().min(1, "ID do ingresso é obrigatório"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
});

export function ValidarIngresso() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingresso_id: "",
      cpf: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { ingresso_id: string; cpf: string }) =>
      BrechoService.appApiValidarIngresso({
        requestBody: {
          ingresso_id: data.ingresso_id, // Corrigido para ingresso_id
          cpf: data.cpf,
        },
      }),
    onSuccess: (data) => {
      setSuccess(`Ingresso de ${data.nome} foi validado com sucesso.`);
      setError(null);
      form.reset();
    },
    onError: (error: any) => {
      setError(error?.message || "Ocorreu um erro inesperado");
      setSuccess(null);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Validar Ingresso</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-3">
<FormField
            control={form.control}
            name="ingresso_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Ingresso</FormLabel>
                <FormControl>
                  <Input placeholder="ID do ingresso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF do Participante</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Somente números"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.replace(/\D/g, ""));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Validar Ingresso
          </Button>
        </form>
      </Form>
    </div>
  );
}