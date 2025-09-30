import { Goal, Transaction, AnalysisData, ForecastData } from './types';

export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-SA', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return '#34C759'; // Green
  if (progress >= 75) return '#4f7f8c'; // Primary
  if (progress >= 50) return '#a5c6d5'; // Secondary
  if (progress >= 25) return '#7ca2b1'; // Tertiary
  return '#6b7680'; // Gray
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#34C759';
    default: return '#6b7680';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'savings': return '💰';
    case 'investment': return '📈';
    case 'debt': return '💳';
    case 'emergency': return '🚨';
    default: return '🎯';
  }
};

export const calculateForecast = (goal: Goal, monthlyContribution: number): ForecastData => {
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsToTarget = Math.ceil(remaining / monthlyContribution);
  const projectedAmount = goal.currentAmount + (monthlyContribution * monthsToTarget);
  
  let confidence: 'low' | 'medium' | 'high' = 'medium';
  if (monthsToTarget <= 6) confidence = 'high';
  else if (monthsToTarget <= 12) confidence = 'medium';
  else confidence = 'low';

  return {
    monthsToTarget,
    projectedAmount,
    monthlyContribution,
    confidence,
  };
};

export const analyzeTransactions = (transactions: Transaction[]): AnalysisData => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;
  
  const categories: { [key: string]: number } = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
  
  // Generate monthly trend (last 6 months)
  const monthlyTrend = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-SA', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === date.getFullYear() && 
             tDate.getMonth() === date.getMonth();
    });
    
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyTrend.push({
      month: monthName,
      income: monthIncome,
      expenses: monthExpenses,
    });
  }
  
  // Generate insights
  const insights: string[] = [];
  
  if (netIncome > 0) {
    insights.push(`You're saving ${formatCurrency(netIncome)} per month`);
  } else if (netIncome < 0) {
    insights.push(`You're spending ${formatCurrency(Math.abs(netIncome))} more than you earn`);
  }
  
  const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
  if (topCategory) {
    insights.push(`Your biggest expense is ${topCategory[0]} (${formatCurrency(topCategory[1])})`);
  }
  
  if (totalExpenses > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate > 20) {
      insights.push('Great job! You have a healthy savings rate');
    } else if (savingsRate < 10) {
      insights.push('Consider reducing expenses to improve your savings rate');
    }
  }
  
  return {
    totalIncome,
    totalExpenses,
    netIncome,
    categories,
    monthlyTrend,
    insights,
  };
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const getTimeRemaining = (deadline: Date): string => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff <= 0) return 'Overdue';
  
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days === 1) return '1 day left';
  if (days < 7) return `${days} days left`;
  if (days < 30) return `${Math.ceil(days / 7)} weeks left`;
  if (days < 365) return `${Math.ceil(days / 30)} months left`;
  return `${Math.ceil(days / 365)} years left`;
};
