import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Plus,
  Trash2,
  Lock,
  Unlock,
  ExternalLink,
  Shield,
  FileCode,
  ArrowRightLeft,
  AlertOctagon,
  BarChart3,
  Settings,
  CheckCircle2,
  Folder,
  Eye,
  Edit,
  X,
  Sparkles,
  Server,
  Layers,
  Check,
} from 'lucide-react';
import { WebsiteDomain, DomainRedirect } from '../../types';

export const WebsitesSection: React.FC = () => {
  const {
    domains,
    addDomain,
    addSubdomain,
    deleteDomain,
    updateDomain,
    redirects,
    addRedirect,
    deleteRedirect,
    errorPages,
    updateErrorPage,
    setActiveSection,
    setSelectedDomain,
    issueAutoSsl,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'domains' | 'subdomains' | 'redirects' | 'privacy' | 'error-pages' | 'stats'>('domains');

  // Add Domain Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [domainType, setDomainType] = useState<'main' | 'subdomain' | 'addon' | 'alias'>('addon');
  const [docRoot, setDocRoot] = useState('/home/sitindia/public_html/');
  const [phpVersion, setPhpVersion] = useState('8.3');
  const [forceHttps, setForceHttps] = useState(true);

  // Dedicated Add Subdomain Modal State
  const [showAddSubdomainModal, setShowAddSubdomainModal] = useState(false);
  const [subdomainPrefix, setSubdomainPrefix] = useState('');
  const [parentDomain, setParentDomain] = useState(domains.find((d) => d.type === 'main')?.domain || 'sitindia.in');
  const [subDocRoot, setSubDocRoot] = useState('');
  const [subPhpVersion, setSubPhpVersion] = useState('8.3');
  const [subDnsType, setSubDnsType] = useState<'A' | 'CNAME'>('A');
  const [subDnsTarget, setSubDnsTarget] = useState('103.175.163.45');

  // Add Redirect Modal State
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redDomain, setRedDomain] = useState('sitindia.in');
  const [redSource, setRedSource] = useState('/');
  const [redTarget, setRedTarget] = useState('https://');
  const [redType, setRedType] = useState<'301' | '302'>('301');
  const [redMatchType, setRedMatchType] = useState<'exact' | 'wildcard' | 'regex'>('exact');

  // Error Page Edit Modal
  const [editingErrorPage, setEditingErrorPage] = useState<{ code: number; name: string; content: string } | null>(null);

  const subdomainsList = domains.filter((d) => d.type === 'subdomain');

  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    addDomain({
      domain: domainName.trim().toLowerCase(),
      type: domainType,
      docRoot: docRoot.trim() || `/home/sitindia/public_html/${domainName.trim()}`,
      phpVersion,
      sslStatus: 'active',
      sslIssuer: "Let's Encrypt Authority X3",
      sslExpiry: '2026-11-20',
      forceHttps,
      bandwidthLimitMB: 50000,
      diskLimitMB: 20000,
      directoryPrivacyEnabled: false,
    });

    setShowAddModal(false);
    setDomainName('');
  };

  const handleCreateSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomainPrefix.trim()) {
      addToast({ type: 'error', title: 'Prefix Required', message: 'Please specify a subdomain prefix (e.g. blog, api, portal)' });
      return;
    }

    const fullSubdomain = `${subdomainPrefix.trim().toLowerCase()}.${parentDomain}`;
    const targetDocRoot = subDocRoot.trim() || `/home/sitindia/public_html/${fullSubdomain}`;

    addSubdomain(
      subdomainPrefix.trim().toLowerCase(),
      parentDomain,
      targetDocRoot,
      subPhpVersion,
      subDnsType,
      subDnsType === 'A' ? subDnsTarget : `@`
    );

    setShowAddSubdomainModal(false);
    setSubdomainPrefix('');
    setSubDocRoot('');
  };

  const handleCreateRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redTarget || redTarget === 'https://') return;

    addRedirect({
      domain: redDomain,
      sourcePath: redSource,
      targetUrl: redTarget,
      type: redType,
      matchType: redMatchType,
      status: 'active',
    });

    setShowRedirectModal(false);
    setRedSource('/');
    setRedTarget('https://');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-sky-400" />
            <span>Websites, Domains & Subdomains</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure virtual hosts, automated DNS zone generation, subdomains, document roots, and SSL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddSubdomainModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subdomain</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain / Addon</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('domains')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'domains' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Domains ({domains.length})
        </button>
        <button
          onClick={() => setActiveTab('subdomains')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'subdomains' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Subdomains ({subdomainsList.length})
        </button>
        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'redirects' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Redirects & Rewrites ({redirects.length})
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'privacy' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Directory Privacy (.htpasswd)
        </button>
        <button
          onClick={() => setActiveTab('error-pages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'error-pages' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Error Pages ({errorPages.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'stats' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Traffic & Visitor Stats
        </button>
      </div>

      {/* Tab 1: All Domains & Virtual Hosts List */}
      {activeTab === 'domains' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400">Total Virtual Hosts</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{domains.length}</div>
              <div className="text-[11px] text-sky-400 mt-1">Automatic DNS Zone Synced</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400">Total Bandwidth Today</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {(domains.reduce((acc, d) => acc + d.bandwidthUsedMB, 0) / 1024).toFixed(1)} GB
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Within allocated quota</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400">Total Pageviews Today</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {domains.reduce((acc, d) => acc + d.pageViewsToday, 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-indigo-400 mt-1">Across all web endpoints</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400">SSL Security Status</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">100% Active</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">Auto-Renewing Let's Encrypt</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-white">Configured Domains & Virtual Hosts</h2>
                <p className="text-xs text-slate-400">Every domain includes automatically generated DNS records and SSL.</p>
              </div>
              <button
                onClick={() => setActiveSection('dns')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <span>View DNS Zone Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Domain Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Document Root</th>
                    <th className="pb-3">PHP</th>
                    <th className="pb-3">Force HTTPS</th>
                    <th className="pb-3">DNS Status</th>
                    <th className="pb-3">Disk / Bandwidth</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {domains.map((dom) => (
                    <tr key={dom.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{dom.domain}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Created {dom.createdAt} • SSL: {dom.sslIssuer}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          dom.type === 'main'
                            ? 'bg-amber-500/20 text-amber-300'
                            : dom.type === 'subdomain'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {dom.type}
                        </span>
                      </td>

                      <td className="py-3.5 font-mono text-slate-300">
                        <span className="truncate max-w-[200px] block" title={dom.docRoot}>
                          {dom.docRoot}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <select
                          value={dom.phpVersion}
                          onChange={(e) => updateDomain(dom.id, { phpVersion: e.target.value })}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-indigo-300 font-mono focus:outline-none focus:border-sky-500"
                        >
                          <option value="8.4">PHP 8.4</option>
                          <option value="8.3">PHP 8.3</option>
                          <option value="8.2">PHP 8.2</option>
                          <option value="7.4">PHP 7.4</option>
                        </select>
                      </td>

                      <td className="py-3.5">
                        <button
                          onClick={() => {
                            updateDomain(dom.id, { forceHttps: !dom.forceHttps });
                            addToast({
                              type: 'info',
                              title: 'HTTPS Redirection Toggled',
                              message: `${dom.domain} force HTTPS is now ${!dom.forceHttps ? 'ON' : 'OFF'}`,
                            });
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                            dom.forceHttps
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {dom.forceHttps ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3" />}
                          <span>{dom.forceHttps ? 'Enforced' : 'HTTP/HTTPS'}</span>
                        </button>
                      </td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" /> Auto DNS
                        </span>
                      </td>

                      <td className="py-3.5 font-mono text-[11px] text-slate-300">
                        <div>Disk: {(dom.diskUsedMB / 1024).toFixed(2)} GB</div>
                        <div className="text-slate-400">Traffic: {(dom.bandwidthUsedMB / 1024).toFixed(1)} GB</div>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDomain(dom.domain);
                              setActiveSection('file-manager');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Browse File Manager"
                          >
                            <Folder className="w-4 h-4 text-amber-400" />
                          </button>
                          {dom.type !== 'main' && (
                            <button
                              onClick={() => deleteDomain(dom.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300"
                              title="Delete Domain"
                            >
                              <Trash2 className="w-4 h-4 text-rose-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dedicated Subdomains Management */}
      {activeTab === 'subdomains' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Configured Subdomains</span>
              </h2>
              <p className="text-xs text-slate-400">
                Subdomains automatically create either an <strong className="text-slate-200">A Record</strong> or <strong className="text-slate-200">CNAME Record</strong> in your DNS zone.
              </p>
            </div>
            <button
              onClick={() => setShowAddSubdomainModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Subdomain</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Subdomain</th>
                  <th className="pb-3">Document Root</th>
                  <th className="pb-3">PHP Version</th>
                  <th className="pb-3">SSL Status</th>
                  <th className="pb-3">DNS Automation</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subdomainsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      No subdomains created yet. Click "Create Subdomain" above to get started.
                    </td>
                  </tr>
                ) : (
                  subdomainsList.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-bold text-white font-mono flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{sub.domain}</span>
                      </td>

                      <td className="py-3 font-mono text-slate-300 truncate max-w-xs">{sub.docRoot}</td>

                      <td className="py-3 font-mono text-indigo-300">PHP {sub.phpVersion}</td>

                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Let's Encrypt SSL Active
                        </span>
                      </td>

                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                          A / CNAME Synced
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDomain(sub.domain);
                              setActiveSection('file-manager');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Browse File Manager"
                          >
                            <Folder className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() => deleteDomain(sub.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                            title="Delete Subdomain"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Redirects & Rewrites */}
      {activeTab === 'redirects' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">URL Redirects & Forwarders</h2>
              <p className="text-xs text-slate-400">Manage 301 Permanent and 302 Temporary URL redirections</p>
            </div>
            <button
              onClick={() => setShowRedirectModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Redirect</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Source Path</th>
                  <th className="pb-3">Destination URL</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Match</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {redirects.map((red) => (
                  <tr key={red.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-200">{red.domain}</td>
                    <td className="py-3 font-mono text-amber-300">{red.sourcePath}</td>
                    <td className="py-3 font-mono text-sky-300 truncate max-w-xs">{red.targetUrl}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${red.type === '301' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {red.type} {red.type === '301' ? 'Permanent' : 'Temporary'}
                      </span>
                    </td>
                    <td className="py-3 uppercase text-[10px] text-slate-400">{red.matchType}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => deleteRedirect(red.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                        title="Delete Redirect"
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
      )}

      {/* Tab 4: Directory Privacy */}
      {activeTab === 'privacy' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Directory Privacy (.htpasswd Protection)</h2>
            <p className="text-xs text-slate-400">
              Protect web folders by requiring a username and password before visitors can access contents.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { path: '/home/sitindia/public_html/admin', protected: true, domain: 'sitindia.in', userCount: 2 },
              { path: '/home/sitindia/public_html/api', protected: true, domain: 'api.sitindia.in', userCount: 4 },
              { path: '/home/sitindia/staging', protected: true, domain: 'staging.sitindia.in', userCount: 3 },
              { path: '/home/sitindia/public_html/shop', protected: false, domain: 'shop.sitindia.in', userCount: 0 },
            ].map((dir, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${dir.protected ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-xs text-white">{dir.path}</div>
                    <div className="text-[11px] text-slate-400">
                      Domain: {dir.domain} • {dir.protected ? `Protected with ${dir.userCount} authorized users` : 'Public access allowed'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Directory Privacy Updated',
                      message: `Updated htpasswd authentication for ${dir.path}`,
                    });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    dir.protected ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {dir.protected ? 'Password Active' : 'Enable Protection'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Error Pages */}
      {activeTab === 'error-pages' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Custom HTTP Error Pages</h2>
            <p className="text-xs text-slate-400">
              Customize response templates for 400, 401, 403, 404, 500, 502, and 503 server errors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {errorPages.map((ep) => (
              <div key={ep.code} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      HTTP {ep.code}
                    </span>
                    <span className="font-semibold text-xs text-white">{ep.name}</span>
                  </div>
                  <button
                    onClick={() => setEditingErrorPage(ep)}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Template
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 line-clamp-3">
                  {ep.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Domain Modal with DNS Automation Notice */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Create New Domain Virtual Host</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated DNS records will be generated in your zone.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain Name</label>
                <input
                  type="text"
                  placeholder="e.g. mynewwebsite.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain Type</label>
                  <select
                    value={domainType}
                    onChange={(e) => setDomainType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="addon">Addon Domain</option>
                    <option value="alias">Domain Alias / Parked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PHP Version</label>
                  <select
                    value={phpVersion}
                    onChange={(e) => setPhpVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:border-sky-500 focus:outline-none"
                  >
                    <option value="8.4">PHP 8.4 (Latest)</option>
                    <option value="8.3">PHP 8.3 (Default)</option>
                    <option value="8.2">PHP 8.2</option>
                    <option value="7.4">PHP 7.4 (Legacy)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Root Directory</label>
                <input
                  type="text"
                  value={docRoot}
                  onChange={(e) => setDocRoot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Automatic DNS Notice Banner */}
              <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-200 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Automatic DNS Records Generation</span>
                </div>
                <p className="text-sky-300/80 leading-relaxed">
                  Upon creation, 10 DNS records (A @, CNAME www, MX, SPF, DMARC, DKIM, ftp, mail) will be automatically provisioned in your DNS Zone.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="forceHttpsCheck"
                  checked={forceHttps}
                  onChange={(e) => setForceHttps(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="forceHttpsCheck" className="text-slate-300">
                  Automatically issue Let's Encrypt SSL & Force HTTPS
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md"
                >
                  Provision Domain & DNS Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subdomain Dedicated Modal with DNS Type selection */}
      {showAddSubdomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Create Subdomain & DNS Record</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Subdomain will automatically generate an A or CNAME DNS record.
                </p>
              </div>
              <button onClick={() => setShowAddSubdomainModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubdomain} className="space-y-4 text-xs">
              {/* Subdomain and Parent Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subdomain Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. blog, api, shop"
                    value={subdomainPrefix}
                    onChange={(e) => setSubdomainPrefix(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parent Domain</label>
                  <select
                    value={parentDomain}
                    onChange={(e) => setParentDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.domain}>{d.domain}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Preview */}
              {subdomainPrefix && (
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Full Subdomain URL: <strong>{subdomainPrefix.toLowerCase()}.{parentDomain}</strong></span>
                </div>
              )}

              {/* DNS Record Automation Selection */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-slate-200 flex items-center justify-between">
                  <span>Automatic DNS Record Type</span>
                  <span className="text-[10px] text-slate-400 font-normal">Created in DNS Zone immediately</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    subDnsType === 'A' ? 'bg-indigo-500/20 border-indigo-500/60 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="subDnsType"
                      checked={subDnsType === 'A'}
                      onChange={() => setSubDnsType('A')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-xs">A Record</div>
                      <div className="text-[10px] text-slate-400">Points to IP Address</div>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    subDnsType === 'CNAME' ? 'bg-indigo-500/20 border-indigo-500/60 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="subDnsType"
                      checked={subDnsType === 'CNAME'}
                      onChange={() => setSubDnsType('CNAME')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-xs">CNAME Record</div>
                      <div className="text-[10px] text-slate-400">Alias to root domain</div>
                    </div>
                  </label>
                </div>

                {subDnsType === 'A' && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Target IPv4 Address</label>
                    <input
                      type="text"
                      value={subDnsTarget}
                      onChange={(e) => setSubDnsTarget(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      placeholder="103.175.163.45"
                    />
                  </div>
                )}
              </div>

              {/* PHP Version & Document Root */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PHP Version</label>
                  <select
                    value={subPhpVersion}
                    onChange={(e) => setSubPhpVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="8.4">PHP 8.4</option>
                    <option value="8.3">PHP 8.3 (Default)</option>
                    <option value="8.2">PHP 8.2</option>
                    <option value="7.4">PHP 7.4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Document Root</label>
                  <input
                    type="text"
                    placeholder={`/home/sitindia/public_html/${subdomainPrefix ? `${subdomainPrefix}.${parentDomain}` : 'subdomain'}`}
                    value={subDocRoot}
                    onChange={(e) => setSubDocRoot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubdomainModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Create Subdomain & DNS Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Redirect Modal */}
      {showRedirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Create URL Redirect</h3>
              <button onClick={() => setShowRedirectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRedirect} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain</label>
                <select
                  value={redDomain}
                  onChange={(e) => setRedDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.domain}>{d.domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Source Path</label>
                <input
                  type="text"
                  placeholder="/old-path or /blog/*"
                  value={redSource}
                  onChange={(e) => setRedSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target URL</label>
                <input
                  type="url"
                  placeholder="https://sitindia.in/new-path"
                  value={redTarget}
                  onChange={(e) => setRedTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={redType}
                    onChange={(e) => setRedType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    <option value="301">301 Permanent</option>
                    <option value="302">302 Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Match Rule</label>
                  <select
                    value={redMatchType}
                    onChange={(e) => setRedMatchType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    <option value="exact">Exact Match</option>
                    <option value="wildcard">Wildcard (*)</option>
                    <option value="regex">Regular Expression</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRedirectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Redirect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Error Page Modal */}
      {editingErrorPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <span>Customize Error Page {editingErrorPage.code} ({editingErrorPage.name})</span>
              </h3>
              <button onClick={() => setEditingErrorPage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={12}
              value={editingErrorPage.content}
              onChange={(e) => setEditingErrorPage({ ...editingErrorPage, content: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setEditingErrorPage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateErrorPage(editingErrorPage.code, editingErrorPage.content);
                  setEditingErrorPage(null);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                Save Error Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
