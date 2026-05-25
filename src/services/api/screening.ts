import apiClient from '../apiClient';
import type {
  ScreeningQuestion,
  ScreeningResult,
} from '../../types';

export interface ScreeningAnalytics {
  totalScreenings: number;
  averageScore: number;
  riskLevelDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  recentScreenings: ScreeningResult[];
}

export interface ScreeningStartResponse {
  sessionId: string;
  questions?: ScreeningQuestion[];
}

export const screeningService = {
  startScreening: async (childId: string): Promise<ScreeningStartResponse> => {
    const response = await apiClient.post<ScreeningStartResponse>('/screening/start', {
      childId,
    });
    return response.data;
  },

  getQuestions: async (): Promise<ScreeningQuestion[]> => {
    const response = await apiClient.get<ScreeningQuestion[]>('/screening/questions');
    return response.data;
  },

  submitScreening: async (_childId: string, answers: Record<string, number>): Promise<ScreeningResult> => {
    const response = await apiClient.post<ScreeningResult>('/screening/submit', answers);
    return response.data;
  },

  getResults: async (childId: string): Promise<ScreeningResult[]> => {
    const response = await apiClient.get<ScreeningResult | ScreeningResult[]>(`/screening/results/${childId}`);
    const data = response.data;
    return Array.isArray(data) ? data : [data];
  },

  getAnalytics: async (childId: string): Promise<ScreeningAnalytics> => {
    const response = await apiClient.get<ScreeningAnalytics>(`/screening/analytics/${childId}`);
    return response.data;
  },
};
