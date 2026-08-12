import React from 'react';
import { Plus, Minus, Flame, Droplet, ShieldCheck, Disc, PackageCheck } from 'lucide-react';
import { ExtraProduct, OrderItem, ServiceType } from '../../types';

interface ProductAddonsProps {
  serviceType: ServiceType;
  gasPrice: number;
  quantity: number;
  setQuantity: (qty: number) => void;
  availableProducts: ExtraProduct[];
  selectedAddons: { [productId: string]: number };
  onUpdateAddonQuantity: (productId: string, delta: number) => void;
}

export const ProductAddons: React.FC<ProductAddonsProps> = ({
  serviceType,
  gasPrice,
  quantity,
  setQuantity,
  availableProducts,
  selectedAddons,
  onUpdateAddonQuantity,
}) => {
  // Filter out primary gas products from extras list
  const extraProducts = availableProducts.filter(
    (p) => !p.id.includes('gas-13kg') && p.available
  );

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'Disc':
        return <Disc className="w-5 h-5 text-slate-300" />;
      default:
        return <PackageCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-5 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">2</span>
            Sua Carga de Gás & Produtos Adicionais
          </h2>
          <p className="text-xs text-slate-400">Escolha a quantidade de botijões e adicione água ou acessórios se precisar</p>
        </div>
      </div>

      {/* Main Gas Cylinder Selection Card */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400 shrink-0">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400/30" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Botijão de Gás P13 (13kg)
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Ultragaz Oficial
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {serviceType === 'portaria' ? 'Retirada na Portaria do Depósito' : 'Entrega rápida com instalação grátis'}
            </p>
            <span className="text-sm font-extrabold text-amber-400 mt-1 inline-block">
              R$ {gasPrice.toFixed(2).replace('.', ',')} / un
            </span>
          </div>
        </div>

        {/* Quantity Controls for Primary Gas */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-center font-bold text-lg disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-lg font-black text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 hover:bg-yellow-400 flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Extras & Upsells */}
      {extraProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
            💡 Adicionar ao mesmo pedido (Aproveite o frete):
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extraProducts.map((prod) => {
              const currentQty = selectedAddons[prod.id] || 0;

              return (
                <div
                  key={prod.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    currentQty > 0
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {renderIcon(prod.imageIcon)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{prod.name}</h5>
                      <span className="text-xs font-extrabold text-amber-400">
                        + R$ {prod.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => onUpdateAddonQuantity(prod.id, -1)}
                      className="w-7 h-7 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                      disabled={currentQty <= 0}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{currentQty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateAddonQuantity(prod.id, 1)}
                      className="w-7 h-7 rounded bg-amber-500 text-slate-950 hover:bg-yellow-400 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
