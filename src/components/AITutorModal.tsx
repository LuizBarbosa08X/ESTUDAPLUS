// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as OpenAIService from '../../services/openai.service';

// Modal de Tutoria com IA
function AITutorModal({ visible, onClose, subject }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Olá! 👋 Sou seu tutor virtual de ${subject}. Pode me fazer qualquer pergunta sobre a matéria!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = React.useRef();

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Adicionar mensagem do usuário
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Preparar histórico para a API
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Chamar tutoria IA
      const response = await OpenAIService.tutorChat(userMessage, subject, conversationHistory);

      // Adicionar resposta da IA
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      
      // Scroll para o final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter resposta. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.tutorContainer}>
        {/* Header */}
        <View style={styles.tutorHeader}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.tutorHeaderInfo}>
            <Text style={styles.tutorHeaderTitle}>🤖 Tutor IA</Text>
            <Text style={styles.tutorHeaderSubtitle}>{subject}</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Mensagens */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.tutorMessages}
          contentContainerStyle={styles.tutorMessagesContent}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.tutorMessage,
                msg.role === 'user' ? styles.tutorMessageUser : styles.tutorMessageAssistant
              ]}
            >
              <Text style={[
                styles.tutorMessageText,
                msg.role === 'user' ? styles.tutorMessageTextUser : styles.tutorMessageTextAssistant
              ]}>
                {msg.content}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={styles.tutorMessageAssistant}>
              <ActivityIndicator size="small" color="#0ea5a4" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.tutorInputContainer}
        >
          <TextInput
            style={styles.tutorInput}
            placeholder="Digite sua dúvida..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.tutorSendButton, loading && styles.tutorSendButtonDisabled]}
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export default AITutorModal;

const styles = StyleSheet.create({
  tutorContainer: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tutorHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tutorHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  tutorHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tutorMessages: {
    flex: 1,
  },
  tutorMessagesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  tutorMessage: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  tutorMessageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ea5a4',
    borderBottomRightRadius: 4,
  },
  tutorMessageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderBottomLeftRadius: 4,
  },
  tutorMessageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tutorMessageTextUser: {
    color: '#fff',
  },
  tutorMessageTextAssistant: {
    color: '#1f2937',
  },
  tutorInputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  tutorInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1f2937',
  },
  tutorSendButton: {
    backgroundColor: '#0ea5a4',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorSendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
});
