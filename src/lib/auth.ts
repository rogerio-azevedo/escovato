/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "./db";
import type { UsuarioComSenha } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Tentar autenticar como admin/recepcionista primeiro
          const resultAdmin = await sql`
            SELECT * FROM usuarios_admin 
            WHERE email = ${credentials.email}
          `;

          if (resultAdmin.rows.length > 0) {
            const usuario = resultAdmin.rows[0] as UsuarioComSenha;

            const senhaValida = await bcrypt.compare(
              credentials.password,
              usuario.senha_hash
            );

            if (!senhaValida) {
              return null;
            }

            return {
              id: usuario.id,
              email: usuario.email,
              name: usuario.nome,
              role: usuario.role || "recepcionista",
            };
          }

          // Se não for admin, tentar autenticar como profissional
          const resultProf = await sql`
            SELECT * FROM profissionais 
            WHERE email = ${credentials.email} AND ativo = true
          `;

          if (resultProf.rows.length > 0) {
            const profissional = resultProf.rows[0];

            const senhaValida = await bcrypt.compare(
              credentials.password,
              profissional.senha_hash
            );

            if (!senhaValida) {
              return null;
            }

            return {
              id: profissional.id,
              email: profissional.email,
              name: profissional.nome,
              role: "profissional",
            };
          }

          // Nenhum usuário encontrado
          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; role: string }).id = token.id as string;
        (session.user as { id: string; role: string }).role =
          token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
