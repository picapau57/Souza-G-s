import React, { useState } from 'react';
import { UserCheck, Plus, Phone, Truck, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Driver } from '../../types';
import { storageService } from '../../services/storage';

interface DriverManagerProps {
  drivers: Driver[];
  onRefreshData: () => void;
}

export const DriverManager: React.FC<DriverManagerProps> = ({
  drivers,
  onRefreshData,
}) => {
  const [driverList, setDriverList] = useState<Driver[]>(drivers);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [phone, setPhone] = useState('');

  const handleToggleDriverStatus = (id: string) => {
    const updated = driverList.map((d) =>
      d.id === id ? { ...d, active: !d.active } : d
    );
    setDriverList(updated);
    storageService.saveDrivers(updated);
    onRefreshData();
  };

  const handleDeleteDriver = (id: string) => {
    const updated = driverList.filter((d) => d.id !== id);
    setDriverList(updated);
    storageService.saveDrivers(updated);
    onRefreshData();
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !vehicle.trim()) return;

    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      name,
      vehicle,
      phone: phone || '(67) 99999-0000',
      active: true,
      currentDeliveriesCount: 0,
    };

    const updated = [...driverList, newDriver];
    setDriverList(updated);
    storageService.saveDrivers(updated);
    onRefreshData();

    setName('');
    setVehicle('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0e1017] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              Gestão de Entregadores da Equipe
            </h3>
            <p className="text-xs text-slate-400">
              Cadastre motociclistas e motoristas para atribuição de entregas
            </p>
          </div>
        </div>

        {/* List of drivers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {driverList.map((driver) => (
            <div
              key={driver.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{driver.name}</h4>
                    <p className="text-xs text-slate-400">{driver.vehicle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDriverStatus(driver.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    driver.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {driver.active ? 'Em Serviço' : 'Indisponível'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                <span className="text-slate-500 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  {driver.phone}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteDriver(driver.id)}
                  className="text-red-400 hover:text-red-300 font-bold p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Driver Form */}
        <form onSubmit={handleAddDriver} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cadastrar Novo Entregador</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome (Ex: Carlos, Marcos)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />

            <input
              type="text"
              placeholder="Veículo (Ex: Moto Cargo 160)..."
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />

            <input
              type="text"
              placeholder="Telefone/WhatsApp..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Entregador</span>
          </button>
        </form>
      </div>
    </div>
  );
};
