import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Cpu,
  Server,
  RefreshCw,
  Play,
  Square,
  RotateCcw,
  Zap,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
} from 'lucide-react';

export const ServerMetricsSection: React.FC = () => {
  const {
    metrics,
    metricsHistory,
    services,
    restartService,
    addToast,
    triggerHaptic,
  } = useApp();

  const [filterService, setFilterService] = useState('ALL');

  // Simulated active processes
  const processes = [
    { pid: 1042, name: 'php-fpm: pool sitindia.in', user: 'sitindia', cpu: 4.2, memMB: 184, state: 'Running' },
    { pid: 1043, name: 'php-fpm: pool sitindia.in', user: 'sitindia', cpu: 3.8, memMB: 172, state: 'Running' },
    { pid: 890, name: 'mysqld --daemonize', user: 'mysql', cpu: 2.1, memMB: 620, state: 'Running' },
    { pid: 712, name: 'nginx: worker process', user: 'www-data', cpu: 1.5, memMB: 48, state: 'Running' },
    { pid: 713, name: 'nginx: worker process', user: 'www-data', cpu: 1.2, memMB: 46, state: 'Running' },
    { pid: 1120, name: 'redis-server *:6379', user: 'redis', cpu: 0.4, memMB: 78, state: 'Running' },
    { pid: 1405, name: 'dovecot/imap', user: 'dovecot', cpu: 0.2, memMB: 34, state: 'Running' },
    { pid: 1420, name: 'spamd child', user: 'spamd', cpu: 0.1, memMB: 92, state: 'Running' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-sky-400" />
            <span>Real-time Telemetry & System Daemons</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live CPU, RAM, I/O monitoring, daemon service controllers, and active process tree.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Polling Interval: 3s
          </span>
        </div>
      </div>

      {/* Real-time Charts / Metric Sparks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPU Graph */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>CPU Utilization History</span>
            </span>
            <span className="font-mono text-xl font-bold text-sky-400">{metrics.cpuUsage}%</span>
          </div>

          <div className="h-32 flex items-end gap-1.5 pt-4 pb-1 px-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {metricsHistory.map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t transition-all duration-300 group-hover:from-sky-400 group-hover:to-sky-200"
                  style={{ height: `${Math.max(8, pt.cpu)}%` }}
                />
                <div className="hidden group-hover:block absolute -top-7 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-white font-mono shadow-md whitespace-nowrap z-20">
                  {pt.cpu}% at {pt.time}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>60 seconds ago</span>
            <span>Now (Live)</span>
          </div>
        </div>

        {/* RAM Graph */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Memory (RAM) Allocation</span>
            </span>
            <span className="font-mono text-xl font-bold text-indigo-400">
              {(metrics.memoryUsedMB / 1024).toFixed(1)} / {(metrics.memoryTotalMB / 1024).toFixed(0)} GB
            </span>
          </div>

          <div className="h-32 flex items-end gap-1.5 pt-4 pb-1 px-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {metricsHistory.map((pt, i) => {
              const ramVal = (pt as any).ram ?? (pt as any).mem ?? 2048;
              const memPct = (ramVal / metrics.memoryTotalMB) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-300"
                    style={{ height: `${Math.max(8, memPct)}%` }}
                  />
                  <div className="hidden group-hover:block absolute -top-7 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-white font-mono shadow-md whitespace-nowrap z-20">
                    {(ramVal / 1024).toFixed(1)} GB at {pt.time}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>60 seconds ago</span>
            <span>Now (Live)</span>
          </div>
        </div>
      </div>

      {/* System Daemon Services Controller */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-white">System Daemons & Background Services</h2>
            <p className="text-xs text-slate-400">Manage Nginx, MySQL, PHP-FPM, Redis, Dovecot, and Postfix</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">All 6 Core Services Operational</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((srv) => (
            <div
              key={srv.name}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{srv.displayName}</div>
                  <div className="font-mono text-[11px] text-slate-400">{srv.name} • Port {srv.port}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                  RUNNING
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800/60 pt-2.5">
                <span>RAM: {srv.memoryMB} MB</span>
                <span>Uptime: {srv.uptime}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    triggerHaptic();
                    restartService(srv.name);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Active Processes Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-white">Process Tree & Resource Consumers</h2>
            <p className="text-xs text-slate-400">Equivalent to Linux htop task monitor</p>
          </div>
          <span className="text-xs font-mono text-slate-400">8 active worker threads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-sans">
                <th className="pb-3">PID</th>
                <th className="pb-3">Process Command</th>
                <th className="pb-3">User</th>
                <th className="pb-3">CPU %</th>
                <th className="pb-3">Memory (RSS)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {processes.map((proc) => (
                <tr key={proc.pid} className="hover:bg-slate-800/40">
                  <td className="py-2.5 text-sky-300 font-bold">{proc.pid}</td>
                  <td className="py-2.5 text-white font-medium">{proc.name}</td>
                  <td className="py-2.5 text-slate-400">{proc.user}</td>
                  <td className="py-2.5 text-slate-200">{proc.cpu}%</td>
                  <td className="py-2.5 text-slate-300">{proc.memMB} MB</td>
                  <td className="py-2.5">
                    <span className="text-emerald-400">{proc.state}</span>
                  </td>
                  <td className="py-2.5 text-right font-sans">
                    <button
                      onClick={() => {
                        addToast({
                          type: 'info',
                          title: `Process ${proc.pid} Signaled`,
                          message: `Sent SIGTERM to ${proc.name}`,
                        });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-900/50 text-rose-400 text-[11px]"
                    >
                      Kill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
