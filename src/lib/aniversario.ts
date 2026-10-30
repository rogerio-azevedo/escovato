export const aniversario = {
  evento: "escovato-1-ano-2026",
  titulo: "1 ano de Escovato",
  data: "7 de novembro de 2026",
  horario: "17h",
  inicio: "2026-11-07T17:00:00-04:00",
  encerramento: "2026-11-07T00:00:00-04:00",
  endereco: "Av. Érico Gonçalvez Preza Filho, 362",
  bairro: "Jardim Itália · Cuiabá",
  url: "https://www.escovato.com.br/aniversario",
  mapa: "https://www.google.com/maps/dir/?api=1&destination=-15.603707,-56.058788",
} as const;

export function inscricoesEncerradas(agora = new Date()): boolean {
  return agora.getTime() >= new Date(aniversario.encerramento).getTime();
}
