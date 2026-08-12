import React from 'react';
import { DollarSign, ShoppingBag, Calendar, TrendingUp, Store, Truck, BarChart3 } from 'lucide-react';
import { Order } from '../../types';

interface MetricsCardProps {
  orders: Order[];
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ orders }) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Calculate beginning of the week (Sunday or Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Filter non-cancelled orders
  const validOrders = orders.filter((o) => o.status !== 'cancelado');

  // Today metrics
  const todayOrders = validOrders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  // Week metrics
  const weekOrders = validOrders.filter((o) => new Date(o.createdAt) >= startOfWeek);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);

  // Split: Portaria vs Entrega (Weekly)
  const portariaCount = weekOrders.filter((o) => o.serviceType === 'portaria').length;
  const entregaCount = weekOrders.filter((o) => o.serviceType === 'entrega').length;

  // Average Ticket
  const avgTicketToday = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Vendas do Dia */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 space-y-2 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Faturamento Hoje
          </span>
          <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
            Dia
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-white">
          R$ {todayRevenue.toFixed(2).replace('.', ',')}
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
          <span>{todayOrders.length} pedido(s) hoje</span>
          <span className="text-emerald-400 font-bold">Méd.: R$ {avgTicketToday.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Vendas da Semana */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 space-y-2 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            Faturamento Semana
          </span>
          <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            7 Dias
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-white">
          R$ {weekRevenue.toFixed(2).replace('.', ',')}
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
          <span>{weekOrders.length} pedido(s) na semana</span>
          <span className="text-amber-400 font-bold">Acumulado</span>
        </div>
      </div>

      {/* Retiradas na Portaria */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-amber-400" />
            Retiradas na Portaria
          </span>
          <span className="text-xs font-bold text-white">{portariaCount} vds</span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-amber-400">
          {weekOrders.length > 0 ? Math.round((portariaCount / weekOrders.length) * 100) : 0}%
        </div>

        <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
          <span>Vendas sem taxa de entrega</span>
        </div>
      </div>

      {/* Entregas em Domicílio */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" />
            Entregas em Casa
          </span>
          <span className="text-xs font-bold text-white">{entregaCount} vds</span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-amber-400">
          {weekOrders.length > 0 ? Math.round((entregaCount / weekOrders.length) * 100) : 0}%
        </div>

        <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
          <span>Atendimento express com entregador</span>
        </div>
      </div>
    </div>
  );
};
