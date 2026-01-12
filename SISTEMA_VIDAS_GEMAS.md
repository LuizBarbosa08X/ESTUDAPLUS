# Sistema de Vidas e Gemas - Estuda+

## 📋 Visão Geral

Implementação completa de um sistema de monetização baseado em vidas e gemas no aplicativo Estuda+.

## ⚙️ Configurações do Sistema

### Constantes (App.tsx)
```javascript
const MAX_LIVES = 5; // Máximo de vidas
const LIFE_RECHARGE_TIME = 30 * 60 * 1000; // 30 minutos em milissegundos
const LIFE_COST_GEMS = 100; // Custo em gemas para comprar 1 vida
const GEMS_PER_LESSON = 10; // Gemas ganhas por completar uma lição
const GEMS_PER_PERFECT_QUIZ = 25; // Gemas extras por acertar todas as questões
```

## 🎮 Como Funciona

### Sistema de Vidas
- **Início**: O usuário começa com 5 vidas
- **Perda de Vida**: Perde 1 vida a cada resposta errada no quiz
- **Sem Vidas**: Não pode fazer novas atividades até recarregar
- **Recarga Automática**: 1 vida a cada 30 minutos (até o máximo de 5)
- **Persistência**: As vidas são salvas no AsyncStorage

### Sistema de Gemas
- **Ganhar Gemas**:
  - 10 gemas por completar uma lição
  - 25 gemas extras se acertar todas as questões (total: 35 gemas)
- **Usar Gemas**:
  - Comprar vidas extras: 100 gemas = 1 vida
- **Persistência**: As gemas são salvas no AsyncStorage

## 🛒 Loja de Vidas

### Acessar a Loja
- Clique no indicador de vidas no topo da tela
- Ou quando ficar sem vidas, aparece um alerta com opção de comprar

### Interface
- Mostra quantidade atual de vidas
- Mostra tempo de recarga automática
- Exibe preço: 100 gemas por vida
- Mostra quantidade atual de gemas
- Botão desabilitado se:
  - Não tiver gemas suficientes
  - Já estiver com vidas cheias

## 🎨 Componentes UI

### LivesAndGemsBar
Barra superior que exibe:
- ❤️ Vidas atuais / Máximo de vidas
- 💎 Quantidade de gemas

### LivesShopModal
Modal da loja com:
- Informações sobre vidas
- Oferta de compra
- Botão de compra
- Dica sobre como ganhar gemas

## 📊 Fluxo do Usuário

1. **Jogando Quiz**:
   - Acerta: Passa para próxima questão
   - Erra: Perde 1 vida + passa para próxima questão

2. **Sem Vidas**:
   - Aparece alerta
   - Opções: Aguardar recarga ou comprar com gemas

3. **Completar Lição**:
   - Ganha 10 gemas base
   - Se acertou tudo: +25 gemas bônus

4. **Monetização**:
   - Sistema incentiva acertar para ganhar mais gemas
   - Gemas permitem continuar jogando comprando vidas
   - Cria loop de engajamento

## 🔧 Arquitetura Técnica

### Persistência de Dados
```javascript
AsyncStorage.setItem('lives', lives.toString());
AsyncStorage.setItem('gems', gems.toString());
AsyncStorage.setItem('lastLifeRecharge', timestamp.toString());
```

### Recarga Automática
- Verificação a cada minuto via `setInterval`
- Calcula quantas vidas podem ser recarregadas
- Atualiza timestamp da última recarga

### Funções Principais

#### `loseLife()`
- Decrementa 1 vida
- Salva no AsyncStorage
- Alerta se ficar sem vidas

#### `buyLife()`
- Verifica se tem gemas suficientes
- Incrementa vida, decrementa gemas
- Salva ambos no AsyncStorage

#### `addGems(amount)`
- Adiciona gemas ao total
- Salva no AsyncStorage

#### `rechargeLives()`
- Calcula tempo desde última recarga
- Adiciona vidas baseado no tempo
- Limita ao máximo de vidas

## 🎯 Estratégia de Monetização

1. **Free-to-Play**: Usuário pode jogar indefinidamente esperando recarga
2. **Pay-to-Continue**: Comprar vidas com gemas para continuar imediatamente
3. **Earn-to-Play**: Ganhar gemas jogando bem (incentiva qualidade)
4. **Loop de Engajamento**: 
   - Jogar → Ganhar Gemas → Comprar Vidas → Jogar Mais

## 📈 Possíveis Expansões Futuras

- [ ] Compra de gemas com dinheiro real (IAP)
- [ ] Sistema de daily rewards (gemas diárias)
- [ ] Missões para ganhar gemas
- [ ] Power-ups compráveis com gemas
- [ ] Vidas infinitas por tempo limitado (compra premium)
- [ ] Sistema de níveis VIP
- [ ] Eventos especiais com multiplicador de gemas

## 🐛 Solução de Problemas

### Vidas não estão recarregando
- Verifique se o `setInterval` está rodando
- Confirme que `lastLifeRecharge` está sendo salvo corretamente

### Gemas não estão sendo salvas
- Verifique permissões do AsyncStorage
- Confirme que `saveLivesAndGems()` está sendo chamado

### Modal não abre
- Verifique estado `showLivesShop`
- Confirme que `setShowLivesShop(true)` está sendo chamado

## 📝 Notas de Desenvolvimento

- AsyncStorage é assíncrono - sempre use `await`
- Vidas e gemas são integers - converter ao salvar/carregar
- Timestamps usam `Date.now()` (milissegundos)
- UI usa constantes configuráveis - fácil ajustar balance
