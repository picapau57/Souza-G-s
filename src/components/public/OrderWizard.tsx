import React, { useState } from 'react';
import {
  Flame,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  FileText
} from 'lucide-react';
import {
  ServiceType,
  PaymentMethod,
  OrderAddress,
  SystemConfig,
  ExtraProduct,
  Driver,
  Order
} from '../../types';
import { ServiceSelector } from './ServiceSelector';
import { ProductAddons } from './ProductAddons';
import { AddressForm } from './AddressForm';
import { SchedulingPicker } from './SchedulingPicker';
import { PaymentSelector } from './PaymentSelector';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import { storageService } from '../../services/storage';

interface OrderWizardProps {
  config: SystemConfig;
  products: ExtraProduct[];
  drivers: Driver[];
  onOrderCreated: (order: Order) => void;
  onOpenTracker: (code?: string) => void;
}

export const OrderWizard: React.FC<OrderWizardProps> = ({
  config,
  products,
  drivers,
  onOrderCreated,
  onOpenTracker,
}) => {
  // Wizard State
  const [serviceType, setServiceType] = useState<ServiceType>('entrega');
  const [gasQuantity, setGasQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<{ [id: string]: number }>({});

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [address, setAddress] = useState<OrderAddress>({
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    reference: '',
    city: 'Goiânia',
    state: 'GO',
  });

  const [scheduledDate, setScheduledDate] = useState('hoje');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('Entrega Expressa (30-45 min)');
  const [preferredDriverId, setPreferredDriverId] = useState<string | undefined>(undefined);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [needChangeFor, setNeedChangeFor] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Price calculations
  const gasPrice = serviceType === 'portaria' ? config.portariaPrice : config.entregaPrice;
  const gasSubtotal = gasPrice * gasQuantity;

  let extrasSubtotal = 0;
  Object.entries(selectedAddons).forEach(([id, qty]) => {
    const qtyNum = Number(qty);
    const prod = products.find((p) => p.id === id);
    if (prod && qtyNum > 0) {
      extrasSubtotal += prod.price * qtyNum;
    }
  });

  const subtotal = gasSubtotal + extrasSubtotal;
  const deliveryFee = 0; // Inclusa no valor de entrega ou portaria
  const total = subtotal + deliveryFee;

  const handleUpdateAddonQty = (productId: string, delta: number) => {
    setSelectedAddons((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddressChange = (field: keyof OrderAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Por favor, informe seu Nome Completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMessage('Por favor, informe um número de Telefone/WhatsApp válido.');
      return;
    }

    if (serviceType === 'entrega') {
      if (!address.street.trim() || !address.number.trim() || !address.neighborhood.trim()) {
        setErrorMessage('Por favor, preencha o Bairro, Rua e Número para a entrega.');
        return;
      }
    }

    // Build Order Items
    const items = [
      {
        productId: serviceType === 'portaria' ? 'gas-13kg-portaria' : 'gas-13kg-entrega',
        name: `Botijão de Gás P13 (${serviceType === 'portaria' ? 'Retirada na Portaria' : 'Entrega em Casa'})`,
        price: gasPrice,
        quantity: gasQuantity,
      },
    ];

    Object.entries(selectedAddons).forEach(([id, qty]) => {
      const qtyNum = Number(qty);
      const prod = products.find((p) => p.id === id);
      if (prod && qtyNum > 0) {
        items.push({
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: qtyNum,
        });
      }
    });

    const code = storageService.generateOrderCode();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceType,
      items,
      subtotal,
      deliveryFee,
      total,
      address: serviceType === 'entrega' ? address : undefined,
      scheduledDate,
      scheduledTimeSlot,
      preferredDriverId,
      paymentMethod,
      needChangeFor: paymentMethod === 'dinheiro' ? needChangeFor : undefined,
      status: 'pendente',
      notes: notes.trim() || undefined,
    };

    storageService.saveOrder(newOrder);
    setCreatedOrder(newOrder);
    onOrderCreated(newOrder);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Hero Banner Accent */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#12141d] via-[#1a1d29] to-[#12141d] p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            PEDIDO FÁCIL PELO CELULAR
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gás de Cozinha no <span className="text-amber-400">Depósito Pantaleão</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Compre direto na portaria com desconto ou agende a entrega em domicílio sem complicações.
          </p>
        </div>

        <div className="shrink-0 text-center bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Portaria Hoje:</span>
          <span className="text-2xl font-black text-amber-400">R$ {config.portariaPrice.toFixed(2).replace('.', ',')}</span>
          <span className="text-[10px] text-emerald-400 font-extrabold block mt-0.5">Entregue: R$ {config.entregaPrice.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Step 1: Service Type (Portaria vs Entrega) */}
        <ServiceSelector
          selectedService={serviceType}
          onSelectService={(st) => {
            setServiceType(st);
            if (st === 'portaria') {
              setScheduledTimeSlot('Atendimento Imediato na Portaria');
            } else {
              setScheduledTimeSlot('Entrega Expressa (30-45 min)');
            }
          }}
          config={config}
        />

        {/* Step 2: Quantity & Extras */}
        <ProductAddons
          serviceType={serviceType}
          gasPrice={gasPrice}
          quantity={gasQuantity}
          setQuantity={setGasQuantity}
          availableProducts={products}
          selectedAddons={selectedAddons}
          onUpdateAddonQuantity={handleUpdateAddonQty}
        />

        {/* Step 3: Address (if Entrega) */}
        {serviceType === 'entrega' && (
          <AddressForm address={address} onChangeAddress={handleAddressChange} />
        )}

        {/* Step 4: Scheduling */}
        <SchedulingPicker
          serviceType={serviceType}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          scheduledTimeSlot={scheduledTimeSlot}
          setScheduledTimeSlot={setScheduledTimeSlot}
          preferredDriverId={preferredDriverId}
          setPreferredDriverId={setPreferredDriverId}
          drivers={drivers}
        />

        {/* Step 5: Payment Selector */}
        <PaymentSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          needChangeFor={needChangeFor}
          setNeedChangeFor={setNeedChangeFor}
          totalAmount={total}
          config={config}
        />

        {/* Step 6: Customer Info */}
        <div className="space-y-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                6
              </span>
              Seus Dados de Contato
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Seu Nome Completo *
              </label>
              <input
                type="text"
                placeholder="Ex: Maria da Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Seu WhatsApp / Celular *
              </label>
              <input
                type="text"
                placeholder="Ex: (67) 99988-7766"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Observações ou Instruções Especiais (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Entregar na cozinha, avisar ao chegar, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-bold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Final Desktop Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Flame className="w-6 h-6 fill-slate-950 animate-pulse" />
          <span>CONFIRMAR E FINALIZAR PEDIDO (R$ {total.toFixed(2).replace('.', ',')})</span>
        </button>
      </form>

      {/* Mobile Sticky Footer Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0c0d12]/95 backdrop-blur-md border-t border-amber-500/30 p-3 sm:hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Total do Pedido</span>
            <span className="text-lg font-black text-amber-400">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            onClick={handleSubmitOrder}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Finalizar Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {createdOrder && (
        <OrderConfirmationModal
          order={createdOrder}
          config={config}
          onClose={() => setCreatedOrder(null)}
          onTrackOrder={(code) => onOpenTracker(code)}
        />
      )}
    </div>
  );
};
