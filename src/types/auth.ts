export interface Usuario {
  id: string;
  email: string;
  nome: string;
  created_at: Date;
}

export interface UsuarioComSenha extends Usuario {
  senha_hash: string;
}
