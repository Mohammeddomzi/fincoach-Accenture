export type GoalType = 'savings' | 'debt' | 'investment' | 'emergency' | 'purchase';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  deadline: string; // ISO date string
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  category?: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'saving' | 'investing' | 'budgeting' | 'debt' | 'general';
  points: number;
  isRead: boolean;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'quarterly';
  reward: string;
  points: number;
  isActive: boolean;
  isCompleted: boolean;
  startDate: string;
  endDate: string;
  participants: string[]; // nicknames
  createdAt: string;
}

export interface UserProfile {
  nickname: string;
  points: number;
  level: number;
  streak: number;
  totalSaved: number;
  totalInvested: number;
  joinedAt: string;
}

export interface AppState {
  hydrated: boolean;
  user: UserProfile;
  goals: Goal[];
  tips: Tip[];
  challenges: Challenge[];
  badges: any[];
  settings: {
    currency: string;
    theme: 'light' | 'dark' | 'system';
    guestMode: boolean;
    notifications: boolean;
  };
}
