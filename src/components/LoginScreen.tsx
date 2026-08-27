import React, { useState } from 'react';
import { ShieldCheck, User, Eye, EyeOff, Lock, Sparkles, LogIn } from 'lucide-react';
import { Participant } from '../types';

interface LoginScreenProps {
  participants: Participant[];
  onLoginSuccess: (user: { role: 'admin' | 'user'; name: string; participantId?: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ participants, onLoginSuccess }) => {
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('admin');
  
  // Form states
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [userPassword, setUserPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (adminUser === 'admin' && adminPassword === 'Elos1610162023@') {
      onLoginSuccess({
        role: 'admin',
        name: 'Administrador',
      });
    } else {
      setErrorMessage('Credenciais administrativas incorretas! Tente novamente.');
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedParticipantId) {
      setErrorMessage('Selecione o seu usuário para continuar.');
      return;
    }

    const selectedPart = participants.find((p) => p.id === selectedParticipantId);
    if (!selectedPart) {
      setErrorMessage('Usuário inválido.');
      return;
    }

    // Check password (subordinates enter password configured by admin, default '123' if not set)
    const expectedPassword = selectedPart.password || '123';
    if (userPassword === expectedPassword) {
      onLoginSuccess({
        role: 'user',
        name: selectedPart.name,
        participantId: selectedPart.id,
      });
    } else {
      setErrorMessage('Senha incorreta! Solicite a senha correta ao Administrador.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#120d2b] border border-[#2a1f4a] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="text-center relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#9333ea] to-[#d926a9] text-white mb-3 shadow-lg">
            <Sparkles className="w-6 h-6 text-[#ffeb3b]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-heading tracking-wide">
            Nossa Conquista 🚀
          </h1>
          <p className="text-xs text-[#a098c4] mt-1">
            Foco, disciplina e metas compartilhadas 💜
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-black/40 border border-[#2a1f4a] p-1 rounded-2xl relative z-10">
          <button
            type="button"
            onClick={() => {
              setLoginMode('admin');
              setErrorMessage('');
              setShowPassword(false);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              loginMode === 'admin'
                ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md'
                : 'text-[#a098c4] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Painel ADM 👑</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('user');
              setErrorMessage('');
              setShowPassword(false);
              if (participants.length > 0 && !selectedParticipantId) {
                setSelectedParticipantId(participants[0].id);
              }
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              loginMode === 'user'
                ? 'bg-gradient-to-r from-[#9333ea] to-[#d926a9] text-white shadow-md'
                : 'text-[#a098c4] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Participantes 👥</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-xs text-center font-semibold animate-shake">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ADMIN FORM */}
        {loginMode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-[#a098c4] mb-1.5 uppercase">
                Usuário do Administrador
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#a098c4]">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#a098c4] mb-1.5 uppercase">
                Senha Administrativa
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#a098c4]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#c084fc]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#a098c4] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:opacity-95 text-xs font-black text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>ENTRAR NO PAINEL ADMIN</span>
            </button>
          </form>
        )}

        {/* PARTICIPANT USER FORM */}
        {loginMode === 'user' && (
          <form onSubmit={handleUserSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-[#a098c4] mb-2 uppercase">
                Quem está entrando?
              </label>
              
              {/* Grid of Participants with visual avatar selection */}
              <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto no-scrollbar pb-1">
                {participants.map((p) => {
                  const isSelected = selectedParticipantId === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setSelectedParticipantId(p.id);
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 ${
                        isSelected
                          ? 'border-[#ff4081] bg-[#ff4081]/15 scale-[1.02] shadow-[0_0_12px_rgba(255,64,129,0.2)]'
                          : 'border-[#2a1f4a] bg-black/20 hover:border-[#a098c4]/30'
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-11 h-11 rounded-full object-cover border"
                        style={{ borderColor: p.color }}
                        crossOrigin="anonymous"
                      />
                      <span className="text-xs font-black truncate max-w-full block text-white">{p.name}</span>
                      <span className="text-[9px] text-[#a098c4] truncate max-w-full block font-medium">{p.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#a098c4] mb-1.5 uppercase">
                Sua Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#a098c4]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Insira a senha do participante"
                  className="w-full bg-[#1c143d] border border-[#2a1f4a] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff4081]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#a098c4] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#d926a9] hover:opacity-95 text-xs font-black text-white flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-98 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>ENTRAR NO COFRE</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
