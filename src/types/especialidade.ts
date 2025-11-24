export interface Especialidade {
  id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEspecialidadeInput {
  nome: string;
  descricao?: string;
  cor: string;
}

export interface UpdateEspecialidadeInput {
  nome?: string;
  descricao?: string;
  cor?: string;
  ativo?: boolean;
}

