// Dados específicos por jornada
export const journeyData = {
  Física: [
    { id: '1', title: 'Cinemática', subtitle: 'Aula 1', progress: 65, completed: false, x: 10, y: 10 },
    { id: '2', title: 'Dinâmica', subtitle: 'Aula 2', progress: 0, completed: false, x: 50, y: 40 },
    { id: '3', title: 'Termodinâmica', subtitle: 'Aula 3', progress: 45, completed: false, x: 90, y: 70 },
    { id: '4', title: 'Ondulatória', subtitle: 'Aula 4', progress: 80, completed: false, x: 30, y: 60 },
    { id: '5', title: 'Óptica', subtitle: 'Aula 5', progress: 90, completed: true, x: 70, y: 90 },
  ],
  Matemática: [
    { id: '1', title: 'Álgebra Linear', subtitle: 'Aula 1', progress: 45, completed: false, x: 10, y: 20 },
    { id: '2', title: 'Cálculo I', subtitle: 'Aula 2', progress: 30, completed: false, x: 40, y: 35 },
    { id: '3', title: 'Geometria Analítica', subtitle: 'Aula 3', progress: 0, completed: false, x: 70, y: 50 },
    { id: '4', title: 'Trigonometria', subtitle: 'Aula 4', progress: 55, completed: false, x: 50, y: 75 },
    { id: '5', title: 'Estatística', subtitle: 'Aula 5', progress: 0, completed: false, x: 80, y: 85 },
  ],
  Química: [
    { id: '1', title: 'Estrutura Atômica', subtitle: 'Aula 1', progress: 70, completed: false, x: 15, y: 25 },
    { id: '2', title: 'Ligações Químicas', subtitle: 'Aula 2', progress: 50, completed: false, x: 45, y: 40 },
    { id: '3', title: 'Reações Químicas', subtitle: 'Aula 3', progress: 0, completed: false, x: 75, y: 60 },
    { id: '4', title: 'Termoquímica', subtitle: 'Aula 4', progress: 35, completed: false, x: 35, y: 70 },
    { id: '5', title: 'Eletroquímica', subtitle: 'Aula 5', progress: 0, completed: false, x: 65, y: 90 },
  ],
  // Jornada ENEM - Questões reais de provas anteriores
  'ENEM Matemática': [
    { id: 'enem-2023', title: 'ENEM 2023', subtitle: 'Prova Real', progress: 0, completed: false, x: 10, y: 15, isEnem: true, year: 2023 },
    { id: 'enem-2022', title: 'ENEM 2022', subtitle: 'Prova Real', progress: 0, completed: false, x: 35, y: 30, isEnem: true, year: 2022 },
    { id: 'enem-2021', title: 'ENEM 2021', subtitle: 'Prova Real', progress: 0, completed: false, x: 60, y: 45, isEnem: true, year: 2021 },
    { id: 'enem-2020', title: 'ENEM 2020', subtitle: 'Prova Real', progress: 0, completed: false, x: 85, y: 60, isEnem: true, year: 2020 },
    { id: 'enem-random', title: 'Simulado ENEM', subtitle: 'Questões Aleatórias', progress: 0, completed: false, x: 50, y: 80, isEnem: true, year: 0 },
  ],
};
