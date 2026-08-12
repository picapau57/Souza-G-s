import React, { useState } from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  User,
  Phone,
  MapPin,
  MessageCircle,
  Filter,
  Eye,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus, Driver, SystemConfig } from '../../types';
import { storageService } from '../../services/storage';
import { whatsappService } from '../../services/whatsapp';

interface OrderManagerProps {
  orders: Order[];
  drivers: Driver[];
  config: SystemConfig;
  onRefreshOrders: () => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  drivers,
  config,
  onRefreshOrders,
}) => {
  const [timeFilter, setTimeFilter] = useState<'hoje' | 'semana' | 'todos'>('hoje');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Filter orders by date range
  const dateFilteredOrders = orders.filter((o) => {
    if (timeFilter === 'hoje') {
      return o.createdAt.startsWith(todayStr);
    }
    if (timeFilter === 'semana') {
      return new Date(o.createdAt) >= startOfWeek;
    }
    return true;
  });

  // Filter by status
  const finalOrders = dateFilteredOrders.filter((o) => {
    if (statusFilter === 'todos') return true;
    return o.status === statusFilter;
  });

  const handleUpdateStatus = (
    orderId: string,
    newStatus: OrderStatus,
    driverId?: string
  ) => {
    storageService.updateOrderStatus(orderId, newStatus, driverId);
    onRefreshOrders();

    // If modal open, update selected order state
    if (selectedOrder && selectedOrder.id === orderId) {
      const driverObj = driverId ? drivers.find((d) => d.id === driverId) : undefined;
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        assignedDriverId: driverId || selectedOrder.assignedDriverId,
      });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pendente':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Pendente
          </span>
        );
      case 'separacao':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <Package className="w-3 h-3 text-blue-400" />
            Em Separação
          </span>
        );
      case 'a_caminho':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-400" />
            A Caminho
          </span>
        );
      case 'entregue':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Entregue
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            Cancelado
          </span>
        );
    }
  };

  const sendStatusWhatsApp = (order: Order) => {
    const driver = order.assignedDriverId
      ? drivers.find((d) => d.id === order.assignedDriverId)
      : undefined;
    const msg = whatsappService.formatStatusNotifyMessage(order, config, driver?.name);
    const link = whatsappService.getWhatsAppLink(order.customerPhone, msg);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        {/* Filter Period Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTimeFilter('hoje')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeFilter === 'hoje'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setTimeFilter('semana')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeFilter === 'semana'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setTimeFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeFilter === 'todos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendentes</option>
            <option value="separacao">Em Separação</option>
            <option value="a_caminho">A Caminho</option>
            <option value="entregue">Entregues</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders List / Cards */}
      {finalOrders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-2">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum pedido encontrado</h3>
          <p className="text-xs text-slate-400">
            Não há pedidos registrados para o filtro selecionado ({timeFilter}).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {finalOrders.map((order) => {
            const assignedDriver = drivers.find((d) => d.id === order.assignedDriverId);

            return (
              <div
                key={order.id}
                className="bg-[#0e1017] p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-lg shadow-black/30"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-amber-400 font-mono">
                      #{order.code}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {order.serviceType === 'portaria' ? 'Portaria' : 'Entrega em Casa'}
                    </span>
                    <span className="text-sm font-black text-white">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block">Cliente:</span>
                    <p className="font-bold text-white">{order.customerName}</p>
                    <p className="text-slate-400 font-mono">{order.customerPhone}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold block">Endereço / Local:</span>
                    {order.address ? (
                      <p className="text-slate-300">
                        {order.address.street}, {order.address.number} - {order.address.neighborhood}
                      </p>
                    ) : (
                      <p className="text-slate-300">Retirada Direta na Portaria</p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold block">Horário / Pagamento:</span>
                    <p className="text-amber-300 font-semibold">{order.scheduledTimeSlot}</p>
                    <p className="text-slate-400 uppercase font-extrabold">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  {/* Entregador Assign */}
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <select
                      value={order.assignedDriverId || ''}
                      onChange={(e) => handleUpdateStatus(order.id, order.status, e.target.value || undefined)}
                      className="bg-slate-950 border border-slate-700 text-white text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="">Atribuir Entregador...</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.vehicle})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Status Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {order.status === 'pendente' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'separacao')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Iniciar Separação
                      </button>
                    )}

                    {(order.status === 'pendente' || order.status === 'separacao') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'a_caminho')}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Saiu para Entrega</span>
                      </button>
                    )}

                    {order.status === 'a_caminho' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'entregue')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Marcar Entregue</span>
                      </button>
                    )}

                    {/* WhatsApp Status Alert Trigger */}
                    <button
                      onClick={() => sendStatusWhatsApp(order)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center gap-1"
                      title="Notificar cliente no WhatsApp sobre o status"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Avisar Cliente</span>
                    </button>

                    {/* Ver Detalhes Modal */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e1017] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-amber-400 font-mono">
                Detalhes do Pedido #{selectedOrder.code}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Itens Comprados:</span>
                <ul className="mt-1 space-y-1">
                  {selectedOrder.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between text-white font-semibold">
                      <span>{it.quantity}x {it.name}</span>
                      <span>R$ {(it.price * it.quantity).toFixed(2).replace('.', ',')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedOrder.address && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-bold">Endereço Completo:</span>
                  <p className="text-white mt-1">
                    {selectedOrder.address.street}, {selectedOrder.address.number} - {selectedOrder.address.neighborhood}
                  </p>
                  {selectedOrder.address.complement && (
                    <p className="text-slate-400">Comp: {selectedOrder.address.complement}</p>
                  )}
                  {selectedOrder.address.reference && (
                    <p className="text-slate-400">Ref: {selectedOrder.address.reference}</p>
                  )}
                </div>
              )}

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Pagamento & Troco:</span>
                <p className="text-amber-300 uppercase font-extrabold mt-1">
                  Método: {selectedOrder.paymentMethod}
                </p>
                {selectedOrder.needChangeFor && (
                  <p className="text-emerald-400 font-bold">
                    Troco para: R$ {selectedOrder.needChangeFor.toFixed(2).replace('.', ',')} (Troco de R${' '}
                    {(selectedOrder.needChangeFor - selectedOrder.total).toFixed(2).replace('.', ',')})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelado')}
                className="px-4 py-2 rounded-xl bg-red-950 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-900"
              >
                Cancelar Pedido
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
