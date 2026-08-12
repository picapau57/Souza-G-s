import React, { useState, useEffect } from 'react';
import { MapPin, Building, Navigation, Info, Compass, Globe } from 'lucide-react';
import { OrderAddress } from '../../types';
import { BRAZIL_LOCATIONS, ALL_UFS } from '../../data/locations';

interface AddressFormProps {
  address: OrderAddress;
  onChangeAddress: (field: keyof OrderAddress, value: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChangeAddress }) => {
  const currentUf = address.state || 'GO';
  const stateData = BRAZIL_LOCATIONS[currentUf] || BRAZIL_LOCATIONS['GO'];

  const availableCities = Object.keys(stateData.cities);
  const currentCity = address.city || stateData.defaultCity;

  const availableNeighborhoods = stateData.cities[currentCity] || ['Outro Bairro...'];

  const [isCustomCity, setIsCustomCity] = useState<boolean>(
    Boolean(currentCity && !availableCities.includes(currentCity))
  );

  const [isCustomNeighborhood, setIsCustomNeighborhood] = useState<boolean>(
    Boolean(address.neighborhood && !availableNeighborhoods.includes(address.neighborhood))
  );

  useEffect(() => {
    // If state is not set yet, set default to GO
    if (!address.state) {
      onChangeAddress('state', 'GO');
    }
    if (!address.city) {
      onChangeAddress('city', 'Goiânia');
    }
  }, []);

  const handleStateChange = (newUf: string) => {
    onChangeAddress('state', newUf);
    const newLoc = BRAZIL_LOCATIONS[newUf];
    if (newLoc) {
      const defaultCity = newLoc.defaultCity;
      onChangeAddress('city', defaultCity);
      setIsCustomCity(false);
      onChangeAddress('neighborhood', '');
      setIsCustomNeighborhood(false);
    }
  };

  const handleCitySelectChange = (newCity: string) => {
    if (newCity === 'Outra Cidade...') {
      setIsCustomCity(true);
      onChangeAddress('city', '');
      onChangeAddress('neighborhood', '');
      setIsCustomNeighborhood(true);
    } else {
      setIsCustomCity(false);
      onChangeAddress('city', newCity);
      onChangeAddress('neighborhood', '');
      setIsCustomNeighborhood(false);
    }
  };

  const handleNeighborhoodSelectChange = (newBairro: string) => {
    if (newBairro === 'Outro Bairro...') {
      setIsCustomNeighborhood(true);
      onChangeAddress('neighborhood', '');
    } else {
      setIsCustomNeighborhood(false);
      onChangeAddress('neighborhood', newBairro);
    }
  };

  return (
    <div className="space-y-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-slate-950 text-xs font-bold">3</span>
            Endereço para Entrega do Gás
          </h2>
          <p className="text-xs text-slate-400">Selecione o Estado e Cidade para carregar os Bairros atendidos</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentCity} - {currentUf}</span>
        </div>
      </div>

      {/* Seleção de Estado (UF) e Cidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Estado (UF) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            Estado (UF) *
          </label>
          <select
            value={currentUf}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-400 font-semibold"
          >
            {ALL_UFS.map((uf) => (
              <option key={uf} value={uf}>
                {BRAZIL_LOCATIONS[uf].name} ({uf})
              </option>
            ))}
          </select>
        </div>

        {/* Cidade */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-orange-400" />
            Cidade *
          </label>
          {!isCustomCity ? (
            <select
              value={currentCity}
              onChange={(e) => handleCitySelectChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-400 font-semibold"
            >
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={address.city}
                onChange={(e) => onChangeAddress('city', e.target.value)}
                placeholder="Digite o nome da sua Cidade..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400 font-semibold"
              />
              <button
                type="button"
                onClick={() => setIsCustomCity(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl font-bold shrink-0"
              >
                Lista
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Bairro / Região */}
        <div className="sm:col-span-1 space-y-1">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            Bairro em {currentCity} *
          </label>
          {!isCustomNeighborhood ? (
            <select
              value={address.neighborhood}
              onChange={(e) => handleNeighborhoodSelectChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-400 font-semibold"
            >
              <option value="">Selecione o Bairro...</option>
              {availableNeighborhoods.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={address.neighborhood}
                onChange={(e) => onChangeAddress('neighborhood', e.target.value)}
                placeholder="Digite o nome do seu Bairro..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400 font-semibold"
              />
              <button
                type="button"
                onClick={() => setIsCustomNeighborhood(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl font-bold shrink-0"
              >
                Lista
              </button>
            </div>
          )}
        </div>

        {/* Nome da Rua */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-orange-400" />
            Rua / Avenida *
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => onChangeAddress('street', e.target.value)}
            placeholder="Ex: Av. T-63, Rua T-53, Av. Rio Verde..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Número */}
        <div className="sm:col-span-1 space-y-1">
          <label className="text-xs font-bold text-slate-300">Número *</label>
          <input
            type="text"
            value={address.number}
            onChange={(e) => onChangeAddress('number', e.target.value)}
            placeholder="Ex: 1050, S/N, Quadra 12 Lote 5"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Complemento */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-300">Complemento (Opcional)</label>
          <input
            type="text"
            value={address.complement || ''}
            onChange={(e) => onChangeAddress('complement', e.target.value)}
            placeholder="Ex: Apto 302, Bloco B, Casa dos fundos"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Ponto de Referência */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-orange-400" />
          Ponto de Referência (Facilita a entrega)
        </label>
        <input
          type="text"
          value={address.reference || ''}
          onChange={(e) => onChangeAddress('reference', e.target.value)}
          placeholder="Ex: Próximo ao Buriti Shopping, em frente à Praça T-25, portão verde..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
        />
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">
        <Info className="w-4 h-4 text-orange-400 shrink-0" />
        <span>Nossa frota em {currentCity} ({currentUf}) atende todos os bairros listados com rapidez e segurança!</span>
      </div>
    </div>
  );
};

