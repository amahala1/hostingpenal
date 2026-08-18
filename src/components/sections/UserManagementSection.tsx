import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  HardDrive,
  Activity,
  Database,
  Mail,
  FolderSync,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  Trash2,
  Edit2,
  Lock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  Server,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServerAccountUser } from '../../types';

export const UserManagementSection: React.FC = () => {
  const {
    serverUsers,
    createServerUser,
    updateServerUser,
    deleteServerUser,
    toggleUserStatus,
    loginAsUser,
    domains,
    networkTelemetry,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ServerAccountUser | null>(null);

  // Form State for User Creation
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPackage, setFormPackage] = useState('Standard Web (20GB)');
  const [formDiskQuotaMB, setFormDiskQuotaMB] = useState(20000);
  const [formBwQuotaMB, setFormBwQuotaMB] = useState(100000);
  const [formDbLimit, setFormDbLimit] = useState(10);
  const [formEmailLimit, setFormEmailLimit] = useState(25);
  const [formFtpLimit, setFormFtpLimit] = useState(5);
  const [formSshAccess, setFormSshAccess] = useState(true);
  const [formPhpVersion, setFormPhpVersion] = useState('8.3');
  const [formSslEnabled, setFormSslEnabled] = useState(true);

  const packages = [
    { name: 'Enterprise Pro (Unlimited)', diskMB: 50000, bwMB: 200000, db: 50, email: 100, ftp: 20 },
    { name: 'Standard Web (20GB)', diskMB: 20000, bwMB: 100000, db: 10, email: 25, ftp: 5 },
    { name: 'Developer Startup (10GB)', diskMB: 10000, bwMB: 50000, db: 5, email: 10, ftp: 2 },
    { name: 'Basic Sandbox (5GB)', diskMB: 5000, bwMB: 20000, db: 2, email: 5, ftp: 1 },
  ];

  const handlePackageSelect = (pkgName: string) => {
    setFormPackage(pkgName);
    const selected = packages.find((p) => p.name === pkgName);
    if (selected) {
      setFormDiskQuotaMB(selected.diskMB);
      setFormBwQuotaMB(selected.bwMB);
      setFormDbLimit(selected.db);
      setFormEmailLimit(selected.email);
      setFormFtpLimit(selected.ftp);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername || !formDomain) return;

    createServerUser({
      username: formUsername.toLowerCase().trim(),
      domain: formDomain.toLowerCase().trim(),
      email: formEmail || `admin@${formDomain.toLowerCase().trim()}`,
      packageName: formPackage,
      diskQuotaMB: formDiskQuotaMB,
      bandwidthQuotaMB: formBwQuotaMB,
      dbLimit: formDbLimit,
      emailLimit: formEmailLimit,
      ftpLimit: formFtpLimit,
      sshAccess: formSshAccess,
      phpVersion: formPhpVersion,
      sslEnabled: formSslEnabled,
      status: 'active',
    });

    // Reset & close
    setFormUsername('');
    setFormPassword('');
    setFormDomain('');
    setFormEmail('');
    setCreateModalOpen(false);
  };

  const filteredUsers = serverUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
              User Accounts & Reseller Manager
            </h1>
            <p className="text-xs text-slate-600">
              Provision sub-accounts, configure Linux user quotas, manage domain document roots, and login as users.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User Account</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {serverUsers.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {serverUsers.filter((u) => u.status === 'active').length} Active Accounts
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Allocated Disk Quota</span>
            <HardDrive className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {(serverUsers.reduce((acc, u) => acc + u.diskQuotaMB, 0) / 1024).toFixed(0)} GB
          </div>
          <div className="text-[11px] text-slate-500">
            Used: {(serverUsers.reduce((acc, u) => acc + u.diskUsedMB, 0) / 1024).toFixed(1)} GB of {networkTelemetry.totalDiskGB} GB
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Allocated Bandwidth</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {(serverUsers.reduce((acc, u) => acc + u.bandwidthQuotaMB, 0) / 1024).toFixed(0)} GB
          </div>
          <div className="text-[11px] text-slate-500">
            Monthly aggregate limit
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Server Public IP</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {networkTelemetry.publicIp}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Port 80/443/53/993 Live
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts by username, primary domain, package, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Accounts ({serverUsers.length})</option>
            <option value="active">Active ({serverUsers.filter((u) => u.status === 'active').length})</option>
            <option value="suspended">Suspended ({serverUsers.filter((u) => u.status === 'suspended').length})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User / Account</th>
                <th className="py-3 px-4">Primary Domain</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Disk Usage</th>
                <th className="py-3 px-4">Bandwidth</th>
                <th className="py-3 px-4">Features</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 font-mono uppercase">
                        {user.username.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono">
                          {user.username}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-sky-700 font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-sky-500" />
                      <span>{user.domain}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      /home/{user.username}/public_html
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {user.packageName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1 w-28">
                      <div className="text-[11px] text-slate-700 font-mono font-medium flex justify-between">
                        <span>{user.diskUsedMB} MB</span>
                        <span className="text-slate-400">/ {user.diskQuotaMB} MB</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (user.diskUsedMB / user.diskQuotaMB) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1 w-28">
                      <div className="text-[11px] text-slate-700 font-mono font-medium flex justify-between">
                        <span>{(user.bandwidthUsedMB / 1024).toFixed(1)} GB</span>
                        <span className="text-slate-400">/ {(user.bandwidthQuotaMB / 1024).toFixed(0)} GB</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (user.bandwidthUsedMB / user.bandwidthQuotaMB) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span title="Databases">{user.dbLimit} DBs</span>
                      <span>•</span>
                      <span title="PHP Version">PHP {user.phpVersion}</span>
                      <span>•</span>
                      <span className={user.sshAccess ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {user.sshAccess ? 'SSH' : 'No SSH'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {user.status === 'active' ? '● Active' : '○ Suspended'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => loginAsUser(user.username)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold transition-colors"
                        title="Login as User into cPanel Grid View"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Login as User</span>
                      </button>

                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        title="Edit Quotas"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {user.username !== 'sitindia' && (
                        <button
                          onClick={() => deleteServerUser(user.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Create New Server User Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provisions Linux system user, /home docroot, and cPanel access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Account Username *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. client_demo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Primary Domain *</label>
                  <input
                    type="text"
                    required
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value.toLowerCase())}
                    placeholder="e.g. clientdomain.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Password</label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Auto-generate secure key"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. user@clientdomain.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Package Presets */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Hosting Package Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {packages.map((pkg) => (
                    <button
                      type="button"
                      key={pkg.name}
                      onClick={() => handlePackageSelect(pkg.name)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        formPackage === pkg.name
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold ring-1 ring-indigo-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px]">{pkg.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {pkg.diskMB / 1024}GB Disk • {pkg.bwMB / 1024}GB Bandwidth
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quotas */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">Disk Quota (MB)</label>
                  <input
                    type="number"
                    value={formDiskQuotaMB}
                    onChange={(e) => setFormDiskQuotaMB(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">Databases Limit</label>
                  <input
                    type="number"
                    value={formDbLimit}
                    onChange={(e) => setFormDbLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">PHP Runtime</label>
                  <select
                    value={formPhpVersion}
                    onChange={(e) => setFormPhpVersion(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="8.3">PHP 8.3 (Recommended)</option>
                    <option value="8.2">PHP 8.2 (LTS)</option>
                    <option value="8.4">PHP 8.4 (Latest)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSshAccess}
                    onChange={(e) => setFormSshAccess(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Allow SSH Shell Access</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSslEnabled}
                    onChange={(e) => setFormSslEnabled(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Issue Let's Encrypt AutoSSL</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Quotas Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Edit Quota: @{editingUser.username}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Disk Quota (MB)</label>
                <input
                  type="number"
                  value={editingUser.diskQuotaMB}
                  onChange={(e) => setEditingUser({ ...editingUser, diskQuotaMB: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Bandwidth Limit (MB)</label>
                <input
                  type="number"
                  value={editingUser.bandwidthQuotaMB}
                  onChange={(e) => setEditingUser({ ...editingUser, bandwidthQuotaMB: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Max Databases</label>
                <input
                  type="number"
                  value={editingUser.dbLimit}
                  onChange={(e) => setEditingUser({ ...editingUser, dbLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateServerUser(editingUser.id, editingUser);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Quotas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
