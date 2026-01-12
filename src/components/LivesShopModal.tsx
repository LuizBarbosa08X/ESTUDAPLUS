import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LIFE_COST_GEMS } from '../constants/app.constants';

interface LivesShopModalProps {
  visible: boolean;
  onClose: () => void;
  lives: number;
  maxLives: number;
  gems: number;
  onBuyLife: () => void;
}

export default function LivesShopModal({ visible, onClose, lives, maxLives, gems, onBuyLife }: LivesShopModalProps) {
  const canBuy = gems >= LIFE_COST_GEMS && lives < maxLives;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Loja de Vidas</Text>
          
          <View style={styles.livesShopInfo}>
            <MaterialIcons name="favorite" size={60} color="#ff4757" />
            <Text style={styles.livesShopText}>
              Suas vidas: {lives}/{maxLives}
            </Text>
            <Text style={styles.livesShopSubtext}>
              As vidas se recarregam automaticamente!
            </Text>
            <Text style={styles.livesShopSubtext}>
              1 vida a cada 30 minutos
            </Text>
          </View>
          
          <View style={styles.livesShopOffer}>
            <Text style={styles.offerTitle}>Comprar 1 Vida</Text>
            <View style={styles.offerPrice}>
              <MaterialIcons name="diamond" size={24} color="#ffd700" />
              <Text style={styles.offerPriceText}>{LIFE_COST_GEMS} gemas</Text>
            </View>
          </View>
          
          <View style={styles.currentGemsInfo}>
            <Text style={styles.currentGemsText}>
              Suas gemas: {gems}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.buyButton, !canBuy && styles.buyButtonDisabled]}
            onPress={canBuy ? onBuyLife : undefined}
            disabled={!canBuy}
          >
            <Text style={styles.buyButtonText}>
              {lives >= maxLives
                ? 'Vidas Cheias'
                : gems < LIFE_COST_GEMS
                ? 'Gemas Insuficientes'
                : 'Comprar Vida'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.earnGemsHint}>
            💡 Ganhe gemas completando lições e atividades!
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  livesShopInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  livesShopText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  livesShopSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  livesShopOffer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  offerPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offerPriceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f39c12',
  },
  currentGemsInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentGemsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  buyButton: {
    backgroundColor: '#0ea5a4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0ea5a4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buyButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  earnGemsHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
});
