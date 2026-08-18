import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Globe,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Flame,
} from 'lucide-react';
import { SslCertificate, FirewallRule } from '../../types';

export const SslSecuritySection: React.FC = () => {
  const {
    sslCertificates,
    domains,
    issueAutoSsl,
    firewallRules,
    addFirewallRule,
    deleteFirewallRule,
    securitySettings,
    updateSecuritySettings,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'autossl' | 'firewall' | 'waf' | 'hotlink'>('autossl');

  // Certificate inspector modal
  const [inspectingCert, setInspectingCert] = useState<SslCertificate | null>(null);

  // New Firewall Rule Modal
  const [showFwModal, setShowFwModal] = useState(false);
  const [fwIp, setFwIp] = useState('');
  const [fwAction, setFwAction] = useState<'block' | 'allow' | 'rate_limit'>('block');
  const [fwReason, setFwReason] = useState('');

  const handleIssueCert = (domain: string) => {
    triggerHaptic();
    issueAutoSsl(domain);
  };

  const handleAddFwRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fwIp.trim()) return;

    addFirewallRule({
      ipOrRange: fwIp.trim(),
      reason: fwReason.trim() || 'Manual administrator blocklist entry',
      durationDays: 30,
    });

    setShowFwModal(false);
    setFwIp('');
    setFwReason('');
  };

  const handleToggle2FA = () => {
    triggerHaptic();
    const nextVal = !securitySettings.twoFactorEnforced;
    updateSecuritySettings({ twoFactorEnforced: nextVal });
    addToast({
      type: nextVal ? 'success' : 'warning',
      title: nextVal ? 'Two-Factor Authentication Enforced' : '2FA Policy Relaxed',
      message: nextVal ? 'All administrator accounts now require TOTP authenticator app tokens.' : 'Standard password login active.',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>SSL / TLS Certificates & Hardened Security</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AutoSSL automated renewals, Let's Encrypt SAN certs, IP firewall filtering, 2FA, and WAF rules.
          </p>
        </div>

        <button
          onClick={() => {
            domains.forEach((d) => issueAutoSsl(d.domain));
            addToast({ type: 'success', title: 'AutoSSL Check Initiated', message: 'Checking 4 virtual hosts...' });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run AutoSSL For All Domains</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('autossl')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'autossl' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          AutoSSL & TLS ({sslCertificates.length})
        </button>
        <button
          onClick={() => setActiveTab('firewall')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'firewall' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          IP Firewall & Fail2ban ({firewallRules.length})
        </button>
        <button
          onClick={() => setActiveTab('waf')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'waf' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Web Application Firewall (WAF)
        </button>
        <button
          onClick={() => setActiveTab('hotlink')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'hotlink' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Hotlink & Directory Protection
        </button>
      </div>

      {/* Tab 1: AutoSSL & Certificates */}
      {activeTab === 'autossl' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">AutoSSL Provider</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Let's Encrypt (v2)</div>
              <div className="text-[11px] text-emerald-400 mt-1">ACME HTTP-01 / DNS-01</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">TLS Protocol Minimum</div>
              <div className="text-xl font-bold text-sky-400 font-mono mt-1">TLS 1.3 / 1.2</div>
              <div className="text-[11px] text-slate-400 mt-1">SSLv3 and TLS 1.0/1.1 Disabled</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Active Certificates</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                {sslCertificates.length} Valid Domains
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1">Next auto-renewal in 58 days</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Domain SSL/TLS Certificates</h2>
              <span className="text-xs text-slate-400">ECDSA P-384 / RSA 4096-bit</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Primary Domain</th>
                    <th className="pb-3">Certificate Authority</th>
                    <th className="pb-3">SAN Domains Covered</th>
                    <th className="pb-3">Valid Until</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sslCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-800/40 font-mono">
                      <td className="py-3.5 font-semibold text-white flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{cert.domain}</span>
                      </td>

                      <td className="py-3.5 text-slate-300 font-sans">{cert.issuer}</td>

                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(cert.sanDomains || cert.domainsCovered || []).map((san) => (
                            <span key={san} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {san}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 text-slate-300 text-[11px]">{cert.validTo || cert.expiresAt}</td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {cert.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingCert(cert)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleIssueCert(cert.domain)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-emerald-400"
                            title="Force Reissue Let's Encrypt"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
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

      {/* Tab 2: IP Firewall & Fail2ban */}
      {activeTab === 'firewall' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">IP Blocker & Stateful Firewall (UFW / CSF)</h2>
              <p className="text-xs text-slate-400">Block malicious attackers, brute force probes, and rate-limit suspicious CIDR blocks.</p>
            </div>
            <button
              onClick={() => setShowFwModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block Rule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-sans">
                  <th className="pb-3">IP / CIDR Range</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Reason / Trigger</th>
                  <th className="pb-3">Date Added</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {firewallRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>{rule.ipOrCidr}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${rule.action === 'block' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {rule.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-sans text-xs">{rule.reason}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{rule.createdAt}</td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => deleteFirewallRule(rule.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                        title="Unblock / Remove Rule"
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

      {/* Tab 3: Web Application Firewall (WAF) */}
      {activeTab === 'waf' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">ModSecurity & OWASP Web Application Firewall (WAF)</h2>
              <p className="text-xs text-slate-400">Deep inspection of HTTP payloads to neutralize SQL injection, XSS, and botnets.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              WAF Engine: ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'OWASP Core Rule Set (CRS 3.3)', desc: 'Blocks SQLi, Remote Code Execution, and Local File Inclusions', status: true },
              { title: 'HTTP Request Rate Limiter', desc: 'Caps rapid-fire brute force traffic to 120 req/min per IP', status: true },
              { title: 'Bad Bot & Crawler Blocker', desc: 'Denies known scraper user-agents (SemrushBot, AhrefsBot probes)', status: true },
              { title: 'Sensitive File Leak Shield', desc: 'Prevents direct public downloads of .env, .git, .sql, and .bak files', status: true },
            ].map((waf, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-xs text-white">{waf.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{waf.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  ENABLED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Hotlink & Directory Protection */}
      {activeTab === 'hotlink' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Hotlink Bandwidth Leech Protection</h2>
            <p className="text-xs text-slate-400">
              Prevent third-party websites from directly embedding your images, videos, and zip files.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Hotlink Defense Mode</span>
              <button
                onClick={() => {
                  updateSecuritySettings({ hotlinkProtection: !securitySettings.hotlinkProtection });
                  addToast({ type: 'info', title: 'Hotlink Protection Updated' });
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  securitySettings.hotlinkProtection ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {securitySettings.hotlinkProtection ? 'ON (Protecting Assets)' : 'OFF'}
              </button>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>Protected file extensions: <span className="font-mono text-sky-300">jpg, jpeg, png, gif, webp, mp4, zip, pdf</span></div>
              <div>Whitelisted referrers: <span className="font-mono text-slate-300">sitindia.in, google.com, bing.com</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Certificate Modal */}
      {inspectingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>SSL/TLS Details for {inspectingCert.domain}</span>
              </h3>
              <button onClick={() => setInspectingCert(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Issuer</div>
                  <div className="font-semibold text-white">{inspectingCert.issuer}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Key Type</div>
                  <div className="font-mono text-sky-400">RSA 4096-bit (SHA-256)</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-slate-400 font-sans text-xs">Subject Alternative Names (SANs):</div>
                <div className="text-emerald-300">
                  {(inspectingCert.sanDomains || inspectingCert.domainsCovered || [inspectingCert.domain]).join(', ')}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400">
                <div>Valid From: {(inspectingCert as any).validFrom || inspectingCert.issuedAt}</div>
                <div>Valid Until: {inspectingCert.validTo || inspectingCert.expiresAt} (Auto-Renewing)</div>
                <div>OCSP Stapling: Enabled</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectingCert(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Firewall Block Rule Modal */}
      {showFwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Add Firewall IP Rule</h3>
            <form onSubmit={handleAddFwRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">IP Address or CIDR Range</label>
                <input
                  type="text"
                  placeholder="e.g. 185.220.101.5 or 198.51.100.0/24"
                  value={fwIp}
                  onChange={(e) => setFwIp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Firewall Action</label>
                <select
                  value={fwAction}
                  onChange={(e) => setFwAction(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="block">Block / Drop All Packets</option>
                  <option value="allow">Whitelist / Always Allow</option>
                  <option value="rate_limit">Rate Limit (Throttle)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Suspicious SSH brute force attempts"
                  value={fwReason}
                  onChange={(e) => setFwReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFwModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Save Firewall Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
