import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Key,
  Sun,
  Moon,
  Contrast,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  Clock,
  Laptop,
  Lock,
  Save,
  Sliders,
  Eye,
  Sparkles,
  ArrowUpCircle,
  RefreshCw,
  Layers,
  Terminal,
  Check,
  AlertTriangle,
  Server,
  Zap,
  DownloadCloud,
} from 'lucide-react';

export const ProfileSettingsSection: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    systemVersion,
    performSystemUpdate,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    hapticEnabled,
    setHapticEnabled,
    screenReaderVoiceEnabled,
    setScreenReaderVoiceEnabled,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'update' | 'profile' | 'security' | 'appearance' | 'api'>('update');
  const [username, setUsername] = useState(userProfile.username || 'sitindia_admin');
  const [email, setEmail] = useState(userProfile.email || 'admin@sitindia.in');
  const [fullName, setFullName] = useState(userProfile.name || 'Ashok Mahala');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    updateUserProfile({ username, email, name: fullName });
    addToast({ type: 'success', title: 'Profile Saved', message: 'Administrator details updated.' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast({ type: 'error', title: 'Password Mismatch', message: 'New passwords do not match.' });
      return;
    }
    triggerHaptic();
    addToast({ type: 'success', title: 'Password Changed', message: 'New administrative password is now active.' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleTriggerUpdate = async () => {
    triggerHaptic();
    await performSystemUpdate();
  };

  return (
    <div id="ha-section-settings" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 rounded-3xl text-white shadow-lg shadow-purple-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>HostAdmin Server Settings & Upgrade Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Settings & System Version Manager
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl font-medium">
            Manage system updates with zero-downtime pre-flight backups, administrator credentials, 2FA tokens, and accessibility preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>v{systemVersion.currentVersion} {systemVersion.hasUpdate ? '(Update Ready)' : '(Latest)'}</span>
          </span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="p-2 bg-white border border-slate-200/80 rounded-2xl flex flex-wrap gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('update')}
          className={`ha-tab text-xs font-bold py-2 px-4 flex items-center gap-2 ${
            activeTab === 'update' ? 'ha-tab-active' : ''
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>System Version & Update</span>
          {systemVersion.hasUpdate && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px]">
              NEW
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`ha-tab text-xs font-bold py-2 px-4 flex items-center gap-2 ${
            activeTab === 'profile' ? 'ha-tab-active' : ''
          }`}
        >
          <User className="w-4 h-4" />
          <span>Admin Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`ha-tab text-xs font-bold py-2 px-4 flex items-center gap-2 ${
            activeTab === 'security' ? 'ha-tab-active' : ''
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & 2FA</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`ha-tab text-xs font-bold py-2 px-4 flex items-center gap-2 ${
            activeTab === 'appearance' ? 'ha-tab-active' : ''
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Theme & Accessibility</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`ha-tab text-xs font-bold py-2 px-4 flex items-center gap-2 ${
            activeTab === 'api' ? 'ha-tab-active' : ''
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Access Keys</span>
        </button>
      </div>

      {/* Tab: System Version & Update */}
      {activeTab === 'update' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Update Overview & Trigger */}
            <div className="lg:col-span-7 space-y-6">
              <div className="ha-card p-6 border-purple-200 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="ha-badge ha-badge-purple text-xs font-bold">RELEASE CHANNEL: STABLE</span>
                      <span className="text-slate-400 text-xs">• Released {systemVersion.releaseDate}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      HostAdmin Pro <span className="text-purple-600 font-extrabold">v{systemVersion.latestVersion} Enterprise</span>
                    </h2>
                    <p className="text-xs text-slate-600">
                      Currently installed version: <strong className="text-slate-800">v{systemVersion.currentVersion}</strong>
                    </p>
                  </div>

                  {systemVersion.hasUpdate ? (
                    <span className="ha-badge ha-badge-mango text-xs font-bold px-3 py-1 animate-pulse-subtle">
                      Update Available
                    </span>
                  ) : (
                    <span className="ha-badge ha-badge-emerald text-xs font-bold px-3 py-1">
                      <Check className="w-3.5 h-3.5" /> System Up-To-Date
                    </span>
                  )}
                </div>

                {/* Dependency Check List */}
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Pre-Flight Automated Dependency Verification
                    </span>
                    <span className="text-purple-700">Auto-Resolved</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(systemVersion?.requiredDependencies || []).map((dep, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-purple-100 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div className="font-mono text-[11px] text-slate-800">
                          <span className="font-bold">{dep.name}</span>
                          <span className="text-slate-400 ml-1">({dep.version})</span>
                        </div>
                        {dep.status === 'ok' ? (
                          <span className="ha-badge ha-badge-emerald text-[10px]">VERIFIED</span>
                        ) : (
                          <span className="ha-badge ha-badge-mango text-[10px]">AUTO-INSTALL</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-flight Backup Guarantee */}
                <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Zero-Downtime Guarantee:</strong> An automated pre-upgrade full system snapshot is created before applying patches. FastCGI sessions remain active.
                  </span>
                </div>

                {/* Action Update Button */}
                {systemVersion.hasUpdate ? (
                  <button
                    onClick={handleTriggerUpdate}
                    disabled={systemVersion.isUpdating}
                    className="ha-btn ha-btn-purple w-full py-3 text-sm font-bold shadow-md shadow-purple-500/25 flex items-center justify-center gap-2"
                  >
                    {systemVersion.isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Applying Upgrade & Resolving Dependencies ({systemVersion.updateProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-4 h-4" />
                        <span>Perform 1-Click System Upgrade to v{systemVersion.latestVersion}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="ha-btn ha-btn-white w-full py-3 text-sm font-bold text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>HostAdmin is Running the Latest v{systemVersion.currentVersion} Enterprise Build</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Box: Live Upgrade Logs or Changelog */}
            <div className="lg:col-span-5 space-y-6">
              {systemVersion.isUpdating || systemVersion.updateLog.length > 0 ? (
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-lg font-mono text-xs flex flex-col h-full min-h-[380px]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-slate-300">Upgrade Daemon Console</span>
                    </div>
                    <span className="ha-badge ha-badge-purple text-[10px]">
                      {systemVersion.updateProgress}% COMPLETED
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${systemVersion.updateProgress}%` }}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed text-slate-300 pr-1">
                    {(systemVersion?.updateLog || []).map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.includes('🚀') || line.includes('successfully')
                            ? 'text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded'
                            : line.includes('✓')
                            ? 'text-purple-300'
                            : line.includes('[Step')
                            ? 'text-amber-300 font-semibold'
                            : 'text-slate-300'
                        }
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ha-card p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    What's New in Version {systemVersion?.latestVersion || '2.5.0'}
                  </h3>

                  <div className="space-y-4">
                    {(systemVersion?.changelog || []).map((entry, idx) => (
                      <div key={idx} className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-900">{entry.version}</span>
                          <span className="text-[11px] text-slate-400">{entry.date}</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {(entry?.items || []).map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2">
                              <span className="text-purple-500 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Admin Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl ha-card p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Master Administrator Credentials</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Administrator Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="ha-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Root Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ha-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                System Notification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ha-input"
                required
              />
            </div>

            <button type="submit" className="ha-btn ha-btn-purple py-2.5 px-5 text-xs font-bold">
              <Save className="w-4 h-4" />
              <span>Save Profile Information</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ha-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-pink-600" />
              <span>Change Master Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="ha-input"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="ha-input"
                  placeholder="Min 12 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="ha-input"
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <button type="submit" className="ha-btn ha-btn-pink py-2.5 px-5 text-xs font-bold">
                Update Master Password
              </button>
            </form>
          </div>

          <div className="ha-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Two-Factor Authentication (TOTP)</span>
            </h3>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2FA Protection is Active</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Google Authenticator / Authy tokens are enforced for all logins from new IP addresses.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'TOTP Secret Generated',
                    message: 'New QR code rendered for authenticator app pairing.',
                  });
                }}
                className="ha-btn ha-btn-white w-full py-2.5 text-xs font-bold"
              >
                Re-Pair Authenticator App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Appearance & Accessibility */}
      {activeTab === 'appearance' && (
        <div className="max-w-3xl ha-card p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <span>Theme & Accessibility Display Settings</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Color Palette & Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setTheme('light');
                    setHighContrast(false);
                    triggerHaptic();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    theme === 'light' && !highContrast
                      ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="text-xs">Bright Multi-Color Light</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('dark');
                    setHighContrast(false);
                    triggerHaptic();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    theme === 'dark' && !highContrast
                      ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Moon className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Deep Slate Dark</span>
                </button>

                <button
                  onClick={() => {
                    setHighContrast(!highContrast);
                    triggerHaptic();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    highContrast
                      ? 'bg-pink-50 border-pink-400 text-pink-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Contrast className="w-5 h-5 text-pink-500" />
                  <span className="text-xs">High Contrast (WCAG)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Font Scaling Scale
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size);
                      triggerHaptic();
                    }}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                      fontSize === size
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size} ({size === 'sm' ? '14px' : size === 'md' ? '16px' : size === 'lg' ? '18px' : '20px'})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: API Access Keys */}
      {activeTab === 'api' && (
        <div className="max-w-3xl ha-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              <span>HostAdmin RESTful API Tokens</span>
            </h2>
            <button
              onClick={() => {
                addToast({ type: 'success', title: 'New API Key Created', message: 'Secret token: ha_live_89172401823901' });
              }}
              className="ha-btn ha-btn-purple py-1.5 px-3 text-xs"
            >
              + Generate New Token
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-800">ha_live_94810283401928401928</span>
              <span className="ha-badge ha-badge-emerald text-[10px]">READ_WRITE_ROOT</span>
            </div>
            <p className="text-[11px] text-slate-500">Created on 2026-06-10 • Used by Terraform Provisioner</p>
          </div>
        </div>
      )}
    </div>
  );
};
