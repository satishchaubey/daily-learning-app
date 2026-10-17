export type StreakTier = 'easy' | 'medium' | 'advanced';

export interface TierStreak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface UserStreaks {
  easy: TierStreak;
  medium: TierStreak;
  advanced: TierStreak;
  freezeTokens: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'STUDENT' | 'PRO_DEV' | 'SENIOR_ARCHITECT' | 'ADMIN';
  timezone: string;
  streaks: UserStreaks;
  completedTopicIds: string[];
  solvedProblemIds: string[];
}

export interface EnrichedTopicContent {
  overview: string;
  mechanics: string[];
  codeLang: string;
  codeSnippet: string;
  tradeoffs: {
    advantages: string[];
    pitfalls: string[];
    complexity: string;
  };
  barRaiserInterview: {
    question: string;
    answer: string;
  };
  checkpointQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Topic {
  topicId: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  streakTier: 'EASY_STREAK' | 'MEDIUM_STREAK' | 'ADVANCED_STREAK';
  visualizerType: 'DSA' | 'SYSTEM_DESIGN' | 'LLD' | 'NONE';
  summary: string;
  readingTimeMinutes: number;
  markdownContent?: string;
  enrichedContent?: EnrichedTopicContent;
}

export interface Chapter {
  chapterIndex: number;
  title: string;
  topics: Topic[];
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  category: string;
  totalTopics: number;
  totalChapters: number;
  chapters: Chapter[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface Problem {
  slug: string;
  title: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  streakTier: 'EASY_STREAK' | 'MEDIUM_STREAK' | 'ADVANCED_STREAK';
  descriptionMarkdown: string;
  starterTemplates: Record<string, string>;
  testCases: TestCase[];
  visualizerPayload?: any;
}
