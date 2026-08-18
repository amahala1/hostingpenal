import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, ExternalLink, Maximize2, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallProgressWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { installTerminalState, setPhpMyAdminModalOpen, addToast, triggerHaptic } = useApp();
  const [logsExpanded, setLogsExpanded] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [installTerminalState.logs]);

  if (!installTerminalState.isOpen && installTerminalState.status === 'idle') {
    return null;
  }

  const logs = installTerminalState.logs || [];
  const latestLog = logs.length > 0 ? logs[logs.length - 1] : 'Initializing installation script...';
  const isInstalling = installTerminalState.status === 'installing';
  const isCompleted = installTerminalState.status === 'completed';

  // Calculate percentage based on log steps
  const totalStepsEstimated = 18;
  const currentStep = Math.min(logs.length, totalStepsEstimated);
  const progressPercent = isCompleted ? 100 : Math.round((currentStep / totalStepsEstimated) * 100);

  return (
    <div className={`ha-card border-2 transition-all ${
      isCompleted
        ? 'border-emerald-500/40 bg-slate-900 text-white shadow-xl shadow-emerald-500/10'
        : 'border-amber-500/50 bg-slate-900 text-white shadow-xl shadow-amber-500/10'
    } p-3.5 space-y-3 rounded-2xl overflow-hidden my-2`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 truncate">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
            isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {isInstalling ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-extrabold text-xs text-white truncate">
                {installTerminalState.title || 'Server Installation Script'}
              </span>
              <span className={`ha-badge text-[9px] py-0 px-1.5 font-bold uppercase ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isInstalling ? 'Installing...' : 'Ready'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
              {isInstalling ? 'Executing bash installer script' : 'Installed on Node IN-DEL-01'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLogsExpanded(!logsExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[11px]"
            title={logsExpanded ? 'Collapse Logs' : 'Expand Logs'}
          >
            {logsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-400">Progress:</span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 shadow-sm shadow-amber-500/50'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Real-time Streaming Logs Terminal Box */}
      {logsExpanded && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-amber-400" />
              <span>Real-Time Installer Stream Log:</span>
            </span>
            <span className="text-[9px] text-slate-500">{logs.length} events</span>
          </div>

          <div
            ref={logContainerRef}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[10px] leading-relaxed max-h-28 overflow-y-auto space-y-1 text-slate-300 shadow-inner"
          >
            {logs.map((log, index) => {
              const isOk = log.includes('[OK]') || log.includes('Done') || log.includes('SUCCESS');
              const isCmd = log.includes('sudo') || log.includes('apt-get') || log.includes('systemctl');
              return (
                <div
                  key={index}
                  className={`break-all ${
                    isOk ? 'text-emerald-400 font-semibold' : isCmd ? 'text-amber-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none me-1.5">&gt;</span>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer Button if completed */}
      {isCompleted && installTerminalState.launchUrl && (
        <div className="pt-1">
          <a
            href={installTerminalState.launchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{installTerminalState.launchText || 'Launch Installed Application'}</span>
          </a>
        </div>
      )}
    </div>
  );
};
