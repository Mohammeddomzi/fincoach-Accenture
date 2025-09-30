export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'savings' | 'investment' | 'debt' | 'emergency' | 'other';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  currency: string;
}

export interface AnalysisData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  categories: { [key: string]: number };
  monthlyTrend: { month: string; income: number; expenses: number }[];
  insights: string[];
}

export interface UserProfile {
  id: string;
  nickname: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  isGuest: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notifications: boolean;
  biometricAuth: boolean;
  dataExport: boolean;
  privacyMode: boolean;
}

export interface SecuritySettings {
  enableBiometric: boolean;
  sessionTimeout: number;
  dataEncryption: boolean;
  privacyMode: boolean;
}

export interface ForecastData {
  monthsToTarget: number;
  projectedAmount: number;
  monthlyContribution: number;
  confidence: 'low' | 'medium' | 'high';
}
