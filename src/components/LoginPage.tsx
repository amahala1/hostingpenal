import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Server,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  Mail,
  Cpu,
  Trash2,
  Terminal,
  Globe,
  Sliders,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const {
    login,
    isMasterInitialized,
    masterAccount,
    setupMasterAccount,
    resetVpsToSetupMode,
  } = useApp();

  // Mode: 'login' or 'setup' (default to 'setup' if master account not yet created)
  const [activeTab, setActiveTab] = useState<'login' | 'setup'>(
    isMasterInitialized ? 'login' : 'setup'
  );

  // Login Form state
  const [username, setUsername] = useState(masterAccount?.username || 'superadmin');
  const [password, setPassword] = useState(masterAccount ? '••••••••••••' : '••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('849201');
  const [show2FA, setShow2FA] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Master Setup Form state
  const [setupUsername, setSetupUsername] = useState('admin');
  const [setupEmail, setSetupEmail] = useState('admin@vps-server.com');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupHostname, setSetupHostname] = useState('vps-srv01.sitindia.in');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please provide a valid username or email address.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 600);
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupUsername.trim()) {
      setErrorMsg('Please enter a valid Master User ID / Username.');
      return;
    }
    if (!setupEmail.trim() || !setupEmail.includes('@')) {
      setErrorMsg('Please enter a valid root email address.');
      return;
    }
    if (!setupPassword || setupPassword.length < 6) {
      setErrorMsg('Master password must be at least 6 characters long.');
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter passwords.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setupMasterAccount({
        username: setupUsername.trim(),
        email: setupEmail.trim(),
        password: setupPassword,
        serverHostname: setupHostname.trim(),
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleQuickLogin = (roleUser: string, roleName: string) => {
    setUsername(roleUser);
    setPassword('HostAdmin@2026');
    setIsLoading(true);
    setTimeout(() => {
      login(roleUser, 'HostAdmin@2026');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      id="ha-login-screen"
      className="min-h-screen w-full flex flex-col justify-between bg-[#F8F9FD] relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%),
                          radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                          radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%)`,
      }}
    >
      {/* Top Banner Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-black text-xl tracking-wider">
            HA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">HostAdmin</span>
              <span className="ha-badge ha-badge-mango text-[11px] font-bold">PRO v2.5</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Enterprise Cloud & Server Control Panel</p>
          </div>
        </div>

        {/* Server Status Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Node: <strong className="text-purple-700 font-bold">IN-DEL-01</strong> (103.21.14.88)</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-bold">99.99% SLA</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Highlights & Features */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border border-purple-200 text-purple-900 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Next-Gen Multi-Color Infrastructure Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ultimate Control Over <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">Domains, Databases & Email</span>
          </h1>

          <p className="text-slate-600 text-base leading-relaxed">
            Manage your high-performance web servers with 1-click phpMyAdmin, built-in PHPMailer & Roundcube diagnostics, and automated dependency resolution.
          </p>

          {/* Quick Feature Pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">1-Click phpMyAdmin</p>
                <p className="text-[11px] text-slate-500">MariaDB 10.11 Ready</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-purple-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">PHPMailer Client</p>
                <p className="text-[11px] text-slate-500">SMTP Auth & Auto-Setup</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-pink-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">1-Click Plugins</p>
                <p className="text-[11px] text-slate-500">Auto-Resolves Deps</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-red-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">AutoSSL & WAF</p>
                <p className="text-[11px] text-slate-500">Fail2ban & ModSecurity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login / VPS Master Setup Card */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative overflow-hidden"
          >
            {/* Top glowing accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-t-2xl"></div>

            {/* Tab Navigation Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Sign In</span>
                {isMasterInitialized && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Master Account Active"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('setup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'setup'
                    ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:text-purple-600 bg-amber-50/80 border border-amber-200/60'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>🚀 VPS Shift & Master Setup</span>
                {!isMasterInitialized && (
                  <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-extrabold uppercase animate-pulse">
                    One-Time
                  </span>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: STANDARD / MASTER LOGIN FORM */}
            {activeTab === 'login' && (
              <div>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Control Panel</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your master administrative credentials or demo account.
                    </p>
                  </div>
                  {isMasterInitialized && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Master Active</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Username or Master Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="ha-login-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. admin or root@vps-srv01"
                        className="ha-input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Master Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShow2FA(!show2FA)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
                      >
                        {show2FA ? 'Hide 2FA' : '+ Add 2FA Code'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="ha-login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="ha-input pl-10"
                        required
                      />
                    </div>
                  </div>

                  {show2FA && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-1"
                    >
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Authenticator (TOTP) 6-Digit Token
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="ha-login-2fa"
                          type="text"
                          maxLength={6}
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          placeholder="849201"
                          className="ha-input pl-10 tracking-widest font-mono text-purple-700 font-bold"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span className="text-xs font-medium text-slate-600">Keep session active (30 days)</span>
                    </label>

                    <span className="text-xs font-medium text-slate-400">SSL 256-bit Encrypted</span>
                  </div>

                  <button
                    id="ha-btn-submit-login"
                    type="submit"
                    disabled={isLoading}
                    className="ha-btn ha-btn-purple w-full py-3 text-sm font-bold shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Authenticating System Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Control Panel</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Switcher or Master Reset options */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  {isMasterInitialized ? (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Master Account Created:</span>
                        <span className="font-mono text-purple-700 font-bold">{masterAccount?.username || username}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        All mock models have been purged. You are running in clean VPS Production Mode.
                      </p>
                      <button
                        type="button"
                        onClick={resetVpsToSetupMode}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 pt-1"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Re-enable First-Time Master Setup & Shift Mode</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        ⚡ Quick Demo Login (Pre-Setup)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('superadmin', 'Super Admin')}
                          className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition flex flex-col items-center gap-0.5"
                        >
                          <span>👑 SuperAdmin</span>
                          <span className="text-[10px] text-amber-600 font-medium">Full Root</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('reseller_pro', 'Reseller')}
                          className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition flex flex-col items-center gap-0.5"
                        >
                          <span>💼 Reseller</span>
                          <span className="text-[10px] text-purple-600 font-medium">Multi-Tenancy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('dev_lead', 'DevOps')}
                          className="px-2.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-900 text-xs font-bold transition flex flex-col items-center gap-0.5"
                        >
                          <span>💻 DevOps</span>
                          <span className="text-[10px] text-pink-600 font-medium">App Engine</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ONE-TIME VPS SHIFT & MASTER ID CREATION FORM */}
            {activeTab === 'setup' && (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      First-Time VPS Shift: Create Master ID
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter master credentials for your live VPS. This is a one-time operation that creates the super administrator account and deletes all mock models.
                  </p>
                </div>

                {/* One-Time Purge Warning Banner */}
                <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Trash2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>One-Time Action: Purge Mock Models</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Creating this Master ID will establish your permanent login and <strong>delete all sample/mock domains, databases, email accounts, and test sub-users</strong> to provide a clean production environment.
                  </p>
                </div>

                <form onSubmit={handleSetupSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Master User ID / Username *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="ha-setup-username"
                          type="text"
                          value={setupUsername}
                          onChange={(e) => setSetupUsername(e.target.value)}
                          placeholder="e.g. admin or root_master"
                          className="ha-input pl-9 text-xs font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Master Root Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="ha-setup-email"
                          type="email"
                          value={setupEmail}
                          onChange={(e) => setSetupEmail(e.target.value)}
                          placeholder="admin@yourvpsdomain.com"
                          className="ha-input pl-9 text-xs font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Create Master Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="ha-setup-password"
                          type="password"
                          value={setupPassword}
                          onChange={(e) => setSetupPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="ha-input pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Confirm Master Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="ha-setup-confirm-password"
                          type="password"
                          value={setupConfirmPassword}
                          onChange={(e) => setSetupConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="ha-input pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      VPS Hostname / Server FQDN (Optional)
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="ha-setup-hostname"
                        type="text"
                        value={setupHostname}
                        onChange={(e) => setSetupHostname(e.target.value)}
                        placeholder="e.g. vps-srv01.sitindia.in"
                        className="ha-input pl-9 text-xs font-mono text-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    id="ha-btn-submit-master-setup"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-3 transition"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Initializing Master ID & Purging Mock Models...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                        <span>Create Master ID & Initialize Live VPS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 z-10 gap-2">
        <div className="flex items-center gap-2">
          <span>HostAdmin Enterprise Server Suite</span>
          <span>•</span>
          <span className="text-slate-600">Kernel 6.8.0-45-generic #45 SMP</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-amber-600 font-semibold">● Mango Gold</span>
          <span className="text-purple-600 font-semibold">● Royal Purple</span>
          <span className="text-pink-600 font-semibold">● Rose Pink</span>
          <span className="text-red-600 font-semibold">● Ruby Red</span>
        </div>
      </footer>
    </div>
  );
};
