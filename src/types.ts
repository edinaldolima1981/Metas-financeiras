export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string; // e.g. 'Administrador', 'Participante', 'Membro'
  monthlyAllowance: number; // e.g. R$ 400, R$ 600, etc.
  color: string; // e.g. '#3b82f6', '#ff4081', '#10b981', '#a855f7'
  bio?: string;
  email?: string;
  password?: string;
}

export interface Goal {
  id: string;
  title: string;
  subtitle?: string;
  owner: string; // Name of participant or 'Casal' / 'Geral'
  participantId?: string;
  targetAmount: number;
  currentAmount: number;
  monthlyTarget: number;
  targetDate: string; // e.g. "31 de Dezembro de 2026"
  daysRemaining: number;
  imageUrl: string;
  isFavorite?: boolean;
  accentColor?: string;
  hasLeftBorderAccent?: boolean;
  currentMonths?: number;
  totalMonths?: number;
  streakDays: number;
  category?: 'tecnologia' | 'viagem' | 'veiculo' | 'casa' | 'educacao' | 'outro';
  description?: string;
}

export interface ExpenseItem {
  id: string;
  targetPerson: string; // Participant name
  participantId?: string;
  description: string;
  amount: number;
  date: string;
  category: 'alimentacao' | 'compras' | 'beleza' | 'lazer' | 'tecnologia' | 'outros';
  registeredBy: string;
  note?: string;
}

export interface PersonBudget {
  name: string;
  participantId?: string;
  goalTitle: string;
  targetAllowance: number;
  expenses: ExpenseItem[];
}

export interface MonthlyBudget {
  id: string;
  monthName: string;
  edinaldo?: PersonBudget;
  coronita?: PersonBudget;
  budgets?: Record<string, PersonBudget>; // dynamic by participantId or name
}

export interface HistoryItem {
  id: string;
  title: string;
  goalId: string;
  goalTitle: string;
  amount: number;
  date: string;
  type: 'deposit' | 'mission_reward' | 'expense' | 'extra';
  emoji: string;
  participantName?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'achievement' | 'reminder' | 'streak' | 'expense';
  icon: string;
}

export interface CoupleProfile {
  partner1: {
    name: string;
    avatar: string;
    currentGoalTitle: string;
    role: 'Admin' | 'Parceiro' | string;
  };
  partner2: {
    name: string;
    avatar: string;
    currentGoalTitle: string;
    role: 'Beneficiária' | 'Parceira' | string;
  };
  relationshipStartDate?: string;
  jointSavingsTarget: number;
}

export interface AdminConfig {
  adminPin: string;
  requirePinForAdmin: boolean;
  adminName: string;
}

export type AppMode = 'viewer' | 'admin';
