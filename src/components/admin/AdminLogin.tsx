import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, Flame } from 'lucide-react';
import { storageService } from '../../services/storage';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const config = storageService.getConfig();

    if (password.trim() === config.adminPasswordHash) {
      storageService.setAdminLoggedIn(true);
      onSuccess();
    } else {
      setError('Senha incorreta! Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-[#0e1017] border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-500/10 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 mb-1">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Painel Administrativo</h2>
        <p className="text-xs text-amber-400 font-semibold">Depósito de Gás Pantaleão</p>
        <p className="text-xs text-slate-400">Área exclusiva do proprietário para gestão de vendas e preços</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Digite sua Senha do Painel:
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Sua senha restrita..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 pr-10 font-mono"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>Acessar Painel do Dono</span>
        </button>
      </form>

      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-[11px] text-slate-500">
        💡 Senha padrão de fábrica: <code className="text-amber-400 font-bold font-mono">pantaleao123</code> (pode ser alterada no painel).
      </div>
    </div>
  );
};
