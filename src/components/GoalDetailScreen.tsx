import React from 'react';
import {
  ChevronLeft,
  Heart,
  Calendar,
  Zap,
  Flame,
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Camera,
  UserCheck,
  Edit3,
  Target,
} from 'lucide-react';
import { Goal, HistoryItem, Participant, CoupleProfile } from '../types';
import { IMAGES } from '../constants/images';

interface GoalDetailScreenProps {
  goal: Goal | null;
  goals: Goal[];
  history: HistoryItem[];
  participants?: Participant[];
  couple?: CoupleProfile;
  onSelectGoal: (goal: Goal) => void;
  onBack: () => void;
  onViewFullHistory: () => void;
  onAddDeposit: () => void;
  onOpenAvatarModal: (personName: string) => void;
  isAdmin?: boolean;
}

export const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({
  goal,
  goals,
  history,
  participants = [],
  couple,
  onSelectGoal,
  onBack,
  onViewFullHistory,
  onAddDeposit,
  onOpenAvatarModal,
  isAdmin = false,
}) => {
  if (!goal) {
    return (
      <div className="pb-32 text-center py-12 px-4 text-white">
        <header className="flex justify-between items-center py-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="text-base sm:text-lg font-bold font-heading">Minhas Metas</h1>
          <div className="w-6 h-6" />
        </header>
        <div className="bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-6 shadow-xl max-w-sm mx-auto">
          <Target className="w-12 h-12 text-[#ff4081] mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold mb-2">Nenhuma Meta Encontrada</h2>
          <p className="text-[#a098c4] text-xs leading-relaxed">
            Você não possui nenhuma meta individual cadastrada no momento.
          </p>
          <p className="text-[#a098c4] text-[11px] mt-3 bg-white/5 p-2 rounded-xl border border-white/5">
            Solicite ao Administrador para cadastrar sua meta e planejar as suas conquistas!
          </p>
        </div>
      </div>
    );
  }

  const percentage = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const isEdinaldo =
    goal.id === 'goal-1' ||
    goal.owner?.toLowerCase() === 'edinaldo' ||
    goal.title.toLowerCase().includes('meu');
  const isCoronita = goal.id === 'goal-2' || goal.owner?.toLowerCase() === 'coronita';

  // Find owner avatar
  const matchedParticipant = participants.find(
    (p) => p.name.toLowerCase() === goal.owner.toLowerCase()
  );

  const ownerAvatar =
    matchedParticipant?.avatar ||
    (isEdinaldo
      ? couple?.partner1.avatar || IMAGES.edinaldoProfile
      : isCoronita
      ? couple?.partner2.avatar || IMAGES.coronitaAvatar
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');

  // Monthly breakdown calculations
  const monthlyRate = goal.monthlyTarget || (isEdinaldo ? 400 : isCoronita ? 600 : 500);
  const monthsCompleted = Math.floor(goal.currentAmount / monthlyRate);
  const totalMonthsNeeded = Math.ceil(goal.targetAmount / monthlyRate);
  const monthsRemaining = Math.max(0, totalMonthsNeeded - monthsCompleted);

  // Filter history for this goal specifically
  const goalHistory = history
    .filter((h) => {
      if (h.goalId === goal.id) return true;
      if (h.goalTitle.toLowerCase().includes(goal.title.toLowerCase())) return true;
      if (h.participantName && h.participantName.toLowerCase() === goal.owner.toLowerCase()) return true;
      return false;
    })
    .map((h) => ({
      ...h,
      title: h.title
        .replace(/1ª\s*quinzena/gi, 'Meta Mensal (Parcela 1)')
        .replace(/2ª\s*quinzena/gi, 'Meta Mensal (Parcela 2)')
        .replace(/quinzenal/gi, 'mensal')
        .replace(/quinzena/gi, 'mês')
        .replace(/quizena/gi, 'mês'),
    }))
    .slice(0, 4);

  const accentColor = goal.accentColor || (isEdinaldo ? '#3b82f6' : isCoronita ? '#ff4081' : '#10b981');
  const deviceImage = goal.imageUrl || (isEdinaldo ? IMAGES.iphone15 : IMAGES.iphone16Detail);

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="flex justify-between items-center py-3 mb-2 text-white">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="text-base sm:text-lg font-bold font-heading text-white flex items-center gap-1.5 truncate max-w-[240px]">
          <span className="truncate">
            {goal.title} ({goal.owner})
          </span>
        </h1>

        {isAdmin ? (
          <button
            onClick={onAddDeposit}
            className="p-2 -mr-2 hover:bg-white/10 rounded-full active:scale-95 transition-all"
            aria-label="Adicionar Aporte"
            title="Adicionar Aporte"
          >
            <Heart
              className="w-6 h-6 fill-current animate-pulse"
              style={{ color: accentColor }}
            />
          </button>
        ) : (
          <div className="w-6 h-6" /> // spacer to balance layout
        )}
      </header>

      {/* Goal Switcher Tabs (All dynamic goals) */}
      <div className="flex gap-2 p-1 bg-[#120d2b] border border-[#2a1f4a] rounded-2xl mb-3.5 overflow-x-auto no-scrollbar">
        {goals.map((g) => {
          const isCurrentSelected = g.id === goal.id;
          const gAccent = g.accentColor || (g.owner.toLowerCase() === 'edinaldo' ? '#3b82f6' : '#ff4081');
          return (
            <button
              key={g.id}
              onClick={() => onSelectGoal(g)}
              className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                isCurrentSelected
                  ? 'text-white shadow-lg'
                  : 'text-[#a098c4] hover:text-white'
              }`}
              style={{
                backgroundColor: isCurrentSelected ? gAccent : 'transparent',
                boxShadow: isCurrentSelected ? `0 0 14px ${gAccent}60` : 'none',
              }}
            >
              <span>{g.title} ({g.owner})</span>
            </button>
          );
        })}
      </div>

      {/* DEDICATED AVATAR & PARTICIPANT PROFILE BAR WITH "TROCAR AVATAR" BUTTON */}
      <div className="bg-[#120d2b] border border-white/15 rounded-3xl p-3 sm:p-3.5 mb-4 shadow-xl flex items-center justify-between gap-2.5 backdrop-blur-md">
        <div
          onClick={() => onOpenAvatarModal(goal.owner)}
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
          title="Clique para trocar o avatar"
        >
          {/* Avatar Thumbnail with Camera Badge */}
          <div className="relative shrink-0">
            <img
              src={ownerAvatar}
              alt={goal.owner}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 shadow-md group-hover:scale-105 transition-transform"
              style={{ borderColor: accentColor }}
              crossOrigin="anonymous"
            />
            <div
              className="absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Camera className="w-3 h-3" />
            </div>
          </div>

          {/* Owner Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#a098c4] font-bold uppercase tracking-wider block truncate">
                Responsável pela Meta
              </span>
              <UserCheck className="w-3 h-3 text-[#4ade80]" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white font-heading truncate">
              {goal.owner}
            </h3>
            <span className="text-[10px] text-[#ffeb3b] font-medium block truncate">
              Meta: R$ {monthlyRate}/mês
            </span>
          </div>
        </div>

        {/* Change Avatar Button */}
        <button
          onClick={() => onOpenAvatarModal(goal.owner)}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-lg active:scale-95 transition-all shrink-0 whitespace-nowrap hover:opacity-95"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 0 16px ${accentColor}50`,
          }}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Trocar Avatar 📸</span>
        </button>
      </div>

      {/* Decorative stars/sparks */}
      <div className="relative">
        <div className="absolute -top-4 left-6 w-2 h-2 rounded-full bg-[#ffeb3b] opacity-80 shadow-[0_0_8px_#facc15]"></div>
        <div className="absolute top-24 right-4 w-3 h-3 rounded-full bg-[#3b82f6] opacity-70 shadow-[0_0_10px_#3b82f6]"></div>
        <div className="absolute top-52 left-2 w-3 h-3 rounded-full bg-[#fde047] opacity-60 shadow-[0_0_12px_#fde047]"></div>
      </div>

      {/* Hero Card */}
      <section
        className="border border-white/10 rounded-3xl p-5 mb-4 shadow-xl relative overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#180e38]/90 to-[#0d0720]/95"
      >
        <h2 className="text-center text-base sm:text-lg font-extrabold text-white mb-4 uppercase tracking-wider font-heading flex items-center justify-center gap-1.5">
          <span className="text-[#ffeb3b]">✦</span>{' '}
          RUMO A: {goal.title.toUpperCase()} ({goal.owner.toUpperCase()}){' '}
          <span className="text-[#ffeb3b]">✦</span>
        </h2>

        <div className="flex gap-3.5 items-center">
          {/* Image Section with Neon Pedestal */}
          <div className="flex-1 relative flex flex-col items-center justify-end pb-2">
            {/* Simulated Glowing Platform */}
            <div
              className="absolute bottom-1 w-32 h-7 rounded-[100%] blur-[1px]"
              style={{
                backgroundColor: `${accentColor}90`,
                boxShadow: `0 0 20px ${accentColor}`,
                borderTop: `1px solid ${accentColor}`,
              }}
            ></div>

            {/* Device Photo */}
            <div className="relative w-28 h-40 bg-black/40 rounded-2xl flex items-center justify-center z-10 shadow-2xl border border-white/15 overflow-hidden p-1.5">
              <img
                src={deviceImage}
                alt={goal.title}
                className="w-full h-full object-contain transform hover:scale-105 transition-transform"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Progress Section */}
          <div
            className="flex-1 rounded-2xl p-3.5 border border-white/10 bg-[#120d2b] flex flex-col items-center justify-center text-center shadow-inner"
          >
            <p className="text-[10px] text-[#a890c4] font-bold mb-1 uppercase tracking-wider">
              Acumulado até agora
            </p>
            <p className="text-xl font-bold mb-0 leading-tight font-heading" style={{ color: accentColor }}>
              R$ <span className="text-2xl font-extrabold">{goal.currentAmount.toLocaleString('pt-BR')}</span>
            </p>
            <p className="text-[11px] text-[#a890c4] mb-2.5 font-medium">
              de R$ {goal.targetAmount.toLocaleString('pt-BR')}
            </p>

            {/* Conic Circular Progress */}
            <div className="relative w-18 h-18 rounded-full flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3.8"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 5px ${accentColor})`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-extrabold text-white font-heading">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missing Amount Banner */}
      <section
        className="border border-white/10 rounded-2xl p-4 mb-4 shadow-lg bg-gradient-to-r from-[#180e38]/80 to-[#0d0720]/80"
      >
        <h3 className="text-center text-xs font-bold text-white mb-2.5 tracking-wide uppercase">
          FALTAM{' '}
          <span className="text-[#ffeb3b] font-extrabold">
            R$ {remaining.toLocaleString('pt-BR')}
          </span>{' '}
          PARA {goal.title.toUpperCase()} ({goal.owner.toUpperCase()})
        </h3>

        {/* Progress bar with star */}
        <div className="relative w-full h-3 bg-black/40 rounded-full overflow-visible">
          <div
            className="h-full rounded-full relative transition-all duration-700"
            style={{
              width: `${Math.min(100, percentage)}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          >
            {/* Star badge */}
            <div className="absolute -right-2.5 -top-2 text-[#ffeb3b] text-base drop-shadow-[0_0_6px_rgba(255,235,59,0.8)] animate-pulse">
              ⭐
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid - 100% Mensal */}
      <section className="grid grid-cols-3 gap-2.5 mb-4">
        {/* Days Remaining */}
        <div className="bg-[#120d2b] border border-white/10 border-t border-t-[#c084fc]/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="text-[#ff80ab] mb-1">
            <Calendar className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-white font-extrabold text-lg leading-none font-heading">{goal.daysRemaining}</p>
          <p className="text-[#a890c4] text-[10px] font-medium mt-1">dias restantes</p>
        </div>

        {/* Monthly Target */}
        <div className="bg-[#120d2b] border border-white/10 border-t border-t-[#c084fc]/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="text-[#ffeb3b] mb-1">
            <Zap className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-white font-extrabold text-base leading-none font-heading">R$ {monthlyRate}</p>
          <p className="text-[#a890c4] text-[10px] font-medium mt-1">meta por mês</p>
        </div>

        {/* Streak */}
        <div className="bg-[#120d2b] border border-white/10 border-t border-t-[#c084fc]/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="text-[#fb923c] mb-1">
            <Flame className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-white font-extrabold text-lg leading-none font-heading">{goal.streakDays}</p>
          <p className="text-[#a890c4] text-[10px] font-medium mt-1">dias de sequência</p>
        </div>
      </section>

      {/* Monthly Plan & Rhythm Box */}
      <section className="bg-[#120d2b] border border-white/10 rounded-2xl p-4 mb-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ffeb3b]" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-heading">
              Planejamento Mensal Deliberado
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#9c27b0]/20 text-[#d8b4fe] border border-[#9c27b0]/30">
            R$ {monthlyRate}/mês
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#1c143d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#a098c4] block mb-0.5">Meses Concluídos</span>
            <span className="text-sm font-extrabold text-white flex items-center gap-1 font-heading">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
              {monthsCompleted} de {totalMonthsNeeded} meses
            </span>
          </div>

          <div className="bg-[#1c143d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-[#a098c4] block mb-0.5">Meses Restantes</span>
            <span className="text-sm font-extrabold text-[#ffeb3b] flex items-center gap-1 font-heading">
              <Clock className="w-3.5 h-3.5 text-[#ffeb3b]" />
              {monthsRemaining} meses até o fim
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#a098c4] leading-relaxed">
          💡 <strong className="text-white">Regra Mensal:</strong> A cada mês que {goal.owner} poupar a meta integral deliberada de <strong className="text-white">R$ {monthlyRate}</strong>, o saldo é transferido diretamente para a meta de <strong className="text-white">{goal.title}</strong>.
        </p>
      </section>

      {/* Recent Achievements */}
      <section className="bg-[#120d2b] border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="text-white font-extrabold text-xs flex items-center uppercase tracking-wider font-heading">
            CONQUISTAS DE {goal.owner.toUpperCase()} <span className="ml-1.5 text-base">🏆</span>
          </h3>
          <button
            onClick={onAddDeposit}
            className="text-[10px] text-[#ffeb3b] font-bold hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3" /> Fazer aporte
          </button>
        </div>

        {goalHistory.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#a098c4]">
            Nenhum aporte registrado para esta meta ainda.
          </div>
        ) : (
          <ul className="space-y-3 mb-4">
            {goalHistory.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-xs bg-[#1c143d] p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center text-gray-200 font-medium truncate mr-2">
                  <span className="mr-2 text-sm shrink-0">{item.emoji}</span>
                  <span className="truncate">{item.title}</span>
                </div>
                <span className="text-[#4ade80] font-extrabold text-xs shrink-0">
                  + R$ {item.amount.toLocaleString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onViewFullHistory}
          className="w-full text-white font-bold text-xs py-3 rounded-xl hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 14px ${accentColor}60`,
          }}
        >
          <Sparkles className="w-4 h-4" /> Ver histórico completo
        </button>
      </section>
    </div>
  );
};
