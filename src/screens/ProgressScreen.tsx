import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function ProgressScreen() {
  const [userStats] = useState({
    currentLevel: 1,
    nextLevelXP: 300,
    currentXP: 150,
    completedLessons: 1,
    totalLessons: 6,
    streakDays: 7,
    totalXP: 2500,
  });

  const [badges] = useState([
    {
      id: 1,
      title: 'Primeiros Passos',
      description: 'Complete sua primeira lição',
      current: 1,
      total: 1,
      status: 'completed',
      icon: 'star',
      color: '#FFD700',
    },
    {
      id: 2,
      title: 'Explorador',
      description: 'Complete 5 lições',
      current: 2,
      total: 5,
      status: 'in-progress',
      icon: 'map',
      color: '#FF6B35',
    },
    {
      id: 3,
      title: 'Mestre da Matemática',
      description: 'Complete 5 lições de matemática',
      current: 0,
      total: 5,
      status: 'locked',
      icon: 'calculator',
      color: '#4A6FA5',
    },
  ]);

  const [specialGoals] = useState([
    {
      id: 1,
      title: 'Física Início',
      description: 'Complete 5 aulas',
      current: 3,
      total: 5,
      color: '#FF6B35',
      journey: 'Física',
    },
    {
      id: 2,
      title: 'Química Avançado',
      description: 'Complete 8 aulas',
      current: 4,
      total: 8,
      color: '#88B04B',
      journey: 'Química',
    },
  ]);

  const xpPercent = (userStats.currentXP / userStats.nextLevelXP) * 100;
  const lessonsPercent = (userStats.completedLessons / userStats.totalLessons) * 100;

  const renderBadge = (badge: any) => {
    let statusIcon = '🔒';
    let statusColor = '#999';

    if (badge.status === 'completed') {
      statusIcon = '✅';
      statusColor = '#88B04B';
    } else if (badge.status === 'in-progress') {
      statusIcon = '⭕';
      statusColor = '#FF6B35';
    }

    return (
      <View key={badge.id} style={styles.badgeCard}>
        <View style={styles.badgeHeader}>
          <View style={[styles.badgeIconContainer, { backgroundColor: badge.color + '20' }]}>
            {badge.icon === 'star' && <MaterialIcons name="star" size={24} color={badge.color} />}
            {badge.icon === 'map' && <MaterialCommunityIcons name="map" size={24} color={badge.color} />}
            {badge.icon === 'calculator' && <MaterialCommunityIcons name="calculator" size={24} color={badge.color} />}
          </View>
          <View style={styles.badgeTitleContainer}>
            <Text style={styles.badgeTitle}>{badge.title}</Text>
            <Text style={styles.badgeStatus}>{statusIcon}</Text>
          </View>
        </View>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        {badge.status !== 'locked' && (
          <View style={styles.badgeProgressContainer}>
            <View style={styles.badgeProgressBar}>
              <View
                style={[
                  styles.badgeProgressFill,
                  {
                    width: `${(badge.current / badge.total) * 100}%`,
                    backgroundColor: badge.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.badgeProgressText}>
              {badge.current}/{badge.total}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.content}>
      {/* Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressHeaderTitle}>Seu Progresso</Text>
      </View>

      {/* Nível Atual */}
      <View style={styles.levelInfoSection}>
        <View style={styles.levelCurrentContainer}>
          <Text style={styles.levelLabel}>Nível Atual</Text>
          <Text style={styles.levelValue}>Nível {userStats.currentLevel}</Text>
        </View>

        <View style={styles.levelProgressContainer}>
          <Text style={styles.levelProgressLabel}>Progresso para Nível 2</Text>
          <View style={styles.levelProgressBar}>
            <View
              style={[
                styles.levelProgressFill,
                { width: `${xpPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.levelProgressValue}>
            {userStats.currentXP}/{userStats.nextLevelXP} XP
          </Text>
        </View>

        <View style={styles.levelDivider} />
      </View>

      {/* Conquistas */}
      <View style={styles.achievementsSection}>
        <Text style={styles.achievementsTitle}>Conquistas</Text>

        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementLabel}>Dias Seguidos</Text>
            <Text style={styles.achievementValue}>{userStats.streakDays}</Text>
            <MaterialIcons name="local-fire-department" size={28} color="#FF6B35" />
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementLabel}>Total XP</Text>
            <Text style={styles.achievementValue}>{userStats.totalXP}</Text>
            <MaterialIcons name="stars" size={28} color="#FFD700" />
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementLabel}>Lições</Text>
            <Text style={styles.achievementValue}>
              {userStats.completedLessons}/{userStats.totalLessons}
            </Text>
            <MaterialCommunityIcons name="book-open-variant" size={28} color="#4A6FA5" />
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementLabel}>Progresso</Text>
            <View style={styles.achievementProgressBar}>
              <View
                style={[
                  styles.achievementProgressFill,
                  { width: `${lessonsPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.achievementProgressPercent}>{Math.round(lessonsPercent)}%</Text>
          </View>
        </View>

        <View style={styles.achievementsDivider} />
      </View>

      {/* Badges/Metas */}
      <View style={styles.badgesSection}>
        <Text style={styles.badgesTitle}>Suas Metas</Text>
        {badges.map(renderBadge)}
      </View>

      {/* Objetivos Especiais */}
      <View style={styles.specialGoalsSection}>
        <Text style={styles.specialGoalsTitle}>Jornadas em Progresso</Text>
        {specialGoals.map((goal) => (
          <View key={goal.id} style={[styles.specialGoalCard, { borderLeftColor: goal.color }]}>
            <View style={styles.specialGoalHeader}>
              <View>
                <Text style={styles.specialGoalTitle}>{goal.title}</Text>
                <Text style={styles.specialGoalJourney}>{goal.journey}</Text>
              </View>
              <View style={[styles.specialGoalBadge, { backgroundColor: goal.color + '20' }]}>
                <Text style={[styles.specialGoalBadgeText, { color: goal.color }]}>
                  {goal.current}/{goal.total}
                </Text>
              </View>
            </View>
            <Text style={styles.specialGoalDescription}>{goal.description}</Text>
            <View style={styles.specialGoalProgressBar}>
              <View
                style={[
                  styles.specialGoalProgressFill,
                  {
                    width: `${(goal.current / goal.total) * 100}%`,
                    backgroundColor: goal.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressHeader: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 24,
  },
  progressHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  levelInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  levelCurrentContainer: {
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  levelValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0ea5a4',
  },
  levelProgressContainer: {
    marginBottom: 16,
  },
  levelProgressLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#0ea5a4',
    borderRadius: 4,
  },
  levelProgressValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '700',
  },
  levelDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  achievementsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  achievementProgressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B35',
  },
  achievementsDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  badgesSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  badgeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgeStatus: {
    fontSize: 18,
  },
  badgeDescription: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 12,
  },
  badgeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  badgeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  badgeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  badgeProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    minWidth: 30,
  },
  specialGoalsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  specialGoalsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  specialGoalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  specialGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  specialGoalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  specialGoalJourney: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  specialGoalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specialGoalBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  specialGoalDescription: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 12,
  },
  specialGoalProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  specialGoalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  spacer: {
    height: 40,
  },
});
