// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import das Screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PremiumScreen from './src/screens/PremiumScreen';

// Import das Constantes
import { PREMIUM_PLANS } from './src/constants/app.constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [showPremiumScreen, setShowPremiumScreen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState('free');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleAuthSuccess = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // RESET COMPLETO DO PREMIUM
    try {
      await AsyncStorage.removeItem('isPremium');
      await AsyncStorage.removeItem('premiumPlan');
      setIsPremium(false);
      setPremiumPlan('free');
    } catch (error) {
      console.log('Erro ao resetar premium:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentTab('home');
  };

  const loadPremiumStatus = async () => {
    try {
      // RESET FORÇADO - Sempre começar como Free
      await AsyncStorage.removeItem('isPremium');
      await AsyncStorage.removeItem('premiumPlan');
      setIsPremium(false);
      setPremiumPlan('free');
    } catch (error) {
      console.log('Erro ao resetar premium:', error);
    }
  };

  const handleSelectPlan = async (planId) => {
    try {
      const isPremiumPlan = planId === 'premium' || planId === 'family';
      setIsPremium(isPremiumPlan);
      setPremiumPlan(planId);
      
      await AsyncStorage.setItem('isPremium', isPremiumPlan.toString());
      await AsyncStorage.setItem('premiumPlan', planId);
      
      setShowPremiumScreen(false);
      
      Alert.alert(
        '🎉 Parabéns!',
        `Você agora é um membro ${PREMIUM_PLANS[planId].name}! Aproveite todos os benefícios.`,
        [{ text: 'Começar' }]
      );
    } catch (error) {
      console.log('Erro ao ativar plano:', error);
    }
  };

  const handleTabPress = (tabName) => {
    // Animação de toque
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentTab(tabName);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'profile':
        return (
          <ProfileScreen 
            onLogout={handleLogout} 
            isPremium={isPremium}
            premiumPlan={premiumPlan}
            onUpgrade={() => setShowPremiumScreen(true)}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  // If not authenticated, show Auth screen
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}

      {/* Premium Screen Modal */}
      {showPremiumScreen && (
        <PremiumScreen
          onClose={() => setShowPremiumScreen(false)}
          onSelectPlan={handleSelectPlan}
          currentPlan={premiumPlan}
        />
      )}

      {/* Floating Navigation Menu */}
      <View style={styles.floatingNav}>
        <TouchableOpacity
          style={[styles.floatingNavItem, currentTab === 'progress' && styles.floatingNavItemActive]}
          onPress={() => handleTabPress('progress')}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: currentTab === 'progress' ? 1.15 : 1 }] }}>
            <MaterialCommunityIcons
              name="progress-check"
              size={28}
              color={currentTab === 'progress' ? '#fff' : '#0ea5a4'}
            />
          </Animated.View>
          <Text style={[styles.floatingNavLabel, { color: currentTab === 'progress' ? '#fff' : '#0ea5a4' }]}>
            Progresso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingNavItem, currentTab === 'home' && styles.floatingNavItemActive]}
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: currentTab === 'home' ? 1.15 : 1 }] }}>
            <Ionicons
              name="home"
              size={28}
              color={currentTab === 'home' ? '#fff' : '#0ea5a4'}
            />
          </Animated.View>
          <Text style={[styles.floatingNavLabel, { color: currentTab === 'home' ? '#fff' : '#0ea5a4' }]}>
            Menu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingNavItem, currentTab === 'profile' && styles.floatingNavItemActive]}
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: currentTab === 'profile' ? 1.15 : 1 }] }}>
            <Ionicons
              name="person"
              size={28}
              color={currentTab === 'profile' ? '#fff' : '#0ea5a4'}
            />
          </Animated.View>
          <Text style={[styles.floatingNavLabel, { color: currentTab === 'profile' ? '#fff' : '#0ea5a4' }]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  // Floating Navigation Menu
  floatingNav: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 60,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    flex: 1,
  },
  floatingNavItemActive: {
    backgroundColor: '#0ea5a4',
  },
  floatingNavLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
