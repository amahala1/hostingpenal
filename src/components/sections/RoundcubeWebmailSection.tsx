import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  Star,
  RefreshCw,
  Search,
  Plus,
  Paperclip,
  LogOut,
  CheckCircle2,
  FileText,
  AlertCircle,
  Archive,
  Folder,
  ShieldCheck,
  User,
  Key,
  CornerUpLeft,
  CornerUpRight,
  Printer,
  ChevronDown,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { WebmailMessage } from '../../types';

export const RoundcubeWebmailSection: React.FC = () => {
  const {
    emailAccounts,
    webmailMessages,
    sendWebmailMessage,
    markMessageRead,
    toggleMessageStarred,
    deleteWebmailMessage,
    addToast,
    triggerHaptic,
    roundcubeSessionMail,
    setRoundcubeSessionMail,
    networkTelemetry,
  } = useApp();

  // Webmail Login Screen State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>(emailAccounts[0]?.email || 'admin@sitindia.in');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••••••');
  const [serverHost, setServerHost] = useState<string>('mail.sitindia.in');

  // Mail View State
  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'drafts' | 'sent' | 'spam' | 'trash'>('inbox');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(webmailMessages[0]?.id || null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  // Composer Form State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    setIsLoggedIn(true);
    setRoundcubeSessionMail(loginEmail);
    addToast({
      type: 'success',
      title: 'Roundcube Webmail Authenticated',
      message: `Logged in as ${loginEmail} (IMAP SSL 993).`,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedMessageId(null);
    addToast({
      type: 'info',
      title: 'Roundcube Session Closed',
      message: 'You have been safely logged out of Roundcube Webmail.',
    });
  };

  const filteredMessages = webmailMessages.filter((msg) => {
    const matchesFolder = msg.folder === currentFolder;
    const matchesSearch = searchFilter
      ? msg.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
        msg.from.toLowerCase().includes(searchFilter.toLowerCase()) ||
        msg.snippet.toLowerCase().includes(searchFilter.toLowerCase())
      : true;
    return matchesFolder && matchesSearch;
  });

  const activeMessage = webmailMessages.find((m) => m.id === selectedMessageId) || filteredMessages[0];

  const handleSelectMessage = (msg: WebmailMessage) => {
    triggerHaptic();
    setSelectedMessageId(msg.id);
    if (!msg.read) {
      markMessageRead(msg.id, true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      sendWebmailMessage({
        accountEmail: roundcubeSessionMail || loginEmail,
        from: roundcubeSessionMail || loginEmail,
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        body: composeBody,
        snippet: composeBody.slice(0, 80) || composeSubject,
        folder: 'sent',
      });
      setIsSending(false);
      setShowComposer(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      addToast({
        type: 'success',
        title: 'Email Sent via SMTP',
        message: `Dispatched to ${composeTo} via Exim4 SMTP TLS.`,
      });
    }, 500);
  };

  // 1. Dedicated Roundcube Login Screen (Req #4: Roundcube alag page par login hona chahiye)
  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
          {/* Top Roundcube Header Banner */}
          <div className="px-6 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Roundcube Webmail</h2>
            <p className="text-xs text-blue-100 mt-1">Enterprise Mail Gateway • Dovecot IMAP SSL</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Email Account</label>
              <select
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="ha-input text-xs font-semibold"
              >
                {emailAccounts.map((acc) => (
                  <option key={acc.id} value={acc.email}>
                    {acc.email} ({acc.quotaMB} MB)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="ha-input text-xs"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mail Server Host</label>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="ha-input text-xs font-mono text-slate-600"
              />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>TLS 1.3 Encryption active on Port 993 (IMAP) and Port 587 (SMTP).</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full ha-btn ha-btn-purple py-2.5 text-sm font-bold shadow-md shadow-purple-500/20"
              >
                <Mail className="w-4 h-4 mr-1" />
                <span>Login to Webmail Console</span>
              </button>

              <a
                href={`https://${networkTelemetry.publicIp || '103.174.102.45'}:8443/roundcube`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition"
              >
                <span>Open Direct Roundcube Page (New Tab)</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </a>
            </div>
          </form>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
            Roundcube Webmail v1.6.6 • Powered by SIT India Server Node
          </div>
        </div>
      </div>
    );
  }

  // 2. Logged-in Roundcube Webmail Dashboard
  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Roundcube Webmail</span>
          </h1>
          <p className="text-xs text-slate-500">
            Connected as <span className="font-bold text-blue-700 font-mono">{roundcubeSessionMail || loginEmail}</span> • IMAP TLS Active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComposer(true)}
            className="ha-btn ha-btn-purple text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Email</span>
          </button>

          <button
            onClick={handleLogout}
            className="ha-btn ha-btn-white text-xs py-2 px-3 text-rose-600 hover:bg-rose-50 border-rose-200"
            title="Log out of Roundcube"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Roundcube Mail Client */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* Left Folder Column */}
        <div className="w-full md:w-56 bg-slate-50/80 border-r border-slate-200/80 p-3 space-y-1 flex-shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Mail Folders
          </div>

          <button
            onClick={() => setCurrentFolder('inbox')}
            className={`roundcube-folder-btn ${currentFolder === 'inbox' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Inbox</span>
            </div>
            <span className="ha-badge ha-badge-blue text-[10px] py-0.5 px-1.5 font-bold">
              {webmailMessages.filter((m) => m.folder === 'inbox' && !m.read).length}
            </span>
          </button>

          <button
            onClick={() => setCurrentFolder('drafts')}
            className={`roundcube-folder-btn ${currentFolder === 'drafts' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Drafts</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {webmailMessages.filter((m) => m.folder === 'drafts').length}
            </span>
          </button>

          <button
            onClick={() => setCurrentFolder('sent')}
            className={`roundcube-folder-btn ${currentFolder === 'sent' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Sent</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {webmailMessages.filter((m) => m.folder === 'sent').length}
            </span>
          </button>

          <button
            onClick={() => setCurrentFolder('spam')}
            className={`roundcube-folder-btn ${currentFolder === 'spam' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Junk / Spam</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {webmailMessages.filter((m) => m.folder === 'spam').length}
            </span>
          </button>

          <button
            onClick={() => setCurrentFolder('trash')}
            className={`roundcube-folder-btn ${currentFolder === 'trash' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-slate-500" />
              <span>Trash</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {webmailMessages.filter((m) => m.folder === 'trash').length}
            </span>
          </button>

          {/* Mailbox Storage Status */}
          <div className="pt-6 px-2">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Disk Quota</span>
                <span>28.4 MB / 1000 MB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full w-[3%]" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Maildir /home/sitindia</p>
            </div>
          </div>
        </div>

        {/* Center Mail Messages List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col flex-shrink-0 bg-white">
          {/* List Search Bar */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject or sender..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="ha-input pl-8 py-1.5 text-xs bg-slate-50"
              />
            </div>
          </div>

          {/* Message Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No messages found in {currentFolder}.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessageId === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    } ${!msg.read ? 'font-bold bg-blue-50/20' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs text-slate-900 truncate">{msg.from}</span>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{msg.date}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-800 truncate font-semibold">{msg.subject}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStarred(msg.id);
                        }}
                        className="text-slate-300 hover:text-amber-500"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            msg.starred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.snippet}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Message Preview & Reading Pane */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          {activeMessage ? (
            <div className="flex-1 flex flex-col p-6 space-y-6">
              {/* Message Header */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{activeMessage.subject}</h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setComposeTo(activeMessage.from);
                        setComposeSubject(`Re: ${activeMessage.subject}`);
                        setShowComposer(true);
                      }}
                      className="ha-btn ha-btn-white text-xs py-1.5 px-3"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => deleteWebmailMessage(activeMessage.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {activeMessage.from.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{activeMessage.from}</p>
                      <p className="text-[11px] text-slate-400">To: {roundcubeSessionMail || loginEmail}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-400">{activeMessage.date}</span>
                </div>
              </div>

              {/* Message Body Content */}
              <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {activeMessage.body || activeMessage.snippet}
              </div>

              {/* Signature Footer */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                -- <br />
                HostAdmin Roundcube Mail Engine • SIT India Node
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-12">
              Select an email from the left list to read its content.
            </div>
          )}
        </div>
      </div>

      {/* Quick Compose Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <span>New Message • Roundcube SMTP</span>
              </h3>
              <button onClick={() => setShowComposer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">To Recipient</label>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="ha-input text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Important Hosting Update..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="ha-input text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write your email here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="ha-input text-xs font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Attachment Added', message: 'file_attachment.pdf attached' })}
                  className="ha-btn ha-btn-white text-xs"
                >
                  <Paperclip className="w-3.5 h-3.5 mr-1" />
                  <span>Attach File</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowComposer(false)}
                    className="ha-btn ha-btn-white text-xs"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="ha-btn ha-btn-purple text-xs font-bold"
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
