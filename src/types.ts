export interface DayRecord {
  day: number;
  initialBalance: number;
  ratePercent: number;
  interestEarned: number;
  finalBalance: number;
  cumulativeProfit: number;
  growthPercentFromStart: number;
}

export interface CalculationSummary {
  initialAmount: number;
  finalAmount: number;
  totalProfit: number;
  totalGrowthPercent: number;
  averageDailyRate: number;
  bestDayProfit: {
    day: number;
    profit: number;
  };
  capitalMultiplier: number;
}
