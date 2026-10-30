const ddds = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

export type PresencaInput = { nome: string; whatsapp: string };
export type PresencaValidada =
  | { ok: true; dados: PresencaInput }
  | { ok: false; erro: string; campo: "nome" | "whatsapp" | "formulario" };

export function normalizarWhatsApp(valor: string): string | null {
  if (!/^[\d\s()+.-]+$/.test(valor) || valor.length > 25) return null;
  let digitos = valor.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {
    digitos = digitos.slice(2);
  }
  if (!ddds.has(digitos.slice(0, 2))) return null;
  const numero = digitos.slice(2);
  if (!/^(?:9\d{8}|[2-5]\d{7})$/.test(numero)) return null;
  if (/^(\d)\1+$/.test(numero)) return null;
  return `55${digitos}`;
}

export function validarPresenca(body: unknown): PresencaValidada {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, campo: "formulario", erro: "Confira os dados e tente novamente." };
  }
  const { nome, whatsapp } = body as Record<string, unknown>;
  if (typeof nome !== "string" || nome.length > 200) {
    return { ok: false, campo: "nome", erro: "Informe seu nome (até 120 caracteres)." };
  }
  const nomeNormalizado = nome.normalize("NFC").trim().replace(/\s+/g, " ");
  if (
    nomeNormalizado.length < 2 || nomeNormalizado.length > 120 ||
    !/^[\p{L}\p{M}][\p{L}\p{M} .'’\-]*$/u.test(nomeNormalizado)
  ) {
    return { ok: false, campo: "nome", erro: "Informe seu nome (até 120 caracteres)." };
  }
  const telefone = typeof whatsapp === "string" ? normalizarWhatsApp(whatsapp) : null;
  if (!telefone) {
    return { ok: false, campo: "whatsapp", erro: "Informe um WhatsApp brasileiro válido com DDD." };
  }
  return { ok: true, dados: { nome: nomeNormalizado, whatsapp: telefone } };
}

export function formatarWhatsApp(telefone: string): string {
  const nacional = telefone.startsWith("55") && telefone.length > 11 ? telefone.slice(2) : telefone;
  return `(${nacional.slice(0, 2)}) ${nacional.slice(2, -4)}-${nacional.slice(-4)}`;
}
