import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, Tip, Challenge, UserProfile, AppState } from '../types/finance';
import { Badge, checkEarnedBadges, calculateBadgeProgress, getNewlyEarnedBadges } from '../lib/badges';

interface AppStore extends AppState {
  // Actions
  hydrate: () => void;
  setHydrated: (hydrated: boolean) => void;
  
  // User actions
  setNickname: (nickname: string) => void;
  bumpPoints: (points: number) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  
  // Challenge actions
  joinChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string) => void;
  
  // Tip actions
  markTipAsRead: (tipId: string) => void;
  
  // Badge actions
  checkAndUpdateBadges: () => void;
  getNewlyEarnedBadges: () => Badge[];
  
  // Settings actions
  updateSettings: (updates: Partial<AppState['settings']>) => void;
}

// Generate random nickname
const generateNickname = (): string => {
  const adjectives = ['Smart', 'Wise', 'Clever', 'Bright', 'Sharp', 'Quick', 'Swift', 'Bold'];
  const nouns = ['Saver', 'Investor', 'Planner', 'Builder', 'Creator', 'Dreamer', 'Achiever', 'Winner'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}${Math.floor(Math.random() * 100)}`;
};

// Seed data
const seedTips: Tip[] = [
  {
    id: 'tip-1',
    title: 'Start with the 50/30/20 Rule',
    content: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.',
    category: 'budgeting',
    points: 10,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tip-2',
    title: 'Build an Emergency Fund',
    content: 'Aim for 3-6 months of expenses in a high-yield savings account for unexpected situations.',
    category: 'saving',
    points: 15,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tip-3',
    title: 'Pay Off High-Interest Debt First',
    content: 'Focus on debts with interest rates above 10% before investing in the stock market.',
    category: 'debt',
    points: 12,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

const seedChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'No-Spend Week',
    description: 'Avoid all non-essential purchases for 7 days. Track your savings!',
    type: 'weekly',
    reward: '50 points + Badge',
    points: 50,
    isActive: true,
    isCompleted: false,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-2',
    title: 'Save 10% Challenge',
    description: 'Save at least 10% of your income this month. Every little bit counts!',
    type: 'monthly',
    reward: '100 points + Achievement',
    points: 100,
    isActive: true,
    isCompleted: false,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-3',
    title: 'Emergency Fund Builder',
    description: 'Contribute to your emergency fund for 30 consecutive days.',
    type: 'monthly',
    reward: '150 points + Special Badge',
    points: 150,
    isActive: true,
    isCompleted: false,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [],
    createdAt: new Date().toISOString(),
  },
];

const initialState: AppState = {
  hydrated: false,
  user: {
    nickname: generateNickname(),
    points: 0,
    level: 1,
    streak: 0,
    totalSaved: 0,
    totalInvested: 0,
    joinedAt: new Date().toISOString(),
  },
  goals: [],
  tips: seedTips,
  challenges: seedChallenges,
  badges: [],
  settings: {
    currency: 'SAR',
    theme: 'system',
    guestMode: true,
    notifications: true,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      hydrate: () => {
        set({ hydrated: true });
      },
      
      setHydrated: (hydrated: boolean) => {
        set({ hydrated });
      },
      
      setNickname: (nickname: string) => {
        set((state) => ({
          user: { ...state.user, nickname },
        }));
      },
      
      bumpPoints: (points: number) => {
        set((state) => ({
          user: {
            ...state.user,
            points: state.user.points + points,
            level: Math.floor((state.user.points + points) / 100) + 1,
          },
        }));
      },
      
      updateUser: (updates: Partial<UserProfile>) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
      
      addGoal: (goalData) => {
        const now = new Date().toISOString();
        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
        
        // Award points for adding a goal
        get().bumpPoints(5);
        
        // Check for new badges
        get().checkAndUpdateBadges();
      },
      
      updateGoal: (id: string, updates: Partial<Goal>) => {
        const now = new Date().toISOString();
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: now }
              : goal
          ),
        }));
      },
      
      removeGoal: (id: string) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },
      
      completeGoal: (id: string) => {
        const goal = get().goals.find((g) => g.id === id);
        if (goal && !goal.isCompleted) {
          get().updateGoal(id, { isCompleted: true });
          get().bumpPoints(25); // Award points for completing a goal
          
          // Update user's total saved
          if (goal.type === 'savings' || goal.type === 'emergency') {
            get().updateUser({
              totalSaved: get().user.totalSaved + goal.targetAmount,
            });
          }
          
          // Check for new badges
          get().checkAndUpdateBadges();
        }
      },
      
      joinChallenge: (challengeId: string) => {
        const user = get().user;
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participants: challenge.participants.includes(user.nickname)
                    ? challenge.participants
                    : [...challenge.participants, user.nickname],
                }
              : challenge
          ),
        }));
      },
      
      completeChallenge: (challengeId: string) => {
        const challenge = get().challenges.find((c) => c.id === challengeId);
        if (challenge && !challenge.isCompleted) {
          set((state) => ({
            challenges: state.challenges.map((c) =>
              c.id === challengeId
                ? { ...c, isCompleted: true }
                : c
            ),
          }));
          
          get().bumpPoints(challenge.points);
          
          // Check for new badges
          get().checkAndUpdateBadges();
        }
      },
      
      markTipAsRead: (tipId: string) => {
        const tip = get().tips.find((t) => t.id === tipId);
        if (tip && !tip.isRead) {
          set((state) => ({
            tips: state.tips.map((t) =>
              t.id === tipId ? { ...t, isRead: true } : t
            ),
          }));
          
          get().bumpPoints(tip.points);
        }
      },
      
      checkAndUpdateBadges: () => {
        const state = get();
        const progress = calculateBadgeProgress(
          state.user,
          state.goals,
          state.challenges.filter(c => c.isCompleted).length
        );
        
        const allBadges = checkEarnedBadges(progress, state.badges);
        const newlyEarned = getNewlyEarnedBadges(allBadges, state.badges);
        
        // Award points for newly earned badges
        newlyEarned.forEach(badge => {
          get().bumpPoints(badge.points);
        });
        
        set({ badges: allBadges });
      },
      
      getNewlyEarnedBadges: () => {
        const state = get();
        const progress = calculateBadgeProgress(
          state.user,
          state.goals,
          state.challenges.filter(c => c.isCompleted).length
        );
        
        const allBadges = checkEarnedBadges(progress, state.badges);
        return getNewlyEarnedBadges(allBadges, state.badges);
      },
      
      updateSettings: (updates: Partial<AppState['settings']>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: 'fincoach.store.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        goals: state.goals,
        tips: state.tips,
        challenges: state.challenges,
        badges: state.badges,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);

// SSR-safe hook for web
export const useAppStoreSSR = () => {
  const store = useAppStore();
  
  // On web, ensure we're hydrated before using the store
  if (typeof window !== 'undefined' && !store.hydrated) {
    store.hydrate();
  }
  
  return store;
};
