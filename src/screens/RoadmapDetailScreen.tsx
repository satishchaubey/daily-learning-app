import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, BookOpen, CheckCircle, Check, Flame, Award } from 'lucide-react-native';
import { mobileApiService } from '../services/api';
import { Roadmap, Topic } from '../types';

export const RoadmapDetailScreen = ({ route, navigation }: any) => {
  const { roadmap } = route.params as { roadmap: Roadmap };
  const chapters = roadmap.chapters || [];

  const [selectedTopic, setSelectedTopic] = useState<Topic>(() => {
    if (chapters.length > 0 && chapters[0].topics.length > 0) {
      return chapters[0].topics[0];
    }
    const desc = (roadmap as any).description || roadmap.category || 'Architecture Overview';
    return {
      topicId: 'default-topic',
      title: 'Introduction to ' + roadmap.title,
      difficulty: 'EASY',
      streakTier: 'EASY_STREAK',
      visualizerType: 'NONE',
      summary: desc,
      markdownContent: '## Overview\n\n' + desc,
      readingTimeMinutes: 10,
    };
  });

  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    await mobileApiService.recordStreak('easy', selectedTopic.topicId);
    setCompleted(true);
    Alert.alert('🔥 Easy Streak Recorded!', 'You completed daily chapter reading. Your streak has been updated!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{roadmap.title}</Text>
        <View style={styles.dummy} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Book Header Banner */}
        <View style={styles.banner}>
          <Text style={styles.categoryBadge}>{roadmap.category}</Text>
          <Text style={styles.bannerTitle}>{roadmap.title}</Text>
          <Text style={styles.bannerDesc}>{(roadmap as any).description || `${roadmap.totalTopics || 20} modules covering core concepts`}</Text>
        </View>

        {/* Chapters Horizontal Scroll / Selector */}
        <Text style={styles.sectionHeading}>TABLE OF CONTENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterScroll}>
          {chapters.map((chap, cIdx) => (
            <View key={chap.chapterIndex || cIdx} style={styles.chapterGroup}>
              <Text style={styles.chapterGroupTitle}>Ch {cIdx + 1}: {chap.title}</Text>
              <View style={styles.topicChips}>
                {chap.topics.map((t) => {
                  const isSelected = selectedTopic.topicId === t.topicId;
                  return (
                    <TouchableOpacity
                      key={t.topicId}
                      style={[styles.topicChip, isSelected && styles.topicChipActive]}
                      onPress={() => {
                        setSelectedTopic(t);
                        setCompleted(false);
                      }}
                    >
                      <Text style={[styles.topicChipText, isSelected && styles.topicChipTextActive]}>
                        {t.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Reading Article Body */}
        <View style={styles.readerCard}>
          <View style={styles.readerMeta}>
            <View style={styles.metaBadge}>
              <BookOpen size={12} color="#475569" />
              <Text style={styles.metaBadgeText}>{selectedTopic.readingTimeMinutes || 10} min read</Text>
            </View>
            {completed && (
              <View style={styles.completedBadge}>
                <Check size={12} color="#10b981" />
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
            )}
          </View>

          <Text style={styles.topicTitle}>{selectedTopic.title}</Text>
          <Text style={styles.topicSummary}>{selectedTopic.summary}</Text>

          {/* Detailed Content */}
          <View style={styles.articleBody}>
            <Text style={styles.bodyParagraph}>
              {selectedTopic.markdownContent || selectedTopic.summary}
            </Text>

            <View style={styles.keyTakeaways}>
              <Text style={styles.takeawaysTitle}>Senior Architecture Bar-Raiser Checklist:</Text>
              <Text style={styles.takeawayItem}>• Understand latency vs throughput tradeoffs at 100k+ QPS.</Text>
              <Text style={styles.takeawayItem}>• Know failure modes and graceful degradation strategies.</Text>
              <Text style={styles.takeawayItem}>• Design for zero downtime deploys and multi-region replication.</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.completeBtn, completed && styles.completeBtnDone]}
            onPress={handleComplete}
            disabled={completed}
          >
            {completed ? (
              <View style={styles.btnRow}>
                <CheckCircle size={18} color="#ffffff" />
                <Text style={styles.completeBtnText}>Streak Recorded for Today</Text>
              </View>
            ) : (
              <View style={styles.btnRow}>
                <Flame size={18} color="#ffffff" />
                <Text style={styles.completeBtnText}>Mark Complete (+1 Easy Streak)</Text>
              </View>
            )}
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    maxWidth: '65%',
  },
  dummy: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  categoryBadge: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chapterScroll: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  chapterGroup: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: 240,
  },
  chapterGroupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  topicChips: {
    gap: 6,
  },
  topicChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topicChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  topicChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  topicChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  readerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  readerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  topicSummary: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 16,
  },
  articleBody: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
    marginBottom: 20,
  },
  bodyParagraph: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 16,
  },
  keyTakeaways: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  takeawaysTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  takeawayItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  completeBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnDone: {
    backgroundColor: '#10b981',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
