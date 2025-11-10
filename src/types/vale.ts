export interface Vale {
  id: string;
  codigo_hash: string;
  nome_completo: string;
  cpf: string;
  descricao: string;
  valor: number;
  mensagem?: string;
  de: string;
  para: string;
  validade: Date;
  usado: boolean;
  data_uso?: Date;
  created_at: Date;
  updated_at?: Date;
}

export interface CreateValeInput {
  nome_completo: string;
  cpf: string;
  descricao: string;
  valor: number;
  mensagem?: string;
  de: string;
  para: string;
  validade: Date;
}

export interface ValeValidacao {
  valido: boolean;
  vale?: Vale;
  motivo?: "usado" | "expirado" | "nao_encontrado";
  mensagem?: string;
}

export type ValeStatus = "ativo" | "usado" | "expirado";

export interface ValeFilters {
  status?: ValeStatus;
  search?: string;
  dataInicio?: Date;
  dataFim?: Date;
}
