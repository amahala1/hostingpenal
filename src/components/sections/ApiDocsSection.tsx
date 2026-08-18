import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Key,
  Copy,
  Check,
  Play,
  Server,
  Layers,
  Globe,
  Database,
  Shield,
  FileCode,
} from 'lucide-react';

export const ApiDocsSection: React.FC = () => {
  const { domains, metrics, databases, addToast, triggerHaptic } = useApp();

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('get-domains');
  const [bearerToken, setBearerToken] = useState('sit_live_sec_994a8e8182b8120c19');
  const [copied, setCopied] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);

  const endpoints = [
    {
      id: 'get-domains',
      method: 'GET',
      path: '/api/v2/domains',
      summary: 'List all virtual hosts & document roots',
      sampleResponse: {
        status: 'success',
        count: domains.length,
        data: domains.map((d) => ({
          domain: d.domain,
          type: d.type,
          docRoot: d.docRoot,
          phpVersion: d.phpVersion,
          sslStatus: d.sslStatus,
        })),
      },
    },
    {
      id: 'get-metrics',
      method: 'GET',
      path: '/api/v2/system/telemetry',
      summary: 'Real-time CPU, RAM and disk usage',
      sampleResponse: {
        status: 'success',
        timestamp: new Date().toISOString(),
        metrics: {
          cpuUsage: metrics.cpuUsage,
          loadAverage: metrics.loadAverage,
          memoryUsedMB: metrics.memoryUsedMB,
          memoryTotalMB: metrics.memoryTotalMB,
          diskUsedGB: metrics.diskUsedGB,
          diskTotalGB: metrics.diskTotalGB,
        },
      },
    },
    {
      id: 'get-databases',
      method: 'GET',
      path: '/api/v2/databases',
      summary: 'List active MySQL databases and quotas',
      sampleResponse: {
        status: 'success',
        databases: databases.map((d) => ({
          name: d.name,
          sizeMB: d.sizeMB,
          collation: d.collation,
          tables: d.tableCount,
        })),
      },
    },
    {
      id: 'post-autossl',
      method: 'POST',
      path: '/api/v2/ssl/autossl/renew',
      summary: 'Trigger Let\'s Encrypt certificate issuance',
      sampleResponse: {
        status: 'queued',
        jobId: 'job_ssl_881923',
        message: 'AutoSSL verification order created for domain sitindia.in',
      },
    },
  ];

  const activeEp = endpoints.find((e) => e.id === selectedEndpoint) || endpoints[0];

  const handleRunSandbox = () => {
    triggerHaptic();
    setSandboxResponse(JSON.stringify(activeEp.sampleResponse, null, 2));
    addToast({ type: 'success', title: 'API 200 OK', message: `${activeEp.method} ${activeEp.path}` });
  };

  const copyToken = () => {
    navigator.clipboard.writeText(bearerToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'info', title: 'API Key Copied' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Code className="w-6 h-6 text-emerald-400" />
            <span>REST API & Automation SDK</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programmatic control for WHMCS provisioning, CI/CD deployment pipelines, and remote cluster orchestration.
          </p>
        </div>

        {/* API Key Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Key className="w-4 h-4" />
          </div>
          <div className="font-mono text-xs text-slate-300">
            sit_live_sec_...
          </div>
          <button
            onClick={copyToken}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy API Token"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoint Explorer & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Endpoints Menu */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Available Endpoints
          </div>

          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setSelectedEndpoint(ep.id);
                setSandboxResponse(null);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedEndpoint === ep.id
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ep.method === 'GET' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs text-slate-200 truncate">{ep.path}</span>
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</div>
            </button>
          ))}
        </div>

        {/* Right 2 Cols: Details & Sandbox */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    activeEp.method === 'GET' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {activeEp.method}
                </span>
                <span className="font-mono text-sm font-bold text-white">{activeEp.path}</span>
              </div>

              <button
                onClick={handleRunSandbox}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Send Test Request</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">{activeEp.summary}</p>

            {/* cURL snippet */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-300">cURL Example:</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 select-all overflow-x-auto">
                curl -X {activeEp.method} https://sitindia.in{activeEp.path} \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer {bearerToken}" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json"
              </div>
            </div>

            {/* Response Area */}
            {sandboxResponse && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                  <span>HTTP/1.1 200 OK (application/json)</span>
                  <span className="font-mono text-slate-400">Response Time: 18ms</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-72">
                  {sandboxResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
