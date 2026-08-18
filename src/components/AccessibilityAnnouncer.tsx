import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const AccessibilityAnnouncer: React.FC = () => {
  const { screenReaderAnnouncement } = useApp();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="screen-reader-live-announcer"
    >
      {screenReaderAnnouncement}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4"
      aria-label="Notifications"
    >
      {(toasts || []).map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (t.type) {
            case 'success':
              return 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100';
            case 'warning':
              return 'border-amber-500/30 bg-amber-950/90 text-amber-100';
            case 'error':
              return 'border-rose-500/30 bg-rose-950/90 text-rose-100';
            case 'info':
            default:
              return 'border-sky-500/30 bg-slate-900/95 text-sky-100';
          }
        };

        return (
          <div
            key={t.id}
            id={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight text-white">{t.title}</div>
              {t.message && <div className="text-xs mt-1 text-slate-300 leading-normal">{t.message}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
