import { v4 as uuidv4 } from "uuid";
import { sql } from "./db";
import type {
  Vale,
  CreateValeInput,
  ValeValidacao,
  ValeFilters,
} from "@/types/vale";

// Gerar código hash único para o vale
export function gerarCodigoHash(): string {
  const uuid = uuidv4();
  const timestamp = Date.now().toString(36);
  return `${uuid.substring(0, 8)}-${timestamp}`.toUpperCase();
}

// Validar CPF
export function validarCPF(cpf: string): boolean {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// Formatar CPF
export function formatarCPF(cpf: string): string {
  if (!cpf) return "Não informado";
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length !== 11) return "Não informado";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formatar valor monetário
export function formatarValor(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Criar novo vale
export async function criarVale(data: CreateValeInput): Promise<Vale> {
  const codigoHash = gerarCodigoHash();

  const result = await sql`
    INSERT INTO vales_presente (
      codigo_hash,
      nome_completo,
      cpf,
      descricao,
      valor,
      mensagem,
      de,
      para,
      validade
    ) VALUES (
      ${codigoHash},
      ${data.nome_completo},
      ${data.cpf},
      ${data.descricao},
      ${data.valor},
      ${data.mensagem || null},
      ${data.de},
      ${data.para},
      ${data.validade.toISOString()}
    )
    RETURNING *
  `;

  return result.rows[0] as Vale;
}

// Buscar vale por ID
export async function buscarValePorId(id: string): Promise<Vale | null> {
  const result = await sql`
    SELECT * FROM vales_presente WHERE id = ${id}
  `;

  return result.rows[0] as Vale | null;
}

// Buscar vale por código hash
export async function buscarValePorCodigo(
  codigo: string
): Promise<Vale | null> {
  const result = await sql`
    SELECT * FROM vales_presente WHERE codigo_hash = ${codigo}
  `;

  return result.rows[0] as Vale | null;
}

// Listar vales com filtros
export async function listarVales(filters?: ValeFilters): Promise<Vale[]> {
  let query = "SELECT * FROM vales_presente WHERE 1=1";
  const params: string[] = [];

  if (filters?.status === "usado") {
    query += " AND usado = true";
  } else if (filters?.status === "ativo") {
    query += " AND usado = false AND validade >= CURRENT_DATE";
  } else if (filters?.status === "expirado") {
    query += " AND usado = false AND validade < CURRENT_DATE";
  }

  if (filters?.search) {
    query += ` AND (
      nome_completo ILIKE $${params.length + 1} OR
      cpf ILIKE $${params.length + 1} OR
      codigo_hash ILIKE $${params.length + 1}
    )`;
    params.push(`%${filters.search}%`);
  }

  query += " ORDER BY created_at DESC";

  const result = await sql.query(query, params);
  return result.rows as Vale[];
}

// Validar vale
export async function validarVale(codigo: string): Promise<ValeValidacao> {
  const vale = await buscarValePorCodigo(codigo);

  if (!vale) {
    return {
      valido: false,
      motivo: "nao_encontrado",
      mensagem: "Vale não encontrado",
    };
  }

  if (vale.usado) {
    return {
      valido: false,
      vale,
      motivo: "usado",
      mensagem: `Vale já utilizado em ${new Date(
        vale.data_uso!
      ).toLocaleDateString("pt-BR")}`,
    };
  }

  const hoje = new Date();
  const validade = new Date(vale.validade);

  if (validade < hoje) {
    return {
      valido: false,
      vale,
      motivo: "expirado",
      mensagem: `Vale expirado em ${validade.toLocaleDateString("pt-BR")}`,
    };
  }

  return {
    valido: true,
    vale,
    mensagem: "Vale válido e disponível para uso",
  };
}

// Marcar vale como usado
export async function marcarValeComoUsado(id: string): Promise<Vale> {
  const result = await sql`
    UPDATE vales_presente
    SET usado = true, data_uso = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return result.rows[0] as Vale;
}

// Atualizar vale
export async function atualizarVale(
  id: string,
  data: Partial<CreateValeInput>
): Promise<Vale> {
  const updates: string[] = [];
  const values: string[] = [];
  let paramCount = 1;

  if (data.nome_completo) {
    updates.push(`nome_completo = $${paramCount++}`);
    values.push(data.nome_completo);
  }

  if (data.cpf) {
    updates.push(`cpf = $${paramCount++}`);
    values.push(data.cpf);
  }

  if (data.descricao) {
    updates.push(`descricao = $${paramCount++}`);
    values.push(data.descricao);
  }

  if (data.valor !== undefined) {
    updates.push(`valor = $${paramCount++}`);
    values.push(data.valor.toString());
  }

  if (data.mensagem !== undefined) {
    updates.push(`mensagem = $${paramCount++}`);
    values.push(data.mensagem);
  }

  if (data.de) {
    updates.push(`de = $${paramCount++}`);
    values.push(data.de);
  }

  if (data.para) {
    updates.push(`para = $${paramCount++}`);
    values.push(data.para);
  }

  if (data.validade) {
    updates.push(`validade = $${paramCount++}`);
    values.push(data.validade.toISOString());
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE vales_presente
    SET ${updates.join(", ")}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await sql.query(query, values);
  return result.rows[0] as Vale;
}
