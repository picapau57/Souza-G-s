import React from 'react';
import { Flame, MapPin, Clock, Phone, ShieldCheck, Heart } from 'lucide-react';
import { SystemConfig } from '../../types';

interface FooterProps {
  config: SystemConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  return (
    <footer className="bg-[#08090c] border-t border-amber-500/20 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Col 1: Sobre */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-slate-950">
              <Flame className="w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-lg font-bold text-white">{config.companyName}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Atendimento rápido, seguro e garantia de pesagem correta. Entrega rápida na sua casa ou retirada direta na portaria pelo menor preço da cidade.
          </p>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Distribuidor Autorizado de Gás Ultragaz</span>
          </div>
        </div>

        {/* Col 2: Endereço e Horários */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-400 tracking-wider uppercase">Localização & Horário</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{config.companyAddress}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{config.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Contato & Acesso Restrito */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-400 tracking-wider uppercase">Contato Direto</h4>
          <div className="space-y-2 text-xs">
            <a
              href={`https://wa.me/${config.companyPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-900/60 transition-all"
            >
              <Phone className="w-4 h-4" />
              WhatsApp: {config.companyPhone}
            </a>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-slate-500 hover:text-amber-400 transition-colors underline underline-offset-4"
            >
              🔐 Acesso Restrito ao Proprietário (Painel Admin)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} {config.companyName}. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Desenvolvido com <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> para Vendas Rápidas no Celular
        </p>
      </div>
    </footer>
  );
};
