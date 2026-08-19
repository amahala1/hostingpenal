import React from 'react';
import { useApp } from '../context/AppContext';
import { X, LogOut } from 'lucide-react';
import { NavSection } from '../types';
import { InstallProgressWidget } from './InstallProgressWidget';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const {
    activeSection,
    setActiveSection,
    domains,
    systemVersion,
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
      label: 'Core Server Tools',
      items: [
        { id: 'websites', title: 'Add New Domain', badge: domains?.length || 0, badgeColor: 'ha-badge-mango' },
        { id: 'file-manager', title: 'File Manager', badge: 'Files', badgeColor: 'ha-badge-blue' },
        { id: 'dns-editor', title: 'DNS Zone Editor', badge: 'Zone', badgeColor: 'ha-badge-emerald' },
        { id: 'phpmyadmin', title: 'phpMyAdmin', badge: 'v5.2.2', badgeColor: 'ha-badge-purple' },
        { id: 'roundcube', title: 'Roundcube Webmail', badge: 'v1.7.3', badgeColor: 'ha-badge-blue' },
      ],
    },
  ];

  const handleNavClick = (id: NavSection, title: string, customClick?: () => void) => {
    triggerHaptic();
    announceToScreenReader(`Navigated to ${title}`);
    if (customClick) customClick();
    else setActiveSection(id);
    onCloseMobile?.();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/55 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="ha-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="hp-sidebar-brand p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hp-sidebar-logo w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0">
              HA
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="hp-sidebar-title font-extrabold text-base tracking-tight truncate">HostAdmin</span>
                <span className="ha-badge ha-badge-mango text-[10px] py-0 px-1.5 font-bold">PRO</span>
              </div>
              <p className="hp-sidebar-muted text-[11px] font-medium truncate">Node IN-DEL-01 • v{systemVersion.currentVersion}</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="hp-sidebar-nav flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="hp-sidebar-group-label px-3 py-1 text-[10px] font-bold uppercase">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id, item.title, item.onClickCustom)}
                      className={`hp-sidebar-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive ? 'hp-sidebar-item-active' : ''
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge !== undefined && (
                        <span className={`hp-sidebar-badge ha-badge text-[10px] py-0.5 px-2 font-bold ${isActive ? '' : item.badgeColor || 'ha-badge-purple'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <InstallProgressWidget />
        </div>

        <div className="hp-sidebar-footer p-3">
          <div className="hp-sidebar-user flex items-center justify-between p-2 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userProfile.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="hp-sidebar-title text-xs font-bold truncate">{userProfile.name}</p>
                <p className="hp-sidebar-muted text-[10px] font-mono truncate">{userProfile.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Secure Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition"
              aria-label="Secure logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
