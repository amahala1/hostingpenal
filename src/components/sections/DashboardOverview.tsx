import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  FolderTree,
  FileCode,
  Database,
  Mail,
  ShieldCheck,
  Cpu,
  Terminal,
  HardDrive,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Lock,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  Boxes,
  Send,
  ArrowUpCircle,
  Sparkles,
  Play,
  TrendingUp,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    domains,
    metrics,
    emailAccounts,
    databases,
    services,
    plugins,
    systemVersion,
    isVpsInstalled,
    launchPhpMyAdmin,
    launchPhpMailerTest,
    launchVpsInstaller,
    setActiveSection,
    setSelectedDomain,
    issueAutoSsl,
    addToast,
    triggerHaptic,
    userProfile,
  } = useApp();

  const totalDiskUsed = domains.reduce((acc, d) => acc + d.diskUsedMB, 0) + 4200;
  const totalBwUsed = domains.reduce((acc, d) => acc + d.bandwidthUsedMB, 0);

  const quickShortcuts = [
    {
      title: '1-Click VPS Auto-Installer',
      subtitle: isVpsInstalled ? 'All Services 100% Active' : 'Automated Setup Required',
      icon: <Server className="w-5 h-5 text-purple-600" />,
      action: () => launchVpsInstaller(),
      badge: isVpsInstalled ? 'Installed' : 'Run Auto-Install',
      badgeStyle: isVpsInstalled ? 'ha-badge-emerald' : 'ha-badge-red',
      borderHover: 'hover:border-purple-400',
    },
    {
      title: '1-Click phpMyAdmin',
      subtitle: `Isolated for ${userProfile.username}`,
      icon: <Database className="w-5 h-5 text-amber-600" />,
      action: () => launchPhpMyAdmin(),
      badge: 'v5.2.2 Pro',
      badgeStyle: 'ha-badge-mango',
      borderHover: 'hover:border-amber-400',
    },
    {
      title: 'Roundcube Webmail',
      subtitle: 'Dedicated Webmail Login & Portal',
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      action: () => setActiveSection('roundcube'),
      badge: 'IMAP SSL',
      badgeStyle: 'ha-badge-blue',
      borderHover: 'hover:border-blue-400',
    },
    {
      title: 'Code Editor & Line Ruler',
      subtitle: 'File Manager with Light Themes',
      icon: <FolderTree className="w-5 h-5 text-pink-600" />,
      action: () => setActiveSection('file-manager'),
      badge: '5 Light Themes',
      badgeStyle: 'ha-badge-pink',
      borderHover: 'hover:border-pink-400',
    },
    {
      title: 'Domains & Virtual Hosts',
      subtitle: `${domains.length} Active Websites`,
      icon: <Globe className="w-5 h-5 text-amber-600" />,
      action: () => setActiveSection('websites'),
      badge: `${domains.length} Live`,
      badgeStyle: 'ha-badge-mango',
      borderHover: 'hover:border-amber-400',
    },
    {
      title: 'PHPMailer SMTP Suite',
      subtitle: 'Real-Time Handshake Diagnostics',
      icon: <Send className="w-5 h-5 text-purple-600" />,
      action: () => launchPhpMailerTest(),
      badge: 'SMTP TLS',
      badgeStyle: 'ha-badge-purple',
      borderHover: 'hover:border-purple-400',
    },
    {
      title: 'PHP & FPM Config',
      subtitle: 'PHP 8.2 & 8.3 Runtime Manager',
      icon: <FileCode className="w-5 h-5 text-purple-600" />,
      action: () => setActiveSection('php-manager'),
      badge: 'OPcache Active',
      badgeStyle: 'ha-badge-purple',
      borderHover: 'hover:border-purple-400',
    },
    {
      title: 'AutoSSL & TLS WAF',
      subtitle: "Let's Encrypt Wildcard SAN",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      action: () => setActiveSection('ssl-security'),
      badge: '100% Secured',
      badgeStyle: 'ha-badge-emerald',
      borderHover: 'hover:border-emerald-400',
    },
  ];

  return (
    <div id="ha-section-overview" className="space-y-7 pb-12">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl text-white shadow-xl shadow-purple-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>HostAdmin Enterprise Server Node IN-DEL-01</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Indian Web Hosting Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed">
            Manage your domains, databases with isolated phpMyAdmin, Roundcube Webmail, code editor with live line ruler, and 1-click automated VPS provisioning with zero manual SSH commands.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={launchVpsInstaller}
            className="px-4 py-2.5 rounded-xl bg-white text-purple-950 hover:bg-white/90 text-xs font-extrabold shadow-lg transition flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-purple-700" />
            <span>1-Click VPS Installer</span>
          </button>

          <button
            onClick={launchPhpMyAdmin}
            className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-white/30 text-white hover:bg-purple-950/60 text-xs font-extrabold shadow-lg transition flex items-center gap-2 backdrop-blur-md"
          >
            <Database className="w-4 h-4 text-amber-300" />
            <span>phpMyAdmin</span>
          </button>
        </div>
      </div>

      {/* 4 Multi-Color Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Mango Gold: Domains */}
        <div className="ha-card p-5 border-amber-200/80 bg-gradient-to-br from-white to-amber-50/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Virtual Hosts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{domains.length} Active</div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">sitindia.in & subdomains</p>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
            <span className="ha-badge ha-badge-mango text-[10px]">100% HTTPS</span>
            <button
              onClick={() => setActiveSection('websites')}
              className="text-amber-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Royal Purple: Databases */}
        <div className="ha-card p-5 border-purple-200/80 bg-gradient-to-br from-white to-purple-50/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">MySQL / MariaDB</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{databases.length} Databases</div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">User: {userProfile.username}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
            <span className="ha-badge ha-badge-purple text-[10px]">Isolated phpMyAdmin</span>
            <button
              onClick={launchPhpMyAdmin}
              className="text-purple-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Launch GUI</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Rose Pink: Email & Roundcube */}
        <div className="ha-card p-5 border-pink-200/80 bg-gradient-to-br from-white to-pink-50/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-800">Email & Webmail</span>
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{emailAccounts.length} Mailboxes</div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Roundcube & SMTP Ready</p>
          </div>
          <div className="mt-3 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
            <span className="ha-badge ha-badge-pink text-[10px]">Dovecot SSL</span>
            <button
              onClick={() => setActiveSection('roundcube')}
              className="text-pink-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Webmail</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Emerald Green: Server Telemetry */}
        <div className="ha-card p-5 border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Server Health</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.cpuUsage.toFixed(1)}% CPU</div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              RAM: {(metrics.memoryUsedMB / 1024).toFixed(1)}GB / {(metrics.memoryTotalMB / 1024).toFixed(0)}GB
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
            <span className="ha-badge ha-badge-emerald text-[10px]">Optimal Load</span>
            <button
              onClick={() => setActiveSection('metrics')}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Telemetry</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Control Center Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Quick Action Shortcuts</h2>
            <p className="text-xs text-slate-500">Instant one-click access to core hosting components</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickShortcuts.map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className={`ha-card p-4.5 cursor-pointer bg-white transition-all duration-200 ${item.borderHover} hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className={`ha-badge ${item.badgeStyle} text-[10px] font-bold`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.subtitle}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-purple-600">
                <span>Launch Tool</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
