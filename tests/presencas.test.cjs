const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');

// Usa o compilador já presente no projeto e substitui apenas os serviços externos.
function carregarTS(arquivo, mocks = {}) {
  const filename = path.resolve(__dirname, '..', arquivo);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const run = vm.runInThisContext(`(function(require,module,exports,Buffer,console){${source}\n})`, { filename });
  run((name) => name in mocks ? mocks[name] : require(name), module, module.exports, Buffer, { error() {} });
  return module.exports;
}

const validacao = carregarTS('src/lib/presencas-validacao.ts');
const evento = carregarTS('src/lib/aniversario.ts');

test('normaliza WhatsApp nacional, internacional e DDD 55 sem confundir com o país', () => {
  for (const numero of ['(65) 99813-5353', '65998135353', '+55 (65) 99813-5353']) {
    assert.equal(validacao.normalizarWhatsApp(numero), '5565998135353');
  }
  assert.equal(validacao.normalizarWhatsApp('(55) 99813-5353'), '5555998135353');
  assert.equal(validacao.normalizarWhatsApp('(65) 3321-4321'), '556533214321');
});

test('rejeita números incompletos, DDD inválido, texto e números repetidos', () => {
  for (const numero of ['', '99813-5353', '(00) 99813-5353', '(20) 99813-5353', '(65) 12345-6789', '(65) 99999-9999', 'abc65998135353', '+1 212 555-1234']) {
    assert.equal(validacao.normalizarWhatsApp(numero), null, numero);
  }
});

test('preserva nomes acentuados, hifenizados e com apóstrofo e remove espaços extras', () => {
  for (const nome of ['José da Silva', 'Ana-Maria', "Maria D’Ávila", '李明']) {
    assert.equal(validacao.validarPresenca({ nome, whatsapp: '65998135353' }).ok, true, nome);
  }
  const resultado = validacao.validarPresenca({ nome: '  João   da Silva  ', whatsapp: '65998135353' });
  assert.equal(resultado.dados.nome, 'João da Silva');
});

test('rejeita payloads inválidos sem lançar exceções nem aceitar HTML', () => {
  for (const body of [null, [], 'texto', 1, {}, { nome: ['Ana'], whatsapp: '65998135353' }, { nome: '<script>x</script>', whatsapp: '65998135353' }, { nome: 'a'.repeat(121), whatsapp: '65998135353' }, { nome: 'Ana', whatsapp: 65998135353 }]) {
    assert.equal(validacao.validarPresenca(body).ok, false);
  }
});

test('aceita confirmações até o fim de 06/11 no fuso de Cuiabá', () => {
  assert.equal(evento.inscricoesEncerradas(new Date('2026-11-07T03:59:59Z')), false);
  assert.equal(evento.inscricoesEncerradas(new Date('2026-11-07T04:00:00Z')), true);
});

function rotaPublica({ salvar = async () => {}, encerrado = false } = {}) {
  return carregarTS('src/app/api/aniversario/confirmar/route.ts', {
    '@/lib/presencas': { confirmarPresenca: salvar },
    '@/lib/presencas-validacao': validacao,
    '@/lib/aniversario': { inscricoesEncerradas: () => encerrado },
  });
}

function requisicao(body, extraHeaders = {}) {
  return new NextRequest('https://www.escovato.com.br/api/aniversario/confirmar', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.escovato.com.br', ...extraHeaders },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('o endpoint salva apenas nome normalizado e WhatsApp e responde sem expor dados', async () => {
  let gravado;
  const { POST } = rotaPublica({ salvar: async (dados) => { gravado = dados; } });
  const resposta = await POST(requisicao({ nome: '  Ana  Silva ', whatsapp: '(65) 99813-5353', evento: 'outro', role: 'admin' }));
  assert.equal(resposta.status, 201);
  assert.deepEqual(gravado, { nome: 'Ana Silva', whatsapp: '5565998135353' });
  assert.deepEqual(await resposta.json(), { success: true });
  assert.equal(resposta.headers.get('cache-control'), 'no-store');
});

test('erros de validação, JSON, origem, formato e tamanho não chegam ao banco', async () => {
  const { POST } = rotaPublica({ salvar: async () => assert.fail('Não deve gravar') });
  assert.equal((await POST(requisicao({ nome: 'Ana', whatsapp: '123' }))).status, 400);
  assert.equal((await POST(requisicao('{'))).status, 400);
  assert.equal((await POST(requisicao({}, { origin: 'https://outro.site' }))).status, 403);
  assert.equal((await POST(requisicao({}, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal((await POST(requisicao({}, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await POST(requisicao('x'.repeat(2049)))).status, 413);
  assert.equal((await POST(requisicao({}, { 'content-length': '3000' }))).status, 413);
});

test('honeypot preenchido não cria um convidado', async () => {
  const { POST } = rotaPublica({ salvar: async () => assert.fail('Não deve gravar') });
  assert.equal((await POST(requisicao({ website: 'spam' }))).status, 201);
});

test('valida a origem pública mesmo quando o proxy reconstrói a URL interna', async () => {
  let gravou = false;
  const { POST } = rotaPublica({ salvar: async () => { gravou = true; } });
  const request = new NextRequest('http://localhost:3001/api/aniversario/confirmar', {
    method: 'POST', headers: { 'content-type': 'application/json', host: '127.0.0.1:3001', origin: 'http://127.0.0.1:3001', 'x-forwarded-proto': 'http' },
    body: JSON.stringify({ nome: 'Ana Silva', whatsapp: '65998135353' }),
  });
  assert.equal((await POST(request)).status, 201);
  assert.equal(gravou, true);
});

test('evento encerrado não aceita gravações', async () => {
  const { POST } = rotaPublica({ encerrado: true, salvar: async () => assert.fail('Não deve gravar') });
  assert.equal((await POST(requisicao({ nome: 'Ana', whatsapp: '65998135353' }))).status, 410);
});

test('falha do banco responde erro recuperável sem fingir confirmação', async () => {
  const { POST } = rotaPublica({ salvar: async () => { throw new Error('falha interna secreta'); } });
  const resposta = await POST(requisicao({ nome: 'Ana', whatsapp: '65998135353' }));
  assert.equal(resposta.status, 503);
  assert.equal(JSON.stringify(await resposta.json()).includes('secreta'), false);
});

test('a lista só é consultada por administrador ou recepcionista e não fica em cache', async () => {
  for (const [role, esperado] of [[null, 401], ['profissional', 403], ['admin', 200], ['recepcionista', 200]]) {
    let consultou = false;
    const { GET } = carregarTS('src/app/api/admin/presencas/route.ts', {
      'next-auth': { getServerSession: async () => role ? { user: { role } } : null },
      '@/lib/auth': { authOptions: {} },
      '@/lib/presencas': { listarPresencas: async () => { consultou = true; return []; } },
    });
    const resposta = await GET();
    assert.equal(resposta.status, esperado, role);
    assert.equal(consultou, esperado === 200);
    assert.equal(resposta.headers.get('cache-control'), 'private, no-store');
  }
});
