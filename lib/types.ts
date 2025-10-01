// Types from App.tsx
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

export interface AppData {
  goals: Goal[];
  nickname: string;
  theme: 'light' | 'dark' | 'system';
  points: number;
  achievements: string[];
  challenges: any[];
  tips: any[];
  transactions: any[];
  chatHistory: ChatMessage[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
}