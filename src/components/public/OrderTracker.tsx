import React, { useState } from 'react';
import { Search, Package, Clock, Truck, CheckCircle, XCircle, User, Phone, MapPin, Flame } from 'lucide-react';
import { Order, OrderStatus, Driver, SystemConfig } from '../../types';
import { storageService } from '../../services/storage';

interface OrderTrackerProps {
  initialCode?: string;
  config: SystemConfig;
  drivers: Driver[];
  onBackToOrder: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  initialCode = '',
  config,
  drivers,
  onBackToOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialCode);
  const [foundOrder, setFoundOrder] = useState<Order | undefined>(
    initialCode ? storageService.getOrderByCodeOrPhone(initialCode) : undefined
  );
  const [searched, setSearched] = useState(!!initialCode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const res = storageService.getOrderByCodeOrPhone(searchTerm);
    setFoundOrder(res);
    setSearched(true);
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pendente':
        return 1;
      case 'separacao':
        return 2;
      case 'a_caminho':
        return 3;
      case 'entregue':
        return 4;
      case 'cancelado':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 0;
  const driver = foundOrder?.assignedDriverId
    ? drivers.find((d) => d.id === foundOrder.assignedDriverId)
    : undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-amber-500/30 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-white">Acompanhar Status do Pedido</h2>
        <p className="text-xs text-slate-400">
          Digite o código do pedido (ex: <code className="text-amber-300 font-mono">SOUZA-8810</code>) ou o número de telefone do cliente
        </p>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Digite o Código ou Telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm hover:opacity-90 transition-opacity shrink-0 shadow-md shadow-amber-500/20"
          >
            Consultar
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && !foundOrder && (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <XCircle className="w-10 h-10 text-amber-500/60 mx-auto" />
          <h3 className="text-base font-bold text-white">Pedido não encontrado</h3>
          <p className="text-xs text-slate-400">
            Não localizamos nenhum pedido com o termo "<span className="text-amber-300">{searchTerm}</span>". Verifique o código e tente novamente.
          </p>
        </div>
      )}

      {foundOrder && (
        <div className="bg-[#0e1017] p-5 sm:p-7 rounded-3xl border border-amber-500/40 space-y-6 shadow-2xl">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Acompanhamento</span>
              <h3 className="text-xl font-black text-amber-400 font-mono">#{foundOrder.code}</h3>
              <p className="text-xs text-slate-400">Cliente: {foundOrder.customerName}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total do Pedido</span>
              <span className="text-lg font-black text-white">R$ {foundOrder.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Cancelled State Notice */}
          {foundOrder.status === 'cancelado' ? (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center font-bold">
              ❌ Este pedido foi cancelado pelo depósito. Entre em contato para maiores informações.
            </div>
          ) : (
            /* Visual Progress Stepper */
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Status Atual do Pedido:</h4>

              <div className="grid grid-cols-4 gap-2 relative">
                {/* Step 1: Recebido */}
                <div className={`p-3 rounded-2xl border text-center space-y-1 ${
                  currentStep >= 1 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  <Clock className="w-5 h-5 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold block">Recebido</span>
                </div>

                {/* Step 2: Em Separação */}
                <div className={`p-3 rounded-2xl border text-center space-y-1 ${
                  currentStep >= 2 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  <Package className="w-5 h-5 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold block">Separação</span>
                </div>

                {/* Step 3: A Caminho */}
                <div className={`p-3 rounded-2xl border text-center space-y-1 ${
                  currentStep >= 3 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  <Truck className="w-5 h-5 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold block">A Caminho</span>
                </div>

                {/* Step 4: Entregue */}
                <div className={`p-3 rounded-2xl border text-center space-y-1 ${
                  currentStep >= 4 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  <CheckCircle className="w-5 h-5 mx-auto" />
                  <span className="text-[10px] sm:text-xs font-bold block">Concluído</span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Driver Box (if on delivery) */}
          {driver && foundOrder.status === 'a_caminho' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Entregador Responsável</span>
                  <h4 className="text-sm font-bold text-white">{driver.name}</h4>
                  <p className="text-xs text-slate-400">{driver.vehicle}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${driver.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ligar</span>
              </a>
            </div>
          )}

          {/* Summary Items */}
          <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h5 className="font-bold text-amber-400">Itens do Pedido:</h5>
            <ul className="space-y-1 text-slate-300">
              {foundOrder.items.map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono">R$ {(it.price * it.quantity).toFixed(2).replace('.', ',')}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onBackToOrder}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-colors"
          >
            ← Fazer um novo pedido
          </button>
        </div>
      )}
    </div>
  );
};
