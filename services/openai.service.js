// OpenAI Service - Integração com ChatGPT
import axios from 'axios';

// IMPORTANTE: Em produção, mova a API key para variáveis de ambiente
// e use um backend intermediário para não expor a chave
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Configuração dos níveis de dificuldade
const DIFFICULTY_LEVELS = {
  FACIL: 'fácil',
  MEDIO: 'médio',
  DIFICIL: 'difícil',
  AVANCADO: 'avançado'
};

/**
 * Fazer requisição para a API da OpenAI
 */
async function callOpenAI(messages, temperature = 0.7, maxTokens = 1000) {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    // Silenciosamente propaga o erro para o sistema de fallback tratar
    throw error;
  }
}

/**
 * Gerar questões automaticamente baseado em matéria e dificuldade
 * @param {string} subject - Matéria (Física, Matemática, Química)
 * @param {string} topic - Tópico específico (ex: Cinemática, Álgebra)
 * @param {string} difficulty - Nível de dificuldade
 * @param {number} quantity - Quantidade de questões
 */
export async function generateQuestions(subject, topic, difficulty = 'médio', quantity = 3) {
  const prompt = `Você é um professor especialista em ${subject} criando questões de múltipla escolha.

Crie ${quantity} questões sobre "${topic}" com nível de dificuldade ${difficulty}.

Retorne APENAS um JSON válido seguindo este formato EXATO (sem markdown, sem comentários):
{
  "questions": [
    {
      "id": 1,
      "question": "texto da pergunta",
      "alternatives": ["alternativa A", "alternativa B", "alternativa C", "alternativa D"],
      "correctAnswer": 0,
      "explanation": "explicação detalhada de por que esta é a resposta correta",
      "difficulty": "${difficulty}",
      "topic": "${topic}"
    }
  ]
}

IMPORTANTE:
- correctAnswer deve ser o índice (0, 1, 2 ou 3) da alternativa correta
- As questões devem ser educativas e precisas
- A explicação deve ensinar o conceito, não apenas confirmar a resposta
- Use português brasileiro correto`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'Você é um professor especialista em criar questões educacionais de alta qualidade. Sempre retorne JSON válido.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await callOpenAI(messages, 0.8, 2000);
    
    // Limpar possível formatação markdown
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    
    const data = JSON.parse(cleanedResponse);
    return data.questions;
  } catch (error) {
    // Propaga erro silenciosamente
    throw new Error('Não foi possível gerar questões. Tente novamente.');
  }
}

/**
 * Obter explicação detalhada de uma resposta
 * @param {string} question - A questão
 * @param {string} userAnswer - Resposta do usuário
 * @param {string} correctAnswer - Resposta correta
 * @param {string} subject - Matéria
 */
export async function getDetailedExplanation(question, userAnswer, correctAnswer, subject) {
  const prompt = `Como professor de ${subject}, explique de forma clara e didática:

Questão: ${question}

Resposta do aluno: ${userAnswer}
Resposta correta: ${correctAnswer}

Forneça:
1. Por que a resposta correta é essa
2. Qual foi o erro no raciocínio (se houver)
3. Conceito fundamental envolvido
4. Dica para não errar questões similares

Use linguagem acessível e exemplos práticos quando possível.`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'Você é um professor paciente e didático que explica conceitos de forma clara.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await callOpenAI(messages, 0.7, 500);
  } catch (error) {
    // Propaga erro para o sistema de fallback tratar
    throw error;
  }
}

/**
 * Sistema de tutoria - responder dúvidas do aluno
 * @param {string} question - Dúvida do aluno
 * @param {string} subject - Matéria relacionada
 * @param {Array} conversationHistory - Histórico da conversa
 */
export async function tutorChat(question, subject, conversationHistory = []) {
  const systemMessage = {
    role: 'system',
    content: `Você é um tutor virtual especialista em ${subject} do aplicativo Estuda+. 
    
Seu papel:
- Responder dúvidas de forma clara e didática
- Usar analogias e exemplos do dia a dia
- Dividir conceitos complexos em partes simples
- Incentivar o aluno a raciocinar
- Ser encorajador e positivo
- Usar emojis ocasionalmente para deixar o aprendizado mais leve

Regras:
- Respostas curtas e diretas (máximo 150 palavras)
- Se o aluno não entender, explique de outra forma
- Sempre pergunte se ficou claro ao final
- Use linguagem adequada para estudantes do ensino médio`
  };

  const messages = [
    systemMessage,
    ...conversationHistory,
    {
      role: 'user',
      content: question
    }
  ];

  try {
    return await callOpenAI(messages, 0.8, 300);
  } catch (error) {
    // Retorna mensagem amigável em caso de erro
    return 'Desculpe, o tutor está temporariamente indisponível. Tente usar as explicações detalhadas das questões ou busque vídeos no YouTube sobre o tema! 🎥📚';
  }
}

/**
 * Adaptar dificuldade baseado no desempenho
 * @param {Array} performanceHistory - Histórico de desempenho [{ correct: bool, difficulty: string }]
 */
export function adaptDifficulty(performanceHistory) {
  if (performanceHistory.length < 3) {
    return DIFFICULTY_LEVELS.FACIL;
  }

  // Calcular últimas 5 questões
  const recentPerformance = performanceHistory.slice(-5);
  const correctCount = recentPerformance.filter(p => p.correct).length;
  const accuracy = correctCount / recentPerformance.length;
  const currentDifficulty = recentPerformance[recentPerformance.length - 1].difficulty;

  // Lógica adaptativa
  if (accuracy >= 0.8) {
    // 80%+ de acerto - aumentar dificuldade
    switch (currentDifficulty) {
      case DIFFICULTY_LEVELS.FACIL:
        return DIFFICULTY_LEVELS.MEDIO;
      case DIFFICULTY_LEVELS.MEDIO:
        return DIFFICULTY_LEVELS.DIFICIL;
      case DIFFICULTY_LEVELS.DIFICIL:
        return DIFFICULTY_LEVELS.AVANCADO;
      default:
        return DIFFICULTY_LEVELS.AVANCADO;
    }
  } else if (accuracy <= 0.4) {
    // 40% ou menos - diminuir dificuldade
    switch (currentDifficulty) {
      case DIFFICULTY_LEVELS.AVANCADO:
        return DIFFICULTY_LEVELS.DIFICIL;
      case DIFFICULTY_LEVELS.DIFICIL:
        return DIFFICULTY_LEVELS.MEDIO;
      case DIFFICULTY_LEVELS.MEDIO:
        return DIFFICULTY_LEVELS.FACIL;
      default:
        return DIFFICULTY_LEVELS.FACIL;
    }
  }

  // Performance OK - manter nível
  return currentDifficulty;
}

/**
 * Gerar feedback motivacional baseado no desempenho
 * @param {number} score - Pontuação (0-100)
 * @param {string} subject - Matéria
 */
export async function generateMotivationalFeedback(score, subject) {
  let prompt = '';
  
  if (score >= 80) {
    prompt = `O aluno acertou ${score}% das questões de ${subject}. Dê um feedback motivacional curto (máximo 30 palavras) parabenizando e incentivando a continuar.`;
  } else if (score >= 50) {
    prompt = `O aluno acertou ${score}% das questões de ${subject}. Dê um feedback encorajador curto (máximo 30 palavras) dizendo que está no caminho certo.`;
  } else {
    prompt = `O aluno acertou apenas ${score}% das questões de ${subject}. Dê um feedback motivador curto (máximo 30 palavras) incentivando a revisar o conteúdo sem desmotivar.`;
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'Você é um professor encorajador que motiva alunos com mensagens curtas e positivas.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await callOpenAI(messages, 0.9, 100);
  } catch (error) {
    // Fallback messages silencioso
    if (score >= 80) return '🎉 Excelente trabalho! Continue assim!';
    if (score >= 50) return '💪 Bom progresso! Continue praticando!';
    return '📚 Não desanime! Revise o conteúdo e tente novamente!';
  }
}

/**
 * Sugerir conteúdo personalizado baseado em erros
 * @param {Array} wrongAnswers - Array de questões erradas
 * @param {string} subject - Matéria
 */
export async function suggestPersonalizedContent(wrongAnswers, subject) {
  if (wrongAnswers.length === 0) {
    return null;
  }

  const topics = wrongAnswers.map(q => q.topic).join(', ');
  const prompt = `O aluno está tendo dificuldade em ${subject} nos tópicos: ${topics}.

Liste 3 sugestões práticas e curtas de estudo:
1. [sugestão 1]
2. [sugestão 2]
3. [sugestão 3]

Seja específico e acionável.`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'Você é um orientador educacional que sugere estratégias de estudo eficazes.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await callOpenAI(messages, 0.7, 200);
  } catch (error) {
    // Retorna null silenciosamente em caso de erro
    return null;
  }
}

export default {
  generateQuestions,
  getDetailedExplanation,
  tutorChat,
  adaptDifficulty,
  generateMotivationalFeedback,
  suggestPersonalizedContent,
  DIFFICULTY_LEVELS
};
