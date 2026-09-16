import React, { useState } from 'react';
import { DayRecord } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { Calendar, Percent, ArrowRight, TrendingUp, Check, Filter } from 'lucide-react';

interface DailyTableProps {
  records: DayRecord[];
  onRateChange: (dayIndex: number, newRate: number) => void;
}

export const DailyTable: React.FC<DailyTableProps> = ({ records, onRateChange }) => {
  const [filterRange, setFilterRange] = useState<'all' | '1-10' | '11-20' | '21-30'>('all');

  const filteredRecords = records.filter((r) => {
    if (filterRange === '1-10') return r.day <= 10;
    if (filterRange === '11-20') return r.day >= 11 && r.day <= 20;
    if (filterRange === '21-30') return r.day >= 21 && r.day <= 30;
    return true;
  });

  return (
    <section id="daily-table-section" className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Tabela de Evolução Dia a Dia (30 Dias)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Você pode alterar a porcentagem diretamente no campo de cada dia para recalcular tudo instantaneamente
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterRange('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              filterRange === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todos (30)
          </button>
          <button
            type="button"
            onClick={() => setFilterRange('1-10')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              filterRange === '1-10'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dias 1-10
          </button>
          <button
            type="button"
            onClick={() => setFilterRange('11-20')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              filterRange === '11-20'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dias 11-20
          </button>
          <button
            type="button"
            onClick={() => setFilterRange('21-30')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              filterRange === '21-30'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dias 21-30
          </button>
        </div>
      </div>

      {/* Table responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100/70 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 text-center w-16">Dia</th>
              <th className="py-3 px-3 sm:px-4 text-right">Saldo Inicial</th>
              <th className="py-3 px-3 sm:px-4 text-center w-28">Taxa Diária (%)</th>
              <th className="py-3 px-3 sm:px-4 text-right">Rendimento do Dia</th>
              <th className="py-3 px-3 sm:px-4 text-right font-bold text-stone-900">Saldo Final</th>
              <th className="py-3 px-3 sm:px-4 text-right">Lucro Total</th>
              <th className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">Evolução (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredRecords.map((r) => {
              const isLastDay = r.day === 30;
              const isMilestone = r.day % 5 === 0;

              return (
                <tr
                  key={r.day}
                  id={`row-day-${r.day}`}
                  className={`transition-colors hover:bg-stone-50/80 ${
                    isLastDay
                      ? 'bg-emerald-50/70 font-semibold text-emerald-950 border-t-2 border-emerald-300'
                      : isMilestone
                      ? 'bg-stone-50/40'
                      : ''
                  }`}
                >
                  {/* Dia */}
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        isLastDay
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : isMilestone
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {r.day}
                    </span>
                  </td>

                  {/* Saldo Inicial */}
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-600">
                    {formatCurrency(r.initialBalance)}
                  </td>

                  {/* Taxa Diária Editável */}
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <div className="inline-flex items-center relative">
                      <input
                        id={`input-table-rate-day-${r.day}`}
                        type="number"
                        step="0.1"
                        value={r.ratePercent}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          onRateChange(r.day - 1, isNaN(val) ? 0 : val);
                        }}
                        className={`w-20 text-right pr-6 pl-2 py-1 text-xs font-bold border rounded-md shadow-2xs focus:outline-hidden transition-all ${
                          isLastDay
                            ? 'border-emerald-400 bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500'
                            : 'border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                      />
                      <span className="absolute right-2 text-stone-400 text-[11px] font-semibold pointer-events-none">
                        %
                      </span>
                    </div>
                  </td>

                  {/* Rendimento do Dia */}
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-emerald-700 font-medium">
                    +{formatCurrency(r.interestEarned)}
                  </td>

                  {/* Saldo Final */}
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono font-bold text-stone-900">
                    {formatCurrency(r.finalBalance)}
                  </td>

                  {/* Lucro Acumulado */}
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-xs text-stone-600">
                    <span className="font-semibold text-emerald-700">
                      +{formatCurrency(r.cumulativeProfit)}
                    </span>
                  </td>

                  {/* Progresso % acumulado */}
                  <td className="py-2.5 px-3 sm:px-4 text-center hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100/70 text-emerald-800">
                      +{formatPercent(r.growthPercentFromStart, 1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with final total reminder */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">Total ao final do 30º dia:</span>
          <span className="text-emerald-700 font-bold text-sm">
            {records.length > 0 ? formatCurrency(records[records.length - 1].finalBalance) : 'R$ 0,00'}
          </span>
        </div>
        <div>
          <span>Mostrando {filteredRecords.length} de {records.length} dias calculados</span>
        </div>
      </div>
    </section>
  );
};
