import React, { useState, useMemo } from 'react';
import { DAYS_COUNT, calculateCompoundDays, calculateSummary } from './utils/calculator';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ControlPanel } from './components/ControlPanel';
import { EvolutionChart } from './components/EvolutionChart';
import { DailyTable } from './components/DailyTable';
import { ActionToolbar } from './components/ActionToolbar';
import { InstallAppModal } from './components/InstallAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Calculator } from 'lucide-react';

export default function App() {
  // Estado principal: Valor inicial e taxas diárias para cada um dos 30 dias
  const [initialAmount, setInitialAmount] = useState<number>(1000);
  const [dailyRates, setDailyRates] = useState<number[]>(() =>
    Array(DAYS_COUNT).fill(1.0)
  );
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Cálculos reativos dos 30 dias e métricas consolidadas
  const records = useMemo(() => {
    return calculateCompoundDays(initialAmount, dailyRates);
  }, [initialAmount, dailyRates]);

  const summary = useMemo(() => {
    return calculateSummary(records, initialAmount);
  }, [records, initialAmount]);

  const handleSingleDayRateChange = (dayIndex: number, newRate: number) => {
    setDailyRates((prev) => {
      const next = [...prev];
      next[dayIndex] = newRate;
      return next;
    });
  };

  const handleReset = () => {
    setInitialAmount(1000);
    setDailyRates(Array(DAYS_COUNT).fill(1.0));
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Cabeçalho com botão para Instalar App / Baixar APK */}
      <Header onOpenInstallModal={() => setIsInstallModalOpen(true)} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Barra de Ações Rápidas (Exportar / WhatsApp / Copiar / Instalar App) */}
        <ActionToolbar
          initialAmount={initialAmount}
          records={records}
          summary={summary}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />

        {/* Cards de Métricas Principais (Valor Final 30 dias, Lucro, Rendimento) */}
        <SummaryCards summary={summary} />

        {/* Painel de Controle (Valor Inicial, Taxa Diária, Edição em Grade) */}
        <ControlPanel
          initialAmount={initialAmount}
          onInitialAmountChange={setInitialAmount}
          dailyRates={dailyRates}
          onDailyRatesChange={setDailyRates}
          onReset={handleReset}
        />

        {/* Gráfico da Curva de Evolução dos 30 Dias */}
        <EvolutionChart
          records={records}
          initialAmount={initialAmount}
        />

        {/* Tabela Detalhada com os 30 Dias e Taxa Editável Linha a Linha */}
        <DailyTable
          records={records}
          onRateChange={handleSingleDayRateChange}
        />
      </main>

      {/* Modal de Instalação e Geração do APK */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Indicador de Status Offline */}
      <OfflineIndicator />

      {/* Rodapé institucional */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-700">Calculadora do Alexandre Penante</span>
            <span>— Todos os 30 dias calculados em juros compostos diários</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(true)}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Baixar App / Gerar APK
            </button>
            <span>•</span>
            <span>Fórmula: M = C × ∏(1 + i_d)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
