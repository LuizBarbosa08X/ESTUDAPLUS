import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InfoScreen() {
  return (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={40} color="#0ea5a4" />
          <Text style={styles.infoCardTitle}>Sobre Estuda+</Text>
          <Text style={styles.infoCardText}>
            Estuda+ é uma plataforma de aprendizado interativa que ajuda você a dominar diferentes disciplinas através de aulas organizadas em jornadas.
          </Text>

          <Text style={[styles.infoCardTitle, { marginTop: 20 }]}>
            Como começar?
          </Text>
          <Text style={styles.infoCardText}>
            1. Escolha uma jornada (Física, Matemática ou Química){'\n'}
            2. Complete as aulas em ordem{'\n'}
            3. Ganhe pontos e prêmios{'\n'}
            4. Mantenha sua sequência de estudos
          </Text>
        </View>

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
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
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
  },
  infoCardText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 20,
  },
  spacer: {
    height: 120,
  },
});
