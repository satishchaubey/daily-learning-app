import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Flame, Shield, Search, BookOpen, ChevronRight, Cpu } from 'lucide-react-native';
import { mobileApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Roadmap, User } from '../types';

export const HomeScreen = ({ navigation }: any) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      const [u, r] = await Promise.all([
        mobileApiService.getUser(),
        mobileApiService.getRoadmaps(),
      ]);
      setUser(authUser || u);
      setRoadmaps(r);
    }
    loadData();
  }, [authUser]);

  const handleUseFreeze = async () => {
    const updated = await mobileApiService.useFreezeToken();
    setUser({ ...updated });
  };

  const categories = ['All', 'AI & LLM Engineering', 'Architecture & Distributed Systems', 'Backend Engineering', 'Algorithms & Data Structures'];

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const desc = (r as any).description || r.category || '';
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.navbar}>
        <View style={styles.brandRow}>
          <View style={styles.logoIcon}>
            <Cpu size={20} color="#ffffff" />
          </View>
          <View>
            <View style={styles.badgeRow}>
              <Text style={styles.brandTitle}>DevMastery</Text>
              <View style={styles.l6Badge}>
                <Text style={styles.l6BadgeText}>L6 BAR</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>Senior SDE Prep</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.freezeBtn} onPress={handleUseFreeze}>
          <Shield size={14} color="#0284c7" />
          <Text style={styles.freezeBtnText}>
            {user?.streaks?.freezeTokens || 0} Freeze
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Streak Banner */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakIndicator}>
              <Flame size={14} color="#e11d48" />
              <Text style={styles.streakLabel}>DAILY MOMENTUM ENGINE</Text>
            </View>
            <Text style={styles.streakMidnight}>Midnight Rollover</Text>
          </View>
          <Text style={styles.streakMainTitle}>Multi-Tier Mastery Streaks</Text>
          <Text style={styles.streakDesc}>Consistency is non-negotiable for L6 Bar-Raiser</Text>

          {/* 3 Tier Badges */}
          <View style={styles.tiersRow}>
            {/* Easy Tier */}
            <View style={[styles.tierBox, { borderColor: '#a7f3d0', backgroundColor: '#ecfdf5' }]}>
              <View style={styles.tierTop}>
                <View style={[styles.tierDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.tierName}>EASY</Text>
              </View>
              <Text style={styles.tierNumber}>{user?.streaks?.easy?.current || 0}d</Text>
              <Text style={styles.tierSub}>Read Chapter</Text>
            </View>

            {/* Medium Tier */}
            <View style={[styles.tierBox, { borderColor: '#fde68a', backgroundColor: '#fffbeb' }]}>
              <View style={styles.tierTop}>
                <View style={[styles.tierDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.tierName}>MED</Text>
              </View>
              <Text style={styles.tierNumber}>{user?.streaks?.medium?.current || 0}d</Text>
              <Text style={styles.tierSub}>LeetCode</Text>
            </View>

            {/* Advanced Tier */}
            <View style={[styles.tierBox, { borderColor: '#fecdd3', backgroundColor: '#fff1f2' }]}>
              <View style={styles.tierTop}>
                <View style={[styles.tierDot, { backgroundColor: '#f43f5e' }]} />
                <Text style={styles.tierName}>ADV</Text>
              </View>
              <Text style={styles.tierNumber}>{user?.streaks?.advanced?.current || 0}d</Text>
              <Text style={styles.tierSub}>Sys Design</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 46 Tracks (System Design, AI, Redis...)"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Roadmaps List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Developer Tracks</Text>
          <Text style={styles.sectionCount}>({filteredRoadmaps.length} Books)</Text>
        </View>

        <View style={styles.cardsGrid}>
          {filteredRoadmaps.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.roadmapCard}
              onPress={() => navigation.navigate('RoadmapDetail', { roadmap: item })}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText} numberOfLines={1}>{item.category}</Text>
                </View>
                <View style={styles.modulesBadge}>
                  <BookOpen size={12} color="#64748b" />
                  <Text style={styles.modulesText}>{item.totalChapters || item.chapters?.length || 10} Ch</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {(item as any).description || `${item.totalTopics || 20} core architecture modules & tradeoffs`}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.actionText}>Read Interactive Book</Text>
                <ChevronRight size={16} color="#0f172a" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  l6Badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  l6BadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  brandSub: {
    fontSize: 10,
    color: '#64748b',
  },
  freezeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  freezeBtnText: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  streakCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  streakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#e11d48',
    letterSpacing: 0.5,
  },
  streakMidnight: {
    fontSize: 10,
    color: '#94a3b8',
  },
  streakMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  streakDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  tiersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tierBox: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  tierTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tierName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  tierNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 2,
  },
  tierSub: {
    fontSize: 9,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  chipActive: {
    backgroundColor: '#0f172a',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionCount: {
    fontSize: 13,
    color: '#64748b',
  },
  cardsGrid: {
    gap: 12,
  },
  roadmapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: '70%',
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  modulesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modulesText: {
    fontSize: 11,
    color: '#64748b',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
});
