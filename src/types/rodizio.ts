export type RodizioStatus = "aberto" | "fechado";
export type ProfissionalStatus =
  | "aguardando"
  | "atendendo"
  | "almoco"
  | "indisponivel"
  | "finalizado";
export type UsuarioTipo = "admin" | "recepcionista" | "profissional";
export type AcaoRodizio =
  | "adicionar"
  | "remover"
  | "mover"
  | "status_mudou"
  | "iniciar_atendimento"
  | "concluir_atendimento";

export interface Rodizio {
  id: string;
  data: Date;
  status: RodizioStatus;
  aberto_por: string;
  aberto_em: Date;
  fechado_em: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface RodizioProfissional {
  id: string;
  rodizio_id: string;
  especialidade_id: string;
  profissional_id: string;
  posicao: number;
  status: ProfissionalStatus;
  adicionado_por: string;
  adicionado_em: Date;
  updated_at: Date;
}

export interface RodizioProfissionalDetalhado extends RodizioProfissional {
  profissional: {
    id: string;
    nome: string;
    telefone: string;
  };
  especialidade: {
    id: string;
    nome: string;
    cor: string;
  };
  adicionado_por_usuario: {
    nome: string;
    email: string;
  };
}

export interface RodizioAtendimento {
  id: string;
  rodizio_profissional_id: string;
  inicio_atendimento: Date;
  fim_atendimento: Date | null;
  created_at: Date;
}

export interface RodizioLog {
  id: string;
  rodizio_id: string;
  usuario_id: string;
  usuario_tipo: UsuarioTipo;
  acao: AcaoRodizio;
  detalhes: Record<string, unknown>;
  created_at: Date;
}

export interface CreateRodizioProfissionalInput {
  especialidade_id: string;
  profissional_id: string;
  adicionado_por: string;
}

export interface UpdateStatusInput {
  status: ProfissionalStatus;
  usuario_id: string;
}

export interface UpdatePosicaoInput {
  nova_posicao: number;
  usuario_id: string;
}

export interface FilaEspecialidade {
  especialidade_id: string;
  especialidade_nome: string;
  especialidade_cor: string;
  profissionais_aguardando: RodizioProfissionalDetalhado[];
  profissionais_atendendo: RodizioProfissionalDetalhado[];
}
