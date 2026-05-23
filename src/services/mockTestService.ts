import type { ScreeningQuestion, ScreeningResult } from '../types';
import type { ScreeningAnalytics } from './testService';

const mockQuestions: ScreeningQuestion[] = [
  {
    id: '1',
    question: 'Does your child look at you when you call their name?',
    pageNumber: 1,
    options: [
      { id: '1_a', label: 'Always', value: 0 },
      { id: '1_b', label: 'Sometimes', value: 1 },
      { id: '1_c', label: 'Never', value: 2 },
    ]
  },
  {
    id: '2',
    question: 'Does your child point to indicate that they want something?',
    pageNumber: 1,
    options: [
      { id: '2_a', label: 'Always', value: 0 },
      { id: '2_b', label: 'Sometimes', value: 1 },
      { id: '2_c', label: 'Never', value: 2 },
    ]
  }
];

export const mockTestService = {
  startScreening: async (_childId?: string): Promise<{ sessionId: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { sessionId: 'mock-session-' + Date.now() };
  },

  getQuestions: async (): Promise<ScreeningQuestion[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockQuestions;
  },

  submitAnswers: async (_sessionId: string, _answers: Record<string, string>): Promise<ScreeningResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      childName: 'Mock Child',
      predictionClass: 'Low Risk',
      confidenceScore: 0.95,
      aqScore: 1,
      riskLevel: 'Low Risk',
      probability: '95%',
      socialAttention: 0,
      jointAttention: 0,
      socialCommunication: 0,
      language: 0,
      imagination: 0,
      repetitiveBehavior: 0,
      createdAt: new Date().toISOString()
    };
  },

  getResults: async (_childId?: string): Promise<ScreeningResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      childName: 'Mock Child',
      predictionClass: 'Low Risk',
      confidenceScore: 0.95,
      aqScore: 1,
      riskLevel: 'Low Risk',
      probability: '95%',
      socialAttention: 0,
      jointAttention: 0,
      socialCommunication: 0,
      language: 0,
      imagination: 0,
      repetitiveBehavior: 0,
      createdAt: new Date().toISOString()
    };
  },

  getAnalytics: async (_childId?: string): Promise<ScreeningAnalytics> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalScreenings: 1,
      averageScore: 1,
      riskLevelDistribution: { low: 1, medium: 0, high: 0 },
      recentScreenings: []
    };
  },
};
