import React from 'react';
import { CalculationSummary } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { Landmark, ArrowUpRight, DollarSign, Percent, Award, Gauge } from 'lucide-react';

interface SummaryCardsProps {
  summary: CalculationSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <section id="summary-section" aria-label="Resumo dos 30 Dias" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Principal: Valor Total Final */}
        <div
          id="card-total-final"
          className="bg-emerald-900 text-white rounded-xl p-5 shadow-xs border border-emerald-800 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between text-emerald-200 text-xs font-medium uppercase tracking-wider mb-2">
              <span>Valor Total (30º Dia)</span>
              <DollarSign className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              {formatCurrency(summary.finalAmount)}
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              Saldo acumulado após os 30 dias
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-100">
            <span>Multiplicador:</span>
            <span className="font-bold text-sm text-emerald-300">
              {summary.capitalMultiplier.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* Card Lucro Total */}
        <div
          id="card-lucro-total"
          className="bg-white rounded-xl p-5 shadow-xs border border-stone-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-2">
              <span>Rendimento Total (Juros)</span>
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 mb-1">
              +{formatCurrency(summary.totalProfit)}
            </div>
            <div className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              +{formatPercent(summary.totalGrowthPercent)} sobre o inicial
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Puro ganho de juros</span>
            <span className="font-semibold text-stone-700">Compostos</span>
          </div>
        </div>

        {/* Card Valor Inicial */}
        <div
          id="card-valor-inicial"
          className="bg-white rounded-xl p-5 shadow-xs border border-stone-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-2">
              <span>Valor Inicial Aportado</span>
              <span className="p-1 rounded-md bg-stone-100 text-stone-600">
                <Landmark className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-1">
              {formatCurrency(summary.initialAmount)}
            </div>
            <p className="text-xs text-stone-500">
              Capital base do 1º dia
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Parcela do final:</span>
            <span className="font-semibold text-stone-700">
              {summary.finalAmount > 0
                ? ((summary.initialAmount / summary.finalAmount) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>

        {/* Card Média Diária & Melhor Dia */}
        <div
          id="card-estatisticas"
          className="bg-white rounded-xl p-5 shadow-xs border border-stone-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-2">
              <span>Média Diária & Recorde</span>
              <span className="p-1 rounded-md bg-amber-50 text-amber-700">
                <Gauge className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-1">
              {formatPercent(summary.averageDailyRate)}
              <span className="text-xs font-normal text-stone-500 ml-1">/dia</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Melhor dia: <strong className="text-stone-800">Dia {summary.bestDayProfit.day}</strong> ({formatCurrency(summary.bestDayProfit.profit)})
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Período total</span>
            <span className="font-semibold text-stone-700">30 Dias Corridos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
