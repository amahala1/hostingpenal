import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  Database,
  Mail,
  FileCode,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VpsInstallerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    isVpsInstalled,
    vpsInstallProgress,
    vpsInstallLogs,
    runVpsAutoInstall,
    addToast,
    triggerHaptic,
  } = useApp();

  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleStartAutoInstall = async () => {
    triggerHaptic();
    setIsInstalling(true);
    await runVpsAutoInstall();
    setIsInstalling(false);
  };

  const stackItems = [
    { title: 'Apache 2.4 & Nginx HTTP Engine', desc: 'Reverse proxy, event MPM, HTTP/2, Brotli compression (Ports 80, 443)' },
    { title: 'PHP 8.2 & PHP 8.3 FPM Multi-Runtime', desc: 'php-imap, mbstring, pdo_mysql, intl, gd, zip, xml, opcache, curl' },
    { title: 'MariaDB 10.11 Enterprise Database', desc: 'InnoDB engine, utf8mb4 collation, roundcubemail & app databases' },
    { title: 'phpMyAdmin 5.2.2 Web Interface', desc: '1-Click root/user access with blowfish encryption' },
    { title: 'Postfix MTA & Dovecot IMAP Server', desc: 'SMTP TLS on port 587/465, IMAP SSL 993, OpenDKIM & SPF' },
    { title: 'Roundcube Webmail Engine', desc: 'Automated DB setup, PHP-IMAP link, SSL certificates for webmail subdomain' },
    { title: 'BIND9 Authoritative DNS Server', desc: 'Port 53 UDP/TCP handler for Child Nameservers (ns1/ns2.sitindia.in)' },
    { title: 'Certbot Let\'s Encrypt AutoSSL', desc: 'Automated 90-day SSL renewal daemon & HTTPS redirects' },
    { title: 'UFW Firewall (All Ports Auto-Opened)', desc: 'Ports 22, 53, 80, 443, 25, 587, 465, 143, 993, 110, 995, 3306' },
  ];

  return (
    <div className="vps-modal-backdrop animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="vps-modal-card flex flex-col overflow-hidden"
      >
        {/* Top Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg shadow-inner">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">1-Click VPS Auto-Installer</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-bold uppercase">
                  Fully Automated
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Zero SSH manual commands needed • Complete web server, database, phpMyAdmin, mail & composer suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isInstalling}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-[#FAFAFE]">
          {/* Status Alert */}
          {isVpsInstalled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-950">VPS Server Stack is 100% Installed and Active!</p>
                <p className="text-emerald-800 mt-0.5">
                  Apache, PHP 8.3, MariaDB, phpMyAdmin, Exim4, Roundcube, and Composer are fully configured and running live.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-amber-950">Zero-Touch VPS Deployment Ready</p>
                <p className="text-amber-800 mt-0.5">
                  Click the button below to start the fully automated background installation. You do not need to open SSH terminal or execute any manual commands.
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar (Visible during or after installation) */}
          {(isInstalling || isVpsInstalled) && (
            <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span>Installation Progress</span>
                </span>
                <span className="font-mono text-purple-700">{vpsInstallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${vpsInstallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Auto-Discovered Packages Matrix */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Automated Stack Components Included</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {stackItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 hover:border-purple-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Real-time Installation Terminal Log (Light Theme) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>Live Automated Execution Log</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Stream: stdout/stderr</span>
            </div>
            <div className="vps-terminal-light space-y-1">
              {vpsInstallLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('[SUCCESS]')
                      ? 'log-success'
                      : log.includes('[STEP')
                      ? 'log-cmd'
                      : log.includes('[WARN]')
                      ? 'log-warn'
                      : 'log-info'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Requirement: Ubuntu 22.04 / 24.04 LTS or Debian 12
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isInstalling}
              className="ha-btn ha-btn-white text-xs"
            >
              Close
            </button>

            {!isVpsInstalled ? (
              <button
                onClick={handleStartAutoInstall}
                disabled={isInstalling}
                className="ha-btn ha-btn-purple text-xs font-bold shadow-md shadow-purple-500/20"
              >
                {isInstalling ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Auto-Installing Stack ({vpsInstallProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start 1-Click VPS Auto-Install</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleStartAutoInstall}
                disabled={isInstalling}
                className="ha-btn ha-btn-mango text-xs font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>Re-Verify & Repair Services</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
