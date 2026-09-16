import React, { useState } from 'react';
import { DAYS_COUNT, formatCurrency } from '../utils/calculator';
import { Sliders, RotateCcw, Check, Sparkles, Edit3, Grid, Layers } from 'lucide-react';

interface ControlPanelProps {
  initialAmount: number;
  onInitialAmountChange: (value: number) => void;
  dailyRates: number[];
  onDailyRatesChange: (rates: number[]) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  initialAmount,
  onInitialAmountChange,
  dailyRates,
  onDailyRatesChange,
  onReset,
}) => {
  const [uniformRateInput, setUniformRateInput] = useState<string>('1.0');
  const [showBatchEditor, setShowBatchEditor] = useState<boolean>(false);
  const [feedbackApplied, setFeedbackApplied] = useState<boolean>(false);

  const capitalPresets = [1000, 5000, 10000, 25000, 50000];
  const ratePresets = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0];

  const handleApplyUniformRate = (rate: number) => {
    const newRates = Array(DAYS_COUNT).fill(rate);
    onDailyRatesChange(newRates);
    setUniformRateInput(rate.toString());
    setFeedbackApplied(true);
    setTimeout(() => setFeedbackApplied(false), 2000);
  };

  const handleDayRateChange = (dayIndex: number, valueStr: string) => {
    const val = parseFloat(valueStr);
    const safeVal = isNaN(val) ? 0 : val;
    const newRates = [...dailyRates];
    newRates[dayIndex] = safeVal;
    onDailyRatesChange(newRates);
  };

  return (
    <section id="control-panel" className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Parâmetros da Simulação (30 Dias)
            </h2>
            <p className="text-xs text-stone-500">
              Defina o valor inicial e digite as porcentagens diárias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-batch-editor"
            type="button"
            onClick={() => setShowBatchEditor(!showBatchEditor)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showBatchEditor
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {showBatchEditor ? <Grid className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {showBatchEditor ? 'Ocultar Grade dos 30 Dias' : 'Editar 30 Dias em Grade'}
          </button>

          <button
            id="btn-reset-defaults"
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center gap-1"
            title="Redefinir para valores padrões"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entrada do Valor Inicial */}
        <div className="flex flex-col justify-between">
          <div>
            <label htmlFor="input-initial-amount" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Valor Inicial Investido (R$)
            </label>
            <div className="relative rounded-lg shadow-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-medium text-sm">
                R$
              </span>
              <input
                id="input-initial-amount"
                type="number"
                min="0"
                step="50"
                value={initialAmount === 0 ? '' : initialAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onInitialAmountChange(isNaN(val) ? 0 : Math.max(0, val));
                }}
                placeholder="Ex: 1000"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-300 rounded-lg text-stone-900 font-semibold text-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Atalhos Rápidos de Capital */}
          <div className="mt-3">
            <span className="text-[11px] font-medium text-stone-500 block mb-1.5">
              Atalhos rápidos de capital:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {capitalPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  id={`preset-capital-${val}`}
                  onClick={() => onInitialAmountChange(val)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                    initialAmount === val
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Entrada da Porcentagem Diária */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-uniform-rate" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Taxa Diária Padrão (% ao dia)
              </label>
              {feedbackApplied && (
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Aplicado aos 30 dias!
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative rounded-lg shadow-xs flex-1">
                <input
                  id="input-uniform-rate"
                  type="number"
                  step="0.1"
                  value={uniformRateInput}
                  onChange={(e) => setUniformRateInput(e.target.value)}
                  placeholder="1.0"
                  className="w-full pl-3 pr-8 py-2.5 bg-stone-50/50 border border-stone-300 rounded-lg text-stone-900 font-semibold text-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-500 font-medium text-sm">
                  %
                </span>
              </div>

              <button
                id="btn-apply-uniform-rate"
                type="button"
                onClick={() => {
                  const parsed = parseFloat(uniformRateInput);
                  handleApplyUniformRate(isNaN(parsed) ? 0 : parsed);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Layers className="w-4 h-4" />
                <span>Aplicar a Todos (30d)</span>
              </button>
            </div>
          </div>

          {/* Atalhos Rápidos de Porcentagem */}
          <div className="mt-3">
            <span className="text-[11px] font-medium text-stone-500 block mb-1.5">
              Preencher todos os 30 dias com:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ratePresets.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  id={`preset-rate-${rate}`}
                  onClick={() => handleApplyUniformRate(rate)}
                  className="px-2.5 py-1 text-xs rounded-md font-medium bg-stone-50 text-stone-700 border border-stone-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                >
                  {rate.toFixed(1)}% ao dia
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grade expansível de edição manual dos 30 dias */}
      {showBatchEditor && (
        <div id="batch-editor-container" className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Edição Manual da Porcentagem dos 30 Dias
              </h3>
              <span className="text-xs text-stone-500">
                (Digite o percentual individual para qualquer dia específico)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleApplyUniformRate(1)}
              className="text-xs text-emerald-700 hover:underline font-medium"
            >
              Resetar todos para 1%
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {dailyRates.map((rate, idx) => (
              <div
                key={idx}
                className="bg-stone-50 p-2 rounded-lg border border-stone-200 flex flex-col focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                  <span className="font-semibold text-stone-700">D{idx + 1}</span>
                  <span className="text-[10px]">Dia {idx + 1}</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id={`input-grid-day-${idx + 1}`}
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => handleDayRateChange(idx, e.target.value)}
                    className="w-full text-right pr-4 py-1 text-xs font-bold text-stone-900 bg-white border border-stone-300 rounded px-1.5 focus:outline-hidden"
                  />
                  <span className="absolute right-1 text-[10px] font-semibold text-stone-400 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
