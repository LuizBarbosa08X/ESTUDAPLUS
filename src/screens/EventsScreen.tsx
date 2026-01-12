import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EventsScreen() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Desafio Semanal', description: 'Complete 5 aulas', date: '2024-12-17' },
    { id: '2', title: 'Torneio de Física', description: 'Compita com outros alunos', date: '2024-12-20' },
  ]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos</Text>

        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDateText}>{new Date(event.date).getDate()}</Text>
              <Text style={styles.eventMonth}>
                {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
              </Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDesc}>{event.description}</Text>
            </View>
            <TouchableOpacity style={styles.eventBtn}>
              <Text style={styles.eventBtnText}>Participar</Text>
            </TouchableOpacity>
          </View>
        ))}

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
  eventCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  eventDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  eventMonth: {
    fontSize: 11,
    color: '#fff',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  eventDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  eventBtn: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  eventBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  spacer: {
    height: 120,
  },
});
