import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { PREMIUM_PLANS } from '../constants/app.constants';

interface ProfileScreenProps {
  onLogout: () => void;
  isPremium?: boolean;
  premiumPlan?: string;
  onUpgrade: () => void;
}

function ProfileScreen({ onLogout, isPremium = false, premiumPlan = 'free', onUpgrade }: ProfileScreenProps) {
  const [profileData] = useState({
    name: 'Luiz Barbosa',
    email: 'secretaria@gmail.com',
    level: 1,
    totalXP: 2500,
    joinDate: '15 de Janeiro de 2024',
  });

  const [friends] = useState([
    {
      id: 1,
      name: 'Marina Silva',
      status: 'online',
      level: 3,
      avatar: 'M',
      lastActive: 'Agora',
      mutualFriends: 5,
      color: '#FF6B9D',
    },
    {
      id: 2,
      name: 'Carlos Santos',
      status: 'offline',
      level: 2,
      avatar: 'C',
      lastActive: 'há 2 horas',
      mutualFriends: 3,
      color: '#C44569',
    },
    {
      id: 3,
      name: 'Ana Costa',
      status: 'online',
      level: 4,
      avatar: 'A',
      lastActive: 'Agora',
      mutualFriends: 8,
      color: '#0EA5A4',
    },
    {
      id: 4,
      name: 'Felipe Oliveira',
      status: 'offline',
      level: 1,
      avatar: 'F',
      lastActive: 'há 5 horas',
      mutualFriends: 2,
      color: '#845EC2',
    },
    {
      id: 5,
      name: 'Beatriz Lima',
      status: 'online',
      level: 5,
      avatar: 'B',
      lastActive: 'Agora',
      mutualFriends: 12,
      color: '#00D2FC',
    },
  ]);

  const [menuOptions] = useState([
    { id: 1, icon: 'settings', label: 'Configurações', color: '#666' },
    { id: 2, icon: 'bell', label: 'Notificações', color: '#666' },
    { id: 3, icon: 'help-circle', label: 'Ajuda e Suporte', color: '#666' },
    { id: 4, icon: 'log-out', label: 'Sair', color: '#E3170A' },
  ]);

  const handleMenuPress = (option: { id: number; icon: string; label: string; color: string }) => {
    if (option.id === 4) {
      Alert.alert('Sair', 'Você tem certeza que quer sair?', [
        { text: 'Cancelar', onPress: () => {} },
        { text: 'Sair', onPress: () => onLogout() },
      ]);
    } else {
      Alert.alert(option.label, `Opção de ${option.label} ainda não implementada.`);
    }
  };

  const handleAddFriend = () => {
    Alert.alert('Adicionar Amigo', 'Encontrar novos amigos em breve.');
  };

  return (
    <ScrollView style={styles.content}>
      {/* Informações do Usuário */}
      <View style={styles.userInfoSection}>
        <View style={styles.userAvatarContainer}>
          <MaterialIcons name="account-circle" size={100} color="#0ea5a4" />
          {isPremium && (
            <View style={styles.premiumBadgeAvatar}>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{profileData.name}</Text>
        {isPremium && (
          <View style={styles.premiumBadgeProfile}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>
              {PREMIUM_PLANS[premiumPlan as keyof typeof PREMIUM_PLANS].name}
            </Text>
          </View>
        )}
        <Text style={styles.userEmail}>{profileData.email}</Text>
        <View style={styles.userDivider} />
      </View>

      {/* Seção Premium / Upgrade */}
      {!isPremium && (
        <View style={styles.upgradeSection}>
          <View style={styles.upgradeCard}>
            <View style={styles.upgradeIconContainer}>
              <Ionicons name="rocket" size={40} color="#FFD700" />
            </View>
            <Text style={styles.upgradeTitle}>Desbloqueie Todo o Potencial!</Text>
            <Text style={styles.upgradeDescription}>
              Tenha acesso ilimitado a todos os conteúdos, tutor IA 24/7, vidas infinitas e muito mais!
            </Text>
            <View style={styles.upgradeFeatures}>
              <View style={styles.upgradeFeatureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.upgradeFeatureText}>Vidas Infinitas</Text>
              </View>
              <View style={styles.upgradeFeatureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.upgradeFeatureText}>Tutor IA Ilimitado</Text>
              </View>
              <View style={styles.upgradeFeatureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.upgradeFeatureText}>Sem Anúncios</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
              <Text style={styles.upgradeButtonText}>⭐ Assinar Premium - R$ 29,90/mês</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Seção de Nível */}
      <View style={styles.levelSection}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Nível {profileData.level}</Text>
        </View>
        
        <View style={styles.levelStatsGrid}>
          <View style={styles.levelStatItem}>
            <Text style={styles.levelStatLabel}>Nível Atual</Text>
            <Text style={styles.levelStatValue}>{profileData.level}</Text>
          </View>
          <View style={styles.levelStatItem}>
            <Text style={styles.levelStatLabel}>Total XP</Text>
            <Text style={styles.levelStatValue}>{profileData.totalXP}</Text>
          </View>
          <View style={styles.levelStatItem}>
            <Text style={styles.levelStatLabel}>Membro Desde</Text>
            <Text style={styles.levelStatValueSmall}>{profileData.joinDate}</Text>
          </View>
        </View>
        
        <View style={styles.levelDivider} />
      </View>

      {/* Seção de Amigos */}
      <View style={styles.friendsSection}>
        <View style={styles.friendsHeaderContainer}>
          <Text style={styles.friendsTitle}>Amigos</Text>
          <View style={styles.friendsCount}>
            <Text style={styles.friendsCountText}>{friends.length}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
          <MaterialIcons name="person-add" size={20} color="#fff" />
          <Text style={styles.addFriendButtonText}>Encontrar Amigos</Text>
        </TouchableOpacity>

        <View style={styles.friendsList}>
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <View style={styles.friendContentWrapper}>
                <View style={[styles.friendAvatar, { backgroundColor: friend.color }]}>
                  <Text style={styles.friendAvatarText}>{friend.avatar}</Text>
                </View>

                <View style={styles.friendInfo}>
                  <View style={styles.friendNameRow}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <View
                      style={[
                        styles.friendStatusDot,
                        { backgroundColor: friend.status === 'online' ? '#10B981' : '#9CA3AF' },
                      ]}
                    />
                  </View>
                  <Text style={styles.friendMeta}>
                    Nível {friend.level} · {friend.mutualFriends} amigos em comum
                  </Text>
                  <Text style={styles.friendLastActive}>{friend.lastActive}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.friendActionButton} activeOpacity={0.7}>
                <MaterialIcons name="message" size={20} color="#0ea5a4" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Seção de Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Menu</Text>
        
        {menuOptions.map((option) => (
          <TouchableOpacity 
            key={option.id} 
            style={styles.menuItem}
            onPress={() => handleMenuPress(option)}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconContainer}>
              {option.icon === 'settings' && <Ionicons name="settings-outline" size={22} color={option.color} />}
              {option.icon === 'bell' && <Ionicons name="notifications-outline" size={22} color={option.color} />}
              {option.icon === 'help-circle' && <Ionicons name="help-circle-outline" size={22} color={option.color} />}
              {option.icon === 'log-out' && <MaterialCommunityIcons name="logout" size={22} color={option.color} />}
            </View>
            <Text style={[styles.menuItemLabel, { color: option.color }]}>{option.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.menuItemChevron} />
          </TouchableOpacity>
        ))}
        
        <View style={styles.menuDivider} />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  spacer: {
    height: 40,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  userAvatarContainer: {
    marginBottom: 24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0fafb',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  userDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  levelSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  levelBadge: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  levelBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  levelStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  levelStatLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  levelStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0ea5a4',
    textAlign: 'center',
  },
  levelStatValueSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  levelDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  friendsSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  friendsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  friendsCount: {
    backgroundColor: '#0ea5a4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  friendsCountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5a4',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addFriendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  friendsList: {
    gap: 10,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  friendContentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  friendAvatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
  friendInfo: {
    flex: 1,
  },
  friendNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 6,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  friendStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  friendMeta: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  friendLastActive: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
  },
  friendActionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemChevron: {
    marginLeft: 8,
  },
  menuDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  premiumBadgeAvatar: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  premiumBadgeProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  upgradeSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  upgradeCard: {
    backgroundColor: '#5b21b6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  upgradeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  upgradeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 15,
    color: '#e9d5ff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  upgradeFeatures: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  upgradeFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  upgradeFeatureText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
});

export default ProfileScreen;
