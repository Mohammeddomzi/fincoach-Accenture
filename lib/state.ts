import { create } from 'zustand';
import { SimpleStorage } from './simpleStorage';
import { Goal, Transaction, AnalysisData, UserProfile, ChatMessage, AppSettings, ForecastData, CommunityPost, CommunityComment } from './types';

interface AppState {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Analysis
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Forecast
  forecastData: ForecastData | null;
  setForecastData: (data: ForecastData) => void;
  
  // Community
  communityPosts: CommunityPost[];
  communityComments: CommunityComment[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt'>) => void;
  addCommunityComment: (comment: Omit<CommunityComment, 'id' | 'createdAt'>) => void;
  likePost: (postId: string) => void;
  likeComment: (commentId: string) => void;
  
  // App State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Actions
  initializeApp: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  resetApp: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  currency: 'SAR',
  language: 'en',
  notifications: true,
  biometricAuth: false,
  dataExport: true,
  privacyMode: true,
};

const defaultUserProfile: UserProfile = {
  id: 'guest_user',
  nickname: 'Guest User',
  currency: 'SAR',
  theme: 'system',
  isGuest: true,
  createdAt: new Date(),
  lastActive: new Date(),
};

export const useAppStore = create<AppState>()((set, get) => ({
      // Initial State
      userProfile: null,
      goals: [],
      transactions: [],
      analysisData: null,
      chatMessages: [],
      settings: defaultSettings,
      forecastData: null,
      communityPosts: [],
      communityComments: [],
      isLoading: false,
      error: null,

      // User Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),

      // Goal Actions
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => {
          const newState = { goals: [...state.goals, newGoal] };
          // Auto-save
          SimpleStorage.setItem('fincoach-data', {
            userProfile: state.userProfile,
            goals: newState.goals,
            transactions: state.transactions,
            settings: state.settings,
          });
          return newState;
        });
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date() }
              : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      completeGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, isCompleted: true, currentAmount: goal.targetAmount, updatedAt: new Date() }
              : goal
          ),
        }));
      },

      // Transaction Actions
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({ transactions: [...state.transactions, newTransaction] }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },

      // Analysis Actions
      setAnalysisData: (data) => set({ analysisData: data }),

      // Chat Actions
      addChatMessage: (messageData) => {
        const newMessage: ChatMessage = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };
        set((state) => ({ chatMessages: [...state.chatMessages, newMessage] }));
      },

      clearChat: () => set({ chatMessages: [] }),

      // Settings Actions
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Forecast Actions
      setForecastData: (data) => set({ forecastData: data }),

      // Community Actions
      addCommunityPost: (postData) => {
        const newPost: CommunityPost = {
          ...postData,
          id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };
        set((state) => ({ communityPosts: [...state.communityPosts, newPost] }));
      },

      addCommunityComment: (commentData) => {
        const newComment: CommunityComment = {
          ...commentData,
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };
        set((state) => ({ communityComments: [...state.communityComments, newComment] }));
      },

      likePost: (postId) => {
        set((state) => ({
          communityPosts: state.communityPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          ),
        }));
      },

      likeComment: (commentId) => {
        set((state) => ({
          communityComments: state.communityComments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          ),
        }));
      },

      // App State Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // App Actions
      initializeApp: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Load data from storage
          const storedData = SimpleStorage.getItem('fincoach-data');
          if (storedData) {
            set({
              userProfile: storedData.userProfile || defaultUserProfile,
              goals: storedData.goals || [],
              transactions: storedData.transactions || [],
              settings: storedData.settings || defaultSettings,
            });
          } else {
            // Initialize with defaults
            set({ userProfile: defaultUserProfile });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to initialize app', isLoading: false });
        }
      },

      exportData: async () => {
        try {
          const state = get();
          const exportData = {
            userProfile: state.userProfile,
            goals: state.goals,
            transactions: state.transactions,
            settings: state.settings,
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
          };
          return JSON.stringify(exportData, null, 2);
        } catch (error) {
          throw new Error('Failed to export data');
        }
      },

      importData: async (dataString) => {
        try {
          const data = JSON.parse(dataString);
          
          if (data.userProfile) {
            set({ userProfile: data.userProfile });
          }
          if (data.goals) {
            set({ goals: data.goals });
          }
          if (data.transactions) {
            set({ transactions: data.transactions });
          }
          if (data.settings) {
            set({ settings: data.settings });
          }
          
          // Save to storage
          SimpleStorage.setItem('fincoach-data', {
            userProfile: data.userProfile,
            goals: data.goals,
            transactions: data.transactions,
            settings: data.settings,
          });
        } catch (error) {
          throw new Error('Failed to import data');
        }
      },

      resetApp: async () => {
        try {
          SimpleStorage.clear();
          set({
            userProfile: defaultUserProfile,
            goals: [],
            transactions: [],
            analysisData: null,
            chatMessages: [],
            settings: defaultSettings,
            forecastData: null,
            error: null,
          });
        } catch (error) {
          set({ error: 'Failed to reset app' });
        }
      },
    })
);
