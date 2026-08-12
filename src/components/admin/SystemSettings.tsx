import React, { useState } from 'react';
import { Settings, Save, Check, Lock, Phone, MapPin, QrCode, Clock, Key } from 'lucide-react';
import { SystemConfig } from '../../types';
import { storageService } from '../../services/storage';

interface SystemSettingsProps {
  config: SystemConfig;
  onRefreshData: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ config, onRefreshData }) => {
  const [formData, setFormData] = useState<SystemConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveConfig(formData);
    onRefreshData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0e1017] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Configurações da Empresa e Pagamento
          </h3>
          <p className="text-xs text-slate-400">
            Ajuste os dados exibidos aos clientes e número do WhatsApp para recebimento de pedidos.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Configurações Salvas!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Nome da Empresa */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300">Nome do Depósito:</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* WhatsApp do Depósito */}
        <div className="space-y-1">
          <label className="font-bold text-amber-400 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            WhatsApp de Recebimento de Pedidos *
          </label>
          <input
            type="text"
            value={formData.companyPhone}
            onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
            placeholder="Ex: 5567999887766 (Com código do país 55 e DDD)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Chave PIX */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            Chave PIX Oficial:
          </label>
          <input
            type="text"
            value={formData.pixKey}
            onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Nome Beneficiário PIX */}
        <div className="space-y-1">
          <label className="font-bold text-slate-300">Nome do Titular do PIX:</label>
          <input
            type="text"
            value={formData.pixReceiverName}
            onChange={(e) => setFormData({ ...formData, pixReceiverName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Endereço Físico */}
        <div className="sm:col-span-2 space-y-1">
          <label className="font-bold text-slate-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Endereço do Depósito (Para Retirada na Portaria):
          </label>
          <input
            type="text"
            value={formData.companyAddress}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Horário de Funcionamento */}
        <div className="sm:col-span-2 space-y-1">
          <label className="font-bold text-slate-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Horário de Funcionamento:
          </label>
          <input
            type="text"
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Senha do Painel Admin */}
        <div className="sm:col-span-2 space-y-1 pt-2 border-t border-slate-800">
          <label className="font-bold text-amber-400 flex items-center gap-1">
            <Key className="w-3.5 h-3.5" />
            Senha de Acesso ao Painel Admin:
          </label>
          <input
            type="text"
            value={formData.adminPasswordHash}
            onChange={(e) => setFormData({ ...formData, adminPasswordHash: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
          />
          <p className="text-[11px] text-slate-500">Mantenha esta senha em segredo para proteger a edição de preços.</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Save className="w-4 h-4" />
        <span>Salvar Configurações do Sistema</span>
      </button>
    </form>
  );
};
