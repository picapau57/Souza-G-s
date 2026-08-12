/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OrderWizard } from './components/public/OrderWizard';
import { OrderTracker } from './components/public/OrderTracker';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { storageService } from './services/storage';
import { Order, SystemConfig, ExtraProduct, Driver } from './types';
import { Search, Flame, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'tracker'>('public');
  const [config, setConfig] = useState<SystemConfig>(storageService.getConfig());
  const [products, setProducts] = useState<ExtraProduct[]>(storageService.getProducts());
  const [drivers, setDrivers] = useState<Driver[]>(storageService.getDrivers());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [trackerCode, setTrackerCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load and subscribe to real-time storage updates
  const refreshAllData = () => {
    setConfig(storageService.getConfig());
    setProducts(storageService.getProducts());
    setDrivers(storageService.getDrivers());
    setOrders(storageService.getOrders());
  };

  useEffect(() => {
    refreshAllData();

    const handleConfigChange = () => setConfig(storageService.getConfig());
    const handleProductsChange = () => setProducts(storageService.getProducts());
    const handleDriversChange = () => setDrivers(storageService.getDrivers());
    const handleOrdersChange = () => setOrders(storageService.getOrders());

    window.addEventListener('pantaleao_config_changed', handleConfigChange);
    window.addEventListener('pantaleao_products_changed', handleProductsChange);
    window.addEventListener('pantaleao_drivers_changed', handleDriversChange);
    window.addEventListener('pantaleao_orders_changed', handleOrdersChange);
    window.addEventListener('storage', refreshAllData);

    return () => {
      window.removeEventListener('pantaleao_config_changed', handleConfigChange);
      window.removeEventListener('pantaleao_products_changed', handleProductsChange);
      window.removeEventListener('pantaleao_drivers_changed', handleDriversChange);
      window.removeEventListener('pantaleao_orders_changed', handleOrdersChange);
      window.removeEventListener('storage', refreshAllData);
    };
  }, []);

  // Count active pending/separacao/a_caminho orders for today
  const todayStr = new Date().toISOString().split('T')[0];
  const activeOrdersCount = orders.filter(
    (o) =>
      o.createdAt.startsWith(todayStr) &&
      (o.status === 'pendente' || o.status === 'separacao' || o.status === 'a_caminho')
  ).length;

  const handleOpenTrackerWithCode = (code?: string) => {
    if (code) {
      setTrackerCode(code);
    }
    setCurrentView('tracker');
    setIsSearchModalOpen(false);
  };

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setTrackerCode(searchQuery.trim());
    setCurrentView('tracker');
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        config={config}
        activeOrdersCount={activeOrdersCount}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'public' && (
          <OrderWizard
            config={config}
            products={products}
            drivers={drivers}
            onOrderCreated={(newOrder) => {
              refreshAllData();
            }}
            onOpenTracker={handleOpenTrackerWithCode}
          />
        )}

        {currentView === 'tracker' && (
          <OrderTracker
            initialCode={trackerCode}
            config={config}
            drivers={drivers}
            onBackToOrder={() => {
              setTrackerCode('');
              setCurrentView('public');
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            orders={orders}
            drivers={drivers}
            config={config}
            products={products}
            onRefreshData={refreshAllData}
            onExitAdmin={() => setCurrentView('public')}
          />
        )}
      </main>

      {/* Quick Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e1017] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                Consultar Pedido Existente
              </h3>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Digite o código do seu pedido (ex: <code className="text-amber-300">SOUZA-8810</code>) ou seu número de telefone com DDD.
            </p>

            <form onSubmit={handleExecuteSearch} className="space-y-3">
              <input
                type="text"
                placeholder="Código do Pedido ou WhatsApp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                Localizar Pedido
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        config={config}
        onOpenAdmin={() => setCurrentView('admin')}
      />
    </div>
  );
}
