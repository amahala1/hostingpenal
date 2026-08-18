import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Globe2, Plus, RefreshCw, Save, Trash2, XCircle } from 'lucide-react';
import { hostingApi } from '../../api/client';

type RecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV' | 'CAA';
type DnsRecord = { name: string; type: RecordType; value: string; ttl: number; priority?: number };

const DEFAULT_RECORD: DnsRecord = { name: '@', type: 'A', value: '', ttl: 300 };

export const RealDnsEditorSection: React.FC = () => {
  const [domain, setDomain] = useState('sitindia.in');
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [zoneText, setZoneText] = useState('');
  const [record, setRecord] = useState<DnsRecord>(DEFAULT_RECORD);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resolver, setResolver] = useState<RecordType>('A');
  const [answers, setAnswers] = useState<string[]>([]);

  const validRecords = useMemo(() => records.filter((item) => item.name && item.value), [records]);

  const loadZone = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await hostingApi.getDnsZone(domain.trim().toLowerCase());
      const text = typeof response === 'string' ? response : '';
      setZoneText(text);
      setMessage('BIND9 zone loaded successfully.');
    } catch (err) {
      setZoneText('');
      setError(err instanceof Error ? err.message : 'Unable to load DNS zone.');
    } finally {
      setLoading(false);
    }
  };

  const saveZone = async () => {
    if (!domain.trim()) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const result = await hostingApi.updateDnsZone(domain.trim().toLowerCase(), validRecords);
      setMessage(`Zone saved and BIND9 reloaded. Serial: ${result.serial}`);
      await loadZone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'DNS zone update failed.');
    } finally {
      setSaving(false);
    }
  };

  const checkResolver = async () => {
    setError('');
    setMessage('');
    try {
      const result = await hostingApi.resolveDns(domain.trim().toLowerCase(), resolver);
      setAnswers(result.answers || []);
      setMessage(`Resolver query completed for ${domain} (${resolver}).`);
    } catch (err) {
      setAnswers([]);
      setError(err instanceof Error ? err.message : 'DNS resolver query failed.');
    }
  };

  useEffect(() => {
    void loadZone();
  }, []);

  const addRecord = () => {
    if (!record.value.trim()) return;
    setRecords((current) => [...current, { ...record, name: record.name.trim() || '@', value: record.value.trim() }]);
    setRecord({ ...DEFAULT_RECORD });
  };

  const removeRecord = (index: number) => setRecords((current) => current.filter((_, itemIndex) => itemIndex !== index));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-sky-600" /> Real DNS Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage the actual BIND9 authoritative zone from the hosting panel.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadZone()} disabled={loading} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-2">
            <RefreshCw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} /> Reload zone
          </button>
          <button onClick={() => void saveZone()} disabled={saving} className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save & Reload BIND9'}
          </button>
        </div>
      </div>

      {(message || error) && (
        <div className={`rounded-xl border p-3 text-sm flex items-center gap-2 ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {error || message}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-xs font-semibold text-slate-600 mb-2">Authoritative zone</label>
        <div className="flex gap-2">
          <input value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-sky-500" placeholder="example.com" />
          <button onClick={() => void loadZone()} className="rounded-xl bg-slate-900 text-white px-4 text-sm font-semibold">Load</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">DNS records</h2>
            <span className="text-xs text-slate-500">{validRecords.length} pending changes</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
            <input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} className="md:col-span-1 rounded-lg border border-slate-200 px-2 py-2 text-sm font-mono" placeholder="@" />
            <select value={record.type} onChange={(e) => setRecord({ ...record, type: e.target.value as RecordType })} className="rounded-lg border border-slate-200 px-2 py-2 text-sm">
              {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA'].map((type) => <option key={type}>{type}</option>)}
            </select>
            <input value={record.value} onChange={(e) => setRecord({ ...record, value: e.target.value })} className="md:col-span-2 rounded-lg border border-slate-200 px-2 py-2 text-sm" placeholder="record value" />
            <input type="number" min={60} max={86400} value={record.ttl} onChange={(e) => setRecord({ ...record, ttl: Number(e.target.value) })} className="rounded-lg border border-slate-200 px-2 py-2 text-sm" />
            {(record.type === 'MX' || record.type === 'SRV') && <input type="number" min={0} max={65535} value={record.priority ?? 10} onChange={(e) => setRecord({ ...record, priority: Number(e.target.value) })} className="rounded-lg border border-slate-200 px-2 py-2 text-sm" placeholder="priority" />}
            <button onClick={addRecord} className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Add</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-500"><th className="py-2">Name</th><th>Type</th><th>Value</th><th>TTL</th><th /></tr></thead>
              <tbody>{records.map((item, index) => <tr key={`${item.name}-${item.type}-${index}`} className="border-b border-slate-50"><td className="py-2 font-mono">{item.name}</td><td>{item.type}</td><td className="font-mono break-all">{item.value}</td><td>{item.ttl}</td><td><button onClick={() => removeRecord(index)} className="text-rose-600"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody>
            </table>
            {!records.length && <div className="py-10 text-center text-sm text-slate-400">Add records, then save the zone.</div>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /><h2 className="font-bold text-slate-900">Live DNS resolver</h2></div>
          <div className="flex gap-2">
            <select value={resolver} onChange={(e) => setResolver(e.target.value as RecordType)} className="rounded-lg border border-slate-200 px-2 py-2 text-sm">{['A','AAAA','CNAME','MX','TXT','NS','CAA','SRV'].map((type) => <option key={type}>{type}</option>)}</select>
            <button onClick={() => void checkResolver()} className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold">Resolve</button>
          </div>
          <div className="rounded-xl bg-slate-950 text-emerald-300 p-4 min-h-28 font-mono text-xs whitespace-pre-wrap">{answers.length ? answers.join('\n') : 'No resolver result yet.'}</div>
          <div className="text-xs text-slate-500">Queries are executed by the backend with <code>dig</code>; the browser does not simulate propagation.</div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-white">Current BIND9 zone</h2><span className="text-xs text-slate-400">read directly from the server</span></div>
        <pre className="overflow-auto max-h-96 text-xs text-emerald-300 font-mono whitespace-pre-wrap">{zoneText || 'Zone file is empty or not created yet.'}</pre>
      </section>
    </div>
  );
};
