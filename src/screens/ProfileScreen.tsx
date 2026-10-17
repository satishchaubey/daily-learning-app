import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ShieldCheck, LogOut, Flame, Shield, Award, User as UserIcon, Mail } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Candidate Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.username?.[0] || 'L').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username || 'Senior Developer'}</Text>
          <Text style={styles.email}>{user?.email || 'learner@dailymastery.dev'}</Text>
          <View style={styles.barBadge}>
            <Text style={styles.barBadgeText}>L6 BAR-RAISER CANDIDATE</Text>
          </View>
        </View>

        {/* Security & 2FA Status */}
        <Text style={styles.sectionHeading}>ACCOUNT SECURITY</Text>
        <View style={styles.securityCard}>
          <View style={styles.secRow}>
            <View style={styles.secIconBox}>
              <ShieldCheck size={20} color="#10b981" />
            </View>
            <View style={styles.secInfo}>
              <Text style={styles.secTitle}>Google Authenticator 2FA</Text>
              <Text style={styles.secDesc}>Active — 6-digit TOTP required at every login</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Multi-Tier Stats */}
        <Text style={styles.sectionHeading}>DAILY STREAK PERFORMANCE</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Flame size={18} color="#10b981" />
              <Text style={styles.statLabel}>Easy Streak (Reading):</Text>
            </View>
            <Text style={styles.statVal}>{user?.streaks?.easy?.current || 0} Days (Best: {user?.streaks?.easy?.longest || 0}d)</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Flame size={18} color="#f59e0b" />
              <Text style={styles.statLabel}>Medium Streak (Code):</Text>
            </View>
            <Text style={styles.statVal}>{user?.streaks?.medium?.current || 0} Days (Best: {user?.streaks?.medium?.longest || 0}d)</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Flame size={18} color="#f43f5e" />
              <Text style={styles.statLabel}>Advanced Streak (Sys Design):</Text>
            </View>
            <Text style={styles.statVal}>{user?.streaks?.advanced?.current || 0} Days (Best: {user?.streaks?.advanced?.longest || 0}d)</Text>
          </View>

          <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
            <View style={styles.statLeft}>
              <Shield size={18} color="#0284c7" />
              <Text style={styles.statLabel}>Streak Freeze Tokens:</Text>
            </View>
            <Text style={styles.statVal}>{user?.streaks?.freezeTokens || 0} Available</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={18} color="#e11d48" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionNote}>DevMastery Mobile v1.0.0 • Google Play Ready</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },
  username: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  email: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  barBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  barBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  securityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  secRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secInfo: {
    flex: 1,
  },
  secTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  secDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeTagText: {
    color: '#15803d',
    fontSize: 9,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  statVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '700',
  },
  versionNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
  },
});
