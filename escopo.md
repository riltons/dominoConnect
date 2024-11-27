# Prompt para Desenvolvimento - DominoConnect

Você é um expert em desenvolvimento mobile com React Native, Expo e Supabase. Vamos desenvolver um aplicativo chamado DominoConnect com as seguintes características:

## Contexto do Sistema

O DominoConnect é um aplicativo para gestão de comunidades de jogadores de dominó, com as seguintes funcionalidades principais:

1. Sistema de Comunidades:
   - Usuários criam comunidades
   - Cada comunidade tem grupo automático no WhatsApp
   - Jogadores podem pertencer a múltiplas comunidades
   - Não é necessário ser usuário para ser jogador

2. Gestão de Jogadores:
   - Cadastro com nome e telefone
   - Indicação opcional (quem convidou)
   - Link de registro enviado por WhatsApp
   - Adição automática ao grupo da comunidade

3. Eventos e Jogos:
   - Criação de eventos na comunidade
   - Confirmação de presença via WhatsApp
   - Gestão de jogos e pontuações
   - Sistema específico de pontuação

4. Pontuação dos Jogos:
   - Batida simples = 1 ponto
   - Batida de Carroça = 2 pontos
   - Batida de Lá-e-lô = 3 pontos
   - Batida de Cruzada = 4 pontos
   - Empate = 0 pontos (próxima partida tem +1 ponto)
   - Jogo termina quando uma dupla atinge 6 pontos

## Stack Tecnológica

1. Frontend:
   - React Native com Expo
   - TypeScript
   - TailwindCSS/NativeWind
   - React Query
   - Zustand
   - React Hook Form

2. Backend:
   - Supabase
   - PostgreSQL
   - Edge Functions
   - Row Level Security

3. Integrações:
   - WhatsApp Business API
   - Expo Notifications
   - AsyncStorage

## Instruções de Desenvolvimento

Para cada aspecto do desenvolvimento que eu solicitar, preciso que você:

1. Mostre o código completo e organizado
2. Explique cada parte importante do código
3. Forneça instruções de implementação
4. Liste dependências necessárias
5. Indique melhores práticas a serem seguidas

Vou solicitar o desenvolvimento em partes, como:
- Configuração inicial do projeto
- Implementação de funcionalidades específicas
- Integrações
- Testes
- Deploy

Para cada solicitação, preciso que você mantenha consistência com o código já desenvolvido e siga as melhores práticas de desenvolvimento React Native e Typescript.

## Diretrizes de Código

1. Estrutura de Pastas:
```
src/
  components/
    common/
    screens/
    forms/
  hooks/
  services/
  store/
  types/
  utils/
  screens/
  navigation/
  config/
```

2. Padrões:
   - Componentes funcionais com TypeScript
   - Hooks customizados para lógica reutilizável
   - Context API para estados globais quando necessário
   - Services para integrações externas
   - Types separados e bem definidos

3. Estilo:
   - TailwindCSS/NativeWind para estilização
   - Tema consistente
   - Componentes responsivos
   - Acessibilidade considerada

4. Performance:
   - Memoização quando necessário
   - Lazy loading de componentes pesados
   - Otimização de re-renders
   - Gestão eficiente de recursos

5. Segurança:
   - Validação de inputs
   - Sanitização de dados
   - Políticas de RLS no Supabase
   - Tratamento seguro de tokens

## Solicitações de Desenvolvimento

Para cada parte do desenvolvimento, usarei o formato:

"Desenvolva [componente/funcionalidade] com as seguintes características:
1. [Característica 1]
2. [Característica 2]
3. [Característica 3]"

Responda sempre com:
1. Código completo e organizado
2. Explicações detalhadas
3. Instruções de implementação
4. Dependências necessárias
5. Considerações de segurança/performance

## Critérios de Qualidade

O código deve seguir:
1. Clean Code
2. SOLID Principles
3. DRY (Don't Repeat Yourself)
4. Typescript strict mode
5. ESLint padrões
6. Testes quando solicitados
7. Documentação clara

## Entregas Esperadas

Para cada solicitação, forneça:
1. Código fonte completo
2. Tipos TypeScript
3. Instruções de implementação
4. Testes (quando aplicável)
5. Documentação relevante

## Observações Importantes:
- Use comentários explicativos no código
- Indique packages necessários
- Alerte sobre possíveis problemas
- Sugira melhorias quando pertinente
- Mantenha consistência com código anterior

## Escopo do Projeto DominoConnect2

### Visão Geral
O DominoConnect2 é um aplicativo mobile projetado para auxiliar no gerenciamento de jogos presenciais de dominó. O foco principal é melhorar a experiência dos jogadores presenciais, oferecendo ferramentas para organização, pontuação e estatísticas.

### Objetivos Principais
1. Gerenciar partidas presenciais de dominó
2. Registrar pontuações e resultados
3. Manter histórico de jogos e estatísticas
4. Facilitar a organização de torneios e campeonatos

### Funcionalidades Essenciais

#### 1. Gestão de Jogadores
- Cadastro de jogadores
- Perfis com informações básicas
- Histórico individual de partidas
- Estatísticas pessoais

#### 2. Gestão de Partidas
- Registro de novas partidas
- Marcação de pontos em tempo real
- Cronômetro para controle de tempo (opcional)
- Finalização e resultado de partidas

#### 3. Estatísticas
- Pontuação total por jogador
- Número de vitórias/derrotas
- Médias de pontos
- Rankings e classificações

#### 4. Torneios
- Criação de torneios
- Gerenciamento de chaves
- Acompanhamento de resultados
- Tabelas de classificação

### Características Técnicas

#### Interface do Usuário
- Design intuitivo e fácil de usar
- Adaptado para uso durante jogos presenciais
- Visualização clara de pontuações
- Acesso rápido às funcionalidades principais

#### Armazenamento
- Dados salvos localmente no dispositivo
- Backup opcional em nuvem
- Exportação de estatísticas

#### Modo Offline
- Funcionamento completo sem necessidade de internet
- Sincronização quando conectado (opcional)

### Fases de Desenvolvimento

#### Fase 1 - MVP (Versão Atual)
- Cadastro básico de jogadores
- Registro de partidas simples
- Marcação de pontos
- Histórico básico

#### Fase 2 - Expansão
- Sistema de torneios
- Estatísticas detalhadas
- Perfis expandidos
- Backup em nuvem

#### Fase 3 - Recursos Avançados
- Rankings e premiações
- Integração com redes sociais
- Modo multiplayer online
- Recursos avançados de torneios

### Considerações Importantes
- O foco é auxiliar jogos presenciais, não substituí-los
- Interface deve ser utilizável durante as partidas
- Prioridade para funcionalidades offline
- Simplicidade e facilidade de uso são essenciais

### Limitações Atuais
- Não inclui modo de jogo virtual
- Não requer conexão constante com internet
- Foco em funcionalidades essenciais para jogos presenciais

Podemos começar? Me diga "Pronto para começar" e aguarde minha primeira solicitação de desenvolvimento.