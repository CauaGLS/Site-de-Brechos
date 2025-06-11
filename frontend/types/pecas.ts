export type Peca = {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  reservada?: boolean; // Garanta que não seja opcional
  expositor_id?: number; // Garanta que não seja opcional
  created_by?: any; // Adicione se necessário
  created_at?: string; // Adicione se necessário
  updated_at?: string; // Adicione se necessário
};