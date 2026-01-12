// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as OpenAIService from '../../services/openai.service';
import { detailedExplanations } from '../data/explanations.data';
import AITutorModal from './AITutorModal';

// Componente Quiz Screen
function QuizScreen({ quiz, setQuiz, onComplete, onWrongAnswer }) {
  const [quizState, setQuizState] = useState(quiz);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const totalQuestions = quizState.questions.length;

  const handleAnswerSelect = async (index) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);
      
      const isCorrectAnswer = index === currentQuestion.correctAnswer;
      
      // Se errou, descontar uma vida
      if (!isCorrectAnswer && onWrongAnswer) {
        onWrongAnswer();
        
        // Buscar explicação detalhada (primeiro tenta IA, depois usa fallback silenciosamente)
        setLoadingExplanation(true);
        
        // Identificar a atividade para buscar explicação - usar a chave correta
        const activityKey = quizState.activityKey || `${quizState.activity.id}-Física`;
        const explanationBank = detailedExplanations[activityKey];
        
        try {
          // Tenta OpenAI (se disponível)
          const explanation = await OpenAIService.getDetailedExplanation(
            currentQuestion.question,
            currentQuestion.alternatives[index],
            currentQuestion.alternatives[currentQuestion.correctAnswer],
            quizState.activity.title || 'Física'
          );
          setAiExplanation(explanation);
        } catch (error) {
          // FALLBACK SILENCIOSO: Usa explicação detalhada pré-definida
          // Não mostra erro ao usuário - o sistema continua funcionando perfeitamente
          
          if (explanationBank) {
            const detailedExp = explanationBank.find(
              exp => exp.id === currentQuestion.id
            );
            
            if (detailedExp) {
              const fullExplanation = detailedExp.explanation;
              
              setAiExplanation(fullExplanation);
              setYoutubeSearchTerm(detailedExp.youtubeSearch);
            } else {
              setAiExplanation('📚 Revise o conceito fundamental desta questão.\n\n💡 DICA: Busque vídeos educativos no YouTube sobre o tema para entender melhor!');
              setYoutubeSearchTerm('');
            }
          } else {
            setAiExplanation('📚 Revise o conceito fundamental desta questão.\n\n💡 DICA: Busque vídeos educativos no YouTube sobre o tema para entender melhor!');
          }
        } finally {
          setLoadingExplanation(false);
        }
      }
      
      // Registrar a resposta
      const newAnswers = [...quizState.answers];
      newAnswers.push({
        questionIndex: quizState.currentQuestionIndex,
        selected: index,
        correct: currentQuestion.correctAnswer,
        question: currentQuestion.question,
        alternatives: currentQuestion.alternatives,
      });
      
      setQuizState({
        ...quizState,
        answers: newAnswers,
      });
    }
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < totalQuestions - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1,
      });
      setSelectedAnswer(null);
      setAnswered(false);
      setAiExplanation('');
      setYoutubeSearchTerm('');
    } else {
      // Quiz finalizado
      setQuizState({ ...quizState, showResult: true });
    }
  };

  const handleFinishQuiz = () => {
    const correctCount = quizState.answers.filter(
      (ans) => ans.selected === ans.correct
    ).length;
    
    if (correctCount === totalQuestions) {
      onComplete(quizState.activity.id, true); // true = quiz perfeito
    } else {
      onComplete(quizState.activity.id, false); // false = tem erros
    }
    
    setQuiz(null);
  };

  // Tela de resultados finais
  if (quizState.showResult) {
    const correctCount = quizState.answers.filter(
      (ans) => ans.selected === ans.correct
    ).length;
    const wrongAnswers = quizState.answers.filter(
      (ans) => ans.selected !== ans.correct
    );

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.quizContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Quiz Finalizado!</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{correctCount}/{totalQuestions}</Text>
            </View>
            <Text style={styles.scoreMessage}>
              {correctCount === totalQuestions
                ? '🎉 Parabéns! Você acertou todas!'
                : `Você acertou ${correctCount} de ${totalQuestions}`}
            </Text>
          </View>

          {wrongAnswers.length > 0 && (
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>📋 Questões para Revisar</Text>
              {wrongAnswers.map((answer, idx) => (
                <View key={idx} style={styles.reviewCard}>
                  <Text style={styles.reviewQuestion}>
                    {idx + 1}. {answer.question}
                  </Text>
                  
                  <Text style={styles.reviewYourAnswer}>Sua resposta:</Text>
                  <View style={styles.wrongAnswerBox}>
                    <Text style={styles.wrongText}>❌ {answer.alternatives[answer.selected]}</Text>
                  </View>

                  <Text style={styles.reviewCorrectAnswer}>Resposta correta:</Text>
                  <View style={styles.correctAnswerBox}>
                    <Text style={styles.correctText}>✓ {answer.alternatives[answer.correct]}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishQuiz}
          >
            <Text style={styles.finishButtonText}>
              {correctCount === totalQuestions ? 'Completar Atividade' : 'Tentar Novamente'}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Tela de pergunta
  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Tutor IA */}
      <AITutorModal
        visible={showAITutor}
        onClose={() => setShowAITutor(false)}
        subject={quizState.activity.title || 'Física'}
      />
      
      <ScrollView style={styles.quizContainer}>
        {/* Header do Quiz */}
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={() => setQuiz(null)}>
            <MaterialIcons name="arrow-back" size={28} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.quizTitleContainer}>
            <Text style={styles.quizTitle}>{quizState.activity.title}</Text>
            {quizState.isEnem && (
              <View style={styles.enemIndicator}>
                <Text style={styles.enemIndicatorText}>🎯 Questão ENEM</Text>
              </View>
            )}
          </View>
          <View style={styles.quizHeaderRight}>
            <TouchableOpacity
              style={styles.tutorButton}
              onPress={() => setShowAITutor(true)}
            >
              <MaterialIcons name="school" size={22} color="#0ea5a4" />
            </TouchableOpacity>
            <View style={[styles.questionCounter, quizState.isEnem && styles.questionCounterEnem]}>
              <Text style={styles.counterText}>
                {quizState.currentQuestionIndex + 1}/{totalQuestions}
              </Text>
            </View>
          </View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${((quizState.currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Questão */}
        <View style={[styles.questionContainer, quizState.isEnem && styles.questionContainerEnem]}>
          {currentQuestion.isEnem && currentQuestion.year && (
            <View style={styles.enemYearBadge}>
              <Text style={styles.enemYearText}>ENEM {currentQuestion.year}</Text>
            </View>
          )}
          <ScrollView 
            style={styles.questionScrollView} 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </ScrollView>
        </View>

        {/* Alternativas */}
        <View style={styles.alternativesContainer}>
          {currentQuestion.alternatives.map((alternative, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            
            let backgroundColor = '#fff';
            let borderColor = '#e0e0e0';
            
            if (answered) {
              if (isSelected && isCorrect) {
                backgroundColor = '#d4edda';
                borderColor = '#28a745';
              } else if (isSelected && !isCorrect) {
                backgroundColor = '#f8d7da';
                borderColor = '#dc3545';
              } else if (isCorrectAnswer) {
                backgroundColor = '#d4edda';
                borderColor = '#28a745';
              }
            } else if (isSelected) {
              backgroundColor = '#e7f3f2';
              borderColor = '#0ea5a4';
            }

            return (
              <TouchableOpacity
                key={index}
                disabled={answered}
                style={[
                  styles.alternative,
                  {
                    backgroundColor,
                    borderColor,
                  },
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <View style={styles.alternativeCircle}>
                  <Text style={styles.alternativeLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={styles.alternativeText}>{alternative}</Text>
                {answered && (
                  <View style={styles.alternativeIcon}>
                    {isSelected && isCorrect && (
                      <MaterialIcons name="check-circle" size={24} color="#28a745" />
                    )}
                    {isSelected && !isCorrect && (
                      <MaterialIcons name="cancel" size={24} color="#dc3545" />
                    )}
                    {isCorrectAnswer && !isSelected && (
                      <MaterialIcons name="check-circle" size={24} color="#28a745" />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {answered && (
          <View
            style={[
              styles.feedbackContainer,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <MaterialIcons
              name={isCorrect ? 'check-circle' : 'error'}
              size={32}
              color={isCorrect ? '#28a745' : '#dc3545'}
            />
            <Text
              style={[
                styles.feedbackText,
                { color: isCorrect ? '#28a745' : '#dc3545' },
              ]}
            >
              {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
            </Text>
            {!isCorrect && (
              <Text style={styles.feedbackExplanation}>
                A resposta correta é: {currentQuestion.alternatives[currentQuestion.correctAnswer]}
              </Text>
            )}
            
            {/* Explicação da IA quando erra */}
            {!isCorrect && aiExplanation && (
              <View style={styles.aiExplanationContainer}>
                <View style={styles.aiExplanationHeader}>
                  <MaterialIcons name="auto-awesome" size={20} color="#0ea5a4" />
                  <Text style={styles.aiExplanationTitle}>Explicação Detalhada</Text>
                </View>
                {loadingExplanation ? (
                  <ActivityIndicator size="small" color="#0ea5a4" style={{ marginTop: 10 }} />
                ) : (
                  <>
                    <ScrollView 
                      style={styles.aiExplanationScrollView}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                    >
                      <Text style={styles.aiExplanationText} selectable={true}>
                        {aiExplanation}
                      </Text>
                    </ScrollView>
                    
                    {/* Botão para abrir YouTube */}
                    {youtubeSearchTerm && (
                      <TouchableOpacity
                        style={styles.youtubeButton}
                        onPress={() => {
                          const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchTerm)}`;
                          Linking.openURL(youtubeUrl).catch(err => 
                            Alert.alert('Erro', 'Não foi possível abrir o YouTube')
                          );
                        }}
                      >
                        <MaterialIcons name="play-circle-filled" size={24} color="#FF0000" />
                        <Text style={styles.youtubeButtonText}>Assistir Vídeo no YouTube</Text>
                        <MaterialIcons name="open-in-new" size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
            
            {/* Botão para ver resolução detalhada (sempre disponível) */}
            {isCorrect && (
              <TouchableOpacity 
                style={styles.viewSolutionButton}
                onPress={() => {
                  const activityKey = quizState.activityKey || `${quizState.activity.id}-Física`;
                  const explanationBank = detailedExplanations[activityKey];
                  
                  if (explanationBank) {
                    const detailedExp = explanationBank.find(
                      exp => exp.id === currentQuestion.id
                    );
                    
                    if (detailedExp) {
                      const fullExplanation = `${detailedExp.explanation}\n\n` +
                        `📹 **VÍDEO RECOMENDADO:**\n` +
                        `Busque no YouTube: "${detailedExp.youtubeSearch}"\n\n` +
                        `💡 **DICA:** Assista vídeos sobre o tema para entender melhor!`;
                      
                      Alert.alert(
                        '📚 Resolução Detalhada', 
                        fullExplanation,
                        [{ text: 'Entendi!', style: 'default' }],
                        { cancelable: true }
                      );
                    } else {
                      Alert.alert(
                        'Quer aprender mais?',
                        'Busque vídeos sobre este tema no YouTube para aprofundar seus conhecimentos!',
                        [{ text: 'OK', style: 'default' }]
                      );
                    }
                  }
                }}
              >
                <MaterialIcons name="lightbulb" size={18} color="#0ea5a4" />
                <Text style={styles.viewSolutionButtonText}>Ver Resolução Detalhada</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {answered && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {quizState.currentQuestionIndex < totalQuestions - 1
                ? 'Próxima Questão'
                : 'Ver Resultado'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  quizHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorButton: {
    padding: 6,
    marginRight: 8,
  },
  questionCounter: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  // Estilos para ENEM
  quizTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  enemIndicator: {
    marginTop: 4,
  },
  enemIndicatorText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  questionCounterEnem: {
    backgroundColor: '#f59e0b',
  },
  questionContainerEnem: {
    borderLeftColor: '#f59e0b',
    backgroundColor: '#fffbeb',
    maxHeight: 350,
  },
  questionScrollView: {
    maxHeight: 300,
  },
  enemYearBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  enemYearText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0ea5a4',
  },
  questionContainer: {
    marginBottom: 24,
    backgroundColor: '#f0fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5a4',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 26,
  },
  alternativesContainer: {
    marginBottom: 24,
  },
  alternative: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  alternativeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alternativeLetter: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  alternativeIcon: {
    marginLeft: 8,
  },
  feedbackContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  feedbackWrong: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  feedbackExplanation: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  aiExplanationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5a4',
    maxHeight: 500,
  },
  aiExplanationScrollView: {
    maxHeight: 450,
  },
  aiExplanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiExplanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0ea5a4',
  },
  aiExplanationText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 22,
  },
  viewSolutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e7f3f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5a4',
    gap: 8,
  },
  viewSolutionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5a4',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF0000',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  youtubeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF0000',
    flex: 1,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0ea5a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  scoreMessage: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 20,
  },
  reviewYourAnswer: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  wrongAnswerBox: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },
  wrongText: {
    fontSize: 13,
    color: '#dc3545',
    fontWeight: '600',
  },
  reviewCorrectAnswer: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  correctAnswerBox: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  correctText: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  spacer: {
    height: 120,
  },
});
