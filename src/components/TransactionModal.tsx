import React, { useState } from 'react';
import { X, MinusCircle, PlusCircle, AlertTriangle, CheckCircle, UserCheck, Target } from 'lucide-react';
import { Goal, ExpenseItem, Participant } from '../types';
import { triggerCelebration } from '../utils/confetti';

interface TransactionModalProps {
  isOpen: boolean;
  goals: Goal[];
  participants?: Participant[];
  onClose: () => void;
  onAddDeposit: (goalId: string, amount: number, note: string) => void;
  onAddExpense: (
    targetPerson: string,
    description: string,
    amount: number,
    category: ExpenseItem['category'],
    note?: string,
    goalId?: string
  ) => void;
  edinaldoAllowanceRemaining?: number;
  coronitaAllowanceRemaining?: number;
  defaultPerson?: string;
  defaultGoalId?: string;
  defaultMode?: 'deposit' | 'expense';
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  goals,
  participants = [],
  onClose,
  onAddDeposit,
  onAddExpense,
  edinaldoAllowanceRemaining = 365,
  coronitaAllowanceRemaining = 475,
  defaultPerson = 'Coronita',
  defaultGoalId,
  defaultMode = 'expense',
}) => {
  const [modalMode, setModalMode] = useState<'expense' | 'deposit'>(defaultMode);

  // Expense form state
  const [targetPerson, setTargetPerson] = useState<string>(defaultPerson);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseItem['category']>('alimentacao');
  const [expenseNote, setExpenseNote] = useState('');
  const [selectedExpenseGoalId, setSelectedExpenseGoalId] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setTargetPerson(defaultPerson);
      setModalMode(defaultMode);
    }
  }, [isOpen, defaultPerson, defaultMode]);

  // Deposit form state
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    defaultGoalId || goals[0]?.id || ''
  );
  const [depositAmount, setDepositAmount] = useState<string>('300');
  const [depositNote, setDepositNote] = useState<string>('Aporte Mensal Guardado');

  if (!isOpen) return null;

  const currentGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(expenseAmount);
    if (!val || val <= 0 || !expenseDesc.trim()) return;

    onAddExpense(targetPerson, expenseDesc.trim(), val, expenseCategory, expenseNote, selectedExpenseGoalId);
    onClose();
    setExpenseDesc('');
    setExpenseAmount('');
    setExpenseNote('');
    setSelectedExpenseGoalId('');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!val || val <= 0) return;

    onAddDeposit(selectedGoalId || goals[0]?.id, val, depositNote || 'Aporte financeiro deliberado');
    triggerCelebration();
    onClose();
  };

  const categories: { id: ExpenseItem['category']; label: string; icon: string }[] = [
    { id: 'alimentacao', label: 'Alimentação', icon: '🍔' },
    { id: 'compras', label: 'Compras', icon: '🛍️' },
    { id: 'beleza', label: 'Beleza / Cuidados', icon: '💅' },
    { id: 'lazer', label: 'Lazer / Passeios', icon: '🎬' },
    { id: 'tecnologia', label: 'Eletrônicos/Acessórios', icon: '🎧' },
    { id: 'outros', label: 'Outros Gastos', icon: '📦' },
  ];

  const quickExpenseValues = [15, 30, 50, 80, 100, 150];
  const quickDepositValues = [100, 200, 300, 400, 600];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#120d2b] border border-[#2a1f4a] w-full max-w-sm rounded-3xl p-5 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold font-heading flex items-center gap-1.5 text-white">
              Lançamentos & Aportes ⚖️
            </h3>
            <p className="text-[11px] text-[#a098c4]">
              Delibere créditos nas metas ou registre despesas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a098c4] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1238] rounded-2xl mb-4 border border-[#2a1f4a]">
          <button
            type="button"
            onClick={() => setModalMode('expense')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              modalMode === 'expense'
                ? 'bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'text-[#a098c4] hover:text-white'
            }`}
          >
            <MinusCircle className="w-4 h-4" /> Registrar Gasto
          </button>
          <button
            type="button"
            onClick={() => setModalMode('deposit')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              modalMode === 'deposit'
                ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-lg'
                : 'text-[#a098c4] hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Aporte Direto
          </button>
        </div>

        {/* EXPENSE FORM */}
        {modalMode === 'expense' && (
          <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
            {/* Person Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1.5 uppercase">
                Quem fez o gasto? (Descontar de quem?) *
              </label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {(participants.length > 0
                  ? participants
                  : [
                      { id: '1', name: 'Edinaldo', color: '#3b82f6' },
                      { id: '2', name: 'Coronita', color: '#ff4081' },
                    ]
                ).map((p) => {
                  const isSelected = targetPerson.toLowerCase() === p.name.toLowerCase();
                  const pColor = p.color || '#3b82f6';
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setTargetPerson(p.name)}
                      className="p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0"
                      style={{
                        borderColor: isSelected ? pColor : '#2a1f4a',
                        backgroundColor: isSelected ? `${pColor}20` : 'rgba(0, 0, 0, 0.2)',
                        color: isSelected ? 'white' : '#a098c4',
                        boxShadow: isSelected ? `0 0 10px ${pColor}40` : 'none',
                      }}
                    >
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goal Selector for Expense (Optional/Direct deduction) */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1.5 uppercase">
                Deseja descontar diretamente de alguma Meta?
              </label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedExpenseGoalId('')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    !selectedExpenseGoalId
                      ? 'border-[#ffeb3b] bg-[#ffeb3b]/10 text-white shadow-md'
                      : 'border-[#2a1f4a] bg-black/20 text-[#a098c4]'
                  }`}
                >
                  <span>Apenas Orçamento Geral</span>
                </button>
                {goals.map((g) => {
                  const isSelected = selectedExpenseGoalId === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setSelectedExpenseGoalId(g.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                        isSelected
                          ? 'border-[#ef4444] bg-[#ef4444]/20 text-white shadow-md'
                          : 'border-[#2a1f4a] bg-black/20 text-[#a098c4]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.accentColor || '#3b82f6' }} />
                      <span>{g.title} ({g.owner})</span>
                    </button>
                  );
                })}
              </div>
              {selectedExpenseGoalId && (
                <p className="text-[10px] text-[#ff80ab] mt-1.5 font-semibold bg-[#ef4444]/10 p-2 rounded-xl border border-[#ef4444]/20">
                  ⚠️ Este gasto também será descontado diretamente do cofre da meta: <strong>{goals.find(g => g.id === selectedExpenseGoalId)?.title}</strong>!
                </p>
              )}
            </div>

            {/* Warning Card */}
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl p-3 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#fca5a5]">
                  Descontando do Orçamento de {targetPerson}
                </p>
                <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
                  Este gasto reduzirá o valor poupado no fechamento mensal.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1 uppercase">
                O que foi comprado / gasto? *
              </label>
              <input
                type="text"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl py-2.5 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ef4444]"
                placeholder="Ex: Lanche, compras, passeio..."
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1 uppercase">
                Valor da Despesa (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-[#ef4444]">
                  - R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl py-3 pl-16 pr-4 text-xl font-extrabold text-white focus:outline-none focus:border-[#ef4444]"
                  placeholder="0,00"
                  required
                />
              </div>

              {/* Quick amount chips */}
              <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                {quickExpenseValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setExpenseAmount(val.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#221a42] hover:bg-[#ef4444]/30 text-xs font-medium text-[#fca5a5] transition-colors shrink-0"
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1.5 uppercase">
                Categoria
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setExpenseCategory(cat.id)}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                      expenseCategory === cat.id
                        ? 'border-[#ef4444] bg-[#ef4444]/20 text-white'
                        : 'border-[#2a1f4a] bg-black/20 text-[#a098c4] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate max-w-[75px]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Expense */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:opacity-95 text-xs font-extrabold text-white shadow-lg shadow-red-500/25 transition-all mt-2 active:scale-98 flex items-center justify-center gap-2"
            >
              <MinusCircle className="w-4 h-4" /> Registrar e Descontar
            </button>
          </form>
        )}

        {/* DEPOSIT FORM */}
        {modalMode === 'deposit' && (
          <form onSubmit={handleDepositSubmit} className="space-y-3.5">
            {/* Goal Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1.5 uppercase">
                Qual Meta irá receber o Aporte? *
              </label>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 no-scrollbar">
                {goals.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setSelectedGoalId(g.id)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      selectedGoalId === g.id
                        ? 'border-[#3b82f6] bg-[#3b82f6]/20 text-white shadow-md'
                        : 'border-[#2a1f4a] bg-black/20 text-[#a098c4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Target className="w-4 h-4 text-[#3b82f6]" />
                      <span className="truncate">{g.title} ({g.owner})</span>
                    </div>
                    <span className="text-[11px] text-[#4ade80]">
                      R$ {g.currentAmount.toLocaleString('pt-BR')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1 uppercase">
                Valor do Aporte Deliberado (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-[#4ade80]">
                  + R$
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl py-3 pl-16 pr-4 text-xl font-extrabold text-white focus:outline-none focus:border-[#3b82f6]"
                  placeholder="0,00"
                  required
                />
              </div>

              {/* Quick Deposit Chips */}
              <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                {quickDepositValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDepositAmount(val.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#221a42] hover:bg-[#3b82f6]/30 text-xs font-medium text-[#60a5fa] transition-colors shrink-0"
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Note / Source */}
            <div>
              <label className="block text-xs font-semibold text-[#a098c4] mb-1 uppercase">
                Descrição do Aporte
              </label>
              <input
                type="text"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                placeholder="Ex: Aporte deliberado, Economia do mês..."
              />
            </div>

            {/* Submit Deposit */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all mt-2 active:scale-98 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Confirmar e Creditar na Meta
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
