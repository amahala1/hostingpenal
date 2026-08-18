import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Plus,
  Trash2,
  Send,
  Inbox,
  Forward,
  Filter,
  Clock,
  ShieldCheck,
  Key,
  Users,
  CheckCircle2,
  Star,
  Search,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Archive,
  RefreshCw,
  X,
} from 'lucide-react';
import { EmailAccount, EmailForwarder, EmailAutoresponder } from '../../types';

export const EmailHostingSection: React.FC = () => {
  const {
    emailAccounts,
    addEmailAccount,
    deleteEmailAccount,
    emailForwarders,
    addEmailForwarder,
    deleteEmailForwarder,
    autoresponders,
    addAutoresponder,
    deleteAutoresponder,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'accounts' | 'webmail' | 'forwarders' | 'autoresponders' | 'dkim-spf' | 'filters'>('accounts');

  // Webmail Inbox Simulator State
  const [selectedMailbox, setSelectedMailbox] = useState<string>('admin@sitindia.in');
  const [selectedMessageId, setSelectedMessageId] = useState<string>('msg-1');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // New Mailbox Modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newPrefix, setNewPrefix] = useState('');
  const [newQuota, setNewQuota] = useState(2048);

  // New Forwarder Modal
  const [showForwarderModal, setShowForwarderModal] = useState(false);
  const [fwSource, setFwSource] = useState('sales@sitindia.in');
  const [fwDest, setFwDest] = useState('');

  // Sample Inbox Messages
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      from: 'cloud-monitor@sitindia.in',
      to: 'admin@sitindia.in',
      subject: 'Server AutoSSL Certificate Successfully Renewed',
      date: '10:14 AM',
      preview: "Let's Encrypt Wildcard SAN certificate has been verified and installed across *.sitindia.in...",
      body: `Hello System Administrator,\n\nThe automated ACME renewal daemon has successfully renewed the TLS certificate for sitindia.in and all active subdomains.\n\nIssuer: Let's Encrypt Authority X3\nKey Type: RSA 4096-bit\nStatus: 100% Active & Deployed\n\nNo further manual action is required.`,
    },
    {
      id: 'msg-2',
      from: 'billing-alert@gateway.in',
      to: 'billing@sitindia.in',
      subject: 'Monthly Gateway Invoices & Settlement Report',
      date: 'Yesterday',
      preview: 'Your settlement summary for the billing cycle ending yesterday has been generated...',
      body: `Dear Accounts Team,\n\nPlease find attached the monthly transaction log and automated reconciliation file.\n\nTotal volume processed: ₹ 4,82,300\nRefund count: 0\nStatus: Settled to Primary Escrow Node.`,
    },
    {
      id: 'msg-3',
      from: 'client-support@partner.org',
      to: 'support@sitindia.in',
      subject: 'Query regarding API rate limits and Webhook headers',
      date: 'Aug 16',
      preview: 'Could you please confirm the maximum requests per minute on the production v2 endpoints?',
      body: `Hi SIT India Support,\n\nWe are integrating our enterprise ERP with api.sitindia.in and would like to verify the rate limits and HMAC authorization header specs.\n\nThank you,\nPartner Engineering Team`,
    },
  ]);

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefix.trim()) return;

    addEmailAccount({
      email: `${newPrefix.trim().toLowerCase()}@sitindia.in`,
      username: newPrefix.trim().toLowerCase(),
      domain: 'sitindia.in',
      quotaMB: newQuota,
      webmailEnabled: true,
      forwardersCount: 0,
      autoresponderActive: false,
      status: 'active',
    });

    setShowAccountModal(false);
    setNewPrefix('');
  };

  const handleCreateForwarder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fwDest.trim()) return;

    addEmailForwarder({
      sourceEmail: fwSource,
      targetEmail: fwDest.trim(),
      active: true,
    });

    setShowForwarderModal(false);
    setFwDest('');
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    addToast({
      type: 'success',
      title: 'Email Sent',
      message: `Message sent from ${selectedMailbox} to ${composeTo}`,
    });
    setComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-purple-400" />
            <span>Email Hosting, Webmail & DNS Authentication</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise mailboxes for <strong className="text-sky-300">sitindia.in</strong> (admin, support, info, billing), webmail, forwarders, and spam protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Email Account</span>
          </button>
          <button
            onClick={() => setActiveTab('webmail')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Inbox className="w-4 h-4 text-sky-400" />
            <span>Open Webmail</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'accounts' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Mailboxes ({emailAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('webmail')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'webmail' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Interactive Webmail Client
        </button>
        <button
          onClick={() => setActiveTab('forwarders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'forwarders' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Forwarders ({emailForwarders.length})
        </button>
        <button
          onClick={() => setActiveTab('autoresponders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'autoresponders' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Autoresponders ({autoresponders.length})
        </button>
        <button
          onClick={() => setActiveTab('dkim-spf')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'dkim-spf' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          DKIM, SPF & DMARC Security
        </button>
      </div>

      {/* Tab 1: Email Accounts List */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Active Inboxes</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{emailAccounts.length}</div>
              <div className="text-[11px] text-purple-400 mt-1">@sitindia.in Domain</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Mail Storage Used</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {emailAccounts.reduce((acc, a) => acc + a.usedMB, 0)} MB
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Total Quota: 8,192 MB</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">SpamAssassin Engine</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">Score: 4.5</div>
              <div className="text-[11px] text-emerald-400 mt-1">Filtering Active</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">IMAP/POP3 SSL</div>
              <div className="text-2xl font-bold text-sky-400 font-mono mt-1">Port 993/465</div>
              <div className="text-[11px] text-sky-400 mt-1">TLS Enforced</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-white">Configured Email Accounts</h2>
                <p className="text-xs text-slate-400">Default business addresses for sitindia.in</p>
              </div>
              <span className="text-xs font-mono text-purple-400">Dovecot + Postfix Mail Daemon</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Storage / Quota</th>
                    <th className="pb-3">Forwarders</th>
                    <th className="pb-3">Autoresponder</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {emailAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{acc.email}</span>
                      </td>

                      <td className="py-3.5 text-slate-300">
                        <div>{acc.usedMB} / {acc.quotaMB} MB</div>
                        <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{ width: `${(acc.usedMB / acc.quotaMB) * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 text-slate-300 font-sans text-xs">
                        {acc.forwardersCount > 0 ? (
                          <span className="text-sky-300 font-semibold">{acc.forwardersCount} active destination</span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      <td className="py-3.5 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${acc.autoresponderActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                          {acc.autoresponderActive ? 'Active (Out of office)' : 'Disabled'}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">
                          ACTIVE
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMailbox(acc.email);
                              setActiveTab('webmail');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-xs transition-colors"
                          >
                            Webmail
                          </button>
                          <button
                            onClick={() => deleteEmailAccount(acc.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                            title="Delete Mailbox"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Tab 2: Interactive Webmail Client (Roundcube / Horde Experience) */}
      {activeTab === 'webmail' && (
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl h-[700px] flex flex-col overflow-hidden">
          {/* Webmail Top Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 font-bold text-xs flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Roundcube Webmail 1.6</span>
              </div>
              <select
                value={selectedMailbox}
                onChange={(e) => setSelectedMailbox(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs font-semibold"
              >
                {emailAccounts.map((a) => (
                  <option key={a.id} value={a.email}>{a.email}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setComposeOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Message</span>
            </button>
          </div>

          {/* Webmail Split View */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Mail List */}
            <div className="w-2/5 border-r border-slate-800 bg-slate-950/60 overflow-y-auto divide-y divide-slate-800/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    msg.id === selectedMessageId ? 'bg-purple-950/30 border-l-2 border-purple-500' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate max-w-[140px]">{msg.from}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">{msg.subject}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{msg.preview}</div>
                </div>
              ))}
            </div>

            {/* Right Message Body */}
            <div className="w-3/5 p-6 bg-slate-900 flex flex-col overflow-y-auto space-y-4">
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <h3 className="text-base font-bold text-white">{activeMessage.subject}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div>
                    From: <span className="text-slate-200 font-mono font-semibold">{activeMessage.from}</span>
                  </div>
                  <div>To: <span className="text-slate-200 font-mono">{activeMessage.to}</span></div>
                </div>
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {activeMessage.body}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Forwarders */}
      {activeTab === 'forwarders' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">Email Forwarders & Aliases</h2>
              <p className="text-xs text-slate-400">Redirect incoming messages to external mailboxes or ticketing systems</p>
            </div>
            <button
              onClick={() => setShowForwarderModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Forwarder</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-sans">
                  <th className="pb-3">Source Address</th>
                  <th className="pb-3">Target Forwarding Destination</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {emailForwarders.map((fw) => (
                  <tr key={fw.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white">{fw.sourceEmail}</td>
                    <td className="py-3 text-sky-300 font-semibold flex items-center gap-1.5">
                      <Forward className="w-3.5 h-3.5 text-purple-400" />
                      <span>{fw.destinationEmail}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => deleteEmailForwarder(fw.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                        title="Delete Forwarder"
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

      {/* Tab 4: Autoresponders */}
      {activeTab === 'autoresponders' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Automated Out-of-Office Responders</h2>
            <p className="text-xs text-slate-400">Instantly reply to incoming senders during maintenance or leaves.</p>
          </div>

          <div className="space-y-3">
            {autoresponders.map((ar) => (
              <div key={ar.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-white font-mono">{ar.email}</div>
                  <span className="text-xs text-amber-300 font-medium">Subject: {ar.subject}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans italic bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  "{ar.body}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Interval delay: {ar.intervalHours} hour between replies to same sender</span>
                  <button
                    onClick={() => deleteAutoresponder(ar.id)}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Delete Autoresponder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: DKIM, SPF & DMARC */}
      {activeTab === 'dkim-spf' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Email Authentication (SPF, DKIM, DMARC)</h2>
            <p className="text-xs text-slate-400">Prevent spoofing and guarantee 100% inbox delivery rate to Gmail, Yahoo, and Outlook.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">SPF (Sender Policy Framework) TXT Record</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">VALID</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-sky-300 select-all">
                v=spf1 +a +mx +ip4:103.21.14.88 include:_spf.google.com ~all
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">DKIM (DomainKeys Identified Mail) 2048-bit Key</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">ACTIVE</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-emerald-300 select-all break-all">
                default._domainkey.sitindia.in TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzq..."
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">DMARC Policy Enforcement</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">ENFORCED</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-purple-300 select-all">
                _dmarc.sitindia.in TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@sitindia.in"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>New Email from {selectedMailbox}</span>
              </h3>
              <button onClick={() => setComposeOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">To</label>
                <input
                  type="email"
                  placeholder="recipient@domain.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter message subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Message Body</label>
                <textarea
                  rows={6}
                  placeholder="Type your message..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Email Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Create Mailbox (@sitindia.in)</h3>
            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Mailbox Name</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. contact or careers"
                    value={newPrefix}
                    onChange={(e) => setNewPrefix(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-l-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 border border-l-0 border-slate-700 text-purple-300 font-mono font-semibold">
                    @sitindia.in
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Storage Quota (MB)</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Create Mailbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Forwarder Modal */}
      {showForwarderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Create Email Forwarder</h3>
            <form onSubmit={handleCreateForwarder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Source Inbound Address</label>
                <input
                  type="text"
                  value={fwSource}
                  onChange={(e) => setFwSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Destination Target</label>
                <input
                  type="email"
                  placeholder="e.g. personal@gmail.com or zendesk@support.in"
                  value={fwDest}
                  onChange={(e) => setFwDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForwarderModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Forwarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
