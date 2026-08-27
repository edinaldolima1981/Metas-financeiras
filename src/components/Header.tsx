import React from 'react';
import { Bell, Menu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenMenu?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Nossa Conquista 🚀',
  subtitle = 'Juntos, foco e disciplina para realizar nosso sonho! 💜',
  unreadCount = 3,
  onOpenNotifications,
  onOpenMenu,
  onOpenAdmin,
}) => {
  return (
    <header className="flex items-center justify-between mb-4 pt-2" data-purpose="top-navigation">
      <button 
        onClick={onOpenMenu}
        className="text-white p-2 focus:outline-none hover:bg-white/10 rounded-full transition-colors active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="text-center flex-1 px-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-1.5 text-white font-heading">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#a098c4] mt-0.5 max-w-[240px] mx-auto leading-tight font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#ffeb3b] hover:bg-white/10 rounded-full transition-colors active:scale-95"
            title="Painel Admin 👑"
            aria-label="Painel Admin"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        )}

        <div className="relative">
          <button 
            onClick={onOpenNotifications}
            className="text-white p-2 focus:outline-none hover:bg-white/10 rounded-full transition-colors active:scale-95 relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#ef4444] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border-2 border-[#070514] min-w-[18px] text-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
