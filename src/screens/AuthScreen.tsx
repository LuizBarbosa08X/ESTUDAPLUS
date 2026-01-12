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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase.config';

function AuthScreen({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    
    setLoading(true);
    try {
      // Simulando login com sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      onAuthSuccess({ email, name: 'Usuário' });
    } catch (error) {
      setErrors({ submit: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;
    
    setLoading(true);
    try {
      // Simulando cadastro com sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.');
      setAuthMode('login');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateForgotForm()) return;
    
    setLoading(true);
    try {
      // Simulando envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Email de recuperação enviado. Verifique sua caixa de entrada.');
      setAuthMode('login');
      setEmail('');
    } catch (error) {
      setErrors({ submit: 'Erro ao enviar email. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (authMode === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
          {/* Header - Improved spacing */}
          <View style={styles.authHeaderImproved}>
            <View style={styles.logoSection}>
              <Text style={styles.authLogoTextImproved}>Estuda+</Text>
            </View>
            <Text style={styles.authSubtitleImproved}>Aprenda de forma interativa</Text>
          </View>

          {/* Card de Login */}
          <View style={styles.authCard}>
            <Text style={styles.authCardTitle}>Entrar</Text>

            {/* Email Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Email</Text>
              <View style={[styles.authInput, errors.email && styles.authInputError]}>
                <MaterialIcons name="email" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="seu@email.com"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  editable={!loading}
                  style={styles.authTextInput}
                />
              </View>
              {errors.email && <Text style={styles.authErrorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Senha</Text>
              <View style={[styles.authInput, errors.password && styles.authInputError]}>
                <MaterialIcons name="lock" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#ccc"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.authTextInput}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.authErrorText}>{errors.password}</Text>}
            </View>

            {errors.submit && <Text style={styles.authErrorText}>{errors.submit}</Text>}

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => setAuthMode('forgot')} disabled={loading}>
              <Text style={styles.authForgotLink}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.authButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.authButtonDisabled]}
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  onAuthSuccess({ email: 'usuario@google.com', name: 'Usuário Google' });
                  setLoading(false);
                }, 1500);
              }}
              disabled={loading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="g-translate" size={20} color="#fff" />
              <Text style={styles.googleButtonText}>Entrar com Google</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.authTogglContainer}>
              <Text style={styles.authToggleText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => { setAuthMode('signup'); setErrors({}); }} disabled={loading}>
                <Text style={styles.authToggleLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (authMode === 'signup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.authHeader}>
            <TouchableOpacity onPress={() => { setAuthMode('login'); setErrors({}); setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); }}>
              <MaterialIcons name="arrow-back" size={28} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.authLogoText}>Criar Conta</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Card de Signup */}
          <View style={styles.authCard}>
            {/* Name Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Nome Completo</Text>
              <View style={[styles.authInput, errors.name && styles.authInputError]}>
                <MaterialIcons name="person" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="Seu nome"
                  placeholderTextColor="#ccc"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  editable={!loading}
                  style={styles.authTextInput}
                />
              </View>
              {errors.name && <Text style={styles.authErrorText}>{errors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Email</Text>
              <View style={[styles.authInput, errors.email && styles.authInputError]}>
                <MaterialIcons name="email" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="seu@email.com"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  editable={!loading}
                  style={styles.authTextInput}
                />
              </View>
              {errors.email && <Text style={styles.authErrorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Senha</Text>
              <View style={[styles.authInput, errors.password && styles.authInputError]}>
                <MaterialIcons name="lock" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#ccc"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.authTextInput}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.authErrorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Confirmar Senha</Text>
              <View style={[styles.authInput, errors.confirmPassword && styles.authInputError]}>
                <MaterialIcons name="lock" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#ccc"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.authTextInput}
                />
              </View>
              {errors.confirmPassword && <Text style={styles.authErrorText}>{errors.confirmPassword}</Text>}
            </View>

            {errors.submit && <Text style={styles.authErrorText}>{errors.submit}</Text>}

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.authButtonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (authMode === 'forgot') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.authHeader}>
            <TouchableOpacity onPress={() => { setAuthMode('login'); setErrors({}); setEmail(''); }}>
              <MaterialIcons name="arrow-back" size={28} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.authLogoText}>Recuperar Senha</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Card de Recuperação */}
          <View style={styles.authCard}>
            <Text style={styles.authCardSubtitle}>Digite seu email para receber um link de recuperação</Text>

            {/* Email Input */}
            <View style={styles.authInputGroup}>
              <Text style={styles.authLabel}>Email</Text>
              <View style={[styles.authInput, errors.email && styles.authInputError]}>
                <MaterialIcons name="email" size={20} color="#0ea5a4" />
                <TextInput
                  placeholder="seu@email.com"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  editable={!loading}
                  style={styles.authTextInput}
                />
              </View>
              {errors.email && <Text style={styles.authErrorText}>{errors.email}</Text>}
            </View>

            {errors.submit && <Text style={styles.authErrorText}>{errors.submit}</Text>}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleForgotPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.authButtonText}>Enviar Link</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  authHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  authHeaderImproved: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  logoSection: {
    marginBottom: 24,
  },
  authLogoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0ea5a4',
    letterSpacing: 1,
  },
  authLogoTextImproved: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0ea5a4',
    letterSpacing: 2,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  authSubtitleImproved: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  authCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  authCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  authCardSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  authInputGroup: {
    marginBottom: 18,
  },
  authLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  authInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  authInputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  authTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    padding: 0,
  },
  authErrorText: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '600',
    marginTop: 6,
  },
  authForgotLink: {
    fontSize: 13,
    color: '#0ea5a4',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 20,
    marginTop: -8,
  },
  authButton: {
    backgroundColor: '#0ea5a4',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5a4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  authTogglContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authToggleText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  authToggleLink: {
    fontSize: 13,
    color: '#0ea5a4',
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#db4437',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#db4437',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default AuthScreen;
