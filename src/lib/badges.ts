import { Goal, UserProfile } from '../types/finance';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'savings' | 'streak' | 'achievement' | 'milestone';
  isEarned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100 for progress-based badges
}

export interface BadgeProgress {
  totalSaved: number;
  currentStreak: number;
  goalsCreated: number;
  goalsReached: number;
  challengesCompleted: number;
  totalPoints: number;
}

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'isEarned' | 'earnedAt' | 'progress'>[] = [
  {
    id: 'first-goal',
    name: 'First Goal',
    description: 'Create your first financial goal',
    icon: '🎯',
    points: 50,
    category: 'achievement',
  },
  {
    id: 'goal-reached',
    name: 'Goal Reached',
    description: 'Successfully complete a goal',
    icon: '🏆',
    points: 100,
    category: 'achievement',
  },
  {
    id: 'savings-500',
    name: '500 SAR Saved',
    description: 'Save 500 SAR across all goals',
    icon: '💰',
    points: 75,
    category: 'savings',
  },
  {
    id: 'savings-1000',
    name: '1,000 SAR Saved',
    description: 'Save 1,000 SAR across all goals',
    icon: '💎',
    points: 150,
    category: 'savings',
  },
  {
    id: 'savings-5000',
    name: '5,000 SAR Saved',
    description: 'Save 5,000 SAR across all goals',
    icon: '💸',
    points: 300,
    category: 'savings',
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Maintain activity for 7 consecutive days',
    icon: '🔥',
    points: 100,
    category: 'streak',
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Maintain activity for 30 consecutive days',
    icon: '⚡',
    points: 250,
    category: 'streak',
  },
  {
    id: 'goals-5',
    name: 'Goal Setter',
    description: 'Create 5 different goals',
    icon: '📋',
    points: 125,
    category: 'milestone',
  },
  {
    id: 'goals-10',
    name: 'Goal Master',
    description: 'Create 10 different goals',
    icon: '🎖️',
    points: 300,
    category: 'milestone',
  },
  {
    id: 'challenge-complete',
    name: 'Challenge Champion',
    description: 'Complete your first challenge',
    icon: '🥇',
    points: 200,
    category: 'achievement',
  },
];

/**
 * Calculate badge progress based on user data
 */
export function calculateBadgeProgress(
  user: UserProfile,
  goals: Goal[],
  challengesCompleted: number
): BadgeProgress {
  const totalSaved = goals
    .filter(goal => goal.isCompleted && (goal.type === 'savings' || goal.type === 'emergency'))
    .reduce((sum, goal) => sum + goal.targetAmount, 0);

  return {
    totalSaved,
    currentStreak: user.streak,
    goalsCreated: goals.length,
    goalsReached: goals.filter(goal => goal.isCompleted).length,
    challengesCompleted,
    totalPoints: user.points,
  };
}

/**
 * Check which badges should be earned based on current progress
 */
export function checkEarnedBadges(
  progress: BadgeProgress,
  existingBadges: Badge[] = []
): Badge[] {
  const earnedBadges: Badge[] = [];
  const existingBadgeIds = new Set(existingBadges.map(b => b.id));

  for (const definition of BADGE_DEFINITIONS) {
    // Skip if already earned
    if (existingBadgeIds.has(definition.id)) {
      continue;
    }

    let isEarned = false;
    let progressValue = 0;

    switch (definition.id) {
      case 'first-goal':
        isEarned = progress.goalsCreated >= 1;
        progressValue = Math.min(100, (progress.goalsCreated / 1) * 100);
        break;

      case 'goal-reached':
        isEarned = progress.goalsReached >= 1;
        progressValue = Math.min(100, (progress.goalsReached / 1) * 100);
        break;

      case 'savings-500':
        isEarned = progress.totalSaved >= 500;
        progressValue = Math.min(100, (progress.totalSaved / 500) * 100);
        break;

      case 'savings-1000':
        isEarned = progress.totalSaved >= 1000;
        progressValue = Math.min(100, (progress.totalSaved / 1000) * 100);
        break;

      case 'savings-5000':
        isEarned = progress.totalSaved >= 5000;
        progressValue = Math.min(100, (progress.totalSaved / 5000) * 100);
        break;

      case 'streak-7':
        isEarned = progress.currentStreak >= 7;
        progressValue = Math.min(100, (progress.currentStreak / 7) * 100);
        break;

      case 'streak-30':
        isEarned = progress.currentStreak >= 30;
        progressValue = Math.min(100, (progress.currentStreak / 30) * 100);
        break;

      case 'goals-5':
        isEarned = progress.goalsCreated >= 5;
        progressValue = Math.min(100, (progress.goalsCreated / 5) * 100);
        break;

      case 'goals-10':
        isEarned = progress.goalsCreated >= 10;
        progressValue = Math.min(100, (progress.goalsCreated / 10) * 100);
        break;

      case 'challenge-complete':
        isEarned = progress.challengesCompleted >= 1;
        progressValue = Math.min(100, (progress.challengesCompleted / 1) * 100);
        break;
    }

    if (isEarned) {
      earnedBadges.push({
        ...definition,
        isEarned: true,
        earnedAt: new Date().toISOString(),
        progress: 100,
      });
    } else {
      earnedBadges.push({
        ...definition,
        isEarned: false,
        progress: progressValue,
      });
    }
  }

  return earnedBadges;
}

/**
 * Get newly earned badges (not in existing badges)
 */
export function getNewlyEarnedBadges(
  allBadges: Badge[],
  existingBadges: Badge[]
): Badge[] {
  const existingIds = new Set(existingBadges.map(b => b.id));
  return allBadges.filter(badge => badge.isEarned && !existingIds.has(badge.id));
}

/**
 * Format badge progress for display
 */
export function formatBadgeProgress(badge: Badge): string {
  if (badge.isEarned) {
    return 'Earned!';
  }
  
  if (badge.progress === undefined) {
    return 'Not started';
  }
  
  return `${Math.round(badge.progress)}%`;
}

/**
 * Get badge category color
 */
export function getBadgeCategoryColor(category: Badge['category']): string {
  switch (category) {
    case 'savings': return '$success';
    case 'streak': return '$warn';
    case 'achievement': return '$primary';
    case 'milestone': return '$accent';
    default: return '$gray8';
  }
}

/**
 * Check if user should earn a specific badge
 */
export function shouldEarnBadge(
  badgeId: string,
  progress: BadgeProgress,
  existingBadges: Badge[]
): boolean {
  const alreadyEarned = existingBadges.some(b => b.id === badgeId && b.isEarned);
  if (alreadyEarned) return false;

  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
  if (!badge) return false;

  switch (badgeId) {
    case 'first-goal':
      return progress.goalsCreated >= 1;
    case 'goal-reached':
      return progress.goalsReached >= 1;
    case 'savings-500':
      return progress.totalSaved >= 500;
    case 'savings-1000':
      return progress.totalSaved >= 1000;
    case 'savings-5000':
      return progress.totalSaved >= 5000;
    case 'streak-7':
      return progress.currentStreak >= 7;
    case 'streak-30':
      return progress.currentStreak >= 30;
    case 'goals-5':
      return progress.goalsCreated >= 5;
    case 'goals-10':
      return progress.goalsCreated >= 10;
    case 'challenge-complete':
      return progress.challengesCompleted >= 1;
    default:
      return false;
  }
}
