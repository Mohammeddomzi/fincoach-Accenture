export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt: Date;
  isCompleted: boolean;
  type: "emergency" | "savings" | "investment" | "debt" | "purchase" | "other";
  priority: "low" | "medium" | "high";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CSVData {
  headers: string[];
  rows: any[];
  summary: {
    totalRows: number;
    dateRange?: { start: string; end: string };
    categories?: { [key: string]: number };
    totals?: { [key: string]: number };
  };
}

export interface OfflineMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export interface Settings {
  currency: string;
  theme: "dark" | "light" | "system";
  locale: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}
