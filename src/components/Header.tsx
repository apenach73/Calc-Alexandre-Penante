import React from 'react';
import { TrendingUp, Calendar, Sparkles, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstallModal }) => {
  return (
    <header id="app-header" className="border-b border-stone-200 bg-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Calculadora do Alexandre Penante
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> 30 Dias
                </span>
              </div>
              <p className="text-sm text-stone-600 mt-1">
                Simulação e projeção diária de juros compostos com porcentagem personalizada dia a dia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              id="btn-header-install-app"
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Instalar App / Baixar APK</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-stone-600 bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Projeção Exponencial (1 a 30 dias)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
