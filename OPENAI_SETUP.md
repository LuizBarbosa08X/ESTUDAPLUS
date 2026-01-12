# Integração OpenAI - Estuda+

## 🔑 Configuração da API Key

1. **Obter API Key da OpenAI**
   - Acesse: https://platform.openai.com/api-keys
   - Faça login ou crie uma conta
   - Clique em "Create new secret key"
   - Copie a chave gerada (só aparece uma vez!)

2. **Adicionar a API Key no projeto**
   
   Abra o arquivo: `services/openai.service.js`
   
   Substitua a linha:
   ```javascript
   const OPENAI_API_KEY = 'SUA_OPENAI_API_KEY_AQUI';
   ```
   
   Por:
   ```javascript
   const OPENAI_API_KEY = 'sk-proj-xxxxxxxxxxxxxxxxxxxxx';
   ```

## 💰 Custos da API

### Modelo GPT-4
- **Input**: ~$0.03 por 1K tokens
- **Output**: ~$0.06 por 1K tokens

### Estimativa de uso no Estuda+:
- Gerar 3 questões: ~$0.02
- Explicação detalhada: ~$0.01
- Mensagem de tutoria: ~$0.005
- **Total médio por aluno/dia**: ~$0.10 - $0.20

### Modelo GPT-3.5-turbo (Alternativa mais barata)
- **Input**: ~$0.0005 por 1K tokens
- **Output**: ~$0.0015 por 1K tokens
- **70-80% mais barato que GPT-4**

Para usar GPT-3.5, altere em `openai.service.js`:
```javascript
model: 'gpt-3.5-turbo'  // ao invés de 'gpt-4'
```

## 🎯 Funcionalidades Implementadas

### 1. Geração Automática de Questões
```javascript
const questions = await OpenAIService.generateQuestions(
  'Física',           // Matéria
  'Cinemática',       // Tópico
  'médio',            // Dificuldade
  3                   // Quantidade
);
```

### 2. Explicações Detalhadas
Quando o aluno erra, a IA explica:
- Por que a resposta está errada
- Qual é o conceito correto
- Dicas para não errar de novo

### 3. Tutor Virtual (Chat)
- Responde dúvidas em tempo real
- Mantém contexto da conversa
- Linguagem didática e acessível

### 4. Dificuldade Adaptativa
```javascript
const newDifficulty = OpenAIService.adaptDifficulty(performanceHistory);
// Ajusta automaticamente: fácil → médio → difícil → avançado
```

### 5. Feedback Motivacional
```javascript
const feedback = await OpenAIService.generateMotivationalFeedback(
  score,    // 0-100
  'Física'
);
```

### 6. Sugestões Personalizadas
Analisa erros e sugere conteúdo específico para revisar.

## 🚀 Como Usar

### No Quiz (já implementado):
1. **Botão de Tutor**: Ícone de "school" no header do quiz
2. **Explicações Automáticas**: Aparecem quando você erra uma questão
3. **Chat com IA**: Clique no botão do tutor para tirar dúvidas

### Para Gerar Questões Novas:
```javascript
// Exemplo de uso
async function loadAIQuestions() {
  try {
    const questions = await OpenAIService.generateQuestions(
      selectedJourney,  // 'Física', 'Matemática', 'Química'
      item.title,       // 'Cinemática', 'Álgebra', etc
      'médio',          // Nível de dificuldade
      5                 // Quantidade de questões
    );
    
    setCurrentQuiz({
      activity: item,
      questions: questions,
      currentQuestionIndex: 0,
      answers: [],
      showResult: false,
    });
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível gerar questões');
  }
}
```

## ⚠️ IMPORTANTE - Segurança

### ❌ NÃO fazer em produção:
```javascript
// API Key exposta no código
const OPENAI_API_KEY = 'sk-proj-xxxxx';
```

### ✅ Fazer em produção:
1. **Criar Backend Intermediário**
   ```
   App → Seu Backend (Node.js/Python) → OpenAI API
   ```

2. **Usar Variáveis de Ambiente**
   ```bash
   # .env
   OPENAI_API_KEY=sk-proj-xxxxx
   ```

3. **Implementar Rate Limiting**
   - Limitar requisições por usuário
   - Prevenir abuso

4. **Monitorar Custos**
   - Dashboard da OpenAI
   - Alertas de gastos

## 📊 Monitoramento

Acesse: https://platform.openai.com/usage

- Veja uso em tempo real
- Configure limites de gasto
- Analise performance

## 🔄 Alternativas à OpenAI

Se quiser reduzir custos:

1. **Google Gemini** (grátis inicialmente)
2. **Anthropic Claude** (similar ao GPT-4)
3. **Mistral AI** (open-source)
4. **Ollama** (rodar localmente, grátis)

## 📚 Próximos Passos

1. [ ] Adicionar botão "Gerar Quiz com IA" no HomeScreen
2. [ ] Implementar cache de questões (reduzir custos)
3. [ ] Criar sistema de feedback sobre qualidade das questões
4. [ ] Adicionar múltiplos idiomas
5. [ ] Implementar voz (text-to-speech)

## 🆘 Suporte

Se tiver problemas:
- Erro de autenticação: Verifique API key
- Erro de limite: Verifique saldo na OpenAI
- Erro de parsing: Verifique formato do JSON retornado

## 💡 Dicas de Otimização

1. **Cache**: Salve questões geradas para reutilizar
2. **Batch**: Gere múltiplas questões de uma vez
3. **Tokens**: Use prompts concisos para economizar
4. **Modelo**: Use GPT-3.5 para tarefas simples
5. **Fallback**: Tenha questões pré-definidas como backup
