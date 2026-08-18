import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Server,
  Activity,
  Globe,
  Sun,
  Moon,
  Eye,
  Type,
  Volume2,
  VolumeX,
  Bell,
  ShieldCheck,
  User,
  ChevronDown,
  Terminal,
  FileCode,
  HardDrive,
  RefreshCw,
  LogOut,
  Menu,
} from 'lucide-react';
import { ThemeMode, FontSize } from '../types';

export const Header: React.FC<{ onToggleMobileSidebar?: () => void }> = ({ onToggleMobileSidebar }) => {
  const {
    setCommandPaletteOpen,
    domains,
    selectedDomain,
    setSelectedDomain,
    metrics,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    screenReaderVoiceEnabled,
    setScreenReaderVoiceEnabled,
    userProfile,
    setActiveSection,
    addToast,
    triggerHaptic,
    services,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickDomainDropdownOpen, setQuickDomainDropdownOpen] = useState(false);

  const toggleTheme = () => {
    triggerHaptic();
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('high-contrast');
    else setTheme('dark');
  };

  const cycleFontSize = () => {
    triggerHaptic();
    const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
    const nextIdx = (sizes.indexOf(fontSize) + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
    addToast({ type: 'info', title: 'Text Size Adjusted', message: `Font scale set to ${sizes[nextIdx].toUpperCase()}` });
  };

  const memPercent = Math.round((metrics.memoryUsedMB / metrics.memoryTotalMB) * 100);
  const cpuPercent = metrics.cpuUsage;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-3 text-slate-100"
      role="banner"
    >
      {/* Left: Mobile Toggle & Brand Context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => onToggleMobileSidebar?.()}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Quick Domain Context Pill */}
        <div className="relative">
          <button
            onClick={() => setQuickDomainDropdownOpen(!quickDomainDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-medium transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-haspopup="listbox"
            aria-expanded={quickDomainDropdownOpen}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-200 group-hover:text-white truncate max-w-[140px] sm:max-w-[200px]">
              {selectedDomain}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {quickDomainDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in"
              role="listbox"
            >
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Domain Scope
              </div>
              {domains.map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => {
                    setSelectedDomain(dom.domain);
                    setQuickDomainDropdownOpen(false);
                    addToast({ type: 'info', title: 'Domain Scope Changed', message: `Working on ${dom.domain}` });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                    selectedDomain === dom.domain
                      ? 'bg-sky-500/10 text-sky-400 font-semibold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                  role="option"
                  aria-selected={selectedDomain === dom.domain}
                >
                  <span className="truncate">{dom.domain}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {dom.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Search domains, files, databases, or commands"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
            <span>Search apps, files, mail, DNS, or run commands...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700/80 rounded-md text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Telemetry pill & Accessibility / Profile tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Real-time Telemetry Pill */}
        <div
          onClick={() => setActiveSection('metrics')}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs cursor-pointer hover:border-slate-700 transition-colors"
          title="Server Health & Resource Load"
        >
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">CPU:</span>
            <span className={`font-semibold ${cpuPercent > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
              {cpuPercent}%
            </span>
          </div>
          <div className="w-[1px] h-3 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">RAM:</span>
            <span className={`font-semibold ${memPercent > 80 ? 'text-amber-400' : 'text-slate-200'}`}>
              {memPercent}%
            </span>
          </div>
        </div>

        {/* Font Size Adjuster */}
        <button
          onClick={cycleFontSize}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          title={`Adjust font size (Current: ${fontSize.toUpperCase()})`}
          aria-label={`Adjust font size (Current: ${fontSize})`}
        >
          <Type className="w-4 h-4" />
        </button>

        {/* High Contrast / Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          title={`Switch Theme (Current: ${theme})`}
          aria-label={`Switch Theme (Current: ${theme})`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-sky-400" />
          ) : theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Eye className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Screen Reader Voice Feedback Toggle */}
        <button
          onClick={() => {
            const next = !screenReaderVoiceEnabled;
            setScreenReaderVoiceEnabled(next);
            addToast({
              type: 'info',
              title: next ? 'Screen Reader Speech Enabled' : 'Screen Reader Speech Muted',
              message: next ? 'Synthesizing voice announcements for UI actions' : 'Visual notifications only',
            });
          }}
          className={`p-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            screenReaderVoiceEnabled
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Text-to-Speech Accessibility Voice"
          aria-label="Toggle Text-to-Speech Accessibility Voice"
        >
          {screenReaderVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notifications Quick Icon */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-slate-950" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-semibold text-white">System Security & Alerts</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  All Systems Operational
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <div className="font-semibold text-slate-200">AutoSSL Wildcard Validated</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">sitindia.in SAN cert renewed for 90 days.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <div className="font-semibold text-slate-200">Daily Cloud Backup Complete</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">2.42 GB synced to AWS S3 bucket.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveSection('audit-logs');
                  setNotifDropdownOpen(false);
                }}
                className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium transition-colors text-center"
              >
                View Full Audit Logs Trail →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="User profile and settings menu"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500/40"
              referrerPolicy="no-referrer"
            />
            <span className="hidden xl:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                <div className="font-semibold text-sm text-white">{userProfile.name}</div>
                <div className="text-xs text-slate-400 truncate">{userProfile.email}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{userProfile.role}</span>
                </div>
              </div>

              <div className="space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    setActiveSection('profile-settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left"
                >
                  <User className="w-4 h-4 text-sky-400" />
                  <span>Profile & Bio Settings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection('terminal');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>SSH Terminal Access</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection('audit-logs');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 text-left"
                >
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Security Audit Logs</span>
                </button>
              </div>

              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    addToast({ type: 'info', title: 'Session Active', message: 'Signed in as ' + userProfile.username });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-300 text-left text-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Session Lock / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
