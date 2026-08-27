import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  Sparkles,
  Palette,
  Upload,
  Camera,
  FolderOpen,
  Link2,
} from 'lucide-react';
import { Participant } from '../types';
import { IMAGES } from '../constants/images';

interface CreateParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveParticipant: (participant: Partial<Participant>) => void;
  editingParticipant?: Participant | null;
}

const PRESET_AVATARS = [
  { label: 'Edinaldo', url: IMAGES.edinaldoProfile },
  { label: 'Coronita', url: IMAGES.coronitaAvatar },
  { label: 'Avatar 1 (Homem)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' },
  { label: 'Avatar 2 (Mulher)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { label: 'Avatar 3 (Jovem)', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80' },
  { label: 'Avatar 4 (Menina)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80' },
  { label: 'Avatar 5 (Gamer)', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80' },
];

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#ff4081', // Pink
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ec4899', // Rose
  '#eab308', // Yellow
];

export const CreateParticipantModal: React.FC<CreateParticipantModalProps> = ({
  isOpen,
  onClose,
  onSaveParticipant,
  editingParticipant,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Participante');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [monthlyAllowance, setMonthlyAllowance] = useState('500');
  const [color, setColor] = useState('#3b82f6');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingParticipant) {
      setName(editingParticipant.name);
      setRole(editingParticipant.role || 'Participante');
      setAvatar(editingParticipant.avatar || PRESET_AVATARS[0].url);
      setMonthlyAllowance((editingParticipant.monthlyAllowance || 500).toString());
      setColor(editingParticipant.color || '#3b82f6');
      setBio(editingParticipant.bio || '');
      setPassword(editingParticipant.password || '');
    } else {
      setName('');
      setRole('Participante');
      setAvatar(PRESET_AVATARS[2].url);
      setMonthlyAllowance('500');
      setColor('#10b981');
      setBio('');
      setPassword('');
    }
    setShowUrlInput(false);
  }, [editingParticipant, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, digite o nome do participante.');
      return;
    }

    onSaveParticipant({
      id: editingParticipant?.id,
      name: name.trim(),
      role: role.trim(),
      avatar: avatar.trim(),
      monthlyAllowance: Math.max(0, parseFloat(monthlyAllowance) || 0),
      color,
      bio: bio.trim(),
      password: password.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#120d2b] border border-[#2a1f4a] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#a098c4] hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-[#9c27b0]/20 text-[#c084fc] border border-[#9c27b0]/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold font-heading text-white">
              {editingParticipant ? 'Editar Participante' : 'Adicionar Novo Participante'}
            </h2>
            <p className="text-[11px] text-[#a098c4]">
              Carregue a foto local do participante da sua galeria
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Participante */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
              Nome do Participante *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lucas, Mariana, João"
              className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c084fc]"
              required
            />
          </div>

          {/* Cargo / Papel & Meta Mensal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
                Cargo / Papel
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c084fc]"
              >
                <option value="Participante">Participante</option>
                <option value="Administrador">Administrador</option>
                <option value="Membro da Família">Membro Família</option>
                <option value="Parceiro(a)">Parceiro(a)</option>
                <option value="Amigo(a)">Amigo(a)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
                Teto/Meta Mensal (R$)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[11px] text-[#a098c4]">R$</span>
                <input
                  type="number"
                  step="10"
                  value={monthlyAllowance}
                  onChange={(e) => setMonthlyAllowance(e.target.value)}
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-8 pr-2 py-2 text-xs font-bold text-[#4ade80] focus:outline-none focus:border-[#c084fc]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Senha do Participante */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
              Senha de Acesso (para Usuário) *
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha para este usuário"
              className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c084fc]"
              required
            />
          </div>

          {/* SEÇÃO PRINCIPAL DE FOTO / AVATAR LOCAL */}
          <div className="bg-[#181033] border border-[#9c27b0]/30 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Camera className="w-4 h-4 text-[#c084fc]" /> Foto / Avatar Local
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[10px] text-[#c084fc] hover:underline flex items-center gap-1 font-semibold"
              >
                <Link2 className="w-3 h-3" /> {showUrlInput ? 'Ocultar Link' : 'Ou usar link'}
              </button>
            </div>

            {/* Input oculto de arquivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Preview & Botão Local */}
            <div className="flex items-center gap-3 bg-[#120d2b] p-2.5 rounded-xl border border-white/10">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-16 h-16 rounded-full border-2 overflow-hidden cursor-pointer group shrink-0"
                style={{ borderColor: color }}
                title="Clique para trocar foto do celular"
              >
                <img
                  src={avatar}
                  alt={name || 'Avatar'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#d926a9] hover:opacity-95 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <FolderOpen className="w-4 h-4 text-[#ffeb3b]" />
                  <span>Escolher Foto da Galeria 📸</span>
                </button>
                <p className="text-[10px] text-[#a098c4]">
                  Carregue direto do celular ou computador.
                </p>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div>
              <span className="text-[10px] font-bold text-[#a098c4] block mb-1.5">
                Ou selecione um avatar rápido:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {PRESET_AVATARS.map((av, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(av.url)}
                    className={`shrink-0 p-0.5 rounded-full border transition-all ${
                      avatar === av.url
                        ? 'border-[#c084fc] scale-110 shadow-[0_0_8px_#c084fc]'
                        : 'border-[#2a1f4a] opacity-70 hover:opacity-100'
                    }`}
                    title={av.label}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-9 h-9 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Optional URL input */}
            {showUrlInput && (
              <div className="pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={avatar.startsWith('data:') ? '' : avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="w-full bg-[#120d2b] border border-[#2a1f4a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c084fc]"
                />
              </div>
            )}
          </div>

          {/* Cor de Identificação */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Cor de Identificação
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Biografia / Motivação */}
          <div>
            <label className="block text-[11px] font-bold text-[#a098c4] mb-1">
              Bio / Meta Pessoal (Opcional)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: Focado em guardar todo mês sem falhas!"
              className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c084fc]"
            />
          </div>

          {/* Botões */}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#d926a9] hover:opacity-90 text-xs font-extrabold text-white shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {editingParticipant ? 'Salvar Participante' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
