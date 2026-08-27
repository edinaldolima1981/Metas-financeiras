import React, { useState } from 'react';
import {
  ChevronLeft,
  Trophy,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Sparkles,
  Trash2,
  Calendar,
  PiggyBank,
  Camera,
  Crown,
  Medal,
  Target,
  ArrowRight,
  User,
  Users,
  Flame,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { MonthlyBudget, ExpenseItem, CoupleProfile, Goal, Participant } from '../types';
import { IMAGES } from '../constants/images';
import { triggerCelebration, triggerStarReward } from '../utils/confetti';

interface MissionsScreenProps {
  goals?: Goal[];
  participants?: Participant[];
  monthlyBudget: MonthlyBudget;
  couple: CoupleProfile;
  onBack: () => void;
  onSelectGoal?: (goal: Goal) => void;
  onOpenAddDeposit?: (goalId?: string) => void;
  onOpenAddExpense: (person?: 'Edinaldo' | 'Coronita') => void;
  onDeleteExpense: (person: 'Edinaldo' | 'Coronita', expenseId: string) => void;
  onCloseMonthAndDeposit: (person: 'Edinaldo' | 'Coronita' | 'Ambos') => void;
  onOpenAvatarModal: (person: 'Edinaldo' | 'Coronita') => void;
  initialTab?: 'ranking' | 'coronita' | 'edinaldo' | 'conjunto' | 'duelo';
  isAdmin?: boolean;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({
  goals = [],
  participants = [],
  monthlyBudget,
  couple,
  onBack,
  onSelectGoal,
  onOpenAddDeposit,
  onOpenAddExpense,
  onDeleteExpense,
  onCloseMonthAndDeposit,
  onOpenAvatarModal,
  initialTab = 'ranking',
  isAdmin = false,
}) => {
  // Normalize tab
  const defaultTab = initialTab === 'duelo' ? 'ranking' : initialTab;
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [rankingViewType, setRankingViewType] = useState<'goals' | 'participants'>('goals');

  // Sync if initialTab changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'duelo' ? 'ranking' : initialTab);
    }
  }, [initialTab]);

  const isParticipantTab = activeTab !== 'ranking' && activeTab !== 'conjunto';
  const activeParticipant = participants.find((p) => p.name.toLowerCase() === activeTab);

  // Dynamic Joint Monthly Stats by aggregating all participants
  const totalCombinedTarget = participants.reduce((sum, p) => {
    const key = p.name.toLowerCase();
    const budgetEntry = monthlyBudget.budgets?.[key] || (key === 'edinaldo' ? monthlyBudget.edinaldo : key === 'coronita' ? monthlyBudget.coronita : null);
    return sum + (budgetEntry?.targetAllowance ?? p.monthlyAllowance);
  }, 0);

  const totalCombinedSpent = participants.reduce((sum, p) => {
    const key = p.name.toLowerCase();
    const budgetEntry = monthlyBudget.budgets?.[key] || (key === 'edinaldo' ? monthlyBudget.edinaldo : key === 'coronita' ? monthlyBudget.coronita : null);
    const spent = (budgetEntry?.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
    return sum + spent;
  }, 0);

  const totalCombinedRemaining = Math.max(0, totalCombinedTarget - totalCombinedSpent);
  const combinedSavedPercentage = totalCombinedTarget > 0 ? Math.round((totalCombinedRemaining / totalCombinedTarget) * 100) : 0;

  // --- DYNAMIC RANKINGS COMPUTATION (DESCENDING ORDER: HIGHEST TO LOWEST) ---

  // 1. Goal Ranking: Ordered strictly descending by currentAmount (Maior valor poupado para baixo)
  const sortedGoals = [...goals].sort((a, b) => b.currentAmount - a.currentAmount);

  // 2. Participant Ranking: Group savings by participant name and sort descending
  const participantRanking = participants.map((p) => {
    const userGoals = goals.filter(
      (g) => g.owner?.trim().toLowerCase() === p.name?.trim().toLowerCase()
    );
    const totalSaved = userGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = userGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalMonthly = userGoals.reduce((sum, g) => sum + g.monthlyTarget, 0);
    const pct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    return {
      ...p,
      totalSaved,
      totalTarget,
      totalMonthly,
      percentage: pct,
      goalsCount: userGoals.length,
      goals: userGoals,
    };
  }).sort((a, b) => b.totalSaved - a.totalSaved);

  const getCategoryIcon = (category: ExpenseItem['category']) => {
    switch (category) {
      case 'alimentacao':
        return '🍔';
      case 'compras':
        return '🛍️';
      case 'beleza':
        return '💅';
      case 'lazer':
        return '🎬';
      case 'tecnologia':
        return '🎧';
      default:
        return '📦';
    }
  };

  const getRankMedal = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: <Crown className="w-4 h-4 text-[#ffeb3b]" />,
          text: '1º Lugar 🥇',
          bg: 'bg-gradient-to-r from-[#eab308]/20 to-[#f59e0b]/20 text-[#fde047] border-[#eab308]/40',
          cardBorder: 'border-[#eab308]/60 shadow-[0_0_20px_rgba(234,179,8,0.15)]',
          glow: 'from-[#eab308]/15',
        };
      case 1:
        return {
          icon: <Medal className="w-4 h-4 text-slate-300" />,
          text: '2º Lugar 🥈',
          bg: 'bg-slate-500/20 text-slate-200 border-slate-400/30',
          cardBorder: 'border-slate-400/40',
          glow: 'from-slate-400/10',
        };
      case 2:
        return {
          icon: <Medal className="w-4 h-4 text-amber-600" />,
          text: '3º Lugar 🥉',
          bg: 'bg-amber-700/20 text-amber-300 border-amber-600/30',
          cardBorder: 'border-amber-700/40',
          glow: 'from-amber-700/10',
        };
      default:
        return {
          icon: <span className="font-black text-xs text-[#a098c4]">#{index + 1}</span>,
          text: `${index + 1}º Lugar`,
          bg: 'bg-white/5 text-[#a098c4] border-white/10',
          cardBorder: 'border-white/10',
          glow: 'from-white/5',
        };
    }
  };

  return (
    <div className="pb-32 text-white">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between py-3 mb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold flex items-center justify-center gap-1.5 font-heading text-white">
            Ranking de Poupadores <Trophy className="w-5 h-5 text-[#ffeb3b] inline" />
          </h1>
          <p className="text-[10px] text-[#a098c4]">
            Cards em ordem decrescente do maior valor para baixo
          </p>
        </div>

        <button
          onClick={() => onOpenAddExpense(isParticipantTab && activeParticipant ? activeParticipant.name as any : undefined)}
          className="py-1.5 px-2.5 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-full text-xs font-bold text-[#fca5a5] flex items-center gap-1 active:scale-95 transition-all"
          title="Registrar Despesa"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Gasto</span>
        </button>
      </header>

      {/* Tabs Selector: Ranking Geral / Dynamic Participant Tabs / Reserva */}
      <div className="flex gap-2 p-1 bg-[#120d2b] border border-[#2a1f4a] rounded-2xl mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'ranking'
              ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#ffeb3b]" />
          <span>Rank 🏆</span>
        </button>

        {participants.map((p) => {
          const isSelected = activeTab === p.name.toLowerCase();
          const budgetKey = p.name.toLowerCase();
          const budgetEntry = monthlyBudget.budgets?.[budgetKey] || (budgetKey === 'edinaldo' ? monthlyBudget.edinaldo : budgetKey === 'coronita' ? monthlyBudget.coronita : null);
          const spent = (budgetEntry?.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
          const target = budgetEntry?.targetAllowance || p.monthlyAllowance;
          const remaining = Math.max(0, target - spent);
          const pColor = p.color || '#3b82f6';

          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.name.toLowerCase())}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                isSelected
                  ? 'text-white'
                  : 'text-[#a098c4] hover:text-white'
              }`}
              style={{
                backgroundColor: isSelected ? pColor : 'transparent',
                boxShadow: isSelected ? `0 0 12px ${pColor}40` : 'none',
              }}
            >
              <img
                src={p.avatar}
                alt={p.name}
                className="w-4 h-4 rounded-full object-cover shrink-0 border border-white/10"
                crossOrigin="anonymous"
              />
              <span>{p.name}</span>
              <span className="text-[10px] font-normal opacity-85">R$ {remaining}</span>
            </button>
          );
        })}

        <button
          onClick={() => setActiveTab('conjunto')}
          className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'conjunto'
              ? 'bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <span>Reserva 💜</span>
          <span className="text-[10px] font-normal opacity-85">R$ {totalCombinedRemaining}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RANKING DOS MAIORES POUPADORES (EM ORDEM DECRESCENTE) */}
      {/* ========================================================================= */}
      {activeTab === 'ranking' && (
        <section className="space-y-4">
          {/* Top Leaderboard Podium Summary Banner */}
          <div className="bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ffeb3b]/20 text-[#ffeb3b] border border-[#ffeb3b]/30 inline-flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#ffeb3b]" /> HANK DO MAIOR POUPADOR
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-white mt-1 font-heading">
                  Classificação por Valor Poupado
                </h2>
                <p className="text-xs text-[#a098c4]">
                  Visualização dinâmica organizada do maior montante acumulado para o menor.
                </p>
              </div>

              {/* View Switcher: Por Metas vs Por Participantes */}
              <div className="flex bg-[#1c143d] p-1 rounded-xl border border-white/10 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setRankingViewType('goals')}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    rankingViewType === 'goals'
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'text-[#a098c4] hover:text-white'
                  }`}
                >
                  <Target className="w-3 h-3" /> Metas ({sortedGoals.length})
                </button>
                <button
                  onClick={() => setRankingViewType('participants')}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    rankingViewType === 'participants'
                      ? 'bg-[#9333ea] text-white shadow-sm'
                      : 'text-[#a098c4] hover:text-white'
                  }`}
                >
                  <Users className="w-3 h-3" /> Poupadores ({participantRanking.length})
                </button>
              </div>
            </div>

            {/* Top 1 Leader Highlight */}
            {sortedGoals.length > 0 && (
              <div className="bg-gradient-to-r from-[#eab308]/15 via-[#1c143d] to-[#120d2b] border border-[#eab308]/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={
                        participants.find((p) => p.name.toLowerCase() === sortedGoals[0].owner.toLowerCase())?.avatar ||
                        sortedGoals[0].imageUrl
                      }
                      alt={sortedGoals[0].owner}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-[#eab308] shadow-lg"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#eab308] text-black p-0.5 rounded-full shadow">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-[#eab308]/30 text-[#fde047] rounded">
                        LÍDER DO RANKING 👑
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {sortedGoals[0].owner}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white font-heading truncate mt-0.5">
                      {sortedGoals[0].title}
                    </h4>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-black text-[#4ade80] font-heading">
                    R$ {sortedGoals[0].currentAmount.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[10px] text-[#fde047] font-semibold">
                    {Math.round((sortedGoals[0].currentAmount / sortedGoals[0].targetAmount) * 100)}% da meta
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VIEW TYPE 1: GOAL CARDS ORDERED DESCENDING */}
          {rankingViewType === 'goals' && (
            <div className="space-y-3">
              {sortedGoals.map((goal, idx) => {
                const rankInfo = getRankMedal(idx);
                const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                const rem = Math.max(0, goal.targetAmount - goal.currentAmount);
                const part = participants.find(
                  (p) => p.name.toLowerCase() === goal.owner.toLowerCase()
                );
                const ownerColor = part?.color || goal.accentColor || '#3b82f6';

                return (
                  <article
                    key={goal.id}
                    className={`bg-[#120d2b] border rounded-3xl p-4 sm:p-5 transition-all relative overflow-hidden shadow-lg ${rankInfo.cardBorder}`}
                  >
                    {/* Top Header: Rank position + Owner */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Position Pill */}
                        <div
                          className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border shrink-0 ${rankInfo.bg}`}
                        >
                          {rankInfo.icon}
                          <span>{rankInfo.text}</span>
                        </div>

                        {/* Owner Badge */}
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <img
                            src={part?.avatar || IMAGES.edinaldoProfile}
                            alt={goal.owner}
                            className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0"
                            crossOrigin="anonymous"
                          />
                          <span className="text-xs font-bold text-white truncate">
                            {goal.owner}
                          </span>
                        </div>
                      </div>

                      {/* Monthly Pace */}
                      <span className="text-[10px] font-bold text-[#ffeb3b] px-2 py-0.5 rounded-full bg-[#ffeb3b]/10 border border-[#ffeb3b]/20 shrink-0">
                        R$ {goal.monthlyTarget}/mês
                      </span>
                    </div>

                    {/* Goal Content Row */}
                    <div className="flex items-center gap-3.5 mb-3.5">
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => onSelectGoal && onSelectGoal(goal)}
                        className="w-16 h-20 sm:w-20 sm:h-24 bg-black/40 rounded-2xl flex items-center justify-center p-1.5 border border-white/10 shrink-0 cursor-pointer group shadow-inner"
                        title="Ver detalhes da meta"
                      >
                        <img
                          src={goal.imageUrl}
                          alt={goal.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          crossOrigin="anonymous"
                        />
                      </div>

                      {/* Financial Metrics */}
                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => onSelectGoal && onSelectGoal(goal)}
                          className="text-sm sm:text-base font-extrabold text-white font-heading truncate cursor-pointer hover:text-[#60a5fa] transition-colors"
                        >
                          {goal.title}
                        </h3>
                        {goal.subtitle && (
                          <p className="text-[11px] text-[#a098c4] truncate mb-1">
                            {goal.subtitle}
                          </p>
                        )}

                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-base sm:text-lg font-black text-[#4ade80] font-heading">
                            R$ {goal.currentAmount.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-xs text-[#a098c4]">
                            / R$ {goal.targetAmount.toLocaleString('pt-BR')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#a098c4] mt-0.5">
                          <span>Faltam: <strong className="text-white">R$ {rem.toLocaleString('pt-BR')}</strong></span>
                          <span className="font-extrabold text-white">{pct}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          backgroundColor: ownerColor,
                        }}
                      />
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 gap-2 text-xs">
                      <button
                        onClick={() => onSelectGoal && onSelectGoal(goal)}
                        className="text-[#a098c4] hover:text-white flex items-center gap-1 font-bold py-1 transition-colors"
                      >
                        <span>Ver detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {onOpenAddDeposit && (
                        <button
                          onClick={() => onOpenAddDeposit(goal.id)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#3b82f6] text-[#60a5fa] hover:text-white border border-[#3b82f6]/30 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Aporte</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* VIEW TYPE 2: PARTICIPANT SUMMARY ORDERED DESCENDING */}
          {rankingViewType === 'participants' && (
            <div className="space-y-3">
              {participantRanking.map((p, idx) => {
                const rankInfo = getRankMedal(idx);
                return (
                  <div
                    key={p.id}
                    className={`bg-[#120d2b] border rounded-3xl p-4 sm:p-5 transition-all shadow-lg ${rankInfo.cardBorder}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border shrink-0 ${rankInfo.bg}`}
                        >
                          {rankInfo.icon}
                          <span>{rankInfo.text}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover border-2"
                            style={{ borderColor: p.color || '#3b82f6' }}
                            crossOrigin="anonymous"
                          />
                          <div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-white font-heading">
                              {p.name}
                            </h3>
                            <span className="text-[10px] text-[#a098c4] block">
                              {p.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-[#4ade80] font-heading">
                          R$ {p.totalSaved.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-[#a098c4]">
                          Total Poupado
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#1c143d] p-2.5 rounded-2xl border border-white/5 text-center text-xs mb-2">
                      <div>
                        <span className="text-[9px] uppercase text-[#a098c4] block font-semibold">
                          Metas Ativas
                        </span>
                        <span className="font-black text-white text-xs mt-0.5 block">
                          {p.goalsCount} meta(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#a098c4] block font-semibold">
                          Meta Total
                        </span>
                        <span className="font-black text-white text-xs mt-0.5 block">
                          R$ {p.totalTarget.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#a098c4] block font-semibold">
                          Progresso
                        </span>
                        <span className="font-black text-[#fde047] text-xs mt-0.5 block">
                          {p.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, p.percentage)}%`,
                          backgroundColor: p.color || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* DYNAMIC PARTICIPANT EXPENSE & BUDGET CONTROL */}
      {/* ========================================================================= */}
      {isParticipantTab && activeParticipant && (() => {
        const budgetKey = activeParticipant.name.toLowerCase();
        const budgetEntry = monthlyBudget.budgets?.[budgetKey] || (budgetKey === 'edinaldo' ? monthlyBudget.edinaldo : budgetKey === 'coronita' ? monthlyBudget.coronita : null);
        const spent = (budgetEntry?.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
        const target = budgetEntry?.targetAllowance || activeParticipant.monthlyAllowance;
        const remaining = Math.max(0, target - spent);
        const savedPercentage = target > 0 ? Math.round((remaining / target) * 100) : 0;
        const pColor = activeParticipant.color || '#3b82f6';
        const userGoals = goals.filter((g) => g.owner.toLowerCase() === budgetKey);
        const linkedGoalTitle = userGoals[0]?.title || `Meta de ${activeParticipant.name}`;

        return (
          <div className="space-y-4">
            <section className="bg-transparent mb-2 relative">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => onOpenAvatarModal(activeParticipant.name as any)}
                  className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 cursor-pointer group shadow-xl"
                  title="Clique para trocar foto"
                >
                  <img
                    src={activeParticipant.avatar}
                    alt={activeParticipant.name}
                    className="w-full h-full object-cover rounded-xl shadow-lg border-2 group-hover:scale-105 transition-transform"
                    style={{ borderColor: pColor }}
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-1 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div 
                  className="flex-1 relative border rounded-2xl p-3 shadow-lg"
                  style={{
                    backgroundColor: `${pColor}10`,
                    borderColor: `${pColor}40`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs flex items-center gap-1" style={{ color: pColor }}>
                      Meta de {activeParticipant.name}: Poupar R$ {target}! ⚡
                    </h3>
                    <button
                      onClick={() => onOpenAvatarModal(activeParticipant.name as any)}
                      className="text-[10px] hover:underline flex items-center gap-0.5 font-bold"
                      style={{ color: pColor }}
                    >
                      <Camera className="w-3 h-3" /> Trocar foto
                    </button>
                  </div>
                  <p className="text-[11px] text-white/90 mt-0.5 leading-snug">
                    Cada despesa registrada reduz o saldo mensal reservado para a meta: <strong>{linkedGoalTitle}</strong>!
                  </p>
                </div>
              </div>
            </section>

            {/* Month Summary Card */}
            <section className="bg-[#120d2b] border border-white/5 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span 
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1 mb-1 border"
                    style={{
                      backgroundColor: `${pColor}20`,
                      color: pColor,
                      borderColor: `${pColor}30`,
                    }}
                  >
                    <Calendar className="w-3 h-3" /> {monthlyBudget.monthName}
                  </span>

                  <div className="text-[11px] text-[#a098c4] font-medium uppercase tracking-wide mt-2">
                    Saldo Restante para o Cofre
                  </div>
                  <h2 className="text-3xl font-extrabold text-white font-heading flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold" style={{ color: pColor }}>R$</span>{' '}
                    <span className="text-white">
                      {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </h2>
                  <p className="text-[11px] text-[#a098c4] mt-0.5">
                    de R$ {target.toLocaleString('pt-BR')} reservados
                  </p>
                </div>

                {/* Circular percentage */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#221a42"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={savedPercentage > 70 ? pColor : savedPercentage > 30 ? '#ffeb3b' : '#ef4444'}
                      strokeWidth="3.5"
                      strokeDasharray={`${savedPercentage}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-extrabold text-white font-heading">
                      {savedPercentage}%
                    </span>
                    <span className="text-[9px] text-[#a098c4]">poupado</span>
                  </div>
                </div>
              </div>

              {/* Breakdown bar */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3 mt-1 text-xs">
                <div className="bg-[#1a1238] rounded-xl p-2.5 border border-[#2a1f4a]">
                  <div className="text-[10px] text-[#a098c4] flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: pColor }} /> Reservado do Mês
                  </div>
                  <div className="text-sm font-extrabold text-white mt-1">
                    R$ {target.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#1a1238] rounded-xl p-2.5 border border-[#2a1f4a]">
                  <div className="text-[10px] text-[#a098c4] flex items-center gap-1 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" /> Despesas Descontadas
                  </div>
                  <div className="text-sm font-extrabold text-[#ef4444] mt-1">
                    - R$ {spent.toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            {isAdmin && (
              <section className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onOpenAddExpense(activeParticipant.name as any)}
                  className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Registrar Gasto
                </button>

                <button
                  onClick={() => {
                    triggerCelebration();
                    onCloseMonthAndDeposit(activeParticipant.name as any);
                  }}
                  disabled={remaining <= 0}
                  className="py-3 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                  style={{
                    background: remaining > 0 ? `linear-gradient(135deg, ${pColor}, #8b5cf6)` : '#221a42',
                    boxShadow: remaining > 0 ? `0 0 14px ${pColor}50` : 'none',
                    color: remaining > 0 ? 'white' : '#a098c4',
                  }}
                >
                  <PiggyBank className="w-4 h-4" /> Fechar e Poupar
                </button>
              </section>
            )}

            {/* List of Despesas */}
            <section className="bg-[#120d2b] border border-white/5 rounded-3xl p-4 sm:p-5 shadow-lg">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white mb-3 flex items-center justify-between font-heading">
                <span>Histórico de Gastos deste Mês ({budgetEntry?.expenses?.length || 0})</span>
                <span className="text-[10px] text-[#a098c4] font-medium uppercase font-sans">Descontado do cofre</span>
              </h3>

              {!budgetEntry || budgetEntry.expenses?.length === 0 ? (
                <div className="py-8 bg-black/20 border border-white/5 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#4ade80] mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-white mb-0.5">Nenhum gasto registrado!</p>
                  <p className="text-[10px] text-[#a098c4] max-w-[200px] mx-auto leading-tight">
                    100% da reserva de R$ {target} protegida para o {linkedGoalTitle}!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(budgetEntry.expenses || []).map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-[#1c143d] border border-[#2a1f4a] rounded-2xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center text-base shrink-0 border border-white/5">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate">
                            {expense.description}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#a098c4]">
                            <span>{expense.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-extrabold text-xs text-[#ef4444]">
                          - R$ {expense.amount.toFixed(2)}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              onDeleteExpense(activeParticipant.name as any, expense.id);
                              triggerStarReward();
                            }}
                            className="p-1 text-[#a098c4] hover:text-[#ef4444] rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        );
      })()}



      {/* ========================================================================= */}
      {/* TAB 4: RESERVA CONJUNTA & FECHAMENTO DO MÊS */}
      {/* ========================================================================= */}
      {activeTab === 'conjunto' && (
        <section className="space-y-4">
          <div className="bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-[#9333ea]/20 text-[#d8b4fe] border border-[#9333ea]/30">
                  POUPANÇA TOTAL DO CASAL 💜
                </span>
                <h3 className="text-sm font-bold text-white mt-1 font-heading">
                  Reserva Mensal Conjunta
                </h3>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-[#4ade80] font-heading">
                  R$ {totalCombinedRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-[#a098c4]">de R$ {totalCombinedTarget.toLocaleString('pt-BR')}</div>
              </div>
            </div>

            {/* Combined progress bar */}
            <div className="w-full bg-[#1c143d] h-3 rounded-full overflow-hidden p-0.5 border border-[#2a1f4a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563eb] via-[#9333ea] to-[#ff4081] transition-all duration-500"
                style={{ width: `${combinedSavedPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#a098c4] mt-2">
              <span>Gastos totais do casal: -R$ {totalCombinedSpent.toFixed(2)}</span>
              <span className="font-bold text-white">{combinedSavedPercentage}% poupado</span>
            </div>

            {/* Double Deposit Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  triggerCelebration();
                  onCloseMonthAndDeposit('Ambos');
                }}
                disabled={totalCombinedRemaining <= 0}
                className={`w-full mt-4 py-3.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  totalCombinedRemaining > 0
                    ? 'bg-gradient-to-r from-[#d81b60] via-[#9c27b0] to-[#2563eb] text-white shadow-lg active:scale-[0.98]'
                    : 'bg-[#221a42] text-[#a098c4] cursor-not-allowed opacity-60'
                }`}
              >
                <PiggyBank className="w-4 h-4 text-[#ffeb3b]" />
                <span>
                  Fechar Mês: Depositar os iPhones de Ambos (+R$ {totalCombinedRemaining.toFixed(0)}) 🚀
                </span>
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
