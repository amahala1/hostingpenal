import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  User,
  Activity,
  Layers,
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditLogsSection: React.FC = () => {
  const { auditLogs, addToast, triggerHaptic } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSev = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSearch = searchQuery
      ? log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery)
      : true;
    return matchesSev && matchesCat && matchesSearch;
  });

  const exportJson = () => {
    triggerHaptic();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `audit_logs_${Date.now()}.json`);
    a.click();
    addToast({ type: 'success', title: 'Exported Logs', message: 'Downloaded JSON file.' });
  };

  const exportCsv = () => {
    triggerHaptic();
    const headers = 'ID,Timestamp,User,IP,Action,Details,Category,Severity\n';
    const rows = auditLogs.map(
      (l) => `"${l.id}","${l.timestamp}","${l.user}","${l.ip}","${l.action}","${l.details}","${l.category}","${l.severity}"`
    ).join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `audit_logs_${Date.now()}.csv`);
    a.click();
    addToast({ type: 'success', title: 'Exported Logs', message: 'Downloaded CSV file.' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-400" />
            <span>Administrator Activity & Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable forensic trail recording all login events, virtual host modifications, SSL reissues, and root operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportJson}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Filters */}
          <div className="flex items-center gap-1">
            {['ALL', 'info', 'warning', 'security', 'error'].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                  severityFilter === s
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="domain">Domain / Web</option>
            <option value="file">File Manager</option>
            <option value="php">PHP FastCGI</option>
            <option value="database">MySQL / DB</option>
            <option value="ssl">SSL / TLS</option>
            <option value="email">Email Hosting</option>
            <option value="firewall">Firewall / Security</option>
            <option value="backup">Backups</option>
            <option value="system">System Daemon</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, user, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-white">Security Events ({filteredLogs.length})</h2>
          <span className="text-xs text-emerald-400 font-mono">Real-time Stream: Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Operator / User</th>
                <th className="pb-3">Source IP</th>
                <th className="pb-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => {
                const isSec = log.severity === 'security';
                const isErr = log.severity === 'error';
                const isWarn = log.severity === 'warning';
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>

                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          isSec
                            ? 'bg-purple-500/20 text-purple-300'
                            : isErr
                            ? 'bg-rose-500/20 text-rose-300'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase">
                        {log.category}
                      </span>
                    </td>

                    <td className="py-3 font-semibold text-white font-sans">{log.action}</td>
                    <td className="py-3 text-slate-300">{log.user}</td>
                    <td className="py-3 text-slate-400">{log.ip}</td>
                    <td className="py-3 text-slate-300 font-sans text-xs max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
