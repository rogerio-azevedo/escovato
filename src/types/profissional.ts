export interface Profissional {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProfissionalComEspecialidades extends Profissional {
  especialidades: {
    id: string;
    nome: string;
    cor: string;
  }[];
}

export interface CreateProfissionalInput {
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  senha: string;
  especialidades_ids?: string[];
}

export interface UpdateProfissionalInput {
  nome?: string;
  telefone?: string;
  cpf?: string;
  email?: string;
  senha?: string;
  ativo?: boolean;
}

export interface ProfissionalEspecialidade {
  id: string;
  profissional_id: string;
  especialidade_id: string;
  created_at: Date;
}
