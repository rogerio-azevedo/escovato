import { sql } from './db';
import type {
  Rodizio,
  RodizioProfissional,
  RodizioProfissionalDetalhado,
  CreateRodizioProfissionalInput,
  UpdateStatusInput,
  UpdatePosicaoInput,
  FilaEspecialidade,
  RodizioLog,
  ProfissionalStatus,
  UsuarioTipo,
  AcaoRodizio,
} from '@/types/rodizio';

// ===== RODÍZIO =====

// Buscar ou criar rodízio do dia
export async function getRodizioHoje(usuarioId: string): Promise<Rodizio> {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    // Tentar buscar rodízio existente
    const resultBusca = await sql`
      SELECT * FROM rodizios WHERE data = ${hoje}
    `;

    if (resultBusca.rows.length > 0) {
      return resultBusca.rows[0] as Rodizio;
    }

    // Criar novo rodízio se não existir
    const resultCriacao = await sql`
      INSERT INTO rodizios (data, status, aberto_por, aberto_em)
      VALUES (${hoje}, 'aberto', ${usuarioId}, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const rodizio = resultCriacao.rows[0] as Rodizio;

    // Registrar log
    await registrarLog(rodizio.id, usuarioId, 'admin', 'adicionar', {
      acao: 'rodizio_aberto',
      data: hoje,
    });

    return rodizio;
  } catch (error) {
    console.error('Erro ao buscar/criar rodízio:', error);
    throw error;
  }
}

// Buscar rodízio por ID
export async function getRodizioById(id: string): Promise<Rodizio | null> {
  try {
    const result = await sql`
      SELECT * FROM rodizios WHERE id = ${id}
    `;

    return result.rows[0] as Rodizio || null;
  } catch (error) {
    console.error('Erro ao buscar rodízio:', error);
    throw error;
  }
}

// Fechar rodízio
export async function fecharRodizio(rodizioId: string): Promise<void> {
  try {
    await sql`
      UPDATE rodizios 
      SET status = 'fechado', fechado_em = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${rodizioId}
    `;
  } catch (error) {
    console.error('Erro ao fechar rodízio:', error);
    throw error;
  }
}

// ===== PROFISSIONAIS NO RODÍZIO =====

// Buscar filas por especialidade de um rodízio
export async function getFilasRodizio(rodizioId: string): Promise<FilaEspecialidade[]> {
  try {
    // Buscar todas as especialidades ativas
    const especialidadesResult = await sql`
      SELECT id, nome, cor FROM especialidades WHERE ativo = true ORDER BY nome ASC
    `;

    const filas: FilaEspecialidade[] = [];

    for (const esp of especialidadesResult.rows) {
      // Buscar profissionais aguardando (incluindo almoço e indisponível)
      const aguardandoResult = await sql`
        SELECT 
          rp.*,
          p.nome as profissional_nome,
          p.telefone as profissional_telefone,
          e.nome as especialidade_nome,
          e.cor as especialidade_cor,
          u.nome as adicionado_por_nome,
          u.email as adicionado_por_email
        FROM rodizios_profissionais rp
        INNER JOIN profissionais p ON rp.profissional_id = p.id
        INNER JOIN especialidades e ON rp.especialidade_id = e.id
        INNER JOIN usuarios_admin u ON rp.adicionado_por = u.id
        WHERE rp.rodizio_id = ${rodizioId} 
        AND rp.especialidade_id = ${esp.id}
        AND rp.status IN ('aguardando', 'almoco', 'indisponivel')
        ORDER BY 
          CASE 
            WHEN rp.status = 'aguardando' THEN 0
            ELSE 1
          END,
          rp.posicao ASC
      `;

      // Buscar profissionais atendendo
      const atendendoResult = await sql`
        SELECT 
          rp.*,
          p.nome as profissional_nome,
          p.telefone as profissional_telefone,
          e.nome as especialidade_nome,
          e.cor as especialidade_cor,
          u.nome as adicionado_por_nome,
          u.email as adicionado_por_email
        FROM rodizios_profissionais rp
        INNER JOIN profissionais p ON rp.profissional_id = p.id
        INNER JOIN especialidades e ON rp.especialidade_id = e.id
        INNER JOIN usuarios_admin u ON rp.adicionado_por = u.id
        WHERE rp.rodizio_id = ${rodizioId} 
        AND rp.especialidade_id = ${esp.id}
        AND rp.status = 'atendendo'
        ORDER BY rp.posicao ASC
      `;

      filas.push({
        especialidade_id: esp.id,
        especialidade_nome: esp.nome,
        especialidade_cor: esp.cor,
        profissionais_aguardando: aguardandoResult.rows.map(mapRowToDetalhado),
        profissionais_atendendo: atendendoResult.rows.map(mapRowToDetalhado),
      });
    }

    return filas;
  } catch (error) {
    console.error('Erro ao buscar filas do rodízio:', error);
    throw error;
  }
}

// Adicionar profissional à fila
export async function adicionarProfissionalAoRodizio(
  rodizioId: string,
  data: CreateRodizioProfissionalInput
): Promise<RodizioProfissional> {
  try {
    const { especialidade_id, profissional_id, adicionado_por } = data;

    // Verificar se o profissional possui esta especialidade
    const temEspecialidade = await sql`
      SELECT id FROM profissionais_especialidades
      WHERE profissional_id = ${profissional_id}
      AND especialidade_id = ${especialidade_id}
    `;

    if (temEspecialidade.rows.length === 0) {
      throw new Error('Este profissional não possui esta especialidade');
    }

    // Verificar se profissional já está nesta fila
    const jaExiste = await sql`
      SELECT id FROM rodizios_profissionais
      WHERE rodizio_id = ${rodizioId}
      AND especialidade_id = ${especialidade_id}
      AND profissional_id = ${profissional_id}
    `;

    if (jaExiste.rows.length > 0) {
      throw new Error('Profissional já está nesta fila');
    }

    // Buscar última posição
    const ultimaPosicaoResult = await sql`
      SELECT COALESCE(MAX(posicao), 0) as ultima_posicao
      FROM rodizios_profissionais
      WHERE rodizio_id = ${rodizioId} AND especialidade_id = ${especialidade_id}
    `;

    const novaPosicao = parseInt(ultimaPosicaoResult.rows[0].ultima_posicao) + 1;

    // Inserir profissional
    const result = await sql`
      INSERT INTO rodizios_profissionais 
        (rodizio_id, especialidade_id, profissional_id, posicao, status, adicionado_por)
      VALUES 
        (${rodizioId}, ${especialidade_id}, ${profissional_id}, ${novaPosicao}, 'aguardando', ${adicionado_por})
      RETURNING *
    `;

    const rodizioProfissional = result.rows[0] as RodizioProfissional;

    // Registrar log
    await registrarLog(rodizioId, adicionado_por, 'admin', 'adicionar', {
      profissional_id,
      especialidade_id,
      posicao: novaPosicao,
    });

    return rodizioProfissional;
  } catch (error) {
    console.error('Erro ao adicionar profissional ao rodízio:', error);
    throw error;
  }
}

// Atualizar status do profissional
export async function atualizarStatusProfissional(
  rodizioProfissionalId: string,
  data: UpdateStatusInput
): Promise<RodizioProfissional | null> {
  try {
    const { status, usuario_id } = data;

    // Buscar dados atuais
    const atual = await sql`
      SELECT * FROM rodizios_profissionais WHERE id = ${rodizioProfissionalId}
    `;

    if (atual.rows.length === 0) {
      return null;
    }

    const statusAnterior = atual.rows[0].status;

    // Se está mudando para "atendendo", registrar início do atendimento
    if (status === 'atendendo' && statusAnterior !== 'atendendo') {
      await sql`
        INSERT INTO rodizios_atendimentos (rodizio_profissional_id, inicio_atendimento)
        VALUES (${rodizioProfissionalId}, CURRENT_TIMESTAMP)
      `;
    }

    // Se está finalizando atendimento (voltando para aguardando)
    if (status === 'aguardando' && statusAnterior === 'atendendo') {
      // Finalizar atendimento atual
      await sql`
        UPDATE rodizios_atendimentos
        SET fim_atendimento = CURRENT_TIMESTAMP
        WHERE rodizio_profissional_id = ${rodizioProfissionalId}
        AND fim_atendimento IS NULL
      `;

      // Mover para o final da fila
      const rodizioId = atual.rows[0].rodizio_id;
      const especialidadeId = atual.rows[0].especialidade_id;

      const ultimaPosicaoResult = await sql`
        SELECT COALESCE(MAX(posicao), 0) as ultima_posicao
        FROM rodizios_profissionais
        WHERE rodizio_id = ${rodizioId} 
        AND especialidade_id = ${especialidadeId}
        AND status = 'aguardando'
      `;

      const novaPosicao = parseInt(ultimaPosicaoResult.rows[0].ultima_posicao) + 1;

      await sql`
        UPDATE rodizios_profissionais
        SET posicao = ${novaPosicao}
        WHERE id = ${rodizioProfissionalId}
      `;
    }

    // Se está mudando para almoço ou indisponível, mover para o final da fila
    if ((status === 'almoco' || status === 'indisponivel') && statusAnterior === 'aguardando') {
      const rodizioId = atual.rows[0].rodizio_id;
      const especialidadeId = atual.rows[0].especialidade_id;

      const ultimaPosicaoResult = await sql`
        SELECT COALESCE(MAX(posicao), 0) as ultima_posicao
        FROM rodizios_profissionais
        WHERE rodizio_id = ${rodizioId} 
        AND especialidade_id = ${especialidadeId}
      `;

      const novaPosicao = parseInt(ultimaPosicaoResult.rows[0].ultima_posicao) + 1;

      await sql`
        UPDATE rodizios_profissionais
        SET posicao = ${novaPosicao}
        WHERE id = ${rodizioProfissionalId}
      `;
    }

    // Atualizar status
    const result = await sql`
      UPDATE rodizios_profissionais
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${rodizioProfissionalId}
      RETURNING *
    `;

    const rodizioProfissional = result.rows[0] as RodizioProfissional;

    // Registrar log
    await registrarLog(
      rodizioProfissional.rodizio_id,
      usuario_id,
      'admin',
      'status_mudou',
      {
        rodizio_profissional_id: rodizioProfissionalId,
        status_anterior: statusAnterior,
        status_novo: status,
      }
    );

    return rodizioProfissional;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

// Atualizar posição do profissional na fila (reordenar)
export async function atualizarPosicaoProfissional(
  rodizioProfissionalId: string,
  data: UpdatePosicaoInput
): Promise<boolean> {
  try {
    const { nova_posicao, usuario_id } = data;

    // Buscar dados atuais
    const atual = await sql`
      SELECT * FROM rodizios_profissionais WHERE id = ${rodizioProfissionalId}
    `;

    if (atual.rows.length === 0) {
      return false;
    }

    const { rodizio_id, especialidade_id, posicao: posicao_antiga } = atual.rows[0];

    if (posicao_antiga === nova_posicao) {
      return true; // Sem mudança
    }

    // Ajustar posições dos outros profissionais
    if (nova_posicao < posicao_antiga) {
      // Movendo para cima: incrementar posições entre nova e antiga
      await sql`
        UPDATE rodizios_profissionais
        SET posicao = posicao + 1
        WHERE rodizio_id = ${rodizio_id}
        AND especialidade_id = ${especialidade_id}
        AND posicao >= ${nova_posicao}
        AND posicao < ${posicao_antiga}
      `;
    } else {
      // Movendo para baixo: decrementar posições entre antiga e nova
      await sql`
        UPDATE rodizios_profissionais
        SET posicao = posicao - 1
        WHERE rodizio_id = ${rodizio_id}
        AND especialidade_id = ${especialidade_id}
        AND posicao > ${posicao_antiga}
        AND posicao <= ${nova_posicao}
      `;
    }

    // Atualizar posição do profissional
    await sql`
      UPDATE rodizios_profissionais
      SET posicao = ${nova_posicao}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${rodizioProfissionalId}
    `;

    // Registrar log
    await registrarLog(rodizio_id, usuario_id, 'admin', 'mover', {
      rodizio_profissional_id: rodizioProfissionalId,
      posicao_antiga,
      posicao_nova: nova_posicao,
    });

    return true;
  } catch (error) {
    console.error('Erro ao atualizar posição:', error);
    throw error;
  }
}

// Remover profissional da fila
export async function removerProfissionalDoRodizio(
  rodizioProfissionalId: string,
  usuarioId: string
): Promise<boolean> {
  try {
    // Buscar dados antes de remover
    const atual = await sql`
      SELECT * FROM rodizios_profissionais WHERE id = ${rodizioProfissionalId}
    `;

    if (atual.rows.length === 0) {
      return false;
    }

    const { rodizio_id, especialidade_id, posicao, profissional_id } = atual.rows[0];

    // Remover profissional
    await sql`
      DELETE FROM rodizios_profissionais WHERE id = ${rodizioProfissionalId}
    `;

    // Ajustar posições dos profissionais que estavam depois
    await sql`
      UPDATE rodizios_profissionais
      SET posicao = posicao - 1
      WHERE rodizio_id = ${rodizio_id}
      AND especialidade_id = ${especialidade_id}
      AND posicao > ${posicao}
    `;

    // Registrar log
    await registrarLog(rodizio_id, usuarioId, 'admin', 'remover', {
      profissional_id,
      especialidade_id,
      posicao,
    });

    return true;
  } catch (error) {
    console.error('Erro ao remover profissional:', error);
    throw error;
  }
}

// Verificar se profissional está atendendo em alguma fila
export async function profissionalEstaAtendendo(
  rodizioId: string,
  profissionalId: string
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM rodizios_profissionais
      WHERE rodizio_id = ${rodizioId}
      AND profissional_id = ${profissionalId}
      AND status = 'atendendo'
    `;

    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Erro ao verificar se profissional está atendendo:', error);
    throw error;
  }
}

// Buscar profissionais disponíveis para adicionar (que não estão na fila específica)
export async function getProfissionaisDisponiveis(
  rodizioId: string,
  especialidadeId: string
): Promise<any[]> {
  try {
    const result = await sql`
      SELECT DISTINCT p.id, p.nome, p.telefone
      FROM profissionais p
      INNER JOIN profissionais_especialidades pe ON p.id = pe.profissional_id
      WHERE pe.especialidade_id = ${especialidadeId}
      AND p.ativo = true
      AND p.id NOT IN (
        SELECT profissional_id 
        FROM rodizios_profissionais 
        WHERE rodizio_id = ${rodizioId} 
        AND especialidade_id = ${especialidadeId}
      )
      ORDER BY p.nome ASC
    `;

    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar profissionais disponíveis:', error);
    throw error;
  }
}

// ===== LOGS E AUDITORIA =====

// Registrar log de ação
export async function registrarLog(
  rodizioId: string,
  usuarioId: string,
  usuarioTipo: UsuarioTipo,
  acao: AcaoRodizio,
  detalhes: Record<string, any>
): Promise<void> {
  try {
    await sql`
      INSERT INTO rodizios_logs (rodizio_id, usuario_id, usuario_tipo, acao, detalhes)
      VALUES (${rodizioId}, ${usuarioId}, ${usuarioTipo}, ${acao}, ${JSON.stringify(detalhes)})
    `;
  } catch (error) {
    console.error('Erro ao registrar log:', error);
    // Não lançar erro para não interromper o fluxo principal
  }
}

// Buscar logs do rodízio
export async function getLogsRodizio(
  rodizioId: string,
  limit = 50
): Promise<RodizioLog[]> {
  try {
    const result = await sql`
      SELECT * FROM rodizios_logs
      WHERE rodizio_id = ${rodizioId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result.rows as RodizioLog[];
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    throw error;
  }
}

// ===== HELPERS =====

// Mapear row do banco para RodizioProfissionalDetalhado
function mapRowToDetalhado(row: any): RodizioProfissionalDetalhado {
  return {
    id: row.id,
    rodizio_id: row.rodizio_id,
    especialidade_id: row.especialidade_id,
    profissional_id: row.profissional_id,
    posicao: row.posicao,
    status: row.status,
    adicionado_por: row.adicionado_por,
    adicionado_em: row.adicionado_em,
    updated_at: row.updated_at,
    profissional: {
      id: row.profissional_id,
      nome: row.profissional_nome,
      telefone: row.profissional_telefone,
    },
    especialidade: {
      id: row.especialidade_id,
      nome: row.especialidade_nome,
      cor: row.especialidade_cor,
    },
    adicionado_por_usuario: {
      nome: row.adicionado_por_nome,
      email: row.adicionado_por_email,
    },
  };
}


