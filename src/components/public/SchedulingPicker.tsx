import React from 'react';
import { Clock, Calendar, UserCheck, Zap } from 'lucide-react';
import { Driver, ServiceType } from '../../types';

interface SchedulingPickerProps {
  serviceType: ServiceType;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTimeSlot: string;
  setScheduledTimeSlot: (slot: string) => void;
  preferredDriverId?: string;
  setPreferredDriverId: (driverId?: string) => void;
  drivers: Driver[];
}

const TIME_SLOTS_ENTREGA = [
  'Entrega Expressa (30-45 min)',
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 19:30',
];

const TIME_SLOTS_PORTARIA = [
  'Atendimento Imediato na Portaria',
  'Retirar de Manhã (08h às 12h)',
  'Retirar à Tarde (13h às 18h)',
  'Retirar ao Fim do Dia (18h às 19h30)',
];

export const SchedulingPicker: React.FC<SchedulingPickerProps> = ({
  serviceType,
  scheduledDate,
  setScheduledDate,
  scheduledTimeSlot,
  setScheduledTimeSlot,
  preferredDriverId,
  setPreferredDriverId,
  drivers,
}) => {
  const isEntrega = serviceType === 'entrega';
  const timeSlots = isEntrega ? TIME_SLOTS_ENTREGA : TIME_SLOTS_PORTARIA;

  return (
    <div className="space-y-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
              {isEntrega ? '4' : '3'}
            </span>
            {isEntrega ? 'Dia e Horário da Entrega' : 'Horário da Retirada na Portaria'}
          </h2>
          <p className="text-xs text-slate-400">Quando você deseja {isEntrega ? 'receber' : 'retirar'} o seu gás?</p>
        </div>
      </div>

      {/* Seleção do Dia */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          Escolha o Dia:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setScheduledDate('hoje')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              scheduledDate === 'hoje'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">Hoje</span>
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Gás Imediato</p>
          </button>

          <button
            type="button"
            onClick={() => setScheduledDate('amanha')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              scheduledDate === 'amanha'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-extrabold text-white">Amanhã</span>
            <p className="text-[10px] text-slate-400 mt-1">Agendado para amanhã</p>
          </button>

          <button
            type="button"
            onClick={() => setScheduledDate('data_futura')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              scheduledDate === 'data_futura'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-extrabold text-white">Outra Data</span>
            <p className="text-[10px] text-slate-400 mt-1">Combinar no WhatsApp</p>
          </button>
        </div>
      </div>

      {/* Seleção do Turno/Janela */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Turno / Janela de Atendimento:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = scheduledTimeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setScheduledTimeSlot(slot)}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{slot}</span>
                {slot.includes('Expressa') || slot.includes('Imediato') ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                    Rápido
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opção de Entregador Preferencial (se entrega) */}
      {isEntrega && drivers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            Preferência de Entregador (Opcional)
          </label>
          <select
            value={preferredDriverId || ''}
            onChange={(e) => setPreferredDriverId(e.target.value || undefined)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Primeiro entregador disponível (Mais Rápido)</option>
            {drivers
              .filter((d) => d.active)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehicle})
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};
