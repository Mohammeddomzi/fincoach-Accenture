/**
 * Financial forecasting utilities for goal planning and projections
 */

export interface ForecastResult {
  monthsToTarget: number;
  projectedAmount: number;
  isAchievable: boolean;
  monthlyNeeded: number;
}

export interface TrendResult {
  direction: 'up' | 'flat' | 'down';
  percentage: number;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Calculate how many months it will take to reach a target amount
 * @param current Current amount saved/invested
 * @param monthly Monthly contribution amount
 * @param target Target amount to reach
 * @returns Number of months to reach target
 */
export function monthsToTarget(
  current: number,
  monthly: number,
  target: number
): number {
  if (monthly <= 0) return Infinity;
  if (current >= target) return 0;
  
  const remaining = target - current;
  return Math.ceil(remaining / monthly);
}

/**
 * Project the amount that will be accumulated over a given period
 * @param current Current amount
 * @param monthly Monthly contribution
 * @param months Number of months to project
 * @returns Projected total amount
 */
export function project(
  current: number,
  monthly: number,
  months: number
): number {
  return current + (monthly * months);
}

/**
 * Calculate burn rate (spending rate) from income and expenses
 * @param income Monthly income
 * @param expenses Monthly expenses
 * @returns Burn rate as a percentage (0-100)
 */
export function burnRate(income: number, expenses: number): number {
  if (income <= 0) return 100;
  return Math.min(100, (expenses / income) * 100);
}

/**
 * Analyze trend from a series of amounts
 * @param amounts Array of amounts over time
 * @returns Trend analysis with direction and confidence
 */
export function trend(amounts: number[]): TrendResult {
  if (amounts.length < 2) {
    return {
      direction: 'flat',
      percentage: 0,
      confidence: 'low',
    };
  }

  // Calculate percentage change from first to last
  const first = amounts[0];
  const last = amounts[amounts.length - 1];
  const percentage = first === 0 ? 0 : ((last - first) / first) * 100;

  // Determine direction
  let direction: 'up' | 'flat' | 'down';
  if (Math.abs(percentage) < 2) {
    direction = 'flat';
  } else if (percentage > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }

  // Calculate confidence based on consistency
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (amounts.length >= 3) {
    const changes = [];
    for (let i = 1; i < amounts.length; i++) {
      const change = amounts[i] - amounts[i - 1];
      changes.push(change);
    }

    // Check if changes are consistent in direction
    const positiveChanges = changes.filter(c => c > 0).length;
    const negativeChanges = changes.filter(c => c < 0).length;
    const totalChanges = changes.length;

    if (positiveChanges / totalChanges >= 0.8 || negativeChanges / totalChanges >= 0.8) {
      confidence = 'high';
    } else if (positiveChanges / totalChanges >= 0.6 || negativeChanges / totalChanges >= 0.6) {
      confidence = 'medium';
    }
  }

  return {
    direction,
    percentage: Math.abs(percentage),
    confidence,
  };
}

/**
 * Generate a comprehensive forecast for a goal
 * @param current Current amount
 * @param monthly Monthly contribution
 * @param target Target amount
 * @param deadline Optional deadline date
 * @returns Complete forecast analysis
 */
export function generateForecast(
  current: number,
  monthly: number,
  target: number,
  deadline?: string
): ForecastResult {
  const monthsNeeded = monthsToTarget(current, monthly, target);
  const projectedAmount = project(current, monthly, monthsNeeded);
  
  let isAchievable = true;
  let monthlyNeeded = monthly;

  // If there's a deadline, check if current plan is achievable
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const monthsUntilDeadline = Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (monthsNeeded > monthsUntilDeadline) {
      isAchievable = false;
      // Calculate required monthly contribution to meet deadline
      const remaining = target - current;
      monthlyNeeded = Math.ceil(remaining / monthsUntilDeadline);
    }
  }

  return {
    monthsToTarget: monthsNeeded,
    projectedAmount,
    isAchievable,
    monthlyNeeded,
  };
}

/**
 * Format currency amount for display
 * @param amount Amount to format
 * @param currency Currency code (default: SAR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  const formatter = new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

/**
 * Generate motivational forecast message
 * @param current Current amount
 * @param monthly Monthly contribution
 * @param target Target amount
 * @param currency Currency code
 * @returns Human-readable forecast message
 */
export function generateForecastMessage(
  current: number,
  monthly: number,
  target: number,
  currency: string = 'SAR'
): string {
  const forecast = generateForecast(current, monthly, target);
  
  if (forecast.isAchievable) {
    const months = forecast.monthsToTarget;
    const timeText = months === 1 ? '1 month' : `${months} months`;
    
    return `If you contribute ${formatCurrency(monthly, currency)}/mo, you'll reach ${formatCurrency(target, currency)} in ${timeText}.`;
  } else {
    return `To reach your goal on time, you'll need to contribute ${formatCurrency(forecast.monthlyNeeded, currency)}/mo instead of ${formatCurrency(monthly, currency)}.`;
  }
}

/**
 * Calculate compound interest projection
 * @param principal Initial amount
 * @param monthlyContribution Monthly contribution
 * @param annualRate Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param months Number of months
 * @returns Projected amount with compound interest
 */
export function compoundProjection(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12;
  let amount = principal;
  
  for (let i = 0; i < months; i++) {
    amount = amount * (1 + monthlyRate) + monthlyContribution;
  }
  
  return amount;
}
