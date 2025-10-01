import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Simple storage
const storage = {
  setItem: (key: string, value: any) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getItem: (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
    return null;
  },
  clear: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
};

// Types
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isCompleted: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

interface AppData {
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

// Loading dots component
const LoadingDots = () => {
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.7)).current;
  const dot3Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0.7, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
      ]).start(() => animateDots());
    };
    animateDots();
  }, []);

  return (
    <View style={styles.loadingDots}>
      <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
    </View>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [appData, setAppData] = useState<AppData>({
    goals: [],
    nickname: 'Guest User',
    theme: 'dark',
    points: 0,
    achievements: [],
    challenges: [
      { id: '1', title: 'Save 500 SAR', description: 'Save 500 SAR in any goal', points: 100, completed: false },
      { id: '2', title: '7-Day Streak', description: 'Add to goals for 7 days', points: 200, completed: false },
      { id: '3', title: 'First Goal', description: 'Create your first goal', points: 50, completed: false },
    ],
    tips: [
      { id: '1', title: 'Emergency Fund', content: 'Build 3-6 months of expenses as emergency fund', category: 'savings' },
      { id: '2', title: 'Track Expenses', content: 'Track every expense for better financial awareness', category: 'tracking' },
      { id: '3', title: 'Automate Savings', content: 'Set up automatic transfers to savings accounts', category: 'automation' },
    ],
    transactions: [],
    chatHistory: [],
  });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [whatIfData, setWhatIfData] = useState({ monthlyContribution: 500, months: 12 });
  const [confettiAnim] = useState(new Animated.Value(0));
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium' as const,
    category: 'savings',
  });

  // Load data on startup
  useEffect(() => {
    const savedData = storage.getItem('fincoach-data');
    if (savedData) {
      setAppData(savedData);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    storage.setItem('fincoach-data', appData);
  }, [appData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#34C759';
    if (progress >= 75) return '#4f7f8c';
    if (progress >= 50) return '#a5c6d5';
    return '#6b7680';
  };

  const showConfetti = () => {
    Animated.sequence([
      Animated.timing(confettiAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(confettiAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const addPoints = (points: number) => {
    setAppData(prev => ({
      ...prev,
      points: prev.points + points,
    }));
    showConfetti();
  };

  const checkAchievements = (goal: Goal) => {
    const newAchievements: string[] = [];
    
    // First goal achievement
    if (appData.goals.length === 0) {
      newAchievements.push('First Goal Created');
      addPoints(50);
    }
    
    // 500 SAR saved achievement
    if (goal.currentAmount >= 500 && !appData.achievements.includes('500 SAR Saved')) {
      newAchievements.push('500 SAR Saved');
      addPoints(100);
    }
    
    // Goal reached achievement
    if (goal.isCompleted && !appData.achievements.includes('Goal Reached')) {
      newAchievements.push('Goal Reached');
      addPoints(250);
    }
    
    if (newAchievements.length > 0) {
      setAppData(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements],
      }));
       Alert.alert('Achievement Unlocked!', `You earned: ${newAchievements.join(', ')}`);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.name.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }
    if (!newGoal.targetAmount || parseFloat(newGoal.targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name.trim(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline || '2024-12-31',
      priority: newGoal.priority,
      category: newGoal.category,
      isCompleted: false,
    };

    setAppData(prev => ({
      ...prev,
      goals: [...prev.goals, goal],
    }));

    checkAchievements(goal);

    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'medium',
      category: 'savings',
    });
    setShowAddGoal(false);
    Alert.alert('Success', 'Goal added successfully!');
  };

  const handleUpdateGoal = (goalId: string, amount: number) => {
    setAppData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      ),
    }));
  };

  const handleCompleteGoal = (goalId: string) => {
    const goal = appData.goals.find(g => g.id === goalId);
    if (goal) {
      setAppData(prev => ({
        ...prev,
        goals: prev.goals.map(g =>
          g.id === goalId
            ? { ...g, isCompleted: true, currentAmount: g.targetAmount }
            : g
        ),
      }));
      checkAchievements({ ...goal, isCompleted: true });
      Alert.alert('Congratulations!', 'Goal completed successfully!');
    }
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: chatMessage, isUser: true };
    
    // Add user message immediately
    setAppData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage],
    }));
    
    const currentMessage = chatMessage;
    setChatMessage('');
    
    try {
      // Create a placeholder bot message that will be updated with streaming content
      const botMessageId = (Date.now() + 1).toString();
      const botMessage = { 
        id: botMessageId, 
        text: '',
        isUser: false,
        isLoading: true
      };
      
      // Add loading message
      setAppData(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, botMessage],
      }));
      
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          settings: {
            currency: 'SAR',
            locale: 'en-SA'
          },
          stream: true
        }),
      });
      
      if (!response.ok) {
         throw new Error(`API request failed: ${response.status}`);
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
      
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        
        // Update the bot message with streaming content
        setAppData(prev => ({
          ...prev,
          chatHistory: prev.chatHistory.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: fullResponse, isLoading: false }
              : msg
          ),
        }));
      }
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Update the bot message with error
      const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      setAppData(prev => ({
        ...prev,
        chatHistory: prev.chatHistory.map(msg => 
          msg.id === (Date.now() + 1).toString()
            ? { ...msg, text: errorMessage, isLoading: false }
            : msg
        ),
      }));
    }
  };

  const handleWhatIfSimulation = () => {
    const totalGoals = appData.goals.reduce((sum, goal) => sum + (goal.targetAmount - goal.currentAmount), 0);
    const monthlyNeeded = totalGoals / whatIfData.months;
    const projectedSavings = whatIfData.monthlyContribution * whatIfData.months;
    
     Alert.alert(
       'What-If Simulation',
       `With ${formatCurrency(whatIfData.monthlyContribution)}/month for ${whatIfData.months} months:\n\n` +
       `Projected Savings: ${formatCurrency(projectedSavings)}\n` +
       `Monthly Need: ${formatCurrency(monthlyNeeded)}\n` +
       `You'll ${projectedSavings >= totalGoals ? 'reach' : 'be short of'} your goals!`
     );
  };

  const handleJoinChallenge = (challengeId: string) => {
    setAppData(prev => ({
      ...prev,
      challenges: prev.challenges.map(c =>
        c.id === challengeId ? { ...c, joined: true } : c
      ),
    }));
    Alert.alert('Challenge Joined!', 'Good luck completing this challenge!');
  };

  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = appData.challenges.find(c => c.id === challengeId);
    if (challenge) {
      setAppData(prev => ({
        ...prev,
        challenges: prev.challenges.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        ),
        points: prev.points + challenge.points,
      }));
      addPoints(challenge.points);
       Alert.alert('Challenge Completed!', `You earned ${challenge.points} points!`);
    }
  };

  const handleExportData = () => {
    const exportData = {
      goals: appData.goals,
      points: appData.points,
      achievements: appData.achievements,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fincoach-data.json';
    link.click();
    
    Alert.alert('Export Complete', 'Your data has been downloaded!');
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAppData(prev => ({
              ...prev,
              goals: prev.goals.filter(goal => goal.id !== goalId),
            }));
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will delete all your data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            storage.clear();
            setAppData({
              goals: [],
              nickname: 'Guest User',
              theme: 'dark',
              points: 0,
              achievements: [],
              challenges: [
                { id: '1', title: 'Save 500 SAR', description: 'Save 500 SAR in any goal', points: 100, completed: false },
                { id: '2', title: '7-Day Streak', description: 'Add to goals for 7 days', points: 200, completed: false },
                { id: '3', title: 'First Goal', description: 'Create your first goal', points: 50, completed: false },
              ],
              tips: [
                { id: '1', title: 'Emergency Fund', content: 'Build 3-6 months of expenses as emergency fund', category: 'savings' },
                { id: '2', title: 'Track Expenses', content: 'Track every expense for better financial awareness', category: 'tracking' },
                { id: '3', title: 'Automate Savings', content: 'Set up automatic transfers to savings accounts', category: 'automation' },
              ],
              transactions: [],
              chatHistory: [],
            });
            Alert.alert('Success', 'App reset successfully!');
          },
        },
      ]
    );
  };

  const renderHome = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="wallet" size={80} color="#4f7f8c" />
        </View>
        <Text style={styles.title}>FinCoach</Text>
        <Text style={styles.subtitle}>Your AI-powered financial advisor</Text>
        <Text style={styles.description}>
          Take control of your finances with intelligent insights and goal tracking.
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="analytics" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Smart Analysis</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="trophy" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Goal Tracking</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="chatbubbles" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>AI Advisor</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Privacy First</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.getStartedButton} onPress={() => setCurrentScreen('advisor')}>
        <Text style={styles.getStartedText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.trustBadge}>
        <Ionicons name="shield-checkmark" size={16} color="#34C759" />
        <Text style={styles.trustText}>Privacy Protected • No Registration Required</Text>
      </View>
    </View>
  );

  const renderAdvisor = () => (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#4f7f8c" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Advisor</Text>
        <View style={styles.navButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={24} color="#4f7f8c" />
            <Text style={styles.cardTitle}>Welcome to FinCoach!</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your AI-powered financial advisor is ready to help you achieve your goals.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowChat(true)}>
            <Ionicons name="chatbubbles" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Ask Coach</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('goals')}>
            <Ionicons name="trophy" size={20} color="#4f7f8c" />
            <Text style={styles.secondaryButtonText}>Set Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowWhatIf(true)}>
            <Ionicons name="calculator" size={20} color="#4f7f8c" />
            <Text style={styles.secondaryButtonText}>What-If Simulator</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={24} color="#34C759" />
            <Text style={styles.cardTitle}>AI Forecast</Text>
          </View>
          <Text style={styles.forecastText}>
            If you contribute {formatCurrency(500)}/month, you'll reach your goal of {formatCurrency(10000)} in 20 months.
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderGoals = () => (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('advisor')} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#4f7f8c" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Goals</Text>
        <TouchableOpacity onPress={() => setShowAddGoal(true)} style={styles.navButton}>
          <Ionicons name="add" size={24} color="#4f7f8c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {appData.goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={80} color="#6b7680" />
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your financial journey by adding your first goal
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddGoal(true)}>
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appData.goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.isCompleted || progress >= 100;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmounts}>
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                  {isCompleted && (
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  )}
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: getProgressColor(progress) }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>

                {!isCompleted && (
                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      style={styles.quickAddButton}
                      onPress={() => handleUpdateGoal(goal.id, 100)}
                    >
                      <Text style={styles.quickAddText}>+100</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickAddButton}
                      onPress={() => handleUpdateGoal(goal.id, 500)}
                    >
                      <Text style={styles.quickAddText}>+500</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleCompleteGoal(goal.id)}
                    >
                      <Text style={styles.completeButtonText}>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.whatIfButton}
                      onPress={() => setShowWhatIf(true)}
                    >
                      <Text style={styles.whatIfButtonText}>What-If</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteGoal(goal.id)}
                    >
                      <Ionicons name="trash" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('advisor')} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#4f7f8c" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={styles.navButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.settingLabel}>Nickname: {appData.nickname}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Management</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <Ionicons name="download" size={20} color="#4f7f8c" />
            <Text style={styles.settingText}>Export Data (JSON)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleResetApp}>
            <Ionicons name="refresh" size={20} color="#FF3B30" />
            <Text style={styles.settingText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trustBadge}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.trustText}>
            🔐 Privacy Protected - Your data stays on your device
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'advisor' && styles.navItemActive]}
        onPress={() => setCurrentScreen('advisor')}
      >
        <Ionicons
          name="chatbubbles-outline"
          size={24}
          color={currentScreen === 'advisor' ? '#4f7f8c' : '#6b7680'}
        />
        <Text style={[styles.navLabel, currentScreen === 'advisor' && styles.navLabelActive]}>
          Advisor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'goals' && styles.navItemActive]}
        onPress={() => setCurrentScreen('goals')}
      >
        <Ionicons
          name="trophy-outline"
          size={24}
          color={currentScreen === 'goals' ? '#4f7f8c' : '#6b7680'}
        />
        <Text style={[styles.navLabel, currentScreen === 'goals' && styles.navLabelActive]}>
          Goals
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'community' && styles.navItemActive]}
        onPress={() => setShowCommunity(true)}
      >
        <Ionicons
          name="people-outline"
          size={24}
          color={currentScreen === 'community' ? '#4f7f8c' : '#6b7680'}
        />
        <Text style={[styles.navLabel, currentScreen === 'community' && styles.navLabelActive]}>
          Community
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'settings' && styles.navItemActive]}
        onPress={() => setCurrentScreen('settings')}
      >
        <Ionicons
          name="cog-outline"
          size={24}
          color={currentScreen === 'settings' ? '#4f7f8c' : '#6b7680'}
        />
        <Text style={[styles.navLabel, currentScreen === 'settings' && styles.navLabelActive]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.app}>
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'advisor' && renderAdvisor()}
      {currentScreen === 'goals' && renderGoals()}
      {currentScreen === 'settings' && renderSettings()}
      {currentScreen !== 'home' && renderBottomNav()}

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Financial Coach</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.chatContainer}>
            {appData.chatHistory.length === 0 && (
              <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeText}>Welcome! I'm your AI financial coach. Ask me anything about:</Text>
                <Text style={styles.welcomeList}>• Setting financial goals</Text>
                <Text style={styles.welcomeList}>• Budgeting and saving</Text>
                <Text style={styles.welcomeList}>• Investment strategies</Text>
                <Text style={styles.welcomeList}>• Debt management</Text>
              </View>
            )}
            
            {appData.chatHistory.map((message) => (
              <View key={message.id} style={[styles.chatMessage, message.isUser ? styles.userMessage : styles.botMessage]}>
                {message.isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.botText}>Thinking...</Text>
                    <LoadingDots />
                  </View>
                ) : (
                  <Text style={[styles.chatText, message.isUser ? styles.userText : styles.botText]}>
                    {message.text}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatInputField}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Ask your financial coach..."
              placeholderTextColor="#6b7680"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendChat}>
              <Ionicons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* What-If Simulator Modal */}
      <Modal visible={showWhatIf} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>What-If Simulator</Text>
            <TouchableOpacity onPress={() => setShowWhatIf(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Monthly Contribution (SAR)</Text>
            <TextInput
              style={styles.input}
              value={whatIfData.monthlyContribution.toString()}
              onChangeText={(text) => setWhatIfData({ ...whatIfData, monthlyContribution: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholderTextColor="#6b7680"
            />
            
            <Text style={styles.inputLabel}>Number of Months</Text>
            <TextInput
              style={styles.input}
              value={whatIfData.months.toString()}
              onChangeText={(text) => setWhatIfData({ ...whatIfData, months: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholderTextColor="#6b7680"
            />
            
            <TouchableOpacity style={styles.simulateButton} onPress={handleWhatIfSimulation}>
              <Text style={styles.simulateButtonText}>Run Simulation</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Community Modal */}
      <Modal visible={showCommunity} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Community Hub</Text>
            <TouchableOpacity onPress={() => setShowCommunity(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.pointsDisplay}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.pointsText}>Your Points: {appData.points}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Tips Feed</Text>
            {appData.tips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipContent}>{tip.content}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Challenges</Text>
            {appData.challenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                <Text style={styles.challengePoints}>{challenge.points} points</Text>
                {!challenge.completed && (
                  <TouchableOpacity 
                    style={styles.joinButton} 
                    onPress={() => challenge.joined ? handleCompleteChallenge(challenge.id) : handleJoinChallenge(challenge.id)}
                  >
                    <Text style={styles.joinButtonText}>
                      {challenge.joined ? 'Complete' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Goal Modal */}
      <Modal visible={showAddGoal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TouchableOpacity onPress={() => setShowAddGoal(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.input}
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
              placeholder="e.g., Emergency Fund"
              placeholderTextColor="#6b7680"
            />

            <Text style={styles.inputLabel}>Target Amount (SAR)</Text>
            <TextInput
              style={styles.input}
              value={newGoal.targetAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
              placeholder="10000"
              keyboardType="numeric"
              placeholderTextColor="#6b7680"
            />

            <Text style={styles.inputLabel}>Current Amount (SAR)</Text>
            <TextInput
              style={styles.input}
              value={newGoal.currentAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, currentAmount: text })}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#6b7680"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddGoal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
                <Text style={styles.addGoalButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4f7f8c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4f7f8c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4f7f8c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a5c6d5',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
  },
  featureText: {
    color: '#6b7680',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  getStartedButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 20,
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#111315',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6b7680',
    lineHeight: 24,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4f7f8c',
    fontSize: 16,
    fontWeight: '600',
  },
  forecastText: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    minWidth: 200,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#111315',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalAmounts: {
    fontSize: 16,
    color: '#4f7f8c',
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#2b2f33',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7680',
    textAlign: 'right',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  quickAddButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4f7f8c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
  },
  quickAddText: {
    color: '#4f7f8c',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  whatIfButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#a5c6d5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
  },
  whatIfButtonText: {
    color: '#a5c6d5',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  settingLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#2b2f33',
    paddingBottom: 20,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(79, 127, 140, 0.1)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#6b7680',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#4f7f8c',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#15181a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2b2f33',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 48,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6b7680',
    paddingVertical: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6b7680',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addGoalButton: {
    flex: 1,
    backgroundColor: '#4f7f8c',
    paddingVertical: 16,
    borderRadius: 8,
  },
  addGoalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Chat styles
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeMessage: {
    backgroundColor: '#111315',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  welcomeList: {
    color: '#a5c6d5',
    fontSize: 14,
    marginBottom: 4,
  },
  chatMessage: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4f7f8c',
    padding: 12,
    borderRadius: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#111315',
    padding: 12,
    borderRadius: 12,
  },
  chatText: {
    fontSize: 16,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#a5c6d5',
  },
  chatInput: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2b2f33',
    alignItems: 'flex-end',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#15181a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4f7f8c',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // What-If styles
  simulateButton: {
    backgroundColor: '#4f7f8c',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  simulateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Community styles
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111315',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  pointsText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 20,
  },
  tipCard: {
    backgroundColor: '#111315',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f7f8c',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    color: '#a5c6d5',
    lineHeight: 20,
  },
  challengeCard: {
    backgroundColor: '#111315',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6b7680',
    marginBottom: 8,
  },
  challengePoints: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#4f7f8c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Loading animation styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4f7f8c',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});