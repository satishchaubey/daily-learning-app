import AsyncStorage from '@react-native-async-storage/async-storage';
import { Roadmap, User, Problem, StreakTier } from '../types';
import localCurriculum from '../data/curriculum.json';
import { DEFAULT_API_BASE } from '../context/AuthContext';

const DEFAULT_DEMO_USER: User = {
  _id: 'usr_demo_101',
  username: 'SeniorCandidate',
  email: 'learner@dailymastery.dev',
  role: 'PRO_DEV',
  timezone: 'Asia/Kolkata',
  streaks: {
    easy: { current: 14, longest: 21, lastActiveDate: new Date().toISOString().slice(0, 10) },
    medium: { current: 8, longest: 14, lastActiveDate: new Date().toISOString().slice(0, 10) },
    advanced: { current: 3, longest: 7, lastActiveDate: new Date().toISOString().slice(0, 10) },
    freezeTokens: 2,
  },
  completedTopicIds: ['system-design-c1-t1', 'backend-c1-t1', 'leetcode-c1-t1'],
  solvedProblemIds: ['two-sum-target'],
};

const DEFAULT_PROBLEMS: Problem[] = [
  {
    slug: 'two-sum-target',
    title: 'Two Sum & Fast Hash Map Lookup',
    category: 'Algorithms & Data Structures',
    difficulty: 'EASY',
    streakTier: 'EASY_STREAK',
    descriptionMarkdown: 'Find two indices in nums that sum to target using O(N) Hash Map.',
    starterTemplates: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', explanation: '2 + 7 = 9' },
    ],
  },
  {
    slug: 'lru-cache-impl',
    title: 'Design LRU Cache in O(1)',
    category: 'Architecture & Distributed Systems',
    difficulty: 'ADVANCED',
    streakTier: 'ADVANCED_STREAK',
    descriptionMarkdown: 'Design an LRU Cache with get and put operations in O(1) time complexity using Doubly Linked List and Hash Map.',
    starterTemplates: {
      javascript: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, val) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, val);\n    if (this.map.size > this.capacity) {\n      const firstKey = this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n  }\n}',
    },
    testCases: [
      { input: 'put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: 'returns 1, returns -1', explanation: '2 was evicted' },
    ],
  },
];

export const mobileApiService = {
  async getRoadmaps(): Promise<Roadmap[]> {
    try {
      const res = await fetch(`${DEFAULT_API_BASE}/roadmaps`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return localCurriculum as unknown as Roadmap[];
  },

  async getRoadmap(slug: string): Promise<Roadmap | null> {
    try {
      const res = await fetch(`${DEFAULT_API_BASE}/roadmaps/${slug}`);
      if (res.ok) return await res.json();
    } catch {}
    const list = localCurriculum as unknown as Roadmap[];
    return list.find((r) => r.slug === slug || r.id === slug) || null;
  },

  async getUser(): Promise<User> {
    try {
      const stored = await AsyncStorage.getItem('dm_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_DEMO_USER;
  },

  async recordStreak(tier: StreakTier, actionId?: string): Promise<User> {
    const user = await this.getUser();
    const today = new Date().toISOString().slice(0, 10);
    const tierObj = user.streaks[tier];

    if (!tierObj.lastActiveDate) {
      tierObj.current = 1;
      tierObj.longest = Math.max(tierObj.longest, 1);
      tierObj.lastActiveDate = today;
    } else {
      const last = new Date(tierObj.lastActiveDate + 'T00:00:00Z');
      const now = new Date(today + 'T00:00:00Z');
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tierObj.current += 1;
        tierObj.longest = Math.max(tierObj.longest, tierObj.current);
        tierObj.lastActiveDate = today;
      } else if (diffDays > 1) {
        tierObj.current = 1;
        tierObj.lastActiveDate = today;
      }
    }

    if (actionId) {
      if (tier === 'easy' && !user.completedTopicIds.includes(actionId)) {
        user.completedTopicIds.push(actionId);
      } else if ((tier === 'medium' || tier === 'advanced') && !user.solvedProblemIds.includes(actionId)) {
        user.solvedProblemIds.push(actionId);
      }
    }

    await AsyncStorage.setItem('dm_user', JSON.stringify(user));
    return user;
  },

  async useFreezeToken(): Promise<User> {
    const user = await this.getUser();
    if (user.streaks.freezeTokens > 0) {
      user.streaks.freezeTokens -= 1;
      const today = new Date().toISOString().slice(0, 10);
      user.streaks.easy.lastActiveDate = today;
      user.streaks.medium.lastActiveDate = today;
      user.streaks.advanced.lastActiveDate = today;
      await AsyncStorage.setItem('dm_user', JSON.stringify(user));
    }
    return user;
  },

  async getProblems(): Promise<Problem[]> {
    try {
      const res = await fetch(`${DEFAULT_API_BASE}/practice/problems`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return DEFAULT_PROBLEMS;
  },
};
