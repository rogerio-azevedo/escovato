# 🔄 Sistema de Rodízio de Profissionais - Escovato

## 📋 Visão Geral

Sistema completo para gerenciar o rodízio diário de profissionais em múltiplas especialidades, incluindo:

- ✅ **CRUD de Especialidades** - Gerencie as especialidades do salão
- ✅ **CRUD de Profissionais** - Cadastro completo de profissionais com múltiplas especialidades
- ✅ **Sistema de Rodízio** - Gerenciamento de filas em tempo real
- ✅ **Autenticação Multi-Role** - Admin, Recepcionista e Profissional
- ✅ **Interface Mobile-First** - Otimizado para uso em celulares
- ✅ **Logs de Auditoria** - Rastreamento de todas as ações
- ✅ **Fechamento Automático** - Rodízio fecha automaticamente à meia-noite

---

## 🚀 Configuração Inicial

### 1. Inicializar Banco de Dados

Após configurar as variáveis de ambiente, acesse:

```
http://localhost:3000/api/init-db
```

Isso criará:
- ✅ Todas as tabelas do sistema de vales (já existente)
- ✅ Todas as tabelas do sistema de rodízio
- ✅ Usuário admin inicial

**Credenciais Padrão:**
- Email: `admin@escovato.com.br`
- Senha: `escovato2025`
- Role: `admin`

⚠️ **IMPORTANTE**: Altere as credenciais padrão em produção!

---

## 👥 Tipos de Usuário e Permissões

### 1. **Admin** (administrador)
- ✅ Acesso total ao sistema
- ✅ Gerenciar especialidades (criar, editar, desativar)
- ✅ Gerenciar profissionais (criar, editar, desativar)
- ✅ Gerenciar rodízio
- ✅ Ver logs de auditoria
- ✅ Gerenciar vales presente

**Login:** `/admin/login`

### 2. **Recepcionista**
- ✅ Gerenciar rodízio (adicionar, remover, mudar status)
- ✅ Visualizar profissionais e especialidades
- ✅ Gerenciar vales presente
- ❌ NÃO pode criar/editar profissionais ou especialidades

**Login:** `/admin/login`

### 3. **Profissional**
- ✅ Ver suas filas no rodízio
- ✅ Concluir atendimentos
- ✅ Mudar próprio status (Almoço, Indisponível)
- ❌ NÃO tem acesso à área administrativa

**Login:** `/profissional/login`

---

## 📖 Como Usar

### **PASSO 1: Criar Especialidades**

1. Acesse `/admin/especialidades`
2. Clique em **"+ Nova Especialidade"**
3. Preencha:
   - Nome (ex: "Cabeleireiro", "Manicure")
   - Descrição (opcional)
   - Cor (para identificação visual)
4. Salve

**Exemplos de especialidades:**
- 💇 Cabeleireiros
- 💅 Manicures
- 💄 Maquiadores
- 🧖 Depiladores
- 💆 Massoterapeutas

---

### **PASSO 2: Criar Profissionais**

1. Acesse `/admin/profissionais`
2. Clique em **"+ Novo Profissional"**
3. Preencha:
   - Nome completo
   - Telefone
   - CPF
   - Email (será usado para login)
   - Senha (mínimo 6 caracteres)
   - Selecione especialidades (pode escolher múltiplas)
4. Salve

**Exemplo de profissional multi-serviços:**
```
Nome: Maria Silva
Email: maria@escovato.com
Especialidades: ✅ Manicure, ✅ Depiladora, ✅ Massoterapeuta
```

Maria poderá estar em 3 filas simultaneamente!

---

### **PASSO 3: Usar o Rodízio (Recepcionista)**

#### Abrir o Rodízio
1. Acesse `/admin/rodizio`
2. O rodízio do dia é criado automaticamente
3. Escolha uma especialidade (nas abas no topo)

#### Adicionar Profissional na Fila
1. Clique no botão **"+"** (flutuante no canto inferior direito)
2. Selecione o profissional na lista
3. Ele será adicionado ao **final da fila**

#### Iniciar Atendimento
1. Na lista **"Aguardando"**, clique em **"Iniciar Atendimento"**
2. O profissional vai para **"Em Atendimento"**

#### Concluir Atendimento
1. Na lista **"Em Atendimento"**, clique em **"Concluir Atendimento"**
2. O profissional volta **automaticamente para o final da fila** de aguardando

#### Mudar Status do Profissional
- **Almoço** 🍽️ - Profissional está em pausa para almoço
- **Indisponível** 🚫 - Profissional não está disponível (banheiro, pausa, etc.)

#### Remover da Fila
- Clique no **"✕"** no card do profissional
- Confirme a remoção

---

### **PASSO 4: Área do Profissional**

#### Login
1. Profissional acessa `/profissional/login`
2. Usa email e senha cadastrados
3. É redirecionado para `/profissional`

#### Visualizar Suas Filas
- Vê todas as especialidades em que está no rodízio
- Vê sua **posição na fila** quando está aguardando
- Vê **status atual** (aguardando, atendendo, almoço, etc.)

#### Concluir Atendimento
1. Quando está **"Atendendo"**, aparece botão:
   - **"✓ Concluir Atendimento"**
2. Clica e volta automaticamente para o final da fila

#### Mudar Status
Quando está **"Aguardando"**, pode:
- 🍽️ **Ir para Almoço**
- 🚫 **Marcar Indisponível**

Depois, pode **"🔄 Voltar para Fila"**

---

## 🔄 Regras do Rodízio

### ✅ **Profissionais Multi-Serviços**

Se um profissional está em múltiplas filas:
- Quando está **"Atendendo"** em uma fila, fica **indisponível** nas outras
- Exemplo: Maria está atendendo como Manicure → fica indisponível nas filas de Depiladora e Massoterapeuta

### ✅ **Ordem da Fila**

- Profissionais são adicionados ao **final da fila**
- Quando concluem atendimento, voltam ao **final da fila**
- A ordem é mantida automaticamente

### ✅ **Fechamento Automático**

- À **meia-noite**, o sistema fecha o rodízio do dia anterior
- Um **novo rodízio** é criado automaticamente quando alguém acessa
- As filas começam **vazias** no novo dia

---

## 🛠️ Estrutura Técnica

### **Tabelas do Banco de Dados**

```sql
especialidades          - Especialidades (Cabeleireiro, Manicure, etc.)
profissionais           - Profissionais cadastrados
profissionais_especialidades - Vínculo M:N entre profissionais e especialidades
rodizios                - Rodízio de cada dia
rodizios_profissionais  - Profissionais em cada fila do rodízio
rodizios_atendimentos   - Histórico de atendimentos
rodizios_logs           - Logs de auditoria
usuarios_admin          - Admins e recepcionistas (com campo 'role')
```

### **APIs Disponíveis**

#### Especialidades
- `GET /api/admin/especialidades` - Listar
- `POST /api/admin/especialidades` - Criar
- `GET /api/admin/especialidades/[id]` - Buscar por ID
- `PUT /api/admin/especialidades/[id]` - Atualizar
- `DELETE /api/admin/especialidades/[id]` - Deletar (soft delete)

#### Profissionais
- `GET /api/admin/profissionais` - Listar
- `POST /api/admin/profissionais` - Criar
- `GET /api/admin/profissionais/[id]` - Buscar por ID
- `PUT /api/admin/profissionais/[id]` - Atualizar
- `DELETE /api/admin/profissionais/[id]` - Deletar (soft delete)
- `POST /api/admin/profissionais/[id]/especialidades` - Associar especialidades

#### Rodízio
- `GET /api/rodizios/hoje` - Buscar rodízio de hoje (cria se não existir)
- `POST /api/rodizios/[id]/profissionais` - Adicionar profissional
- `PUT /api/rodizios/profissionais/[id]/status` - Mudar status
- `PUT /api/rodizios/profissionais/[id]/posicao` - Reordenar
- `DELETE /api/rodizios/profissionais/[id]` - Remover profissional
- `GET /api/rodizios/[id]/logs` - Ver logs (apenas admin)

---

## 🔐 Segurança

- ✅ **Autenticação obrigatória** em todas as rotas
- ✅ **Senhas hasheadas** com bcrypt
- ✅ **Roles e permissões** por tipo de usuário
- ✅ **Soft delete** (desativação ao invés de remoção)
- ✅ **Logs de auditoria** de todas as ações

---

## 📱 Design Mobile-First

### Otimizações para Celular:
- ✅ Interface responsiva
- ✅ Botões grandes e touch-friendly
- ✅ Tabs horizontais com scroll
- ✅ Modal full-screen em mobile
- ✅ Botão flutuante para ações principais
- ✅ Auto-refresh a cada 10 segundos

---

## ⚙️ Configuração do Cron Job (Fechamento Automático)

### Vercel
Adicione no `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/fechar-rodizio",
    "schedule": "0 0 * * *"
  }]
}
```

### Variável de Ambiente
```env
CRON_SECRET=sua-chave-secreta-aqui
```

---

## 🎯 Casos de Uso

### **Cenário 1: Dia Normal**

1. **8:00** - Recepcionista abre o sistema
2. Profissionais vão chegando:
   - 8:10 - Ana (Cabeleireira) → Adiciona na fila
   - 8:15 - Maria (Manicure + Depiladora) → Adiciona em ambas filas
   - 8:20 - João (Cabeleireiro) → Adiciona na fila
3. **8:30** - Primeiro cliente chega
   - Ana inicia atendimento de corte
4. **9:00** - Ana conclui
   - Ana vai para o final da fila automaticamente
   - João fica em 1º lugar
5. **12:00** - Maria vai para almoço
   - Clica em "Almoço" no app do profissional
   - Fica com status "Almoço"
6. **13:00** - Maria volta
   - Clica em "Voltar para Fila"
   - Vai para o final da fila

### **Cenário 2: Profissional Multi-Serviços**

1. Maria está em 2 filas: Manicure e Depiladora
2. Cliente pede atendimento de Manicure
3. Recepcionista coloca Maria "Atendendo" na fila de Manicure
4. Sistema automaticamente marca Maria como "ocupada" na fila de Depiladora
5. Maria conclui atendimento de Manicure
6. Volta para o final da fila de Manicure
7. Fica disponível novamente na fila de Depiladora

---

## 🐛 Solução de Problemas

### Profissional não consegue fazer login
- ✅ Verificar se o email está correto
- ✅ Verificar se o profissional está **ativo**
- ✅ Resetar senha se necessário (via admin)

### Rodízio não está atualizando
- ✅ Verificar conexão com internet
- ✅ Fazer refresh manual da página
- ✅ Auto-refresh acontece a cada 10 segundos

### Não consigo criar especialidade/profissional
- ✅ Verificar se está logado como **admin**
- ✅ Recepcionistas não têm essa permissão

---

## 📊 Próximas Melhorias (Futuro)

- [ ] Relatórios de produtividade por profissional
- [ ] Notificações push quando for sua vez
- [ ] Histórico de atendimentos por cliente
- [ ] Dashboard com estatísticas do dia
- [ ] Integração com sistema de agendamento
- [ ] Exportação de dados (CSV, Excel)
- [ ] Estimativa de tempo de espera

---

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte este README
- Verifique os logs do sistema
- Entre em contato com o suporte técnico

---

**Sistema desenvolvido para Escovato** 💜
Versão 1.0 - 2025


