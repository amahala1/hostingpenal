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
  LayoutGrid,
  Users,
  Network,
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
    launchVpsInstaller,
    setActiveSection,
    setSelectedDomain,
    issueAutoSsl,
    addToast,
    triggerHaptic,
    userProfile,
    networkTelemetry,
    detectServerIpAndMetrics,
    serverUsers,
    setPanelMode,
  } = useApp();

  const totalDiskUsed = domains.reduce((acc, d) => acc + d.diskUsedMB, 0) + 4200;
  const totalBwUsed = domains.reduce((acc, d) => acc + d.bandwidthUsedMB, 0);

  const quickShortcuts = [
    {
      title: 'User Panel (cPanel Grid)',
      subtitle: 'Photo-matched iconic user account view',
      icon: <LayoutGrid className="w-5 h-5 text-sky-600" />,
      action: () => {
        setPanelMode('user');
        setActiveSection('user-panel');
      },
      badge: 'Interactive',
      badgeStyle: 'ha-badge-blue',
      borderHover: 'hover:border-sky-400',
    },
    {
      title: 'User Accounts & Reseller',
      subtitle: `${serverUsers.length} active server accounts`,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      action: () => setActiveSection('users-manager'),
      badge: 'Manager',
      badgeStyle: 'ha-badge-purple',
      borderHover: 'hover:border-indigo-400',
    },
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
      title: 'DNS Zone Records',
      subtitle: 'A, CNAME, MX, SPF, DKIM',
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
      action: () => setActiveSection('dns'),
      badge: 'DNSSEC Ready',
      badgeStyle: 'ha-badge-purple',
      borderHover: 'hover:border-indigo-400',
    },
  ];

  return (
    <div id="ha-section-overview" className="space-y-7 pb-12">
      {/* Dedicated Real-Time System Health Widget (Fetched from Live Telemetry Data) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-5 border border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Status Beacon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
              <Activity className="w-6 h-6 animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-extrabold tracking-tight text-white">System Health & Live Telemetry</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>ONLINE • 100% HEALTHY</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Host Node: <span className="text-purple-300 font-bold">IN-DEL-01</span> • Uptime: <span className="text-slate-200">{Math.floor(metrics.uptimeSeconds / 86400)}d {Math.floor((metrics.uptimeSeconds % 86400) / 3600)}h {Math.floor((metrics.uptimeSeconds % 3600) / 60)}m</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic();
                detectServerIpAndMetrics();
                addToast({
                  type: 'success',
                  title: 'Telemetry Synchronized',
                  message: 'Fetched latest real-time RAM, CPU load, and disk utilization from server kernel.',
                });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition shadow-sm hover:border-slate-600"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Fetch Live Telemetry</span>
            </button>
          </div>
        </div>

        {/* 3 Core System Health Telemetry Gauges (RAM, CPU, Disk) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Gauge 1: Real-Time CPU Load */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">CPU Load</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-bold">{metrics.cpuCores} Cores (x86_64)</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-sky-300">
                {metrics.cpuUsage.toFixed(1)}%
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Load Avg: <span className="text-slate-200 font-bold">{metrics.loadAverage.join(', ')}</span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metrics.cpuUsage > 80 ? 'bg-rose-500' : metrics.cpuUsage > 50 ? 'bg-amber-400' : 'bg-sky-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, metrics.cpuUsage))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0% Idle</span>
                <span>100% Max</span>
              </div>
            </div>
          </div>

          {/* Gauge 2: Real-Time System RAM Memory Usage */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">System RAM</span>
              </div>
              <span className="text-[11px] font-mono text-purple-300 font-bold">
                {((metrics.memoryUsedMB / metrics.memoryTotalMB) * 100).toFixed(1)}% Used
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-purple-300">
                {(metrics.memoryUsedMB / 1024).toFixed(1)} GB
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Total: <span className="text-slate-200 font-bold">{(metrics.memoryTotalMB / 1024).toFixed(0)} GB</span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full rounded-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${((metrics.memoryUsedMB / metrics.memoryTotalMB) * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Free: {((metrics.memoryTotalMB - metrics.memoryUsedMB) / 1024).toFixed(1)} GB</span>
                <span>Buffer/Cache OPcache</span>
              </div>
            </div>
          </div>

          {/* Gauge 3: Real-Time Disk Storage Utilization */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Disk Utilization</span>
              </div>
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                {((metrics.diskUsedGB / metrics.diskTotalGB) * 100).toFixed(1)}% Used
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-amber-300">
                {metrics.diskUsedGB} GB
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Total: <span className="text-slate-200 font-bold">{metrics.diskTotalGB} GB</span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${((metrics.diskUsedGB / metrics.diskTotalGB) * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Avail: {(metrics.diskTotalGB - metrics.diskUsedGB).toFixed(1)} GB</span>
                <span>NVMe SSD Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Service Telemetry Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono relative z-10">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Server Public IP</span>
            <span className="font-bold text-sky-300">{networkTelemetry.publicIp}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Bandwidth I/O</span>
            <span className="font-bold text-emerald-300">{metrics.bandwidthInMbps} Mbps IN / {metrics.bandwidthOutMbps} Mbps OUT</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">MariaDB Queries</span>
            <span className="font-bold text-purple-300">{metrics.mysqlQps} QPS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Linux Threads</span>
            <span className="font-bold text-amber-300">{metrics.activeProcesses} Active</span>
          </div>
        </div>
      </div>

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
            Manage domains, multi-user accounts, MariaDB databases, Roundcube Webmail, code editor with line ruler, and photo-matched cPanel User Panel layout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setPanelMode('user');
              setActiveSection('user-panel');
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-sky-950 hover:bg-white/90 text-xs font-extrabold shadow-lg transition flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4 text-sky-600" />
            <span>Open User Panel</span>
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
