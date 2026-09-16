import React, { useState } from 'react';
import { DayRecord, CalculationSummary } from '../types';
import { exportToCSV, generateWhatsAppSummary } from '../utils/calculator';
import { Download, Printer, Copy, Check, MessageSquare, Smartphone } from 'lucide-react';

interface ActionToolbarProps {
  initialAmount: number;
  records: DayRecord[];
  summary: CalculationSummary;
  onOpenInstallModal: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  initialAmount,
  records,
  summary,
  onOpenInstallModal,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopySummary = async () => {
    const text = generateWhatsAppSummary(initialAmount, records, summary);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppSummary(initialAmount, records, summary);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    exportToCSV(records, initialAmount);
  };

  return (
    <div id="action-toolbar" className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-xs">
      <div className="flex items-center gap-2">
        <button
          id="btn-toolbar-install-app"
          type="button"
          onClick={onOpenInstallModal}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar App / APK</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copiar Resumo */}
        <button
          id="btn-copy-summary"
          type="button"
          onClick={handleCopySummary}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
          title="Copiar relatório formatado para a área de transferência"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
        </button>

        {/* WhatsApp */}
        <button
          id="btn-share-whatsapp"
          type="button"
          onClick={handleWhatsAppShare}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          title="Enviar resumo dos 30 dias pelo WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        {/* Baixar CSV */}
        <button
          id="btn-export-csv"
          type="button"
          onClick={handleDownloadCSV}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          title="Exportar todos os 30 dias em planilha CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar CSV</span>
        </button>

        {/* Imprimir */}
        <button
          id="btn-print-report"
          type="button"
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          title="Imprimir ou Salvar em PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Imprimir / PDF</span>
        </button>
      </div>
    </div>
  );
};
