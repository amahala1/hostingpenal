import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Network,
  Plus,
  Trash2,
  Edit,
  Globe,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Search,
  Layers,
  X,
} from 'lucide-react';
import { DnsRecord } from '../../types';

export const DnsEditorSection: React.FC = () => {
  const {
    dnsRecords,
    addDnsRecord,
    deleteDnsRecord,
    domains,
    addToast,
    triggerHaptic,
  } = useApp();

  const [selectedDomain, setSelectedDomain] = useState<string>('sitindia.in');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Record Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [recName, setRecName] = useState('');
  const [recType, setRecType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV' | 'CAA'>('A');
  const [recValue, setRecValue] = useState('');
  const [recTtl, setRecTtl] = useState(14400);
  const [recPriority, setRecPriority] = useState(10);

  // BIND Zone Raw modal
  const [showBindModal, setShowBindModal] = useState(false);

  const filteredRecords = dnsRecords.filter((r) => {
    const matchesDomain = r.domain === selectedDomain;
    const matchesType = filterType === 'ALL' || r.type === filterType;
    const matchesQuery = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.value.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesDomain && matchesType && matchesQuery;
  });

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName.trim() || !recValue.trim()) return;

    addDnsRecord({
      domain: selectedDomain,
      name: recName.includes('.') ? recName.trim() : `${recName.trim()}.${selectedDomain}.`,
      type: recType,
      value: recValue.trim(),
      ttl: recTtl,
      priority: recType === 'MX' ? recPriority : undefined,
    });

    setShowAddModal(false);
    setRecName('');
    setRecValue('');
  };

  const generateBindZone = () => {
    const header = `; BIND Zone file for ${selectedDomain}\n$TTL 14400\n@ IN SOA ns1.sitindia.in. hostmaster.sitindia.in. ( 2026081701 10800 3600 604800 300 )\n;\n`;
    const body = dnsRecords
      .filter((r) => r.domain === selectedDomain)
      .map((r) => `${r.name.padEnd(28)} ${r.ttl} IN ${r.type.padEnd(6)} ${r.priority ? r.priority + ' ' : ''}${r.value}`)
      .join('\n');
    return header + body;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-sky-400" />
            <span>Authoritative DNS Zone Editor</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage A, AAAA, CNAME, MX, TXT, SRV, and CAA records with sub-second cluster propagation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBindModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export BIND Zone</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add DNS Record</span>
          </button>
        </div>
      </div>

      {/* Domain Selector & Filter Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Zone Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs font-bold text-sky-300 focus:outline-none"
          >
            {domains.map((d) => (
              <option key={d.id} value={d.domain}>{d.domain}</option>
            ))}
          </select>
        </div>

        {/* Record Type Filters */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['ALL', 'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                filterType === t
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          <input
            type="text"
            placeholder="Search host or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      {/* Child Nameservers & BIND9 DNS Server Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
              <Globe className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Child Nameservers (Glue Records) & BIND9 DNS Engine</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Port 53 Active (TCP/UDP)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Registrar Glue Records point to this VPS. BIND9 authoritatively resolves DNS for <span className="font-mono text-sky-300 font-bold">ns1.sitindia.in</span> & <span className="font-mono text-sky-300 font-bold">ns2.sitindia.in</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-semibold">
              Host IP: 103.174.102.45
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-indigo-500/10 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="text-slate-400 font-medium">Child Nameserver 1</div>
            <div className="font-mono text-sky-400 font-bold">ns1.sitindia.in ➜ 103.174.102.45</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="text-slate-400 font-medium">Child Nameserver 2</div>
            <div className="font-mono text-sky-400 font-bold">ns2.sitindia.in ➜ 103.174.102.45</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="text-slate-400 font-medium">Roundcube Webmail Record</div>
            <div className="font-mono text-purple-400 font-bold">webmail.sitindia.in ➜ 103.174.102.45</div>
          </div>
        </div>
      </div>

      {/* DNS Records Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-white">Zone Records for {selectedDomain}</h2>
          <span className="text-xs text-emerald-400 font-mono">Anycast Nameservers: ns1.sitindia.in / ns2.sitindia.in</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-sans">
                <th className="pb-3">Name / Host</th>
                <th className="pb-3">TTL</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Record Value / Destination</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-white truncate max-w-[220px]" title={r.name}>
                    {r.name}
                  </td>
                  <td className="py-3 text-slate-400">{r.ttl}s</td>
                  <td className="py-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        r.type === 'A'
                          ? 'bg-sky-500/20 text-sky-300'
                          : r.type === 'CNAME'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : r.type === 'MX'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-200 truncate max-w-sm" title={r.value}>
                    {r.value}
                  </td>
                  <td className="py-3 text-slate-400">{r.priority !== undefined ? r.priority : '-'}</td>
                  <td className="py-3 text-right font-sans">
                    <button
                      onClick={() => deleteDnsRecord(r.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add DNS Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Add DNS Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Record Type</label>
                <select
                  value={recType}
                  onChange={(e) => setRecType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                >
                  <option value="A">A (IPv4 Address)</option>
                  <option value="AAAA">AAAA (IPv6 Address)</option>
                  <option value="CNAME">CNAME (Alias)</option>
                  <option value="MX">MX (Mail Exchange)</option>
                  <option value="TXT">TXT (Text Record)</option>
                  <option value="SRV">SRV (Service)</option>
                  <option value="CAA">CAA (Certificate Authority Auth)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Name / Host</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. mail or @ or sub"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-l-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 border border-l-0 border-slate-700 text-slate-400 font-mono text-[11px]">
                    .{selectedDomain}.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target / Value</label>
                <input
                  type="text"
                  placeholder={recType === 'A' ? '103.21.14.88' : recType === 'CNAME' ? 'sitindia.in.' : 'Record value...'}
                  value={recValue}
                  onChange={(e) => setRecValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">TTL (Seconds)</label>
                  <select
                    value={recTtl}
                    onChange={(e) => setRecTtl(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  >
                    <option value={300}>300 (5 mins - Rapid)</option>
                    <option value={3600}>3600 (1 hour)</option>
                    <option value={14400}>14400 (4 hours - Standard)</option>
                    <option value={86400}>86400 (1 day)</option>
                  </select>
                </div>

                {recType === 'MX' && (
                  <div>
                    <label className="block text-slate-300 mb-1">Priority</label>
                    <input
                      type="number"
                      value={recPriority}
                      onChange={(e) => setRecPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BIND Export Modal */}
      {showBindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Raw BIND Zone File ({selectedDomain}.db)</h3>
              <button onClick={() => setShowBindModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={12}
              readOnly
              value={generateBindZone()}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 select-all"
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowBindModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
