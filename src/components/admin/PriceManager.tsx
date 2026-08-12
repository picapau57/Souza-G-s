import React, { useState } from 'react';
import { DollarSign, Save, Check, Store, Truck, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { SystemConfig, ExtraProduct } from '../../types';
import { storageService } from '../../services/storage';

interface PriceManagerProps {
  config: SystemConfig;
  products: ExtraProduct[];
  onRefreshData: () => void;
}

export const PriceManager: React.FC<PriceManagerProps> = ({
  config,
  products,
  onRefreshData,
}) => {
  const [portariaPrice, setPortariaPrice] = useState(config.portariaPrice);
  const [entregaPrice, setEntregaPrice] = useState(config.entregaPrice);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // States for extra products
  const [productList, setProductList] = useState<ExtraProduct[]>(products);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'agua' | 'acessorio'>('agua');

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig = {
      ...config,
      portariaPrice: Number(portariaPrice),
      entregaPrice: Number(entregaPrice),
    };
    storageService.saveConfig(updatedConfig);
    onRefreshData();

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleProductAvailability = (id: string) => {
    const updated = productList.map((p) =>
      p.id === id ? { ...p, available: !p.available } : p
    );
    setProductList(updated);
    storageService.saveProducts(updated);
    onRefreshData();
  };

  const handleDeleteProduct = (id: string) => {
    const updated = productList.filter((p) => p.id !== id);
    setProductList(updated);
    storageService.saveProducts(updated);
    onRefreshData();
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) return;

    const newProd: ExtraProduct = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      price: parseFloat(newProductPrice),
      description: 'Adicionado pelo proprietário do depósito',
      category: newProductCategory,
      imageIcon: newProductCategory === 'agua' ? 'Droplet' : 'ShieldCheck',
      available: true,
    };

    const updated = [...productList, newProd];
    setProductList(updated);
    storageService.saveProducts(updated);
    onRefreshData();

    setNewProductName('');
    setNewProductPrice('');
  };

  return (
    <div className="space-y-8">
      {/* 1. Main Gas Price Controls */}
      <form onSubmit={handleSavePrices} className="bg-[#0e1017] p-6 rounded-3xl border border-amber-500/40 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Editar Preços Principais do Gás
            </h3>
            <p className="text-xs text-slate-400">
              Alteração em tempo real. O novo valor aparecerá imediatamente no celular do cliente.
            </p>
          </div>

          {savedSuccess && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Preços Salvos!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preço na Portaria */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              Preço Retirada na Portaria (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">R$</span>
              <input
                type="number"
                step="0.10"
                value={portariaPrice}
                onChange={(e) => setPortariaPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-lg font-black text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">Valor com desconto para o cliente vir buscar no depósito.</p>
          </div>

          {/* Preço na Entrega */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              Preço Entrega em Domicílio (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">R$</span>
              <input
                type="number"
                step="0.10"
                value={entregaPrice}
                onChange={(e) => setEntregaPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-lg font-black text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">Valor entregue na residência com instalação inclusa.</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações de Preço</span>
        </button>
      </form>

      {/* 2. Extra Products / Upsells Catalog */}
      <div className="bg-[#0e1017] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          Catálogo de Produtos Extras & Água Mineral
        </h3>

        {/* Existing Products List */}
        <div className="space-y-3">
          {productList.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{prod.name}</h4>
                  {!prod.available && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/30">
                      Indisponível
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-400 font-extrabold mt-0.5">
                  R$ {prod.price.toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleProductAvailability(prod.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    prod.available
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {prod.available ? 'Ativo' : 'Pausado'}
                </button>

                {!prod.id.includes('gas-13kg') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1.5 rounded-lg bg-red-950/50 text-red-400 border border-red-500/30 hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Product Form */}
        <form onSubmit={handleAddProduct} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cadastrar Novo Produto Extra</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome (Ex: Garrafão 10L, Registo)..."
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />

            <input
              type="number"
              step="0.50"
              placeholder="Preço (R$)..."
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />

            <select
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="agua">Água Mineral</option>
              <option value="acessorio">Acessório de Gás</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ao Catálogo</span>
          </button>
        </form>
      </div>
    </div>
  );
};
