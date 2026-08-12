import React from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, Flame, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Order, SystemConfig } from '../../types';
import { whatsappService } from '../../services/whatsapp';

interface OrderConfirmationModalProps {
  order: Order;
  config: SystemConfig;
  onClose: () => void;
  onTrackOrder: (code: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  config,
  onClose,
  onTrackOrder,
}) => {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const formattedMsg = whatsappService.formatOrderMessage(order, config);
  const whatsappUrl = whatsappService.getWhatsAppLink(config.companyPhone, formattedMsg);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-500/10 space-y-6 my-8 animate-in fade-in zoom-in duration-200">
        {/* Top Gold Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 mb-1">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Pedido Realizado com Sucesso!</h2>
          <p className="text-xs text-amber-400 font-semibold">
            {config.companyName} já recebeu a sua solicitação.
          </p>
        </div>

        {/* Code & Copy Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Código do Pedido</span>
            <div className="text-xl font-black text-amber-400 font-mono">#{order.code}</div>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Order Details Receipt Box */}
        <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold">
            <span className="text-slate-400">Cliente:</span>
            <span className="text-white">{order.customerName} ({order.customerPhone})</span>
          </div>

          <div className="space-y-1.5 py-1">
            <span className="text-amber-400 font-bold block">Itens Solicitados:</span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-mono">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex items-center justify-between text-slate-400">
                <span>Taxa Entrega:</span>
                <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-black text-amber-400 pt-1">
              <span>Total do Pedido:</span>
              <span className="text-base">R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Agendamento: <strong className="text-white">{order.scheduledTimeSlot}</strong> ({order.scheduledDate === 'hoje' ? 'Hoje' : order.scheduledDate})</span>
            </div>
            {order.address && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{order.address.street}, {order.address.number} - {order.address.neighborhood} ({order.address.city}{order.address.state ? `/${order.address.state}` : ''})</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>Enviar Pedido no WhatsApp do Depósito</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.code);
              }}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Acompanhar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-bold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
