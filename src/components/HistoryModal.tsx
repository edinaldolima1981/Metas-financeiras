import React from 'react';
import { X, ClipboardList, TrendingUp } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalSaved = history.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#120d2b] border border-[#2a1f4a] w-full max-w-md rounded-3xl p-5 shadow-2xl relative text-white flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#ff4081]" />
            <h3 className="text-base font-bold font-heading">Histórico de Conquistas</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#a098c4] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Summary Banner */}
        <div className="bg-gradient-to-r from-[#9c27b0]/20 to-[#d81b60]/20 border border-[#9c27b0]/30 rounded-2xl p-3 mb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a098c4] uppercase font-semibold">Total Acumulado Registrado</span>
            <div className="text-xl font-extrabold text-[#ffeb3b] font-heading">R$ {totalSaved.toLocaleString('pt-BR')}</div>
          </div>
          <TrendingUp className="w-6 h-6 text-[#4ade80]" />
        </div>

        {/* List */}
        <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-1">
          {history.map((item) => {
            const isExpense = item.type === 'expense';
            return (
              <div
                key={item.id}
                className="bg-[#1c143d] border border-white/5 rounded-xl p-3 flex items-center justify-between hover:border-[#ff4081]/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[10px] text-[#a098c4] truncate">{item.goalTitle} • {item.date}</p>
                  </div>
                </div>
                <span className={`font-extrabold text-sm shrink-0 ${isExpense ? 'text-[#ef4444]' : 'text-[#4ade80]'}`}>
                  {isExpense ? '-' : '+'} R$ {item.amount.toLocaleString('pt-BR')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
