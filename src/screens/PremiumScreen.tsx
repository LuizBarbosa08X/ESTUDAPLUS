import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PREMIUM_PLANS } from '../constants/app.constants';

interface PremiumScreenProps {
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
  currentPlan?: string;
}

export default function PremiumScreen({ onClose, onSelectPlan, currentPlan = 'free' }: PremiumScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      Alert.alert('Plano Gratuito', 'Você já está usando o plano gratuito!');
      return;
    }

    Alert.alert(
      '💳 Confirmar Assinatura',
      `Deseja assinar o plano ${PREMIUM_PLANS[selectedPlan as keyof typeof PREMIUM_PLANS].name} por ${PREMIUM_PLANS[selectedPlan as keyof typeof PREMIUM_PLANS].priceText}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Simular pagamento (integrar com Stripe/MercadoPago depois)
            onSelectPlan(selectedPlan);
          }
        }
      ]
    );
  };

  const PlanCard = ({ plan, planData }: { plan: string; planData: any }) => {
    const isSelected = selectedPlan === plan;
    const isCurrent = currentPlan === plan;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
          planData.popular && styles.planCardPopular,
        ]}
        onPress={() => setSelectedPlan(plan)}
        activeOpacity={0.8}
      >
        {planData.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>✨ MAIS POPULAR</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={styles.planIcon}>{planData.icon}</Text>
          <Text style={styles.planName}>{planData.name}</Text>
          {isCurrent && (
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanText}>Plano Atual</Text>
            </View>
          )}
        </View>

        <View style={styles.planPriceContainer}>
          <Text style={styles.planPrice}>{planData.priceText}</Text>
          {planData.savings && (
            <Text style={styles.planSavings}>{planData.savings}</Text>
          )}
        </View>

        <View style={styles.planFeaturesList}>
          {planData.features.map((feature: string, index: number) => (
            <View key={index} style={styles.planFeatureItem}>
              <Ionicons 
                name={planData.id === 'free' ? "checkmark-circle-outline" : "checkmark-circle"} 
                size={18} 
                color={planData.id === 'free' ? '#9ca3af' : '#10b981'} 
              />
              <Text style={styles.planFeatureText}>{feature}</Text>
            </View>
          ))}
          {planData.limitations && planData.limitations.map((limitation: string, index: number) => (
            <View key={`limit-${index}`} style={styles.planFeatureItem}>
              <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
              <Text style={[styles.planFeatureText, styles.planLimitationText]}>{limitation}</Text>
            </View>
          ))}
        </View>

        {isSelected && !isCurrent && (
          <View style={styles.selectedCheckmark}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.premiumContainer}>
        <View style={styles.premiumHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.premiumTitle}>Escolha seu Plano</Text>
          <Text style={styles.premiumSubtitle}>
            Turbine seus estudos com recursos exclusivos
          </Text>
        </View>

        <ScrollView style={styles.premiumContent} showsVerticalScrollIndicator={false}>
          <PlanCard plan="free" planData={PREMIUM_PLANS.free} />
          <PlanCard plan="premium" planData={PREMIUM_PLANS.premium} />
          <PlanCard plan="family" planData={PREMIUM_PLANS.family} />

          <View style={styles.premiumInfoSection}>
            <View style={styles.premiumInfoItem}>
              <Ionicons name="shield-checkmark" size={24} color="#10b981" />
              <Text style={styles.premiumInfoText}>Cancele quando quiser</Text>
            </View>
            <View style={styles.premiumInfoItem}>
              <Ionicons name="lock-closed" size={24} color="#10b981" />
              <Text style={styles.premiumInfoText}>Pagamento 100% seguro</Text>
            </View>
            <View style={styles.premiumInfoItem}>
              <Ionicons name="people" size={24} color="#10b981" />
              <Text style={styles.premiumInfoText}>+10.000 alunos satisfeitos</Text>
            </View>
          </View>

          <View style={styles.premiumFaqSection}>
            <Text style={styles.premiumFaqTitle}>💡 Perguntas Frequentes</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Posso cancelar a qualquer momento?</Text>
              <Text style={styles.faqAnswer}>Sim! Você pode cancelar sua assinatura quando quiser, sem multas.</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Como funciona o plano Família?</Text>
              <Text style={styles.faqAnswer}>Você pode adicionar até 4 perfis (ideal para irmãos ou pais que querem acompanhar).</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>O que são vidas infinitas?</Text>
              <Text style={styles.faqAnswer}>Você nunca ficará sem vidas! Pode errar quantas vezes precisar para aprender.</Text>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.premiumFooter}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              selectedPlan === 'free' && styles.subscribeButtonDisabled,
            ]}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeButtonText}>
              {selectedPlan === 'free' 
                ? 'Continuar com Gratuito' 
                : `Assinar ${PREMIUM_PLANS[selectedPlan as keyof typeof PREMIUM_PLANS].name}`
              }
            </Text>
            {selectedPlan !== 'free' && (
              <Text style={styles.subscribeButtonPrice}>
                {PREMIUM_PLANS[selectedPlan as keyof typeof PREMIUM_PLANS].priceText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  premiumContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  premiumHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  premiumContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planCardSelected: {
    borderColor: '#10b981',
    borderWidth: 3,
  },
  planCardPopular: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1f2937',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  planIcon: {
    fontSize: 32,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  currentPlanBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentPlanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0ea5a4',
  },
  planPriceContainer: {
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  planSavings: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 4,
    fontWeight: '600',
  },
  planFeaturesList: {
    gap: 10,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planFeatureText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  planLimitationText: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  selectedCheckmark: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  premiumInfoSection: {
    marginTop: 24,
    marginBottom: 16,
    gap: 16,
  },
  premiumInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  premiumInfoText: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
  },
  premiumFaqSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  premiumFaqTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  premiumFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  subscribeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  subscribeButtonPrice: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  spacer: {
    height: 120,
  },
});
