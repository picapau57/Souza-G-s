import React, { useState } from 'react';
import { Flame, ShieldCheck, ShoppingBag, Phone, Search, Clock } from 'lucide-react';
import { SystemConfig } from '../../types';

interface NavbarProps {
  currentView: 'public' | 'admin' | 'tracker';
  setCurrentView: (view: 'public' | 'admin' | 'tracker') => void;
  config: SystemConfig;
  activeOrdersCount?: number;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  config,
  activeOrdersCount = 0,
  onOpenSearchModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/50">
      {/* Top Gold Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('public')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 fill-amber-200 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5 border border-amber-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {config.companyName}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Aberto Agora
              </span>
            </div>
            <p className="text-xs text-amber-400/80 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Gás Oficial Ultragaz • Portaria & Entrega
            </p>
          </div>
        </button>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rastrear Pedido / Consultar */}
          <button
            onClick={onOpenSearchModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs sm:text-sm font-medium transition-all shadow-sm"
            title="Acompanhar ou consultar pedido pelo código"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Meus Pedidos</span>
          </button>

          {/* Direct WhatsApp Call */}
          <a
            href={`https://wa.me/${config.companyPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 text-xs font-semibold transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pedir por Fone</span>
          </a>

          {/* Toggle View Tabs (Cliente vs Admin) */}
          <div className="bg-slate-950 p-1 rounded-xl border border-amber-500/20 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setCurrentView('public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'public'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedir Gás</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <span>Painel Dono</span>
              {activeOrdersCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-extrabold bg-red-600 text-white rounded-full animate-bounce">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
