import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, ExternalLink, CheckCircle2, Loader2, RefreshCw, ShieldAlert, Sparkles, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveSshTerminalModal: React.FC = () => {
  const { installTerminalState, closeInstallTerminal, addToast, triggerHaptic } = useApp();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (installTerminalState.isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [installTerminalState.logs, installTerminalState.isOpen]);

  if (!installTerminalState.isOpen) return null;

  const handleCopyLogs = () => {
    triggerHaptic();
    const text = installTerminalState.logs.join('\n');
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Terminal Logs Copied',
      message: 'All live SSH installation output copied to clipboard.',
    });
  };

  const handleLaunchExternal = () => {
    if (installTerminalState.launchUrl) {
      triggerHaptic();
      window.open(installTerminalState.launchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Terminal Title Bar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>SSH Live Terminal: {installTerminalState.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {installTerminalState.status === 'installing' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span>Installing...</span>
              </span>
            )}

            {installTerminalState.status === 'completed' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Installed & Active</span>
              </span>
            )}

            <button
              onClick={handleCopyLogs}
              title="Copy Logs"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={closeInstallTerminal}
              disabled={installTerminalState.status === 'installing'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 bg-slate-950 text-slate-200 font-mono text-xs overflow-y-auto space-y-1.5 flex-1 min-h-[300px] max-h-[500px]">
          <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-900">
            Linux sitindia-vps-node1 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64
            <br />
            Invoking automated APT & Nginx deployment daemon for package: <span className="text-amber-400 font-bold">{installTerminalState.packageName}</span>
          </div>

          {installTerminalState.logs.map((log, idx) => {
            const isCommand = log.startsWith('sitindia@') || log.startsWith('root@') || log.startsWith('$');
            const isSuccess = log.includes('[SUCCESS]') || log.includes('OK') || log.includes('100%') || log.includes('complete');
            const isLink = log.includes('[AUTOMATIC LINK UPDATED]');

            return (
              <div
                key={idx}
                className={`leading-relaxed whitespace-pre-wrap ${
                  isCommand
                    ? 'text-sky-300 font-bold pt-1'
                    : isSuccess
                    ? 'text-emerald-400 font-semibold'
                    : isLink
                    ? 'text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 font-bold my-1'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })}

          <div ref={logsEndRef} />
        </div>

        {/* Live Automatic Link Bar / Launch Action Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-medium">
            {installTerminalState.status === 'installing' ? (
              <div className="flex items-center gap-2 text-amber-400 font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing live SSH script... Please do not close browser.</span>
              </div>
            ) : installTerminalState.launchUrl ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-white">Live URL Updated: </span>
                  <span className="font-mono text-emerald-400 underline">{installTerminalState.launchUrl}</span>
                </div>
              </div>
            ) : (
              <span className="text-emerald-400 font-bold">Installation finished successfully. Service operational.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {installTerminalState.status === 'completed' && installTerminalState.launchUrl && (
              <button
                onClick={handleLaunchExternal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
              >
                <span>{installTerminalState.launchText || 'Open in New Tab'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={closeInstallTerminal}
              disabled={installTerminalState.status === 'installing'}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40"
            >
              Close Terminal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
