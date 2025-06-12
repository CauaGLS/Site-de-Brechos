import { BrechoService } from "@/services";

export type Ingresso = Awaited<
  ReturnType<typeof BrechoService.appApiObterIngresso>
>;

export type CreateIngressoData = Parameters<
  typeof BrechoService.appApiCriarIngresso
>[0]["requestBody"];