export type UserRole = "admin" | "recepcionista" | "profissional";

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  created_at: Date;
}

export interface UsuarioComSenha extends Usuario {
  senha_hash: string;
}
