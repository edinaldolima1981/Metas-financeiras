import React from 'react';
import { ChevronRight, Sparkles, ShieldCheck, PlusCircle, Target } from 'lucide-react';
import { Goal, Participant } from '../types';
import { CircularProgress } from './CircularProgress';
import { Header } from './Header';

interface HomeScreenProps {
  goals: Goal[];
  participants: Participant[];
  totalTarget: number;
  totalCurrent: number;
  onSelectGoal: (goal: Goal) => void;
  onOpenMissions: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenAdmin?: () => void;
  onOpenCreateGoal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  goals,
  participants,
  totalTarget,
  totalCurrent,
  onSelectGoal,
  onOpenMissions,
  onOpenNotifications,
  onOpenMenu,
  onOpenAdmin,
  onOpenCreateGoal,
}) => {
  const totalPercentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  const totalRemaining = Math.max(0, totalTarget - totalCurrent);

  return (
    <div className="pb-28">
      {/* Top Header */}
      <Header
        title="Nossa Conquista 🚀"
        subtitle="Metas deliberadas, foco e disciplina mensal! 💜"
        unreadCount={3}
        onOpenNotifications={onOpenNotifications}
        onOpenMenu={onOpenMenu}
        onOpenAdmin={onOpenAdmin}
      />



      {/* BEGIN: Main Progress Card */}
      <section
        className="bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-5 mb-4.5 shadow-lg relative overflow-hidden"
        data-purpose="total-progress-overview"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#9c27b0] opacity-25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#9c27b0]/25 text-[#ff4081] text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                Meta Geral
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">
                31 DE DEZEMBRO DE 2026
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold flex items-baseline gap-1 mt-2 text-white font-heading">
              <span className="text-lg font-bold">R$</span> {totalTarget.toLocaleString('pt-BR')}
            </h2>
            <p className="text-xs text-[#a098c4] font-semibold tracking-wider uppercase mt-0.5">
              Total Deliberado
            </p>
          </div>

          {/* Circular Progress */}
          <div className="relative">
            <CircularProgress
              percentage={totalPercentage}
              size={76}
              strokeWidth={3.8}
              color="#ffeb3b"
              trackColor="#221a42"
            />
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="relative z-10 mt-2">
          <div className="h-4 w-full bg-[#221a42] rounded-full overflow-hidden mb-2 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#d81b60] to-[#ffeb3b] rounded-full shadow-[0_0_12px_rgba(216,27,96,0.6)] transition-all duration-700"
              style={{ width: `${Math.min(100, totalPercentage)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-[#ff4081] font-semibold">
              R$ {totalCurrent.toLocaleString('pt-BR')} conquistados
            </span>
            <span className="text-[#a098c4]">
              Faltam R$ {totalRemaining.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </section>
      {/* END: Main Progress Card */}

      {/* BEGIN: Goal List */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white font-heading">
          Metas Deliberadas ({goals.length})
        </h3>
        <div className="flex items-center gap-2">
          {onOpenCreateGoal && (
            <button
              onClick={onOpenCreateGoal}
              className="py-1 px-2.5 bg-[#3b82f6]/20 border border-[#3b82f6]/40 hover:bg-[#3b82f6] text-[#93c5fd] hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Nova Meta</span>
            </button>
          )}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-[#ffeb3b] font-bold hover:underline flex items-center gap-1"
            >
              Gerenciar
            </button>
          )}
        </div>
      </div>

      <main className="space-y-3.5" data-purpose="individual-goals">
        {goals.map((goal) => {
          const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          const matchedParticipant = participants.find(p => p.name.toLowerCase() === goal.owner.toLowerCase());
          const accentBorder = goal.accentColor || matchedParticipant?.color || '#3b82f6';

          return (
            <article
              key={goal.id}
              onClick={() => onSelectGoal(goal)}
              className="bg-[#120d2b] border border-[#2a1f4a] rounded-2xl p-4 flex gap-3.5 items-center relative overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/30 active:scale-[0.99]"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: accentBorder,
              }}
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-20 shrink-0 bg-black/30 rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-white/5">
                <img
                  src={goal.imageUrl}
                  alt={goal.title}
                  className="object-contain w-full h-full drop-shadow-md"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Goal Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${accentBorder}20`,
                      color: accentBorder,
                      border: `1px solid ${accentBorder}40`,
                    }}
                  >
                    {goal.owner}
                  </span>
                  <span className="text-[10px] text-[#a098c4]">
                    Meta: R$ {goal.monthlyTarget}/mês
                  </span>
                </div>

                <h3 className="font-bold text-base leading-tight mb-1 text-white font-heading truncate">
                  {goal.title}
                </h3>

                {goal.subtitle && (
                  <p className="font-semibold text-xs text-[#a098c4] mb-1 truncate">
                    {goal.subtitle}
                  </p>
                )}

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-bold text-sm text-white">
                    R$ {goal.currentAmount.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[11px] text-[#a098c4]">
                    / R$ {goal.targetAmount.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Progress bar inside card */}
                <div className="mt-1.5">
                  <div className="h-1.5 w-full bg-[#221a42] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, percentage)}%`,
                        backgroundColor: accentBorder,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Circular Progress & Arrow */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 pl-1">
                <ChevronRight className="w-4 h-4 text-[#a098c4]" />
                <CircularProgress
                  percentage={percentage}
                  size={46}
                  strokeWidth={3.8}
                  color={accentBorder}
                  trackColor="#221a42"
                />
              </div>
            </article>
          );
        })}
      </main>
      {/* END: Goal List */}

      {/* BEGIN: Countdown & Ranking Banner */}
      <section
        onClick={onOpenMissions}
        className="mt-5 bg-gradient-to-r from-[#eab308]/20 via-[#9c27b0]/20 to-[#3b82f6]/20 border border-[#eab308]/40 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden cursor-pointer hover:border-[#ffeb3b]/60 transition-all shadow-lg"
        data-purpose="countdown-banner"
      >
        <div className="absolute left-3 top-2 text-[#ffeb3b] text-base animate-pulse">
          ⚡
        </div>
        <div className="absolute left-7 bottom-2 text-[#60a5fa] text-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <div className="text-center flex-1 pl-4">
          <p className="font-extrabold text-[11px] tracking-wider text-[#ffeb3b] uppercase flex items-center justify-center gap-1">
            Ranking dos Maiores Poupadores 🏆
          </p>
          <p className="font-bold text-xs tracking-wide text-white mt-0.5">
            Cards ordenados do maior valor para o menor • Faltam <span className="text-[#ffeb3b] text-base font-extrabold mx-0.5">134</span> dias!
          </p>
        </div>

        <div className="text-2xl pr-1 filter drop-shadow-[0_0_10px_rgba(255,235,59,0.5)] animate-bounce duration-1000">
          🏆
        </div>
      </section>
      {/* END: Countdown & Ranking Banner */}
    </div>
  );
};
