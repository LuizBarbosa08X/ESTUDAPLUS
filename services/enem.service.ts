// Serviço para buscar questões do ENEM da API
// API: https://api.enem.dev

const BASE_URL = 'https://api.enem.dev/v1';

// Interface para a estrutura da questão retornada pela API
interface ENEMApiAlternative {
  letter: string;
  text: string | null;
  file: string | null;
  isCorrect: boolean;
}

interface ENEMApiQuestion {
  title: string;
  index: number;
  discipline: string;
  language: string | null;
  year: number;
  context: string;
  files: string[];
  correctAlternative: string;
  alternativesIntroduction: string;
  alternatives: ENEMApiAlternative[];
}

interface ENEMApiResponse {
  metadata: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  questions: ENEMApiQuestion[];
}

// Interface para as questões formatadas para o app
export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  alternatives: string[];
  correctAnswer: number;
  year?: number;
  originalIndex?: number;
  files?: string[];
  isEnem: boolean;
}

// Anos disponíveis do ENEM
export const ENEM_YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];

// Cache para evitar requisições repetidas
const questionCache: { [key: string]: QuizQuestion[] } = {};

/**
 * Busca questões de matemática do ENEM
 * @param year - Ano do ENEM (ex: 2020)
 * @param limit - Número de questões para buscar
 * @param offset - Offset para paginação (questões de matemática começam após ~135)
 */
export async function fetchENEMMathQuestions(
  year: number = 2020,
  limit: number = 10,
  offset: number = 136 // Questões de matemática começam após as outras disciplinas
): Promise<QuizQuestion[]> {
  const cacheKey = `${year}-${limit}-${offset}`;
  
  // Verifica cache
  if (questionCache[cacheKey]) {
    console.log('📚 Usando questões do ENEM do cache');
    return questionCache[cacheKey];
  }

  try {
    console.log(`📚 Buscando questões de matemática do ENEM ${year}...`);
    
    const response = await fetch(
      `${BASE_URL}/exams/${year}/questions?offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar questões: ${response.status}`);
    }

    const data: ENEMApiResponse = await response.json();
    
    // Filtra apenas questões de matemática
    const mathQuestions = data.questions.filter(q => q.discipline === 'matematica');
    
    // Converte para o formato do app
    const formattedQuestions = mathQuestions
      .filter(q => {
        // Filtra questões que têm alternativas com texto (algumas têm apenas imagens)
        const hasTextAlternatives = q.alternatives.every(alt => alt.text !== null);
        return hasTextAlternatives;
      })
      .map((q, index): QuizQuestion => {
        // Encontra o índice da resposta correta
        const correctIndex = q.alternatives.findIndex(alt => alt.isCorrect);
        
        // Monta a questão com contexto + introdução das alternativas
        let questionText = '';
        if (q.context) {
          // Remove markdown e URLs de imagens do contexto para texto limpo
          const cleanContext = q.context
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove imagens markdown
            .replace(/\*\*/g, '') // Remove bold
            .replace(/_/g, '') // Remove italics
            .replace(/\n{3,}/g, '\n\n') // Remove múltiplas quebras de linha
            .trim();
          
          questionText = cleanContext + '\n\n' + q.alternativesIntroduction;
        } else {
          questionText = q.alternativesIntroduction;
        }

        return {
          id: index + 1,
          question: questionText,
          context: q.context,
          alternatives: q.alternatives.map(alt => alt.text || ''),
          correctAnswer: correctIndex >= 0 ? correctIndex : 0,
          year: q.year,
          originalIndex: q.index,
          files: q.files,
          isEnem: true,
        };
      });

    // Salva no cache
    questionCache[cacheKey] = formattedQuestions;
    
    console.log(`✅ ${formattedQuestions.length} questões de matemática carregadas`);
    return formattedQuestions;
  } catch (error) {
    console.error('❌ Erro ao buscar questões do ENEM:', error);
    throw error;
  }
}

/**
 * Busca questões aleatórias de matemática de vários anos
 * @param count - Número de questões desejadas
 */
export async function fetchRandomMathQuestions(count: number = 5): Promise<QuizQuestion[]> {
  try {
    const allQuestions: QuizQuestion[] = [];
    
    // Busca de 2-3 anos aleatórios
    const shuffledYears = [...ENEM_YEARS].sort(() => Math.random() - 0.5).slice(0, 3);
    
    for (const year of shuffledYears) {
      const questions = await fetchENEMMathQuestions(year, 15, 136);
      allQuestions.push(...questions);
    }
    
    // Embaralha e retorna a quantidade desejada
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Erro ao buscar questões aleatórias:', error);
    throw error;
  }
}

/**
 * Busca questões de um ano específico formatadas para o quiz
 * @param year - Ano do ENEM
 * @param count - Número de questões
 */
export async function getENEMQuizQuestions(
  year: number,
  count: number = 5
): Promise<QuizQuestion[]> {
  const questions = await fetchENEMMathQuestions(year, 45, 136);
  
  // Embaralha e seleciona a quantidade desejada
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Verifica se a API está disponível
 */
export async function checkAPIAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/exams`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Retorna os anos disponíveis na API
 */
export async function getAvailableYears(): Promise<number[]> {
  try {
    const response = await fetch(`${BASE_URL}/exams`);
    if (!response.ok) throw new Error('API indisponível');
    
    const data = await response.json();
    return data.value.map((exam: { year: number }) => exam.year);
  } catch {
    return ENEM_YEARS; // Retorna anos conhecidos como fallback
  }
}
