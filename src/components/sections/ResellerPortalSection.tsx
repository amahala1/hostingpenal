import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Package,
  HardDrive,
  Activity,
  Database,
  Mail,
  Shield,
  Search,
  Plus,
  LogIn,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Globe,
  X,
  Layers,
  Percent,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServerAccountUser } from '../../types';

export interface HostingPackage {
  id: string;
  name: string;
  diskQuotaMB: number;
  bandwidthQuotaMB: number;
  dbLimit: number;
  emailLimit: number;
  ftpLimit: number;
  sshAccess: boolean;
  pricePerMonth?: string;
  isPopular?: boolean;
}

export const INITIAL_PACKAGES: HostingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Enterprise Pro (Unlimited)',
    diskQuotaMB: 50000,
    bandwidthQuotaMB: 200000,
    dbLimit: 50,
    emailLimit: 100,
    ftpLimit: 20,
    sshAccess: true,
    pricePerMonth: '$49.99',
    isPopular: true,
  },
  {
    id: 'pkg-2',
    name: 'Standard Web (20GB)',
    diskQuotaMB: 20000,
    bandwidthQuotaMB: 100000,
    dbLimit: 10,
    emailLimit: 25,
    ftpLimit: 5,
    sshAccess: true,
    pricePerMonth: '$19.99',
  },
  {
    id: 'pkg-3',
    name: 'Developer Startup (10GB)',
    diskQuotaMB: 10000,
    bandwidthQuotaMB: 50000,
    dbLimit: 5,
    emailLimit: 10,
    ftpLimit: 2,
    sshAccess: false,
    pricePerMonth: '$9.99',
  },
  {
    id: 'pkg-4',
    name: 'Basic Sandbox (5GB)',
    diskQuotaMB: 5000,
    bandwidthQuotaMB: 20000,
    dbLimit: 2,
    emailLimit: 5,
    ftpLimit: 1,
    sshAccess: false,
    pricePerMonth: '$4.99',
  },
];

export const ResellerPortalSection: React.FC = () => {
  const {
    serverUsers,
    createServerUser,
    deleteServerUser,
    toggleUserStatus,
    loginAsUser,
    addToast,
    triggerHaptic,
    userProfile,
    networkTelemetry,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'create-user' | 'packages' | 'pool'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Defined Packages State
  const [packages, setPackages] = useState<HostingPackage[]>(INITIAL_PACKAGES);

  // New Package Form State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDiskMB, setNewPkgDiskMB] = useState(15000);
  const [newPkgBwMB, setNewPkgBwMB] = useState(75000);
  const [newPkgDbLimit, setNewPkgDbLimit] = useState(10);
  const [newPkgEmailLimit, setNewPkgEmailLimit] = useState(20);
  const [newPkgFtpLimit, setNewPkgFtpLimit] = useState(5);
  const [newPkgSsh, setNewPkgSsh] = useState(true);
  const [newPkgPrice, setNewPkgPrice] = useState('$14.99');

  // New Customer Form State
  const [custUsername, setCustUsername] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custDomain, setCustDomain] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [selectedPkgName, setSelectedPkgName] = useState(packages[1]?.name || 'Standard Web (20GB)');
  const [custPhpVersion, setCustPhpVersion] = useState('8.3');
  const [custSslEnabled, setCustSslEnabled] = useState(true);

  // Calculated totals
  const totalAllocatedDiskMB = serverUsers.reduce((acc, u) => acc + u.diskQuotaMB, 0);
  const totalUsedDiskMB = serverUsers.reduce((acc, u) => acc + u.diskUsedMB, 0);
  const resellerDiskPoolMB = 500000; // 500 GB Reseller Quota Pool

  const totalAllocatedBwMB = serverUsers.reduce((acc, u) => acc + u.bandwidthQuotaMB, 0);
  const resellerBwPoolMB = 2000000; // 2 TB Reseller Bandwidth Pool

  const filteredUsers = serverUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;

    const newPackage: HostingPackage = {
      id: `pkg-${Date.now()}`,
      name: newPkgName.trim(),
      diskQuotaMB: newPkgDiskMB,
      bandwidthQuotaMB: newPkgBwMB,
      dbLimit: newPkgDbLimit,
      emailLimit: newPkgEmailLimit,
      ftpLimit: newPkgFtpLimit,
      sshAccess: newPkgSsh,
      pricePerMonth: newPkgPrice || '$14.99',
    };

    setPackages((prev) => [newPackage, ...prev]);
    setShowPackageModal(false);
    setNewPkgName('');

    addToast({
      type: 'success',
      title: 'Hosting Package Defined',
      message: `Successfully created new hosting plan '${newPackage.name}'. Ready for sub-user provisioning.`,
    });
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custUsername.trim() || !custDomain.trim()) return;

    const selectedPkg = packages.find((p) => p.name === selectedPkgName) || packages[0];

    createServerUser({
      username: custUsername.toLowerCase().trim(),
      domain: custDomain.toLowerCase().trim(),
      email: custEmail.trim() || `admin@${custDomain.toLowerCase().trim()}`,
      packageName: selectedPkg.name,
      diskQuotaMB: selectedPkg.diskQuotaMB,
      bandwidthQuotaMB: selectedPkg.bandwidthQuotaMB,
      dbLimit: selectedPkg.dbLimit,
      emailLimit: selectedPkg.emailLimit,
      ftpLimit: selectedPkg.ftpLimit,
      sshAccess: selectedPkg.sshAccess,
      phpVersion: custPhpVersion,
      sslEnabled: custSslEnabled,
      status: 'active',
    });

    setCustUsername('');
    setCustPassword('');
    setCustDomain('');
    setCustEmail('');
    setActiveTab('users');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Reseller Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/30 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-500/30 shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight font-display">Reseller Hosting Control Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                  ★ Gold Partner
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Signed in as <strong className="text-white font-bold">{userProfile.username}</strong>. Scope: Package Creation, Customer Account Provisioning, and Resource Pool Allocation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create-user')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Customer Account</span>
            </button>
            <button
              onClick={() => setShowPackageModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs font-bold border border-purple-600/50 shadow-md transition-all"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Define Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota Pool Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Customer Accounts</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{serverUsers.length}</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{serverUsers.filter((u) => u.status === 'active').length} Active Customers</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Disk Quota Allocated</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(totalAllocatedDiskMB / 1024).toFixed(0)} GB
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${Math.min(100, (totalAllocatedDiskMB / resellerDiskPoolMB) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Used: {(totalUsedDiskMB / 1024).toFixed(1)} GB</span>
            <span>Pool: {(resellerDiskPoolMB / 1024).toFixed(0)} GB</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Bandwidth Pool</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(totalAllocatedBwMB / 1024).toFixed(0)} GB
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-sky-500 h-full transition-all"
              style={{ width: `${Math.min(100, (totalAllocatedBwMB / resellerBwPoolMB) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Allocated</span>
            <span>Limit: {(resellerBwPoolMB / 1024).toFixed(0)} GB</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Defined Packages</span>
            <Package className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{packages.length} Plans</div>
          <div className="text-[11px] text-purple-400 font-bold">Ready for Instant Provisioning</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('users');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts ({serverUsers.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('packages');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'packages'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Hosting Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('create-user');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'create-user'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Customer</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('pool');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'pool'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Pool Usage Analytics</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ACCOUNTS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-base text-white">Sub-User Customer Directory</h2>
              <p className="text-xs text-slate-400">
                Manage accounts created under your Reseller quota pool and monitor real-time resource usage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer username, domain, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {(['all', 'active', 'suspended'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition ${
                      statusFilter === st ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] font-sans">
                  <th className="pb-3">Customer Username & Domain</th>
                  <th className="pb-3">Assigned Plan</th>
                  <th className="pb-3">Disk Usage</th>
                  <th className="pb-3">Bandwidth</th>
                  <th className="pb-3">Services</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const diskPct = Math.min(100, Math.round((user.diskUsedMB / user.diskQuotaMB) * 100));
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/40 font-sans">
                      <td className="py-3">
                        <div className="font-bold text-white text-sm">{user.username}</div>
                        <div className="font-mono text-xs text-sky-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>{user.domain}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{user.email}</div>
                      </td>

                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-xs">
                          {user.packageName}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="font-mono font-bold text-white">
                          {(user.diskUsedMB / 1024).toFixed(1)} GB / {(user.diskQuotaMB / 1024).toFixed(0)} GB
                        </div>
                        <div className="w-28 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
                          <div
                            className={`h-full ${diskPct > 85 ? 'bg-rose-500' : 'bg-amber-400'}`}
                            style={{ width: `${diskPct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-mono text-slate-300">
                          {(user.bandwidthQuotaMB / 1024).toFixed(0)} GB / mo
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                          <span title="MySQL DBs" className="flex items-center gap-0.5 text-amber-400">
                            <Database className="w-3 h-3" /> {user.dbCount || 0}/{user.dbLimit}
                          </span>
                          <span title="Emails" className="flex items-center gap-0.5 text-pink-400">
                            <Mail className="w-3 h-3" /> {user.emailCount || 0}/{user.emailLimit}
                          </span>
                        </div>
                      </td>

                      <td className="py-3">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          ● {user.status.toUpperCase()}
                        </button>
                      </td>

                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => loginAsUser(user.username)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                            title="Access Customer cPanel Grid"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Login Panel</span>
                          </button>

                          <button
                            onClick={() => deleteServerUser(user.id)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEFINE HOSTING PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-white">Reseller Hosting Packages Manager</h2>
              <p className="text-xs text-slate-400">
                Define reusable hosting packages with disk quotas, bandwidth limits, email, MySQL, and SSH capabilities.
              </p>
            </div>

            <button
              onClick={() => setShowPackageModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Hosting Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition shadow-xl space-y-4 relative ${
                  pkg.isPopular ? 'border-amber-500/50' : 'border-slate-800'
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    ★ Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-base text-white">{pkg.name}</h3>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">{pkg.pricePerMonth}</div>
                </div>

                <div className="space-y-2 border-t border-b border-slate-800 py-3 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Disk Quota:</span>
                    <span className="font-bold text-white">{(pkg.diskQuotaMB / 1024).toFixed(0)} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Bandwidth:</span>
                    <span className="font-bold text-sky-400">{(pkg.bandwidthQuotaMB / 1024).toFixed(0)} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">MySQL Databases:</span>
                    <span className="font-bold text-amber-400">{pkg.dbLimit} DBs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Accounts:</span>
                    <span className="font-bold text-pink-400">{pkg.emailLimit} Accounts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SSH Terminal:</span>
                    <span className={pkg.sshAccess ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {pkg.sshAccess ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPkgName(pkg.name);
                    setActiveTab('create-user');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-purple-700 hover:text-white text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Provision Customer with Plan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROVISION NEW CUSTOMER ACCOUNT */}
      {activeTab === 'create-user' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              <span>Provision Sub-User Customer Account</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Create a new customer account assigned to your Reseller quota pool with automatic cPanel directory structure.
            </p>
          </div>

          <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Username</label>
                <input
                  type="text"
                  placeholder="e.g. sitclient or client1"
                  value={custUsername}
                  onChange={(e) => setCustUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Primary Domain Name</label>
                <input
                  type="text"
                  placeholder="e.g. clientdomain.com"
                  value={custDomain}
                  onChange={(e) => setCustDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Email</label>
                <input
                  type="email"
                  placeholder="e.g. admin@clientdomain.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Select Hosting Package</label>
              <select
                value={selectedPkgName}
                onChange={(e) => setSelectedPkgName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-amber-300 font-mono font-bold"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name} — {(pkg.diskQuotaMB / 1024).toFixed(0)}GB Disk, {(pkg.bandwidthQuotaMB / 1024).toFixed(0)}GB Bw ({pkg.pricePerMonth})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-400 font-mono text-[11px]">
              <div className="text-slate-200 font-bold font-sans">Automatic Provisioning Specs:</div>
              <div>• Document Root: <span className="text-sky-400">/home/{custUsername || 'username'}/public_html</span></div>
              <div>• Default PHP Version: <span className="text-purple-400">v8.3 FPM</span></div>
              <div>• AutoSSL: <span className="text-emerald-400">Let's Encrypt Certificate Auto-Issued</span></div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:opacity-95 text-white font-bold shadow-lg shadow-purple-500/25"
              >
                Provision Customer Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: POOL USAGE ANALYTICS */}
      {activeTab === 'pool' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-bold text-base text-white">Reseller Resource Pool Analytics</h2>
            <p className="text-xs text-slate-400">
              Aggregate bandwidth and storage allocation across all sub-tenant accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Storage Allocation Breakdown</span>
              </h3>
              <div className="text-2xl font-black text-white font-mono">
                {(totalAllocatedDiskMB / 1024).toFixed(1)} GB / {(resellerDiskPoolMB / 1024).toFixed(0)} GB
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-purple-500 h-full"
                  style={{ width: `${Math.min(100, (totalAllocatedDiskMB / resellerDiskPoolMB) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                You have allocated <strong className="text-white">{((totalAllocatedDiskMB / resellerDiskPoolMB) * 100).toFixed(1)}%</strong> of your total reseller disk pool.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-sky-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Monthly Bandwidth Pool</span>
              </h3>
              <div className="text-2xl font-black text-white font-mono">
                {(totalAllocatedBwMB / 1024).toFixed(1)} GB / {(resellerBwPoolMB / 1024).toFixed(0)} GB
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full"
                  style={{ width: `${Math.min(100, (totalAllocatedBwMB / resellerBwPoolMB) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                High-speed Anycast bandwidth pool available for sub-account web traffic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEFINE PACKAGE MODAL */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>Define New Hosting Package</span>
              </h3>
              <button onClick={() => setShowPackageModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Package Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Agency E-Commerce 50GB"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Disk Quota (MB)</label>
                  <input
                    type="number"
                    value={newPkgDiskMB}
                    onChange={(e) => setNewPkgDiskMB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Bandwidth (MB)</label>
                  <input
                    type="number"
                    value={newPkgBwMB}
                    onChange={(e) => setNewPkgBwMB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max DBs</label>
                  <input
                    type="number"
                    value={newPkgDbLimit}
                    onChange={(e) => setNewPkgDbLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max Emails</label>
                  <input
                    type="number"
                    value={newPkgEmailLimit}
                    onChange={(e) => setNewPkgEmailLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max FTP</label>
                  <input
                    type="number"
                    value={newPkgFtpLimit}
                    onChange={(e) => setNewPkgFtpLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={newPkgSsh}
                    onChange={(e) => setNewPkgSsh(e.target.checked)}
                    className="rounded border-slate-700 text-purple-600 w-4 h-4"
                  />
                  <span>Enable Web SSH Access</span>
                </label>

                <div className="w-28">
                  <input
                    type="text"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    placeholder="$19.99"
                    className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono text-xs font-bold text-right"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Package Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
