import { Goal } from "../types";

export interface GoalPlan {
  perDay: number;
  perWeek: number;
  perMonth: number;
  isRealistic: boolean;
  suggestions: string[];
}

export interface Forecast {
  sixMonthSavings: number;
  pacePerMonth: number;
}

export const computePlan = (goal: Goal): GoalPlan => {
  const now = new Date();
  const deadline = new Date(goal.deadline);
  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const remainingAmount = goal.targetAmount - goal.currentAmount;

  if (daysLeft <= 0) {
    return {
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
      isRealistic: false,
      suggestions: ["Deadline has passed. Please update your goal deadline."],
    };
  }

  const perDay = remainingAmount / daysLeft;
  const perWeek = perDay * 7;
  const perMonth = perDay * 30;

  // Realism heuristic: assume user can save 20-50% of income
  // For demo purposes, we'll use a conservative estimate
  const estimatedMonthlyIncome = 10000; // Default assumption
  const maxRealisticMonthly = estimatedMonthlyIncome * 0.3; // 30% of income

  const isRealistic = perMonth <= maxRealisticMonthly;

  const suggestions: string[] = [];
  if (!isRealistic) {
    if (perMonth > estimatedMonthlyIncome * 0.5) {
      suggestions.push("Consider extending your deadline by 2-3 months");
      suggestions.push("Or reduce your target amount by 20-30%");
    } else {
      suggestions.push("Consider extending your deadline by 1-2 months");
      suggestions.push("Or reduce your target amount by 10-20%");
    }
  }

  return {
    perDay,
    perWeek,
    perMonth,
    isRealistic,
    suggestions,
  };
};

export const calculateProgress = (goal: Goal): number => {
  if (goal.targetAmount === 0) return 0;
  return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
};

export const getDaysLeft = (goal: Goal): number => {
  const now = new Date();
  const deadline = new Date(goal.deadline);
  return Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
};

export const forecastSixMonths = (goal: Goal): Forecast => {
  // Approximate saving pace from currentAmount over goal age
  const now = new Date();
  const created = new Date(goal.createdAt);
  const daysSince = Math.max(1, Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  const pacePerDay = goal.currentAmount / daysSince;
  const pacePerMonth = pacePerDay * 30;
  const sixMonthSavings = pacePerMonth * 6;
  return { sixMonthSavings, pacePerMonth };
};
