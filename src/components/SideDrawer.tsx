import React from 'react';
import { X, Target, Trophy, Sparkles, Heart, Users, RefreshCw, Camera, Smartphone, ShieldCheck, LogOut } from 'lucide-react';
import { CoupleProfile, Goal } from '../types';
import { IMAGES } from '../constants/images';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  couple: CoupleProfile;
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onSelectScreen: (screen: 'home' | 'coronita-detail' | 'missions' | 'history' | 'admin') => void;
  onResetData: () => void;
  onOpenAvatarModal: (person: 'Edinaldo' | 'Coronita') => void;
  onOpenAdmin: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  couple,
  goals,
  onSelectGoal,
  onSelectScreen,
  onResetData,
  onOpenAvatarModal,
  onOpenAdmin,
  isAdmin = false,
  onLogout,
}) => {
  if (!isOpen) return null;

  const edinaldoGoal = goals.find((g) => g.id === 'goal-1' || g.owner?.toLowerCase() === 'edinaldo') || goals[0];
  const coronitaGoal = goals.find((g) => g.id === 'goal-2' || g.owner?.toLowerCase() === 'coronita') || goals[1];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#120d2b] border-r border-[#2a1f4a] h-full p-5 text-white flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-300 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-lg font-heading flex items-center gap-1.5">
              Nossa Conquista 🚀
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#a098c4] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Panel Feature Button */}
          {isAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="w-full mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#9333ea] text-white shadow-lg flex items-center justify-between hover:opacity-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white/20">
                  <ShieldCheck className="w-5 h-5 text-[#ffeb3b]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-black uppercase tracking-wider">Painel do Admin 👑</span>
                  <span className="block text-[10px] text-blue-100 opacity-90">Criar metas e participantes</span>
                </div>
              </div>
              <span className="text-xs">➔</span>
            </button>
          )}

          {/* Couple Avatars Box with individual click-to-edit */}
          <div className="bg-[#1c143d] border border-[#2a1f4a] rounded-2xl p-3.5 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-[#a098c4] tracking-wider">
                Perfil do Casal (Clique p/ foto)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Edinaldo Avatar */}
              <div
                onClick={() => {
                  onOpenAvatarModal('Edinaldo');
                }}
                className="relative cursor-pointer group"
                title="Clique para trocar foto do Edinaldo"
              >
                <img
                  id="avatar-edinaldo-drawer"
                  src={couple.partner1.avatar || IMAGES.edinaldoProfile}
                  alt="Edinaldo"
                  className="w-12 h-12 rounded-full border-2 border-[#3b82f6] object-cover transition-transform group-hover:scale-105"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGES.edinaldoProfile;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#3b82f6] text-white p-0.5 rounded-full shadow-md">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Coronita Avatar */}
              <div
                onClick={() => {
                  onOpenAvatarModal('Coronita');
                }}
                className="relative cursor-pointer group"
                title="Clique para trocar foto da Coronita"
              >
                <img
                  id="avatar-coronita-drawer"
                  src={couple.partner2.avatar || IMAGES.coronitaAvatar}
                  alt="Coronita"
                  className="w-12 h-12 rounded-full border-2 border-[#ff4081] object-cover transition-transform group-hover:scale-105"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGES.coronitaAvatar;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#ff4081] text-white p-0.5 rounded-full shadow-md">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                  Edinaldo & Coronita <Heart className="w-3 h-3 text-[#ff4081] fill-current inline shrink-0" />
                </div>
                <div className="text-[10px] text-[#a098c4]">Metas Deliberadas: {goals.length}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-[#a098c4] tracking-wider px-1 mb-1">
              Navegação
            </div>

            <button
              onClick={() => {
                onSelectScreen('home');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#ff4081]/15 text-left text-xs font-semibold transition-colors"
            >
              <Target className="w-4 h-4 text-[#ff4081]" /> Tela Principal (Visão Geral)
            </button>

            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  onSelectGoal(g);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 text-left text-xs font-semibold transition-colors truncate"
              >
                <Smartphone className="w-4 h-4 text-[#60a5fa] shrink-0" />
                <span className="truncate">{g.title} ({g.owner})</span>
              </button>
            ))}

            <button
              onClick={() => {
                onSelectScreen('missions');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eab308]/20 text-left text-xs font-semibold transition-colors"
            >
              <Trophy className="w-4 h-4 text-[#ffeb3b]" /> Ranking dos Poupadores 🏆
            </button>

            <button
              onClick={() => {
                onSelectScreen('history');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 text-left text-xs font-semibold transition-colors"
            >
              <Users className="w-4 h-4 text-[#4ade80]" /> Histórico de Conquistas
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-6 border-t border-[#2a1f4a] space-y-2">
          {isAdmin && (
            <button
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-black/30 text-[11px] text-[#a098c4] hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restaurar dados iniciais
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair da Conta 🚪
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
