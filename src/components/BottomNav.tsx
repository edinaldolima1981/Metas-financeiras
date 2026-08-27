import React from 'react';
import { Home, Target, Plus, ClipboardList, Swords } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { CoupleProfile } from '../types';

export type TabType = 'home' | 'goals' | 'missions' | 'history' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  activeScreen?: string;
  couple?: CoupleProfile;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  couple,
  isAdmin = false,
}) => {
  const edinaldoAvatar = couple?.partner1?.avatar || IMAGES.edinaldoProfile;
  const coronitaAvatar = couple?.partner2?.avatar || IMAGES.coronitaAvatar;

  return (
    <nav 
      className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-[#070514]/95 backdrop-blur-md border-t border-[#2a1f4a] z-50 px-5 py-2.5"
      data-purpose="bottom-tab-bar"
    >
      <div className="flex justify-between items-center relative">
        {/* Início */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'home'
              ? 'text-[#d81b60] scale-105'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'drop-shadow-[0_0_8px_rgba(216,27,96,0.8)]' : ''}`} />
          <span className="text-[10px] font-semibold">Início</span>
        </button>

        {/* Metas */}
        <button
          onClick={() => onSelectTab('goals')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'goals'
              ? 'text-[#d81b60] scale-105'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <Target className={`w-5 h-5 ${currentTab === 'goals' ? 'drop-shadow-[0_0_8px_rgba(216,27,96,0.8)]' : ''}`} />
          <span className="text-[10px] font-semibold">Metas</span>
        </button>

        {/* Histórico */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'history'
              ? 'text-[#d81b60] scale-105'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          <ClipboardList className={`w-5 h-5 ${currentTab === 'history' ? 'drop-shadow-[0_0_8px_rgba(216,27,96,0.8)]' : ''}`} />
          <span className="text-[10px] font-semibold">Histórico</span>
        </button>

        {/* Ranking dos Maiores Poupadores */}
        <button
          onClick={() => onSelectTab('missions')}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentTab === 'missions'
              ? 'text-white scale-105 font-bold'
              : 'text-[#a098c4] hover:text-white'
          }`}
        >
          {/* Dual avatar display */}
          <div className="flex items-center -space-x-2 relative mb-0.5">
            {/* Edinaldo */}
            <div className={`w-5 h-5 rounded-full overflow-hidden border-2 z-10 ${
              currentTab === 'missions' ? 'border-[#3b82f6] shadow-[0_0_6px_rgba(59,130,246,0.9)]' : 'border-[#1e3a6a]'
            }`}>
              <img
                src={edinaldoAvatar}
                alt="Edinaldo"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.edinaldoProfile;
                }}
              />
            </div>
            {/* Coronita */}
            <div className={`w-5 h-5 rounded-full overflow-hidden border-2 ${
              currentTab === 'missions' ? 'border-[#ff4081] shadow-[0_0_6px_rgba(255,64,129,0.9)]' : 'border-[#2a1f4a]'
            }`}>
              <img
                src={coronitaAvatar}
                alt="Coronita"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.coronitaAvatar;
                }}
              />
            </div>
          </div>
          <span className="text-[10px] font-semibold flex items-center gap-0.5">
            Ranking 🏆
          </span>
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2 mb-0.5"></div>
    </nav>
  );
};
