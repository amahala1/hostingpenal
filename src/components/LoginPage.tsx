import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Database, Mail, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, masterAccount } = useApp();
  const [username, setUsername] = useState(masterAccount?.username || 'superadmin');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter your username and password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(username.trim(), password, rememberMe);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ha-login-screen"
      className="min-h-screen w-full flex flex-col justify-between bg-[#F8F9FD] relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%)',
      }}
    >
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
            <p className="text-xs font-medium text-slate-500">Enterprise Cloud &amp; Server Control Panel</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Node: <strong className="text-purple-700 font-bold">server1.sitindia.in</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-bold">SSL Encrypted</span>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-8 my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border border-purple-200 text-purple-900 text-xs font-bold shadow-sm">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Enterprise Multi-Tenant Server Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            High-Performance <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">Control Panel</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Manage your websites, domains, MySQL databases, email accounts, and server security with real-time telemetry and 1-click phpMyAdmin.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><Database className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold text-slate-800">1-Click phpMyAdmin</p><p className="text-[11px] text-slate-500">MariaDB Ready</p></div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-purple-200/80 shadow-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold text-slate-800">Roundcube Webmail</p><p className="text-[11px] text-slate-500">SSL IMAP/SMTP</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-t-2xl" />
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Control Panel</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your master administrative credentials.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Username or Master Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input id="ha-login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="superadmin" className="ha-input pl-10 text-sm font-semibold text-slate-800" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Master Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input id="ha-login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="ha-input pl-10 text-sm" required />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4" />
                  <span className="text-xs font-medium text-slate-600">Keep session active</span>
                </label>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /><span>SSL 256-bit Encrypted</span></div>
              </div>
              <button id="ha-btn-submit-login" type="submit" disabled={isLoading} className="ha-btn ha-btn-purple w-full py-3 text-sm font-bold shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 mt-3">
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Authenticating System Session...</span></>
                ) : (
                  <><span>Enter Control Panel</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 z-10 gap-2">
        <div className="flex items-center gap-2"><span>HostAdmin Enterprise Control Panel</span><span>•</span><span className="text-slate-600">server1.sitindia.in</span></div>
        <div className="flex items-center gap-3 text-xs font-medium"><span className="text-emerald-600 font-semibold">● System Online</span><span className="text-purple-600 font-semibold">● SSL TLS 1.3 Active</span></div>
      </footer>
    </div>
  );
};
