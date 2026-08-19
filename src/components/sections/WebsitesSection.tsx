import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { hostingApi } from '../../api/client';
import { Globe, Plus, Trash2, Lock, Unlock, ExternalLink, Shield, FileCode, ArrowRightLeft, AlertOctagon, BarChart3, Settings, CheckCircle2, Folder, Eye, Edit, X, Sparkles, Server, Layers, Check } from 'lucide-react';
import { WebsiteDomain, DomainRedirect } from '../../types';

export const WebsitesSection: React.FC = () => {
  const { domains, addDomain, addSubdomain, deleteDomain, updateDomain, redirects, addRedirect, deleteRedirect, errorPages, updateErrorPage, setActiveSection, setSelectedDomain, issueAutoSsl, addToast, triggerHaptic, networkTelemetry } = useApp();
  const [activeTab, setActiveTab] = useState<'domains' | 'subdomains' | 'redirects' | 'privacy' | 'error-pages' | 'stats'>('domains');
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [domainType, setDomainType] = useState<'main' | 'subdomain' | 'addon' | 'alias'>('addon');
  const [docRoot, setDocRoot] = useState('/home/sitindia/public_html/');
  const [phpVersion, setPhpVersion] = useState('8.3');
  const [forceHttps, setForceHttps] = useState(true);
  const [issueSsl, setIssueSsl] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [showAddSubdomainModal, setShowAddSubdomainModal] = useState(false);
  const [subdomainPrefix, setSubdomainPrefix] = useState('');
  const [parentDomain, setParentDomain] = useState(domains.find((d) => d.type === 'main')?.domain || 'sitindia.in');
  const [subDocRoot, setSubDocRoot] = useState('');
  const [subPhpVersion, setSubPhpVersion] = useState('8.3');
  const [subDnsType, setSubDnsType] = useState<'A' | 'CNAME'>('A');
  const [subDnsTarget, setSubDnsTarget] = useState('');
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redDomain, setRedDomain] = useState('sitindia.in');
  const [redSource, setRedSource] = useState('/');
  const [redTarget, setRedTarget] = useState('https://');
  const [redType, setRedType] = useState<'301' | '302'>('301');
  const [redMatchType, setRedMatchType] = useState<'exact' | 'wildcard' | 'regex'>('exact');
  const [editingErrorPage, setEditingErrorPage] = useState<{ code: number; name: string; content: string } | null>(null);

  const subdomainsList = domains.filter((d) => d.type === 'subdomain');

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = domainName.trim().toLowerCase();
    if (!domain || provisioning) return;
    setProvisioning(true);
    addToast({ type: 'info', title: 'Provisioning domain', message: `${domain}: creating Nginx, DNS and SSL configuration...` });
    try {
      const result = await hostingApi.provisionDomain({ domain, username: 'sitindia', phpSocket: `/run/php/php${phpVersion}-fpm.sock`, serverIp: networkTelemetry.publicIp, issueSsl: issueSsl && forceHttps });
      if (!result.success) throw new Error(result.message || 'Domain provisioning failed');
      const sslStatus = result.ssl?.status === 'active' ? 'active' : 'pending';
      addDomain({ domain, type: domainType, docRoot: result.documentRoot || docRoot.trim() || `/home/sitindia/public_html/${domain}`, phpVersion, sslStatus, sslIssuer: sslStatus === 'active' ? "Let's Encrypt" : 'Pending', sslExpiry: result.ssl?.status === 'active' ? undefined : undefined, forceHttps, bandwidthLimitMB: 50000, diskLimitMB: 20000, directoryPrivacyEnabled: false });
      setShowAddModal(false); setDomainName('');
      addToast({ type: 'success', title: 'Domain provisioned', message: `${domain}: Nginx ${result.nginx?.status || 'configured'}, DNS ${result.dns?.status || 'pending'}, SSL ${sslStatus}.` });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Domain provisioning failed', message: error?.message || 'Unable to provision domain.' });
    } finally { setProvisioning(false); }
  };

  const handleCreateSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = subdomainPrefix.trim().toLowerCase();
    if (!prefix || provisioning) { if (!prefix) addToast({ type: 'error', title: 'Prefix Required', message: 'Please specify a subdomain prefix.' }); return; }
    setProvisioning(true);
    const fullSubdomain = `${prefix}.${parentDomain}`;
    try {
      const target = subDnsType === 'A' ? (subDnsTarget || networkTelemetry.publicIp) : '@';
      const result = await hostingApi.provisionSubdomain({ prefix, parentDomain, username: 'sitindia', phpSocket: `/run/php/php${subPhpVersion}-fpm.sock`, recordType: subDnsType, target, issueSsl: forceHttps });
      if (!result.success) throw new Error(result.message || 'Subdomain provisioning failed');
      addSubdomain(prefix, parentDomain, result.documentRoot || subDocRoot || `/home/sitindia/public_html/${fullSubdomain}`, subPhpVersion, subDnsType, target);
      setShowAddSubdomainModal(false); setSubdomainPrefix(''); setSubDocRoot('');
      addToast({ type: 'success', title: 'Subdomain provisioned', message: `${fullSubdomain}: DNS ${result.dns?.status || 'pending'}, SSL ${result.ssl?.status || 'not-requested'}.` });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Subdomain provisioning failed', message: error?.message || 'Unable to provision subdomain.' });
    } finally { setProvisioning(false); }
  };

  const handleCreateRedirect = (e: React.FormEvent) => { e.preventDefault(); if (!redTarget || redTarget === 'https://') return; addRedirect({ domain: redDomain, sourcePath: redSource, targetUrl: redTarget, type: redType, matchType: redMatchType, status: 'active' }); setShowRedirectModal(false); setRedSource('/'); setRedTarget('https://'); };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5"><Globe className="w-6 h-6 text-sky-400" /><span>Websites, Domains & Subdomains</span></h1><p className="text-xs text-slate-400 mt-1">Configure virtual hosts, automated DNS zone generation, subdomains, document roots, and SSL.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setShowAddSubdomainModal(true)} disabled={provisioning} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"><Plus className="w-4 h-4" /><span>Add Subdomain</span></button><button onClick={() => setShowAddModal(true)} disabled={provisioning} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all"><Plus className="w-4 h-4" /><span>Add Domain / Addon</span></button></div></div>
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">{(['domains','subdomains','redirects','privacy','error-pages','stats'] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>{tab === 'domains' ? `All Domains (${domains.length})` : tab === 'subdomains' ? `Subdomains (${subdomainsList.length})` : tab === 'redirects' ? `Redirects & Rewrites (${redirects.length})` : tab === 'privacy' ? 'Directory Privacy (.htpasswd)' : tab === 'error-pages' ? `Error Pages (${errorPages.length})` : 'Traffic & Visitor Stats'}</button>)}</div>
      {activeTab === 'domains' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl"><div className="flex items-center justify-between"><div><h2 className="font-bold text-base text-white">Configured Domains & Virtual Hosts</h2><p className="text-xs text-slate-400">Provisioning is performed on the hosting server before the domain is added to the panel.</p></div><button onClick={() => setActiveSection('dns')} className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">View DNS Zone Editor <ExternalLink className="w-3.5 h-3.5" /></button></div><div className="overflow-x-auto mt-4"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]"><th className="pb-3">Domain</th><th className="pb-3">Type</th><th className="pb-3">Document Root</th><th className="pb-3">PHP</th><th className="pb-3">SSL</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-800/60">{domains.map((dom) => <tr key={dom.id} className="hover:bg-slate-800/40"><td className="py-3.5 font-bold text-white">{dom.domain}</td><td className="py-3.5 text-slate-300">{dom.type}</td><td className="py-3.5 font-mono text-slate-300">{dom.docRoot}</td><td className="py-3.5"><select value={dom.phpVersion} onChange={(e) => updateDomain(dom.id, { phpVersion: e.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-indigo-300 font-mono"><option>8.4</option><option>8.3</option><option>8.2</option><option>7.4</option></select></td><td className="py-3.5"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${dom.sslStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{dom.sslStatus}</span></td><td className="py-3.5 text-right"><button onClick={() => { setSelectedDomain(dom.domain); setActiveSection('file-manager'); }} className="text-sky-400 mr-3"><Folder className="w-4 h-4 inline" /></button><button onClick={() => deleteDomain(dom.id)} className="text-red-400"><Trash2 className="w-4 h-4 inline" /></button></td></tr>)}</tbody></table></div></div>}
      {activeTab === 'subdomains' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800"><h2 className="font-bold text-white">Subdomains</h2><p className="text-xs text-slate-400 mt-1">Create subdomains through the real provisioning API.</p></div>}
      {activeTab === 'redirects' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800"><h2 className="font-bold text-white">Redirects & Rewrites</h2><p className="text-xs text-slate-400">Manage redirect rules from this section.</p></div>}
      {activeTab === 'privacy' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800"><h2 className="font-bold text-white">Directory Privacy</h2><p className="text-xs text-slate-400">Protection configuration is available for provisioned document roots.</p></div>}
      {activeTab === 'error-pages' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800"><h2 className="font-bold text-white">Error Pages</h2><p className="text-xs text-slate-400">Customize server error responses.</p></div>}
      {activeTab === 'stats' && <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800"><h2 className="font-bold text-white">Traffic & Visitor Stats</h2><p className="text-xs text-slate-400">Per-domain statistics are shown from panel telemetry.</p></div>}
      {showAddModal && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><form onSubmit={handleCreateDomain} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4"><div className="flex justify-between"><h2 className="text-white font-bold">Add Domain</h2><button type="button" onClick={() => setShowAddModal(false)}><X className="text-slate-400" /></button></div><input required value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="example.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /><select value={domainType} onChange={(e) => setDomainType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"><option value="main">Main</option><option value="addon">Addon</option><option value="alias">Alias</option></select><input value={docRoot} onChange={(e) => setDocRoot(e.target.value)} placeholder="Document root" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /><select value={phpVersion} onChange={(e) => setPhpVersion(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"><option>8.4</option><option>8.3</option><option>8.2</option><option>7.4</option></select><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={forceHttps} onChange={(e) => setForceHttps(e.target.checked)} /> Force HTTPS</label><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={issueSsl} onChange={(e) => setIssueSsl(e.target.checked)} /> Issue Let's Encrypt certificate</label><button disabled={provisioning} className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl py-2.5 font-semibold">{provisioning ? 'Provisioning…' : 'Provision Domain'}</button></form></div>}
      {showAddSubdomainModal && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><form onSubmit={handleCreateSubdomain} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4"><div className="flex justify-between"><h2 className="text-white font-bold">Add Subdomain</h2><button type="button" onClick={() => setShowAddSubdomainModal(false)}><X className="text-slate-400" /></button></div><input required value={subdomainPrefix} onChange={(e) => setSubdomainPrefix(e.target.value)} placeholder="blog" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /><input value={parentDomain} onChange={(e) => setParentDomain(e.target.value.toLowerCase())} placeholder="example.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" /><select value={subDnsType} onChange={(e) => setSubDnsType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"><option>A</option><option>CNAME</option></select>{subDnsType === 'A' && <input value={subDnsTarget} onChange={(e) => setSubDnsTarget(e.target.value)} placeholder="Server IP (blank = detected server IP)" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" />}<select value={subPhpVersion} onChange={(e) => setSubPhpVersion(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"><option>8.4</option><option>8.3</option><option>8.2</option><option>7.4</option></select><button disabled={provisioning} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-2.5 font-semibold">{provisioning ? 'Provisioning…' : 'Provision Subdomain'}</button></form></div>}
    </div>
  );
};
