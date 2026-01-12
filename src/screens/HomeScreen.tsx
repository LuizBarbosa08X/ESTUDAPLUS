// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { journeyData } from '../data/journey.data';
import { quizData } from '../data/quiz.data';
import { 
  MAX_LIVES, 
  LIFE_RECHARGE_TIME, 
  GEMS_PER_LESSON, 
  GEMS_PER_PERFECT_QUIZ,
  LIFE_COST_GEMS,
  PREMIUM_PLANS,
} from '../constants/app.constants';
import LivesAndGemsBar from '../components/LivesAndGemsBar';
import LivesShopModal from '../components/LivesShopModal';
import QuizScreen from '../components/QuizScreen';
import * as ENEMService from '../../services/enem.service';

function HomeScreen() {
  const [selectedJourney, setSelectedJourney] = useState('Física');
  const [journeyItems, setJourneyItems] = useState(journeyData.Física);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Luiz Barbosa');
  const [searchText, setSearchText] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  
  // Estados do sistema de vidas e gemas
  const [lives, setLives] = useState(MAX_LIVES);
  const [gems, setGems] = useState(0);
  const [lastLifeRecharge, setLastLifeRecharge] = useState(Date.now());
  const [showLivesShop, setShowLivesShop] = useState(false);
  
  // Estados do sistema Premium
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState('free');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Estado para carregamento de questões ENEM
  const [loadingENEM, setLoadingENEM] = useState(false);

  useEffect(() => {
    // Animação de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    loadUserData();
    loadLivesAndGems();
  }, []);

  // Recarregar vidas automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      rechargeLives();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [lives, lastLifeRecharge]);

  // Atualizar items quando trocar jornada
  useEffect(() => {
    setJourneyItems(journeyData[selectedJourney]);
    setSearchText('');
  }, [selectedJourney]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Exemplo: buscar dados do Supabase
      // const { data, error } = await supabase.from('users').select('*').single();
      // if (!error) setUserName(data.name);
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar vidas e gemas do AsyncStorage
  const loadLivesAndGems = async () => {
    try {
      const storedLives = await AsyncStorage.getItem('lives');
      const storedGems = await AsyncStorage.getItem('gems');
      const storedLastRecharge = await AsyncStorage.getItem('lastLifeRecharge');
      // const storedPremium = await AsyncStorage.getItem('isPremium');
      // const storedPlan = await AsyncStorage.getItem('premiumPlan');

      if (storedLives !== null) setLives(parseInt(storedLives));
      if (storedGems !== null) setGems(parseInt(storedGems));
      if (storedLastRecharge !== null) setLastLifeRecharge(parseInt(storedLastRecharge));
      // if (storedPremium !== null) setIsPremium(storedPremium === 'true');
      // if (storedPlan !== null) setPremiumPlan(storedPlan);
      
      // RESETAR PREMIUM - Sempre começar como Free
      setIsPremium(false);
      setPremiumPlan('free');
      await AsyncStorage.removeItem('isPremium');
      await AsyncStorage.removeItem('premiumPlan');
      
      // Verificar se precisa recarregar vidas
      rechargeLives();
    } catch (error) {
      console.log('Erro ao carregar vidas e gemas:', error);
    }
  };

  // Funções de gerenciamento Premium
  const activatePremium = async (planId) => {
    try {
      setIsPremium(true);
      setPremiumPlan(planId);
      await AsyncStorage.setItem('isPremium', 'true');
      await AsyncStorage.setItem('premiumPlan', planId);
      
      // Se for premium, dar vidas infinitas (ou muitas)
      if (planId === 'premium' || planId === 'family') {
        setLives(MAX_LIVES);
        await AsyncStorage.setItem('lives', MAX_LIVES.toString());
      }
      
      Alert.alert(
        '🎉 Bem-vindo ao Premium!',
        `Você agora tem acesso a todos os recursos ${PREMIUM_PLANS[planId].name}!`,
        [{ text: 'Começar', onPress: () => setShowPremiumModal(false) }]
      );
    } catch (error) {
      console.log('Erro ao ativar premium:', error);
    }
  };

  const checkPremiumAccess = (feature) => {
    if (isPremium) return true;
    
    // Mostrar modal de upgrade
    Alert.alert(
      '⭐ Recurso Premium',
      `Este recurso está disponível apenas para assinantes Premium.\n\nAssine agora por apenas R$ 29,90/mês!`,
      [
        { text: 'Agora Não', style: 'cancel' },
        { text: 'Ver Planos', onPress: () => setShowPremiumModal(true) }
      ]
    );
    return false;
  };

  // Salvar vidas e gemas
  const saveLivesAndGems = async (newLives, newGems) => {
    try {
      await AsyncStorage.setItem('lives', newLives.toString());
      await AsyncStorage.setItem('gems', newGems.toString());
      await AsyncStorage.setItem('lastLifeRecharge', lastLifeRecharge.toString());
    } catch (error) {
      console.log('Erro ao salvar vidas e gemas:', error);
    }
  };

  // Recarregar vidas automaticamente
  const rechargeLives = () => {
    if (lives >= MAX_LIVES) return;

    const now = Date.now();
    const timeSinceLastRecharge = now - lastLifeRecharge;
    const livesToAdd = Math.floor(timeSinceLastRecharge / LIFE_RECHARGE_TIME);

    if (livesToAdd > 0) {
      const newLives = Math.min(lives + livesToAdd, MAX_LIVES);
      const newLastRecharge = lastLifeRecharge + (livesToAdd * LIFE_RECHARGE_TIME);
      
      setLives(newLives);
      setLastLifeRecharge(newLastRecharge);
      saveLivesAndGems(newLives, gems);
    }
  };

  // Perder uma vida
  const loseLife = () => {
    if (lives > 0) {
      const newLives = lives - 1;
      setLives(newLives);
      saveLivesAndGems(newLives, gems);
      
      if (newLives === 0) {
        Alert.alert(
          '💔 Sem Vidas!',
          'Suas vidas acabaram! Aguarde 30 minutos para recarregar ou compre vidas com gemas.',
          [
            { text: 'Aguardar', style: 'cancel' },
            { text: 'Comprar Vidas', onPress: () => setShowLivesShop(true) }
          ]
        );
      }
    }
  };

  // Comprar vida com gemas
  const buyLife = () => {
    if (gems >= LIFE_COST_GEMS && lives < MAX_LIVES) {
      const newLives = lives + 1;
      const newGems = gems - LIFE_COST_GEMS;
      
      setLives(newLives);
      setGems(newGems);
      saveLivesAndGems(newLives, newGems);
      
      Alert.alert('✓ Compra Realizada!', 'Você comprou 1 vida!');
    }
  };

  // Adicionar gemas
  const addGems = (amount) => {
    const newGems = gems + amount;
    setGems(newGems);
    saveLivesAndGems(lives, newGems);
  };

  const completeActivity = (itemId, isPerfect = false) => {
    setJourneyItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, completed: true, progress: 100 }
          : item
      )
    );
    
    // Dar recompensa em gemas
    const gemsEarned = isPerfect ? GEMS_PER_LESSON + GEMS_PER_PERFECT_QUIZ : GEMS_PER_LESSON;
    addGems(gemsEarned);
    
    Alert.alert(
      '🎉 Parabéns!',
      `Você completou esta atividade!\n\n💎 +${gemsEarned} gemas ganhas!` +
      (isPerfect ? '\n⭐ Bônus por acertar todas as questões!' : ''),
      [{ text: 'OK' }]
    );
  };

  const handleCardPress = async (item) => {
    // Verificar se tem vidas
    if (lives <= 0 && !isPremium) {
      Alert.alert(
        '💔 Sem Vidas!',
        'Você precisa de vidas para fazer atividades. Aguarde a recarga ou compre vidas com gemas.',
        [
          { text: 'Aguardar', style: 'cancel' },
          { text: 'Comprar Vidas', onPress: () => setShowLivesShop(true) }
        ]
      );
      return;
    }
    
    // Verificar se é uma questão do ENEM
    if (item.isEnem) {
      try {
        setLoadingENEM(true);
        
        let questions;
        if (item.year === 0) {
          // Simulado com questões aleatórias de vários anos
          questions = await ENEMService.fetchRandomMathQuestions(5);
        } else {
          // Questões de um ano específico
          questions = await ENEMService.getENEMQuizQuestions(item.year, 5);
        }
        
        if (questions.length === 0) {
          Alert.alert('Aviso', 'Não foi possível carregar as questões. Verifique sua conexão.');
          return;
        }
        
        // Converter para formato do quiz
        const formattedQuestions = questions.map(q => ({
          id: q.id,
          question: q.question,
          alternatives: q.alternatives,
          correctAnswer: q.correctAnswer,
          isEnem: true,
          year: q.year,
        }));
        
        setSelectedCard(item);
        setCurrentQuiz({
          activity: item,
          activityKey: `enem-${item.year}`,
          questions: formattedQuestions,
          currentQuestionIndex: 0,
          answers: [],
          showResult: false,
          isEnem: true,
        });
      } catch (error) {
        console.error('Erro ao carregar questões ENEM:', error);
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível carregar as questões do ENEM. Verifique sua conexão com a internet.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoadingENEM(false);
      }
      return;
    }
    
    // Verificar se a atividade está bloqueada para usuários free (módulo 3+)
    // Módulos 1 e 2 são gratuitos, 3+ são premium
    if (!isPremium && item.id >= 3) {
      Alert.alert(
        '🔒 Conteúdo Premium',
        'Esta lição está disponível apenas para assinantes Premium!\n\nAssine agora e desbloqueie:\n\n✓ Todas as lições\n✓ Vidas infinitas\n✓ Tutor IA ilimitado\n✓ Sem anúncios',
        [
          { text: 'Mais Tarde', style: 'cancel' },
          { text: '⭐ Ver Planos', onPress: () => setShowPremiumModal(true) }
        ]
      );
      return;
    }
    
    setSelectedCard(item);
    const quizKey = `${item.id}-${selectedJourney}`;
    const questions = quizData[quizKey];
    
    if (questions) {
      setCurrentQuiz({
        activity: item,
        activityKey: quizKey, // Adicionar a chave correta aqui
        questions: questions,
        currentQuestionIndex: 0,
        answers: [],
        showResult: false,
      });
    } else {
      Alert.alert('Quiz', 'Quiz em desenvolvimento para esta atividade');
    }
  };

  const filteredItems = journeyItems.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalItems = journeyItems.length;
  const completedCount = journeyItems.filter((item) => item.completed).length;
  const journeyProgress = (completedCount / totalItems) * 100;

  // Se estiver em um quiz, mostrar a tela de quiz
  if (currentQuiz) {
    return (
      <QuizScreen 
        quiz={currentQuiz} 
        setQuiz={setCurrentQuiz} 
        onComplete={completeActivity}
        onWrongAnswer={loseLife}
      />
    );
  }

  return (
    <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
      {/* Barra de Vidas e Gemas */}
      <LivesAndGemsBar 
        lives={lives}
        gems={gems}
        maxLives={MAX_LIVES}
        onBuyLives={() => setShowLivesShop(true)}
      />
      
      {/* Modal da Loja de Vidas */}
      <LivesShopModal
        visible={showLivesShop}
        onClose={() => setShowLivesShop(false)}
        lives={lives}
        maxLives={MAX_LIVES}
        gems={gems}
        onBuyLife={buyLife}
      />
      
      <ScrollView style={styles.content} scrollEnabled>

        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <Text style={styles.greetingText}>Olá, {userName}</Text>
          <TouchableOpacity style={styles.estudaButton} onPress={() => Alert.alert('Menu', 'Menu Estuda+ pressionado')}>
            <Text style={styles.estudaText}>Estuda+</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de busca */}
        <View style={styles.searchRow}>
          <Text style={styles.checkbox}>☐</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar por assunto"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Título central */}
        <Text style={styles.centerTitle}>Escolha sua jornada</Text>

        {/* Botões de jornada */}
        <View style={styles.journeyRow}>
          {['Física', 'Matemática', 'Química', 'ENEM Matemática'].map((j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.journeyBtn, 
                selectedJourney === j && styles.journeyBtnActive,
                j === 'ENEM Matemática' && styles.journeyBtnEnem,
                selectedJourney === j && j === 'ENEM Matemática' && styles.journeyBtnEnemActive,
              ]}
              onPress={() => setSelectedJourney(j)}
            >
              <Text style={[
                styles.journeyBtnText, 
                selectedJourney === j && styles.journeyBtnTextActive,
                j === 'ENEM Matemática' && styles.journeyBtnTextEnem,
              ]}>
                {j === 'ENEM Matemática' ? '🎯 ENEM' : j}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Jornada Dinâmica com Progresso */}
        <View style={styles.section}>
          <View style={styles.journeyHeaderSection}>
            <View>
              <Text style={styles.sectionTitle}>Jornada de {selectedJourney}</Text>
              <Text style={styles.sectionSubtitle}>Complete as missões para avançar!</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{Math.round(journeyProgress)}%</Text>
            </View>
          </View>

          {/* Barra de progresso da jornada */}
          <View style={styles.journeyProgressContainer}>
            <View style={styles.journeyProgressBar}>
              <View style={[styles.journeyProgressFill, { width: `${journeyProgress}%` }]} />
            </View>
            <Text style={styles.journeyProgressText}>
              {completedCount} de {totalItems} atividades completas
            </Text>
          </View>

          {/* Mapa de Atividades - Nova versão visual */}
          {loading || loadingENEM ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0ea5a4" style={{ marginTop: 20 }} />
              {loadingENEM && (
                <Text style={styles.loadingText}>Carregando questões do ENEM...</Text>
              )}
            </View>
          ) : filteredItems.length > 0 ? (
            <View style={styles.pathContainer}>
              {filteredItems.map((item, index) => (
                <View key={item.id} style={styles.pathItemWrapper}>
                  {/* Linha conectora */}
                  {index < filteredItems.length - 1 && (
                    <View
                      style={[
                        styles.pathLine,
                        item.completed && styles.pathLineCompleted,
                      ]}
                    />
                  )}

                  {/* Item do caminho */}
                  <TouchableOpacity
                    style={[
                      styles.pathItem,
                      item.completed && styles.pathItemCompleted,
                      index % 2 === 0 && styles.pathItemLeft,
                      index % 2 === 1 && styles.pathItemRight,
                      !isPremium && !item.isEnem && item.id >= 3 && styles.pathItemLocked,
                      item.isEnem && styles.pathItemEnem,
                    ]}
                    onPress={() => handleCardPress(item)}
                  >
                    {/* Badge de Premium/Bloqueado */}
                    {!isPremium && !item.isEnem && item.id >= 3 && (
                      <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={16} color="#FFD700" />
                        <Text style={styles.lockedBadgeText}>Premium</Text>
                      </View>
                    )}
                    
                    {/* Badge do ENEM */}
                    {item.isEnem && (
                      <View style={styles.enemBadge}>
                        <Text style={styles.enemBadgeText}>🎯 ENEM</Text>
                      </View>
                    )}
                    
                    {/* Círculo indicador */}
                    <View
                      style={[
                        styles.pathCircle,
                        item.completed && styles.pathCircleCompleted,
                        !isPremium && !item.isEnem && item.id >= 3 && styles.pathCircleLocked,
                        item.isEnem && styles.pathCircleEnem,
                      ]}
                    >
                      {!isPremium && !item.isEnem && item.id >= 3 ? (
                        <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                      ) : item.isEnem ? (
                        <Text style={styles.pathCircleEnemIcon}>📝</Text>
                      ) : item.completed ? (
                        <MaterialIcons
                          name="check"
                          size={20}
                          color="#fff"
                          style={styles.pathCheckIcon}
                        />
                      ) : (
                        <Text style={styles.pathCircleNumber}>{index + 1}</Text>
                      )}
                    </View>

                    {/* Conteúdo do card */}
                    <View style={styles.pathItemContent}>
                      <Text style={styles.pathItemTitle}>{item.title}</Text>
                      <Text style={styles.pathItemSubtitle}>{item.subtitle}</Text>

                      {!item.completed && (
                        <View style={styles.pathProgressContainer}>
                          <View style={styles.pathProgressBar}>
                            <View
                              style={[
                                styles.pathProgressFill,
                                { width: `${item.progress}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.pathProgressPercent}>
                            {item.progress}%
                          </Text>
                        </View>
                      )}

                      {item.completed && (
                        <View style={styles.completedBadge}>
                          <MaterialIcons
                            name="check-circle"
                            size={16}
                            color="#28a745"
                          />
                          <Text style={styles.completedText}>Completo</Text>
                        </View>
                      )}
                    </View>

                    {/* Ícone da disciplina */}
                    <View style={styles.pathItemIcon}>
                      {selectedJourney === 'Física' && (
                        <Text style={styles.disciplineIcon}>⚛️</Text>
                      )}
                      {selectedJourney === 'Matemática' && (
                        <Text style={styles.disciplineIcon}>📐</Text>
                      )}
                      {selectedJourney === 'Química' && (
                        <Text style={styles.disciplineIcon}>🧪</Text>
                      )}
                      {selectedJourney === 'ENEM Matemática' && (
                        <Text style={styles.disciplineIcon}>🎯</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noResultsText}>Nenhuma aula encontrada</Text>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  estudaButton: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  estudaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 8,
    color: '#374151',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingRight: 12,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    color: '#111827',
    fontSize: 14,
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    color: '#0f172a',
  },
  journeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  journeyBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  journeyBtnActive: {
    backgroundColor: '#0ea5a4',
  },
  journeyBtnText: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
  },
  journeyBtnTextActive: {
    color: '#fff',
  },
  section: {
    marginTop: 6,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
  // Novo Layout de Caminho/Trilha
  pathContainer: {
    paddingVertical: 16,
  },
  pathItemWrapper: {
    marginBottom: 24,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    left: '8%',
    top: -24,
    width: 2,
    height: 24,
    backgroundColor: '#d0d0d0',
    zIndex: 1,
  },
  pathLineCompleted: {
    backgroundColor: '#0ea5a4',
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 2,
  },
  pathItemLeft: {
    marginRight: '15%',
  },
  pathItemRight: {
    marginLeft: '15%',
    flexDirection: 'row-reverse',
  },
  pathItemCompleted: {
    backgroundColor: '#f0fafb',
    borderColor: '#0ea5a4',
  },
  pathItemLocked: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    opacity: 0.7,
  },
  lockedBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  pathCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0ea5a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    flexShrink: 0,
  },
  pathCircleCompleted: {
    backgroundColor: '#28a745',
  },
  pathCircleLocked: {
    backgroundColor: '#e5e7eb',
  },
  pathCircleNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  pathCheckIcon: {
    fontWeight: 'bold',
  },
  pathItemContent: {
    flex: 1,
  },
  pathItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  pathItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  pathProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pathProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pathProgressFill: {
    height: '100%',
    backgroundColor: '#0ea5a4',
  },
  pathProgressPercent: {
    fontSize: 11,
    color: '#0ea5a4',
    fontWeight: '700',
    minWidth: 30,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  completedText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  pathItemIcon: {
    marginLeft: 12,
    fontSize: 28,
  },
  disciplineIcon: {
    fontSize: 28,
  },
  journeyHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressBadge: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  journeyProgressContainer: {
    marginBottom: 24,
  },
  journeyProgressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  journeyProgressFill: {
    height: '100%',
    backgroundColor: '#0ea5a4',
  },
  journeyProgressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  // Estilos para ENEM
  journeyBtnEnem: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  journeyBtnEnemActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  journeyBtnTextEnem: {
    color: '#d97706',
  },
  pathItemEnem: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  pathCircleEnem: {
    backgroundColor: '#f59e0b',
  },
  pathCircleEnemIcon: {
    fontSize: 20,
  },
  enemBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  enemBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  spacer: {
    height: 120,
  },
});

export default HomeScreen;
