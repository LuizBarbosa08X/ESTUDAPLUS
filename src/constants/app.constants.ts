// Configuração do Sistema de Vidas e Gemas
export const MAX_LIVES = 99; // Máximo de vidas
export const LIFE_RECHARGE_TIME = 30 * 60 * 1000; // 30 minutos em milissegundos
export const LIFE_COST_GEMS = 1; // Custo em gemas para comprar 1 vida
export const GEMS_PER_LESSON = 10; // Gemas ganhas por completar uma lição
export const GEMS_PER_PERFECT_QUIZ = 25; // Gemas extras por acertar todas

// Configuração dos Planos Premium
export const PREMIUM_PLANS = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    priceText: 'R$ 0,00',
    color: '#6b7280',
    icon: '🆓',
    features: [
      'Acesso a 3 jornadas básicas',
      '1 lição por jornada',
      'Sistema de vidas (recarga 30 min)',
      'Explicações básicas',
      'Quiz com questões básicas',
    ],
    limitations: [
      'Conteúdo limitado',
      'Sem tutor IA',
      'Com anúncios',
      'Sem badges premium',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 29.90,
    priceText: 'R$ 29,90/mês',
    color: '#FFD700',
    icon: '⭐',
    popular: true,
    features: [
      '✅ Conteúdo completo ilimitado',
      '✅ Tutor IA ilimitado (GPT-4)',
      '✅ Vidas infinitas',
      '✅ Sem anúncios',
      '✅ Estatísticas avançadas',
      '✅ Badges exclusivos',
      '✅ Rankings globais',
      '✅ Modo offline',
      '✅ Acesso antecipado a novos conteúdos',
    ],
  },
  family: {
    id: 'family',
    name: 'Família',
    price: 49.90,
    priceText: 'R$ 49,90/mês',
    color: '#10b981',
    icon: '👨‍👩‍👧‍👦',
    features: [
      '✅ Até 4 perfis',
      '✅ Tudo do Premium',
      '✅ Dashboard para pais',
      '✅ Relatórios semanais por email',
      '✅ Controle parental',
      '✅ Melhor custo-benefício',
    ],
    savings: 'Economize R$ 69,70/mês',
  },
};
