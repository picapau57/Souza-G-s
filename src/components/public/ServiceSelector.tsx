import React from 'react';
import { Store, Truck, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { ServiceType, SystemConfig } from '../../types';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
  config: SystemConfig;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onSelectService,
  config,
}) => {
  const savings = (config.entregaPrice - config.portariaPrice).toFixed(2).replace('.', ',');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">1</span>
            Escolha como prefere receber o seu gás
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Selecione para ver os valores atualizados do {config.companyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Opção 1: Comprar na Portaria */}
        <button
          type="button"
          onClick={() => onSelectService('portaria')}
          className={`relative p-4 sm:p-5 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedService === 'portaria'
              ? 'bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          {/* Badge Economia */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Economize R$ {savings}
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`p-3 rounded-xl ${
                selectedService === 'portaria'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Store className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Sem Taxa</span>
              <h3 className="text-base font-bold text-white">Retirada na Portaria</h3>
              <p className="text-xs text-slate-400">Você retira diretamente no nosso depósito.</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Preço na Portaria:</span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                R$ {config.portariaPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {selectedService === 'portaria' && (
            <div className="absolute bottom-2 right-3 text-amber-400 flex items-center gap-1 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Selecionado</span>
            </div>
          )}
        </button>

        {/* Opção 2: Entrega em Domicílio */}
        <button
          type="button"
          onClick={() => onSelectService('entrega')}
          className={`relative p-4 sm:p-5 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedService === 'entrega'
              ? 'bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          {/* Badge Entrega Rápida */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🛵 Mais Pedido
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`p-3 rounded-xl ${
                selectedService === 'entrega'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Truck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Entrega Rápida</span>
              <h3 className="text-base font-bold text-white">Entrega em Domicílio</h3>
              <p className="text-xs text-slate-400">Levamos e instalamos o gás com segurança na sua casa.</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Preço Entregue:</span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                R$ {config.entregaPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {selectedService === 'entrega' && (
            <div className="absolute bottom-2 right-3 text-amber-400 flex items-center gap-1 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Selecionado</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
