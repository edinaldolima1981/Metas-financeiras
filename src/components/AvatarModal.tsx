import React, { useState, useRef } from 'react';
import { X, Upload, Check, Camera, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: string;
  currentAvatar: string;
  onSaveAvatar: (person: string, newUrl: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  person,
  currentAvatar,
  onSaveAvatar,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentAvatar);
  const [customUrl, setCustomUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedImage when modal opens or currentAvatar changes
  React.useEffect(() => {
    setSelectedImage(currentAvatar);
    setCustomUrl('');
  }, [isOpen, currentAvatar]);

  if (!isOpen) return null;

  const isEdinaldo = person.toLowerCase() === 'edinaldo';
  const isCoronita = person.toLowerCase() === 'coronita';
  const themeColor = isEdinaldo ? '#3b82f6' : isCoronita ? '#ff4081' : '#9333ea';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const finalUrl = customUrl.trim() || selectedImage;
    if (finalUrl) {
      onSaveAvatar(person, finalUrl);
      onClose();
    }
  };

  const handleResetToDefault = () => {
    const defaultUrl = isEdinaldo
      ? IMAGES.edinaldoProfile
      : isCoronita
      ? IMAGES.coronitaAvatar
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    setSelectedImage(defaultUrl);
    setCustomUrl('');
  };

  // Quick Presets
  const avatarPresets = [
    { label: 'Edinaldo (Original)', url: IMAGES.edinaldoProfile },
    { label: 'Coronita (Original)', url: IMAGES.coronitaAvatar },
    {
      label: 'Foto Estilosa 1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      label: 'Foto Estilosa 2',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      label: 'Foto Estilosa 3',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    },
    {
      label: 'Foto Gamer',
      url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-5 text-white shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#2a1f4a]">
          <div>
            <span
              className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block"
              style={{
                backgroundColor: `${themeColor}25`,
                color: themeColor,
                border: `1px solid ${themeColor}50`,
              }}
            >
              Foto do Perfil & Avatar
            </span>
            <h3 className="font-extrabold text-base font-heading mt-1 flex items-center gap-1.5">
              Avatar de {person} <Sparkles className="w-4 h-4 text-[#ffeb3b]" />
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a098c4] hover:text-white bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current / Preview Avatar */}
        <div className="flex flex-col items-center justify-center my-3">
          <div
            className="relative w-28 h-28 rounded-full p-1 border-2 shadow-xl overflow-hidden group cursor-pointer"
            style={{ borderColor: themeColor }}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={customUrl.trim() || selectedImage}
              alt={person}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = isEdinaldo
                  ? IMAGES.edinaldoProfile
                  : IMAGES.coronitaAvatar;
              }}
            />
            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-full">
              <Camera className="w-6 h-6 text-white" />
              <span className="text-[10px] text-white font-bold mt-1">Trocar Foto</span>
            </div>
          </div>

          <p className="text-xs text-[#a098c4] mt-2 font-medium">
            Foto atual de <strong>{person}</strong>
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Upload Button */}
        <div className="space-y-3 mt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <Upload className="w-4 h-4 text-[#ffeb3b]" /> Escolher Foto da Galeria / Câmera 📸
          </button>

          {/* Quick Presets Carousel */}
          <div>
            <label className="text-[10px] font-bold text-[#a098c4] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Ou selecione uma foto rápida:
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setCustomUrl('');
                  }}
                  className="shrink-0 p-1 rounded-xl bg-[#1c143d] border border-white/10 hover:border-white/40 transition-all text-center group"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Or Paste URL */}
          <div className="bg-[#1a1238] rounded-xl p-2.5 border border-[#2a1f4a]">
            <label className="text-[10px] font-semibold text-[#a098c4] uppercase tracking-wider block mb-1">
              Ou colar link da imagem (URL da internet):
            </label>
            <input
              type="text"
              placeholder="https://exemplo.com/sua-foto.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-[#120d2b] border border-[#2a1f4a] rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-[#5d5480] focus:outline-none focus:border-[#3b82f6]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-[#2a1f4a]">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#a098c4] hover:text-white transition-colors"
            title="Restaurar foto padrão"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-98"
            style={{
              background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)`,
              color: '#ffffff',
            }}
          >
            <Check className="w-4 h-4" /> Salvar Foto de {person}
          </button>
        </div>
      </div>
    </div>
  );
};
