import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  QrCode,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=047857&margin=1`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="install-apk-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="install-apk-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-stone-900">
                Instalar no Celular / Gerar APK
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Android & iOS
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Calculadora do Alexandre Penante como aplicativo nativo
            </p>
          </div>
        </div>

        {/* Status de Instalado */}
        {isInstalled && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>O aplicativo já está instalado no seu dispositivo neste momento!</span>
          </div>
        )}

        {/* OPÇÃO 1: INSTALAÇÃO DIRETA (PWA) */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Opção 1: Instalação Direta (Mais Rápida)
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Sem precisar de APK
            </span>
          </div>
          <p className="text-xs text-stone-600 mb-3 leading-relaxed">
            Este app foi transformado em um <strong>PWA (Progressive Web App)</strong>. No celular ele roda como um aplicativo nativo completo, com tela cheia, ícone oficial e funcionamento offline.
          </p>

          {isInstallable ? (
            <button
              id="btn-trigger-pwa-install"
              type="button"
              onClick={handleDirectInstall}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicativo no Dispositivo Agora</span>
            </button>
          ) : (
            <div className="text-xs text-stone-600 bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
              <p className="font-semibold text-stone-800">Como instalar no seu celular:</p>
              <p>• <strong>No Android (Google Chrome):</strong> Toque nos <strong>3 pontinhos</strong> do navegador no topo e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
              <p>• <strong>No iPhone (Safari):</strong> Toque no botão de <strong>Compartilhar</strong> e selecione <strong>"Adicionar à Tela de Início"</strong>.</p>
            </div>
          )}
        </div>

        {/* OPÇÃO 2: GERAR PACOTE APK PARA DOWNLOAD */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              Opção 2: Gerar arquivo .APK de instalação
            </span>
            <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
              Pacote Android
            </span>
          </div>
          <p className="text-xs text-stone-600 mb-3 leading-relaxed">
            Para compilar o arquivo físico <strong>.apk</strong> para distribuir ou instalar manualmente:
          </p>

          <ol className="text-xs text-stone-600 space-y-2 mb-3 list-decimal list-inside bg-white p-3 rounded-lg border border-stone-200">
            <li>Copie o link do aplicativo abaixo.</li>
            <li>Acesse o gerador gratuito e oficial <strong>PWABuilder (da Microsoft)</strong>.</li>
            <li>Cole o link e clique em <strong>Package for Android</strong> para baixar o seu arquivo <strong>.APK / .AAB</strong> compilado!</li>
          </ol>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copiado!' : '1. Copiar Link do App'}</span>
            </button>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>2. Abrir PWABuilder (Gerar APK)</span>
            </a>
          </div>
        </div>

        {/* OPÇÃO 3: QR CODE PARA ABRIR NO CELULAR */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-2xs shrink-0">
            <img
              src={qrCodeUrl}
              alt="QR Code para abrir no celular"
              className="w-24 h-24"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-1">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Abra no Celular com a Câmera</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Aponte a câmera do seu celular para o QR Code para abrir a Calculadora instantaneamente e tocar em "Instalar".
            </p>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
