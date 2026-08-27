import React from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#120d2b] border border-[#2a1f4a] w-full max-w-sm rounded-3xl p-5 shadow-2xl relative text-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#ff4081]" />
            <h3 className="text-base font-bold font-heading">Notificações</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#a098c4] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto no-scrollbar my-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-all ${
                n.read
                  ? 'bg-black/20 border-white/5 opacity-70'
                  : 'bg-[#1e1442] border-[#9c27b0]/30 shadow-md'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white font-heading">{n.title}</h4>
                  <p className="text-[11px] text-[#a098c4] mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[9px] text-[#d8b4fe] font-mono mt-1 block">{n.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="w-full py-2.5 rounded-xl bg-[#221a42] hover:bg-[#ff4081]/20 text-xs font-semibold text-[#d8b4fe] flex items-center justify-center gap-1.5 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Marcar todas como lidas
        </button>
      </div>
    </div>
  );
};
