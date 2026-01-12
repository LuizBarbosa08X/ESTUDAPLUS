import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LivesAndGemsBarProps {
  lives: number;
  gems: number;
  maxLives: number;
  onBuyLives: () => void;
}

export default function LivesAndGemsBar({ lives, gems, maxLives, onBuyLives }: LivesAndGemsBarProps) {
  return (
    <View style={styles.livesGemsBar}>
      <TouchableOpacity style={styles.livesContainer} onPress={onBuyLives}>
        <MaterialIcons name="favorite" size={20} color="#ff4757" />
        <Text style={styles.livesText}>{lives}/{maxLives}</Text>
      </TouchableOpacity>
      
      <View style={styles.gemsContainer}>
        <MaterialIcons name="diamond" size={20} color="#ffd700" />
        <Text style={styles.gemsText}>{gems}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  livesGemsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  livesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4757',
  },
  gemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8dc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  gemsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f39c12',
  },
});
