import React, { useState } from 'react';
import { QrCode, CreditCard, Banknote, Copy, Check, Info } from 'lucide-react';
import { PaymentMethod, SystemConfig } from '../../types';

interface PaymentSelectorProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  needChangeFor: number | undefined;
  setNeedChangeFor: (val: number | undefined) => void;
  totalAmount: number;
  config: SystemConfig;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  needChangeFor,
  setNeedChangeFor,
  totalAmount,
  config,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(config.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="space-y-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
              5
            </span>
            Forma de Pagamento
          </h2>
          <p className="text-xs text-slate-400">Escolha como prefere pagar o seu gás</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* PIX */}
        <button
          type="button"
          onClick={() => setPaymentMethod('pix')}
          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
            paymentMethod === 'pix'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">PIX</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Chave Copia e Cola</span>
          </div>
        </button>

        {/* Cartão Débito */}
        <button
          type="button"
          onClick={() => setPaymentMethod('cartao_debito')}
          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
            paymentMethod === 'cartao_debito'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">Débito</span>
            <span className="text-[10px] text-slate-400 font-medium">Na Entrega/Portaria</span>
          </div>
        </button>

        {/* Cartão Crédito */}
        <button
          type="button"
          onClick={() => setPaymentMethod('cartao_credito')}
          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
            paymentMethod === 'cartao_credito'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">Crédito</span>
            <span className="text-[10px] text-slate-400 font-medium">Na Entrega/Portaria</span>
          </div>
        </button>

        {/* Dinheiro */}
        <button
          type="button"
          onClick={() => setPaymentMethod('dinheiro')}
          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
            paymentMethod === 'dinheiro'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">Dinheiro</span>
            <span className="text-[10px] text-amber-400 font-medium">Com Troco</span>
          </div>
        </button>
      </div>

      {/* PIX Details Box */}
      {paymentMethod === 'pix' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <QrCode className="w-4 h-4" />
              <span>Chave PIX Oficial ({config.pixKeyType}):</span>
            </div>
            <span className="text-[10px] text-slate-400">{config.pixReceiverName}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={config.pixKey}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 font-bold"
            />
            <button
              type="button"
              onClick={handleCopyPix}
              className="px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              {copiedPix ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>

          {/* QR Code Visual Box Simulation */}
          <div className="p-3 bg-white rounded-xl text-center max-w-[160px] mx-auto shadow-md">
            <div className="w-28 h-28 mx-auto bg-slate-950 p-2 rounded-lg flex flex-col items-center justify-center text-amber-400">
              <QrCode className="w-20 h-20 text-amber-400" />
            </div>
            <p className="text-[10px] text-slate-700 font-bold mt-1">Escaneie no seu app do banco</p>
          </div>
        </div>
      )}

      {/* Dinheiro - Troco Box */}
      {paymentMethod === 'dinheiro' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
          <label className="text-xs font-bold text-amber-400 block">
            Precisa de troco para quanto?
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">R$</span>
            <input
              type="number"
              step="5"
              placeholder={`Ex: ${(Math.ceil(totalAmount / 50) * 50 || 100).toFixed(0)}`}
              value={needChangeFor || ''}
              onChange={(e) => setNeedChangeFor(e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          {needChangeFor && needChangeFor > totalAmount ? (
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Troco do entregador: R$ {(needChangeFor - totalAmount).toFixed(2).replace('.', ',')}
            </p>
          ) : needChangeFor && needChangeFor <= totalAmount ? (
            <p className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              O valor do troco deve ser maior que o total do pedido (R$ {totalAmount.toFixed(2).replace('.', ',')})
            </p>
          ) : (
            <p className="text-[11px] text-slate-500">Se pagar com valor exato, pode deixar em branco.</p>
          )}
        </div>
      )}

      {(paymentMethod === 'cartao_debito' || paymentMethod === 'cartao_credito') && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Levaremos a maquininha de cartão sem taxa adicional. Aceitamos todas as bandeiras.</span>
        </div>
      )}
    </div>
  );
};
