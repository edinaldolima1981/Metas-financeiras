import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  Users,
  Target,
  DollarSign,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  Plus,
  Receipt,
  Camera,
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Key,
} from 'lucide-react';
import { Goal, Participant, HistoryItem } from '../types';
import { IMAGES } from '../constants/images';

interface AdminPanelProps {
  goals: Goal[];
  participants: Participant[];
  history: HistoryItem[];
  onOpenCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenCreateParticipant: () => void;
  onEditParticipant: (participant: Participant) => void;
  onDeleteParticipant: (participantId: string) => void;
  onOpenAddDeposit: (preselectedGoalId?: string) => void;
  onOpenAddExpense?: (person?: string) => void;
  onSwitchToViewerMode: () => void;
  onResetData: () => void;
  onQuickDeposit: (goalId: string, amount: number, title: string) => void;
  onUpdateGoalImage?: (goalId: string, newImage: string) => void;
  onUpdateParticipantAvatar?: (participantId: string, newAvatar: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  goals,
  participants,
  history,
  onOpenCreateGoal,
  onEditGoal,
  onDeleteGoal,
  onOpenCreateParticipant,
  onEditParticipant,
  onDeleteParticipant,
  onOpenAddDeposit,
  onOpenAddExpense,
  onSwitchToViewerMode,
  onResetData,
  onQuickDeposit,
  onUpdateGoalImage,
  onUpdateParticipantAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'participants' | 'deposits' | 'settings'>('goals');
  const [quickAmount, setQuickAmount] = useState<{ [key: string]: string }>({});

  // File upload state for Goal image
  const goalFileInputRef = useRef<HTMLInputElement>(null);
  const [activeGoalUploadId, setActiveGoalUploadId] = useState<string | null>(null);

  // File upload state for Participant avatar
  const participantFileInputRef = useRef<HTMLInputElement>(null);
  const [activeParticipantUploadId, setActiveParticipantUploadId] = useState<string | null>(null);

  // Summary Metrics
  const totalTargetAmount = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalPercentage = totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0;
  const totalMonthlyTargets = goals.reduce((acc, g) => acc + g.monthlyTarget, 0);

  const handleQuickDepositSubmit = (goalId: string) => {
    const val = parseFloat(quickAmount[goalId] || '0');
    if (val <= 0) {
      alert('Informe um valor válido para o aporte.');
      return;
    }
    onQuickDeposit(goalId, val, `Aporte Deliberado pelo Admin (+R$ ${val})`);
    setQuickAmount((prev) => ({ ...prev, [goalId]: '' }));
  };

  const triggerGoalImagePick = (goalId: string) => {
    setActiveGoalUploadId(goalId);
    goalFileInputRef.current?.click();
  };

  const onGoalFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeGoalUploadId && onUpdateGoalImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateGoalImage(activeGoalUploadId, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (goalFileInputRef.current) goalFileInputRef.current.value = '';
  };

  const triggerParticipantAvatarPick = (participantId: string) => {
    setActiveParticipantUploadId(participantId);
    participantFileInputRef.current?.click();
  };

  const onParticipantFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeParticipantUploadId && onUpdateParticipantAvatar) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateParticipantAvatar(activeParticipantUploadId, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (participantFileInputRef.current) participantFileInputRef.current.value = '';
  };

  return (
    <div className="w-full text-white pb-24 pt-2">
      {/* Hidden File Inputs for Direct Local Image Selection */}
      <input
        ref={goalFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onGoalFileSelected}
      />
      <input
        ref={participantFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onParticipantFileSelected}
      />

      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
            Painel de Gestão & Deliberação 👑
          </h1>
          <p className="text-xs text-[#a098c4]">
            Defina fotos locais da sua galeria, cadastre metas e delibere valores com controle total.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateGoal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-xs font-extrabold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" /> + Nova Meta
          </button>
          <button
            onClick={onOpenCreateParticipant}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#d926a9] hover:opacity-95 text-xs font-extrabold text-white shadow-lg shadow-pink-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <Users className="w-4 h-4" /> + Participante
          </button>
        </div>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-[#120d2b] border border-white/10 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#a098c4] block truncate">
            Total Deliberado
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black text-white font-heading truncate my-1">
            R$ {totalTargetAmount.toLocaleString('pt-BR')}
          </span>
          <span className="text-[10px] text-[#4ade80] block font-medium truncate">
            Soma das metas
          </span>
        </div>

        <div className="bg-[#120d2b] border border-white/10 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#a098c4] block truncate">
            Total Acumulado
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black text-[#4ade80] font-heading truncate my-1">
            R$ {totalCurrentAmount.toLocaleString('pt-BR')}
          </span>
          <span className="text-[10px] text-[#a098c4] block font-medium truncate">
            {totalPercentage}% atingido
          </span>
        </div>

        <div className="bg-[#120d2b] border border-white/10 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#a098c4] block truncate">
            Participantes
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black text-[#60a5fa] font-heading truncate my-1">
            {participants.length} Pessoas
          </span>
          <span className="text-[10px] text-[#a098c4] block font-medium truncate">
            Ativos no app
          </span>
        </div>

        <div className="bg-[#120d2b] border border-white/10 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-[#a098c4] block truncate">
            Meta Mensal Total
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black text-[#ffeb3b] font-heading truncate my-1">
            R$ {totalMonthlyTargets.toLocaleString('pt-BR')}/mês
          </span>
          <span className="text-[10px] text-[#a098c4] block font-medium truncate">
            {goals.length} metas ativas
          </span>
        </div>
      </div>

      {/* Navigation Tabs in Admin */}
      <div className="flex bg-[#120d2b] border border-[#2a1f4a] p-1 rounded-2xl mb-4 overflow-x-auto no-scrollbar gap-1.5">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'goals'
              ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Metas Deliberadas ({goals.length})
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'participants'
              ? 'bg-gradient-to-r from-[#9333ea] to-[#d926a9] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Participantes ({participants.length})
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'deposits'
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Lançamentos ({history.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Sistema
        </button>
      </div>

      {/* TAB 1: METAS DELIBERADAS */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-heading">
              Todas as Metas Cadastradas ({goals.length})
            </h2>
            <button
              onClick={onOpenCreateGoal}
              className="text-xs text-[#60a5fa] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Criar nova meta
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="bg-[#120d2b] border border-white/10 rounded-2xl p-8 text-center">
              <Target className="w-12 h-12 text-[#a098c4] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-white mb-1">Nenhuma meta cadastrada</p>
              <p className="text-xs text-[#a098c4] mb-4">Clique no botão abaixo para criar a primeira meta deliberada.</p>
              <button
                onClick={onOpenCreateGoal}
                className="px-4 py-2 rounded-xl bg-[#3b82f6] text-white text-xs font-bold"
              >
                + Criar Primeira Meta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {goals.map((g) => {
                const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
                const rem = Math.max(0, g.targetAmount - g.currentAmount);
                const part = participants.find((p) => p.name.toLowerCase() === g.owner.toLowerCase());

                return (
                  <div
                    key={g.id}
                    className="bg-[#120d2b] border border-white/10 rounded-3xl p-3.5 sm:p-4 shadow-xl flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top bar with owner & tag */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={part?.avatar || IMAGES.edinaldoProfile}
                          alt={g.owner}
                          className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                          crossOrigin="anonymous"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#a098c4] font-bold uppercase tracking-wide block truncate">
                            RESPONSÁVEL: <strong className="text-white">{g.owner}</strong>
                          </span>
                          <h3 className="text-xs sm:text-sm font-extrabold text-white font-heading truncate">
                            {g.title} {g.subtitle ? `(${g.subtitle})` : ''}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditGoal(g)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#60a5fa] hover:text-white transition-colors"
                          title="Editar Meta"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGoal(g.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Excluir Meta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Main Device / Goal section with Local Image Quick Action */}
                    <div className="flex gap-2.5 sm:gap-3 items-center mb-3">
                      {/* Image Thumbnail with Direct Click-to-Upload */}
                      <div
                        onClick={() => triggerGoalImagePick(g.id)}
                        className="relative w-18 h-22 sm:w-20 sm:h-24 bg-black/40 rounded-2xl flex items-center justify-center p-1 border border-white/15 shrink-0 group cursor-pointer overflow-hidden shadow-inner"
                        title="Clique para escolher foto local do dispositivo"
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                          <Camera className="w-5 h-5 text-white" />
                          <span className="text-[8px] text-white font-bold mt-0.5">Trocar</span>
                        </div>
                        <div className="absolute bottom-1 right-1 p-1 bg-[#3b82f6] rounded-full text-white shadow">
                          <FolderOpen className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-center text-xs gap-1">
                          <span className="text-[#a098c4] text-[11px] truncate">Acumulado:</span>
                          <span className="font-bold text-[#4ade80] text-xs shrink-0">
                            R$ {g.currentAmount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs gap-1">
                          <span className="text-[#a098c4] text-[11px] truncate">Valor Alvo:</span>
                          <span className="font-bold text-white text-xs shrink-0">
                            R$ {g.targetAmount.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs gap-1">
                          <span className="text-[#a098c4] text-[11px] truncate">Meta Mensal:</span>
                          <span className="font-bold text-[#ffeb3b] text-xs shrink-0">
                            R$ {g.monthlyTarget}/mês
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs gap-1">
                          <span className="text-[#a098c4] text-[11px] truncate">Faltam:</span>
                          <span className="font-bold text-[#f87171] text-xs shrink-0">
                            R$ {rem.toLocaleString('pt-BR')}
                          </span>
                        </div>

                        {/* Botão Direto de Trocar Imagem Local */}
                        <button
                          type="button"
                          onClick={() => triggerGoalImagePick(g.id)}
                          className="mt-1 w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-[#3b82f6]/20 border border-white/10 hover:border-[#3b82f6]/40 text-[10px] font-bold text-[#60a5fa] hover:text-white flex items-center justify-center gap-1 transition-all"
                        >
                          <Camera className="w-3 h-3 text-[#ffeb3b]" />
                          <span>Alterar Imagem Local 📸</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[#a098c4]">Progresso</span>
                        <span className="text-white font-heading">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Deposit directly from Admin */}
                    <div className="pt-2.5 border-t border-white/5 flex gap-2 items-center">
                      <div className="relative flex-1 min-w-0">
                        <span className="absolute left-2.5 top-1.5 text-[10px] text-[#a098c4] font-bold">R$</span>
                        <input
                          type="number"
                          placeholder="Valor do Aporte"
                          value={quickAmount[g.id] || ''}
                          onChange={(e) =>
                            setQuickAmount((prev) => ({ ...prev, [g.id]: e.target.value }))
                          }
                          className="w-full bg-[#1c143d] border border-white/10 rounded-xl pl-7 pr-2 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <button
                        onClick={() => handleQuickDepositSubmit(g.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#3b82f6]/20 hover:bg-[#3b82f6] text-[#60a5fa] hover:text-white border border-[#3b82f6]/40 text-xs font-bold transition-all shrink-0 whitespace-nowrap"
                      >
                        + Aporte
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PARTICIPANTES */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-heading">
              Participantes Cadastrados ({participants.length})
            </h2>
            <button
              onClick={onOpenCreateParticipant}
              className="text-xs text-[#c084fc] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Participante
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth w-full">
            {participants.map((p) => {
              const userGoals = goals.filter((g) => g.owner.toLowerCase() === p.name.toLowerCase());
              const totalTarget = userGoals.reduce((a, b) => a + b.targetAmount, 0);
              const totalSaved = userGoals.reduce((a, b) => a + b.currentAmount, 0);

              return (
                <div
                  key={p.id}
                  className="bg-[#120d2b] border border-white/10 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden shrink-0 w-[295px] sm:w-[320px] snap-start"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {/* Avatar with Click-to-upload local photo */}
                      <div
                        onClick={() => triggerParticipantAvatarPick(p.id)}
                        className="relative cursor-pointer group shrink-0"
                        title="Clique para trocar foto do participante"
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 shadow-md group-hover:scale-105 transition-transform"
                          style={{ borderColor: p.color || '#3b82f6' }}
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#120d2b] flex items-center justify-center text-[8px] text-white font-bold"
                          style={{ backgroundColor: p.color || '#3b82f6' }}
                        >
                          📸
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditParticipant(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#60a5fa] hover:text-white transition-colors"
                          title="Editar Participante"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {participants.length > 1 && (
                          <button
                            onClick={() => onDeleteParticipant(p.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Remover Participante"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-white font-heading truncate">{p.name}</h3>
                      <button
                        onClick={() => triggerParticipantAvatarPick(p.id)}
                        className="text-[10px] text-[#c084fc] hover:underline flex items-center gap-0.5 font-bold"
                      >
                        <Camera className="w-3 h-3" /> Trocar foto
                      </button>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/5 text-[#a098c4] border border-white/10 inline-block mb-2 truncate max-w-full">
                      {p.role}
                    </span>

                    {p.bio && (
                      <p className="text-[11px] text-[#a098c4] mb-3 line-clamp-2 italic">
                        "{p.bio}"
                      </p>
                    )}

                    <div className="bg-[#1c143d] p-2.5 rounded-xl border border-white/5 space-y-1 mb-3">
                      <div className="flex justify-between text-xs gap-1">
                        <span className="text-[#a098c4] truncate">Reserva Mensal:</span>
                        <span className="font-bold text-[#4ade80] shrink-0">R$ {p.monthlyAllowance}/mês</span>
                      </div>
                      <div className="flex justify-between text-xs gap-1">
                        <span className="text-[#a098c4] truncate">Metas Ativas:</span>
                        <span className="font-bold text-white shrink-0">{userGoals.length} meta(s)</span>
                      </div>
                      <div className="flex justify-between text-xs gap-1">
                        <span className="text-[#a098c4] truncate">Total Acumulado:</span>
                        <span className="font-bold text-[#ffeb3b] shrink-0">R$ {totalSaved.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-xs gap-1 pt-1.5 border-t border-white/5 items-center">
                        <span className="text-[#a098c4] truncate">Senha de Acesso:</span>
                        <span className="font-mono font-black text-[#ffeb3b] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] tracking-wider shrink-0">
                          {p.password || '123'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        onOpenCreateGoal();
                      }}
                      className="py-2 px-1 rounded-xl bg-white/5 hover:bg-[#3b82f6]/20 border border-white/5 text-[10px] font-bold text-[#a098c4] hover:text-white transition-all flex items-center justify-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Meta
                    </button>
                    <button
                      onClick={() => onOpenAddExpense ? onOpenAddExpense(p.name) : undefined}
                      className="py-2 px-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-[10px] font-bold text-red-400 hover:text-white transition-all flex items-center justify-center gap-0.5"
                    >
                      <MinusCircle className="w-3 h-3" /> Gasto
                    </button>
                    <button
                      onClick={() => onEditParticipant(p)}
                      className="py-2 px-1 rounded-xl bg-[#c084fc]/10 hover:bg-[#c084fc]/20 border border-[#c084fc]/35 text-[10px] font-bold text-[#c084fc] hover:text-white transition-all flex items-center justify-center gap-0.5 shadow-sm"
                    >
                      <Key className="w-3 h-3" /> Senha
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LANÇAMENTOS E APORTES */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="bg-[#120d2b] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-heading mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4ade80]" /> Lançamento de Aportes & Despesas
            </h2>
            <p className="text-xs text-[#a098c4] mb-4">
              Como Administrador, você pode deliberar aportes diretamente para qualquer meta ou registrar despesas que debitam da reserva.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onOpenAddDeposit()}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-white flex items-center gap-3 shadow-lg active:scale-98 transition-all"
              >
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-xs sm:text-sm font-extrabold truncate">Adicionar Aporte / Depósito</span>
                  <span className="text-[10px] text-blue-100 opacity-80 block truncate">
                    Credita saldo na meta escolhida
                  </span>
                </div>
              </button>

              <button
                onClick={() => onOpenAddExpense ? onOpenAddExpense() : undefined}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#1c143d] border border-white/10 hover:border-white/20 text-white flex items-center gap-3 shadow-lg active:scale-98 transition-all"
              >
                <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-xs sm:text-sm font-extrabold truncate">Registrar Despesa / Débito</span>
                  <span className="text-[10px] text-[#a098c4] block truncate">
                    Debita do orçamento mensal
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent History Table */}
          <div className="bg-[#120d2b] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white font-heading mb-3">
              Últimos Lançamentos Registrados ({history.length})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c143d] border border-white/5 text-xs gap-2"
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="text-base shrink-0">{h.emoji}</span>
                    <div className="truncate min-w-0">
                      <p className="text-white font-bold truncate">{h.title}</p>
                      <p className="text-[10px] text-[#a098c4] truncate">{h.goalTitle} • {h.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-extrabold shrink-0 text-xs ${
                      h.type === 'expense' ? 'text-red-400' : 'text-[#4ade80]'
                    }`}
                  >
                    {h.type === 'expense' ? '-' : '+'} R$ {h.amount.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURAÇÕES E SISTEMA */}
      {activeTab === 'settings' && (
        <div className="bg-[#120d2b] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-heading mb-1 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#ffeb3b]" /> Manutenção e Dados do Sistema
            </h2>
            <p className="text-xs text-[#a098c4]">
              Ações administrativas para o cofre e persistência do app.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c143d] border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white">Visualização de Participante</h4>
                <p className="text-[11px] text-[#a098c4]">
                  Alterne para o modo visual para ver a interface como os participantes veem.
                </p>
              </div>
              <button
                onClick={onSwitchToViewerMode}
                className="px-3.5 py-2 rounded-xl bg-[#3b82f6] text-white text-xs font-bold shrink-0 self-start sm:self-auto"
              >
                Modo Visual 👀
              </button>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c143d] border border-red-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-red-400">Restaurar Dados Iniciais de Fábrica</h4>
                <p className="text-[11px] text-[#a098c4]">
                  Restaura as metas do iPhone 15 do Edinaldo e iPhone 16 da Coronita.
                </p>
              </div>
              <button
                onClick={onResetData}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold shrink-0 border border-red-500/30 self-start sm:self-auto"
              >
                Restaurar Fábrica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
