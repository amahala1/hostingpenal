import React from 'react';
import { useApp } from '../context/AppContext';
import { X, LogOut } from 'lucide-react';
import { NavSection } from '../types';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const {
    activeSection,
    setActiveSection,
    domains,
    emailAccounts,
    databases,
    plugins,
    systemVersion,
    launchPhpMyAdmin,
    launchPhpMailerTest,
    launchVpsInstaller,
    isVpsInstalled,
    logout,
    userProfile,
    triggerHaptic,
    announceToScreenReader,
  } = useApp();

  const navGroups: {
    label: string;
    items: {
      id: NavSection;
      title: string;
      badge?: string | number;
      badgeColor?: string;
      onClickCustom?: () => void;
    }[];
  }[] = [
    {
      label: 'Main Control',
      items: [
        {
          id: 'overview',
          title: 'Dashboard Overview',
        },
      ],
    },
    {
      label: 'Websites & Files',
      items: [
        {
          id: 'websites',
          title: 'Domain Management',
          badge: domains?.length || 0,
          badgeColor: 'ha-badge-mango',
        },
        {
          id: 'file-manager',
          title: 'File Manager & Editor',
          badge: 'Ruler',
          badgeColor: 'ha-badge-blue',
        },
        {
          id: 'php-manager',
          title: 'PHP Settings & FPM',
          badge: 'v8.3',
          badgeColor: 'ha-badge-purple',
        },
      ],
    },
    {
      label: 'Databases & phpMyAdmin',
      items: [
        {
          id: 'databases',
          title: 'MySQL Databases',
          badge: databases?.length || 0,
          badgeColor: 'ha-badge-mango',
        },
        {
          id: 'phpmyadmin',
          title: '1-Click phpMyAdmin',
          badge: userProfile.username,
          badgeColor: 'ha-badge-purple',
          onClickCustom: () => launchPhpMyAdmin(),
        },
      ],
    },
    {
      label: 'Email & Communications',
      items: [
        {
          id: 'email',
          title: 'Email Accounts & Forwarders',
          badge: emailAccounts?.length || 0,
          badgeColor: 'ha-badge-pink',
        },
        {
          id: 'roundcube',
          title: 'Roundcube Webmail',
          badge: 'Live',
          badgeColor: 'ha-badge-blue',
        },
        {
          id: 'phpmailer-client',
          title: 'PHPMailer SMTP Suite',
          badge: 'SMTP',
          badgeColor: 'ha-badge-purple',
          onClickCustom: () => launchPhpMailerTest(),
        },
      ],
    },
    {
      label: 'Security & Network',
      items: [
        {
          id: 'ssl-security',
          title: 'SSL Certificates (AutoSSL)',
          badge: '100%',
          badgeColor: 'ha-badge-emerald',
        },
        {
          id: 'dns-editor',
          title: 'DNS Zone Records',
        },
      ],
    },
    {
      label: 'System & Automation',
      items: [
        {
          id: 'vps-installer',
          title: '1-Click VPS Auto-Installer',
          badge: isVpsInstalled ? 'Installed' : 'Setup Required',
          badgeColor: isVpsInstalled ? 'ha-badge-emerald' : 'ha-badge-red',
          onClickCustom: () => launchVpsInstaller(),
        },
        {
          id: 'terminal',
          title: 'Web SSH Terminal',
          badge: 'Live',
          badgeColor: 'ha-badge-purple',
        },
        {
          id: 'metrics',
          title: 'Server Telemetry & Status',
        },
        {
          id: 'cron',
          title: 'Cron Job Scheduler',
        },
        {
          id: 'backups',
          title: 'Automated Backups',
        },
        {
          id: 'plugins',
          title: '1-Click Plugins Store',
          badge: `${plugins.filter((p) => p.installed).length}/${plugins.length}`,
          badgeColor: 'ha-badge-pink',
        },
        {
          id: 'settings',
          title: 'System Version & Updates',
          badge: systemVersion.hasUpdate ? 'Update' : `v${systemVersion.currentVersion}`,
          badgeColor: systemVersion.hasUpdate ? 'ha-badge-red' : 'ha-badge-emerald',
        },
      ],
    },
  ];

  const handleNavClick = (id: NavSection, title: string, customClick?: () => void) => {
    triggerHaptic();
    announceToScreenReader(`Navigated to ${title}`);
    if (customClick) {
      customClick();
    } else {
      setActiveSection(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="ha-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header - Pure Clean Light Indian Web Hosting Style */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20">
              HA
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">HostAdmin</span>
                <span className="ha-badge ha-badge-mango text-[10px] py-0 px-1.5 font-bold">PRO</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">Node IN-DEL-01 • v{systemVersion.currentVersion}</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Links - Text Only without symbols as requested */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id, item.title, item.onClickCustom)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                          : 'text-slate-700 hover:bg-purple-50 hover:text-purple-900'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>

                      {item.badge !== undefined && (
                        <span
                          className={`ha-badge text-[10px] py-0.5 px-2 font-bold ${
                            isActive ? 'bg-white/25 text-white' : item.badgeColor || 'ha-badge-purple'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                {userProfile.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{userProfile.username}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Secure Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
