import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Globe,
  FolderTree,
  Database,
  Mail,
  ShieldCheck,
  Cpu,
  Terminal,
  Server,
  Layers,
  Settings,
  HardDrive,
  FileCode,
  Lock,
  Zap,
} from 'lucide-react';
import { NavSection } from '../types';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSection,
    domains,
    setSelectedDomain,
    addToast,
    issueAutoSsl,
    databases,
    emailAccounts,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const actions = [
    {
      id: 'nav-overview',
      title: 'Server Overview & Health',
      subtitle: 'Real-time telemetry, load average, system status',
      icon: <Server className="w-4 h-4 text-sky-400" />,
      run: () => {
        setActiveSection('overview');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-websites',
      title: 'Manage Domains & Virtual Hosts',
      subtitle: 'Subdomains, document roots, redirects, error pages',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      run: () => {
        setActiveSection('websites');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-files',
      title: 'Interactive Web File Manager',
      subtitle: 'Browse /public_html, upload, edit code, chmod, zip',
      icon: <FolderTree className="w-4 h-4 text-amber-400" />,
      run: () => {
        setActiveSection('file-manager');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-php',
      title: 'PHP Version & FPM Manager',
      subtitle: 'Switch PHP 7.4-8.4, toggle extensions, edit php.ini',
      icon: <FileCode className="w-4 h-4 text-indigo-400" />,
      run: () => {
        setActiveSection('php-manager');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-databases',
      title: 'MySQL / MariaDB & phpMyAdmin',
      subtitle: 'Databases, users, SQL query runner, table browser',
      icon: <Database className="w-4 h-4 text-teal-400" />,
      run: () => {
        setActiveSection('databases');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-email',
      title: 'Email Hosting & Webmail Client',
      subtitle: 'admin@, support@, info@, billing@sitindia.in, DKIM/SPF',
      icon: <Mail className="w-4 h-4 text-violet-400" />,
      run: () => {
        setActiveSection('email');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-ssl',
      title: "AutoSSL & Security Center",
      subtitle: "Let's Encrypt 1-click issuance, IP blocker, 2FA, WAF",
      icon: <ShieldCheck className="w-4 h-4 text-green-400" />,
      run: () => {
        setActiveSection('ssl-security');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-dns',
      title: 'DNS Zone Editor',
      subtitle: 'A, CNAME, MX, TXT, SPF, DKIM, DNSSEC keys',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      run: () => {
        setActiveSection('dns');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-terminal',
      title: 'Web SSH Terminal Console',
      subtitle: 'Execute shell commands, htop, systemctl, composer',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      run: () => {
        setActiveSection('terminal');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-backups',
      title: 'Automated Backup Schedules & Snapshots',
      subtitle: 'AWS S3, SFTP, cron frequency, 1-click restore',
      icon: <HardDrive className="w-4 h-4 text-orange-400" />,
      run: () => {
        setActiveSection('backups');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-plugins',
      title: 'Plugin & Extension Marketplace',
      subtitle: 'WordPress Toolkit, Redis, Docker, Cloudflare Edge',
      icon: <Layers className="w-4 h-4 text-pink-400" />,
      run: () => {
        setActiveSection('plugins');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-profile',
      title: 'User Profile & Security Settings',
      subtitle: 'Bio, avatar, 2FA, session timeout, accessibility',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      run: () => {
        setActiveSection('profile-settings');
        setCommandPaletteOpen(false);
      },
    },
  ];

  // Also include domains in search
  const domainActions = domains.map((d) => ({
    id: `dom-${d.id}`,
    title: `Domain: ${d.domain}`,
    subtitle: `${d.docRoot} • PHP ${d.phpVersion} • SSL ${d.sslStatus}`,
    icon: <Globe className="w-4 h-4 text-blue-400" />,
    run: () => {
      setSelectedDomain(d.domain);
      setActiveSection('websites');
      setCommandPaletteOpen(false);
    },
  }));

  // Also include emails in search
  const emailItemActions = emailAccounts.map((e) => ({
    id: `email-${e.id}`,
    title: `Email: ${e.email}`,
    subtitle: `${e.usedMB} / ${e.quotaMB} MB • Webmail Active`,
    icon: <Mail className="w-4 h-4 text-purple-400" />,
    run: () => {
      setActiveSection('email');
      setCommandPaletteOpen(false);
    },
  }));

  const allSearchable = [...actions, ...domainActions, ...emailItemActions];

  const filtered = query.trim()
    ? allSearchable.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : allSearchable;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command, domain, file, tool, or shortcut (e.g., 'sitindia', 'ssl', 'php', 'email')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-4 bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
            aria-label="Search command palette"
          />
          <kbd className="px-2 py-1 text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.run}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-slate-800/80 focus:bg-slate-800 text-left transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <div className="p-2 rounded-lg bg-slate-800/90 group-hover:bg-slate-700/90 shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-100 group-hover:text-white truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Jump ↵
                </span>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Navigate with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↓</kbd>
            </span>
            <span>
              Select with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd>
            </span>
          </div>
          <span className="text-emerald-400 font-medium">HostAdmin v3.4 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
