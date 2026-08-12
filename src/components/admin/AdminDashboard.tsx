import React, { useState } from 'react';
import {
  BarChart3,
  ShoppingBag,
  DollarSign,
  UserCheck,
  Settings,
  LogOut,
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';
import { Order, Driver, SystemConfig } from '../../types';
import { storageService } from '../../services/storage';
import { AdminLogin } from './AdminLogin';
import { MetricsCard } from './MetricsCard';
import { OrderManager } from './OrderManager';
import { PriceManager } from './PriceManager';
import { DriverManager } from './DriverManager';
import { SystemSettings } from './SystemSettings';

interface AdminDashboardProps {
  orders: Order[];
  drivers: Driver[];
  config: SystemConfig;
  products: any[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  drivers,
  config,
  products,
  onRefreshData,
  onExitAdmin,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(storageService.isAdminLoggedIn());
  const [activeTab, setActiveTab] = useState<'vendas' | 'precos' | 'entregadores' | 'config'>('vendas');

  if (!isLoggedIn) {
    return <AdminLogin onSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    storageService.setAdminLoggedIn(false);
    setIsLoggedIn(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Bar */}
      <div className="bg-[#0e1017] p-4 sm:p-6 rounded-3xl border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PAINEL DO DONO
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">{config.companyName}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhamento de vendas do dia, relatórios da semana e controle total de preços
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onRefreshData}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Atualizar dados do sistema"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* 1. Daily & Weekly Metrics */}
      <MetricsCard orders={orders} />

      {/* 2. Main Admin Tab Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 bg-slate-950 p-1.5 rounded-2xl border border-amber-500/20 overflow-x-auto shadow-inner">
        <button
          onClick={() => setActiveTab('vendas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'vendas'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gestão de Vendas ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('precos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'precos'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Editar Preços & Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab('entregadores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'entregadores'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Entregadores ({drivers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'config'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Tab Content Views */}
      <div className="pt-2">
        {activeTab === 'vendas' && (
          <OrderManager
            orders={orders}
            drivers={drivers}
            config={config}
            onRefreshOrders={onRefreshData}
          />
        )}

        {activeTab === 'precos' && (
          <PriceManager
            config={config}
            products={products}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'entregadores' && (
          <DriverManager
            drivers={drivers}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'config' && (
          <SystemSettings
            config={config}
            onRefreshData={onRefreshData}
          />
        )}
      </div>
    </div>
  );
};
