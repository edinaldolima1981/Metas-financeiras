import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Target,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  Upload,
  Camera,
  FolderOpen,
  Link2,
} from 'lucide-react';
import { Goal, Participant } from '../types';
import { IMAGES } from '../constants/images';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goalData: Partial<Goal>) => void;
  participants: Participant[];
  editingGoal?: Goal | null;
}

const PRESET_IMAGES = [
  { label: 'iPhone 15 (Azul)', url: IMAGES.iphone15 },
  { label: 'iPhone 16 (Rosa/Pink)', url: IMAGES.iphone16Home },
  { label: 'MacBook / Notebook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60' },
  { label: 'PlayStation 5 / Game', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=60' },
  { label: 'Viagem / Férias', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60' },
  { label: 'Carro / Veículo', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60' },
  { label: 'Casa / Decoração', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60' },
];

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  participants,
  editingGoal,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [owner, setOwner] = useState(participants[0]?.name || 'Edinaldo');
  const [targetAmount, setTargetAmount] = useState('5000');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [monthlyTarget, setMonthlyTarget] = useState('500');
  const [targetDate, setTargetDate] = useState('31 DE DEZEMBRO DE 2026');
  const [imageUrl, setImageUrl] = useState(IMAGES.iphone15);
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [category, setCategory] = useState<'tecnologia' | 'viagem' | 'veiculo' | 'casa' | 'educacao' | 'outro'>('tecnologia');
  const [description, setDescription] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setSubtitle(editingGoal.subtitle || '');
      setOwner(editingGoal.owner);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount(editingGoal.currentAmount.toString());
      setMonthlyTarget(editingGoal.monthlyTarget.toString());
      setTargetDate(editingGoal.targetDate);
      setImageUrl(editingGoal.imageUrl);
      setAccentColor(editingGoal.accentColor || '#3b82f6');
      setCategory(editingGoal.category || 'tecnologia');
      setDescription(editingGoal.description || '');
    } else {
      setTitle('');
      setSubtitle('');
      setOwner(participants[0]?.name || 'Edinaldo');
      setTargetAmount('5000');
      setCurrentAmount('0');
      setMonthlyTarget('500');
      setTargetDate('31 DE DEZEMBRO DE 2026');
      setImageUrl(IMAGES.iphone15);
      setAccentColor('#3b82f6');
      setCategory('tecnologia');
      setDescription('');
    }
    setShowUrlInput(false);
  }, [editingGoal, isOpen, participants]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o título da meta.');
      return;
    }

    const tAmt = Math.max(1, parseFloat(targetAmount) || 1000);
    const cAmt = Math.max(0, parseFloat(currentAmount) || 0);
    const mTarget = Math.max(1, parseFloat(monthlyTarget) || 200);

    const targetParticipant = participants.find((p) => p.name.toLowerCase() === owner.toLowerCase());

    onSaveGoal({
      id: editingGoal?.id,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      owner: owner.trim(),
      participantId: targetParticipant?.id,
      targetAmount: tAmt,
      currentAmount: cAmt,
      monthlyTarget: mTarget,
      targetDate: targetDate.trim() || '31 DE DEZEMBRO DE 2026',
      daysRemaining: editingGoal?.daysRemaining || 134,
      imageUrl: imageUrl.trim() || IMAGES.iphone15,
      accentColor,
      category,
      description: description.trim(),
      streakDays: editingGoal?.streakDays || 1,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#120d2b] border border-[#2a1f4a] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#a098c4] hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold font-heading text-white">
              {editingGoal ? 'Editar Meta Deliberada' : 'Criar Nova Meta Deliberada'}
            </h2>
            <p className="text-[11px] text-[#a098c4]">
              Painel do Administrador • Defina imagem local, valores e prazos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título & Subtítulo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
                Nome da Meta *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: PlayStation 5, Viagem Paris"
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
                Subtítulo / Modelo (Opcional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: 512GB, Edição Digital"
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          {/* Participante Dono da Meta */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#3b82f6]" /> Participante Responsável *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map((p) => {
                const isSelected = owner.toLowerCase() === p.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      setOwner(p.name);
                      setAccentColor(p.color || '#3b82f6');
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                        : 'bg-[#1c143d] border-[#2a1f4a] text-[#a098c4] hover:text-white'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                      crossOrigin="anonymous"
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEÇÃO PRINCIPAL DE IMAGEM LOCAL */}
          <div className="bg-[#181033] border border-[#3b82f6]/30 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
                <ImageIcon className="w-4 h-4 text-[#3b82f6]" /> Imagem da Meta (Arquivo Local)
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[10px] text-[#60a5fa] hover:underline flex items-center gap-1 font-semibold"
              >
                <Link2 className="w-3 h-3" /> {showUrlInput ? 'Ocultar Link' : 'Ou usar link'}
              </button>
            </div>

            {/* Hidden Input for Local Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Image Preview & Local Upload Trigger */}
            <div className="flex items-center gap-3 bg-[#120d2b] p-2.5 rounded-xl border border-white/10">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 bg-black/50 rounded-xl flex items-center justify-center border border-white/20 overflow-hidden cursor-pointer group shrink-0"
                title="Clique para trocar imagem do dispositivo"
              >
                <img
                  src={imageUrl}
                  alt="Pré-visualização da meta"
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[8px] text-white font-bold mt-0.5">Alterar</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <FolderOpen className="w-4 h-4 text-[#ffeb3b]" />
                  <span>Escolher Imagem do Dispositivo 📸</span>
                </button>
                <p className="text-[10px] text-[#a098c4] leading-tight">
                  Selecione qualquer foto da sua galeria ou arquivos do celular/computador.
                </p>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div>
              <span className="text-[10px] font-bold text-[#a098c4] block mb-1.5">
                Ou selecione uma imagem rápida:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {PRESET_IMAGES.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setImageUrl(img.url)}
                    className={`shrink-0 flex flex-col items-center p-1.5 rounded-xl border text-[10px] transition-all ${
                      imageUrl === img.url
                        ? 'border-[#3b82f6] bg-[#3b82f6]/20 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        : 'border-[#2a1f4a] bg-[#120d2b] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-10 h-10 rounded-lg object-contain bg-black/40 p-0.5"
                      crossOrigin="anonymous"
                    />
                    <span className="mt-1 truncate max-w-[65px] text-[9px] text-[#a098c4]">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional URL input if needed */}
            {showUrlInput && (
              <div className="pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.png"
                  className="w-full bg-[#120d2b] border border-[#2a1f4a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            )}
          </div>

          {/* Valores Deliberados */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#a098c4] mb-1">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-[#a098c4]">R$</span>
                <input
                  type="number"
                  step="10"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-8 pr-2 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#3b82f6]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#a098c4] mb-1">
                Acumulado (R$)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-[#a098c4]">R$</span>
                <input
                  type="number"
                  step="10"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-8 pr-2 py-2 text-xs font-bold text-[#4ade80] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#a098c4] mb-1">
                Meta Mensal (R$)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-[#a098c4]">R$</span>
                <input
                  type="number"
                  step="10"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-8 pr-2 py-2 text-xs font-bold text-[#ffeb3b] focus:outline-none focus:border-[#3b82f6]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Limite & Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#ffeb3b]" /> Data Limite / Prazo
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="Ex: 31 DE DEZEMBRO DE 2026"
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="tecnologia">📱 Tecnologia / Celular / Gadget</option>
                <option value="viagem">✈️ Viagem / Férias</option>
                <option value="veiculo">🚗 Carro / Moto</option>
                <option value="casa">🏠 Casa / Eletrodoméstico</option>
                <option value="educacao">🎓 Educação / Curso</option>
                <option value="outro">✨ Outro Sonho</option>
              </select>
            </div>
          </div>

          {/* Descrição Deliberada */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
              Descrição / Deliberação do Admin
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ex: Meta acordada no valor total deliberado com disciplina mensal."
              className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#a098c4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-90 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {editingGoal ? 'Salvar Alterações' : 'Criar Meta Deliberada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
