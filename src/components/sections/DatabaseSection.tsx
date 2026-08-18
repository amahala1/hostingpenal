import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Plus,
  Trash2,
  Users,
  Play,
  Download,
  Upload,
  Key,
  Shield,
  Table,
  CheckCircle2,
  Clock,
  Terminal,
  FileCode,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Search,
  X,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Edit3,
  Server,
  Settings,
} from 'lucide-react';
import { DatabaseRecord, DatabaseUser } from '../../types';

// Standard MySQL / phpMyAdmin Privileges (docs: https://www.phpmyadmin.net/docs/)
const MYSQL_DATA_PRIVILEGES = [
  { id: 'SELECT', label: 'SELECT', desc: 'Read data from tables' },
  { id: 'INSERT', label: 'INSERT', desc: 'Insert new rows' },
  { id: 'UPDATE', label: 'UPDATE', desc: 'Update existing rows' },
  { id: 'DELETE', label: 'DELETE', desc: 'Delete rows from tables' },
  { id: 'FILE', label: 'FILE', desc: 'Read and write server files' },
];

const MYSQL_STRUCTURE_PRIVILEGES = [
  { id: 'CREATE', label: 'CREATE', desc: 'Create new databases and tables' },
  { id: 'ALTER', label: 'ALTER', desc: 'Alter existing table structures' },
  { id: 'INDEX', label: 'INDEX', desc: 'Create and drop table indexes' },
  { id: 'DROP', label: 'DROP', desc: 'Drop databases and tables' },
  { id: 'CREATE TEMPORARY TABLES', label: 'CREATE TEMPORARY TABLES', desc: 'Create temporary tables' },
  { id: 'SHOW VIEW', label: 'SHOW VIEW', desc: 'Inspect view definitions' },
  { id: 'CREATE ROUTINE', label: 'CREATE ROUTINE', desc: 'Create stored procedures & functions' },
  { id: 'ALTER ROUTINE', label: 'ALTER ROUTINE', desc: 'Alter stored procedures & functions' },
  { id: 'EXECUTE', label: 'EXECUTE', desc: 'Execute stored procedures' },
  { id: 'CREATE VIEW', label: 'CREATE VIEW', desc: 'Create database views' },
  { id: 'EVENT', label: 'EVENT', desc: 'Manage scheduled MySQL events' },
  { id: 'TRIGGER', label: 'TRIGGER', desc: 'Create and manage triggers' },
];

const MYSQL_ADMIN_PRIVILEGES = [
  { id: 'GRANT OPTION', label: 'GRANT OPTION', desc: 'Grant privileges to other users' },
  { id: 'LOCK TABLES', label: 'LOCK TABLES', desc: 'Lock tables for threads' },
  { id: 'REFERENCES', label: 'REFERENCES', desc: 'Create foreign key references' },
  { id: 'RELOAD', label: 'RELOAD', desc: 'Execute FLUSH statements' },
  { id: 'SHOW DATABASES', label: 'SHOW DATABASES', desc: 'List database names' },
  { id: 'PROCESS', label: 'PROCESS', desc: 'View active threads (SHOW PROCESSLIST)' },
];

const ALL_MYSQL_PRIVILEGES = [
  ...MYSQL_DATA_PRIVILEGES.map((p) => p.id),
  ...MYSQL_STRUCTURE_PRIVILEGES.map((p) => p.id),
  ...MYSQL_ADMIN_PRIVILEGES.map((p) => p.id),
];

export const DatabaseSection: React.FC = () => {
  const {
    databases,
    dbUsers,
    createDatabase,
    createDatabaseWithUser,
    deleteDatabase,
    createDbUser,
    deleteDbUser,
    updateUserPrivileges,
    assignUserToDatabase,
    executeSqlQuery,
    launchPhpMyAdmin,
    isPhpMyAdminInstalled,
    isVpsInstalled,
    installPhpMyAdmin,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'databases' | 'users' | 'phpmyadmin' | 'remote-access'>('databases');

  // Unified Database & User Creation Wizard
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [dbName, setDbName] = useState('');
  const [dbHost, setDbHost] = useState('localhost');
  const [dbUsername, setDbUsername] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'CREATE',
    'ALTER',
    'INDEX',
    'DROP',
    'LOCK TABLES',
  ]);
  const [grantOption, setGrantOption] = useState(true);
  const [dbCollation, setDbCollation] = useState('utf8mb4_unicode_ci');
  const [dbCharset, setDbCharset] = useState('utf8mb4');

  // Quick Standalone DB Modal
  const [showQuickDbModal, setShowQuickDbModal] = useState(false);
  const [quickDbName, setQuickDbName] = useState('');
  const [quickDbCollation, setQuickDbCollation] = useState('utf8mb4_unicode_ci');

  // Edit User Privileges Modal
  const [editingUser, setEditingUser] = useState<DatabaseUser | null>(null);
  const [editUserPrivs, setEditUserPrivs] = useState<string[]>([]);
  const [editUserDbs, setEditUserDbs] = useState<string[]>([]);
  const [editGrantOption, setEditGrantOption] = useState(false);

  // Assign user modal
  const [assignDbId, setAssignDbId] = useState<string | null>(null);
  const [assignUser, setAssignUser] = useState(dbUsers[0]?.username || '');

  // SQL Query Runner (Interactive phpMyAdmin Query Console)
  const [selectedSqlDb, setSelectedSqlDb] = useState<string>(databases[0]?.name || 'sitindia_portal');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    columns?: string[];
    rows?: any[];
    affectedRows?: number;
    message?: string;
    durationMs: number;
  } | null>(null);

  // Remote MySQL IPs
  const [remoteIps, setRemoteIps] = useState<string[]>(['103.175.163.45', '192.168.1.%', '49.36.120.45']);
  const [newRemoteIp, setNewRemoteIp] = useState('');

  // Password Generator Helper
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDbPassword(pass);
    addToast({ type: 'info', title: 'Strong Password Generated', message: '16 characters alphanumeric + symbols' });
  };

  const handleTogglePrivilege = (privId: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(privId) ? prev.filter((p) => p !== privId) : [...prev, privId]
    );
  };

  const handleToggleEditPrivilege = (privId: string) => {
    setEditUserPrivs((prev) =>
      prev.includes(privId) ? prev.filter((p) => p !== privId) : [...prev, privId]
    );
  };

  const handleSetAllPrivileges = () => {
    setSelectedPrivileges([...ALL_MYSQL_PRIVILEGES]);
  };

  const handleSetStandardPrivileges = () => {
    setSelectedPrivileges([
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'ALTER',
      'INDEX',
      'DROP',
      'CREATE TEMPORARY TABLES',
      'LOCK TABLES',
    ]);
  };

  const handleSetReadOnlyPrivileges = () => {
    setSelectedPrivileges(['SELECT', 'SHOW VIEW']);
  };

  const handleClearAllPrivileges = () => {
    setSelectedPrivileges([]);
  };

  const handleCreateDatabaseAndUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbName.trim() || !dbUsername.trim()) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Database Name and Username are required.' });
      return;
    }

    createDatabaseWithUser(
      dbName.trim(),
      dbUsername.trim(),
      dbHost.trim() || 'localhost',
      dbPassword,
      selectedPrivileges.length > 0 ? selectedPrivileges : ['ALL PRIVILEGES'],
      dbCollation,
      dbCharset,
      grantOption
    );

    setShowCreateWizard(false);
    setDbName('');
    setDbUsername('');
    setDbPassword('');
  };

  const handleQuickCreateDb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDbName.trim()) return;
    createDatabase(quickDbName.trim(), 'utf8mb4', quickDbCollation);
    setShowQuickDbModal(false);
    setQuickDbName('');
  };

  const handleSaveUserPrivileges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserPrivileges(editingUser.id, editUserPrivs, editUserDbs, editGrantOption);
    setEditingUser(null);
  };

  const handleExecuteSql = () => {
    triggerHaptic();
    const res = executeSqlQuery(selectedSqlDb, sqlQuery);
    setQueryResult(res);
    addToast({
      type: res.success ? 'success' : 'error',
      title: res.success ? 'SQL Executed' : 'SQL Error',
      message: `Completed in ${res.durationMs} ms`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>MySQL / MariaDB & phpMyAdmin</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  v10.11.8 Enterprise
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Hostname: <span className="text-teal-300 font-mono font-semibold">localhost:3306</span> • Granular MySQL Grants • 1-Click phpMyAdmin Access
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1-Click phpMyAdmin Direct Launch */}
          <button
            onClick={() => launchPhpMyAdmin(databases[0]?.name || 'sitindia_portal')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="1-Click phpMyAdmin - Instant Single Sign-On Access"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>1-Click phpMyAdmin</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Unified Create DB & User Wizard */}
          <button
            onClick={() => setShowCreateWizard(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Database & User</span>
          </button>

          <button
            onClick={() => setShowQuickDbModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Database className="w-4 h-4 text-teal-400" />
            <span>Quick DB</span>
          </button>
        </div>
      </div>

      {/* phpMyAdmin FastCGI Directory Installation Quick Action Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-black text-sm">
            pMA
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>phpMyAdmin 5.2.2 (Directory Installation)</span>
              <span className={`w-2 h-2 rounded-full ${isPhpMyAdminInstalled || isVpsInstalled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={`text-[10px] font-mono ${isPhpMyAdminInstalled || isVpsInstalled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPhpMyAdminInstalled || isVpsInstalled ? 'Installed & Verified Live (/phpmyadmin)' : 'Dependency Missing (Not Installed)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Directory: <span className="font-mono text-slate-300">/usr/share/phpmyadmin (/phpmyadmin)</span> | Socket: <span className="font-mono text-slate-300">/run/mysqld/mysqld.sock</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPhpMyAdminInstalled || isVpsInstalled ? (
            <button
              onClick={() => launchPhpMyAdmin(databases[0]?.name)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Auto-Verify & Launch Directory phpMyAdmin"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Verified phpMyAdmin (/phpmyadmin)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          ) : (
            <button
              onClick={() => installPhpMyAdmin()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
              title="Install phpMyAdmin Directory Suite on VPS"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install phpMyAdmin (v5.2.1)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('databases')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'databases' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Databases ({databases.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'users' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Database Users & Privileges ({dbUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('phpmyadmin')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'phpmyadmin' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Interactive SQL Console & Studio
        </button>
        <button
          onClick={() => setActiveTab('remote-access')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'remote-access' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Remote MySQL Whitelist
        </button>
      </div>

      {/* Tab 1: Databases List */}
      {activeTab === 'databases' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Total Databases</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{databases.length}</div>
              <div className="text-[11px] text-teal-400 mt-1">InnoDB Engine • utf8mb4</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Total Database Size</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {databases.reduce((acc, d) => acc + d.sizeMB, 0).toFixed(1)} MB
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Optimized Indexes & Tables</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Total DB Tables</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {databases.reduce((acc, d) => acc + d.tableCount, 0)}
              </div>
              <div className="text-[11px] text-indigo-400 mt-1">utf8mb4_unicode_ci collation</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-white">Active MySQL Databases</h2>
                <p className="text-xs text-slate-400">Direct 1-Click phpMyAdmin access for every database</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Host: localhost:3306</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Database Name</th>
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Collation</th>
                    <th className="pb-3">Assigned Users</th>
                    <th className="pb-3">Tables</th>
                    <th className="pb-3 text-right">phpMyAdmin & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {databases.map((db) => (
                    <tr key={db.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{db.name}</span>
                      </td>

                      <td className="py-3 text-slate-300">{db.sizeMB.toFixed(1)} MB</td>
                      <td className="py-3 text-slate-400">{db.collation}</td>

                      <td className="py-3 font-sans">
                        <div className="flex flex-wrap items-center gap-1">
                          {db.assignedUsers.map((u) => (
                            <span key={u} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                              {u}
                            </span>
                          ))}
                          <button
                            onClick={() => setAssignDbId(db.id)}
                            className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] hover:bg-teal-500/30"
                          >
                            + Assign
                          </button>
                        </div>
                      </td>

                      <td className="py-3 text-slate-300">{db.tableCount} tables</td>

                      <td className="py-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click phpMyAdmin Button */}
                          <button
                            onClick={() => launchPhpMyAdmin(db.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                            title={`Open ${db.name} in 1-Click phpMyAdmin`}
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>1-Click phpMyAdmin</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSqlDb(db.name);
                              setActiveTab('phpmyadmin');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
                            title="Query in Interactive SQL Console"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              addToast({
                                type: 'success',
                                title: 'Database Exported',
                                message: `Dump saved: ${db.name}_backup.sql.gz (InnoDB dump)`,
                              });
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                            title="Export .sql.gz Dump"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteDatabase(db.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                            title="Drop Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Granular Privileges List */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-white">Database Users & Granular Privileges</h2>
              <p className="text-xs text-slate-400">
                Manage user credentials, host bindings (<span className="text-teal-300 font-mono">localhost</span> / <span className="text-teal-300 font-mono">%</span>), assigned databases, and grant permissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateWizard(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create User & Privileges</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Username</th>
                  <th className="pb-3">Hostname</th>
                  <th className="pb-3">Assigned Databases</th>
                  <th className="pb-3">MySQL Privileges</th>
                  <th className="pb-3">Grant Option</th>
                  <th className="pb-3">Created</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {dbUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{u.username}</span>
                    </td>

                    <td className="py-3 text-teal-300">{u.host || 'localhost'}</td>

                    <td className="py-3 font-sans">
                      <div className="flex flex-wrap gap-1">
                        {(u.assignedDatabases && u.assignedDatabases.length > 0
                          ? u.assignedDatabases
                          : ['* (Global)']
                        ).map((db) => (
                          <span key={db} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {db}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 font-sans">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {u.privileges.includes('ALL PRIVILEGES') ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            ALL PRIVILEGES
                          </span>
                        ) : (
                          u.privileges.map((p) => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px] font-mono">
                              {p}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    <td className="py-3">
                      {u.grantOption ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          YES
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">NO</span>
                      )}
                    </td>

                    <td className="py-3 text-slate-400">{u.createdAt}</td>

                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditUserPrivs(
                              u.privileges.includes('ALL PRIVILEGES') ? ALL_MYSQL_PRIVILEGES : u.privileges
                            );
                            setEditUserDbs(u.assignedDatabases || []);
                            setEditGrantOption(!!u.grantOption);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1"
                          title="Edit User Privileges"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Privileges</span>
                        </button>

                        <button
                          onClick={() => deleteDbUser(u.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: phpMyAdmin & SQL Query Runner */}
      {activeTab === 'phpmyadmin' && (
        !isPhpMyAdminInstalled ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Server className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">phpMyAdmin Database Suite Not Installed</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                phpMyAdmin must be installed on your VPS before linking database access. Click the button below to download and configure phpMyAdmin v5.2.1 automatically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 font-mono text-slate-300">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Installation Package Specifications:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400 pl-6 list-disc">
                <li>Package: phpMyAdmin-5.2.1-all-languages.tar.gz</li>
                <li>Directory Target: /usr/share/phpMyAdmin</li>
                <li>MySQL Socket: /var/run/mysqld/mysqld.sock</li>
                <li>Blowfish Cookie Encryption: 32-bit Auto-Generated Secret</li>
              </ul>
            </div>

            <button
              onClick={() => installPhpMyAdmin()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" />
              <span>Install phpMyAdmin (v5.2.1)</span>
            </button>
          </div>
        ) : (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-teal-400" />
                <span>phpMyAdmin & Interactive SQL Query Studio</span>
              </h2>
              <p className="text-xs text-slate-400">Run SQL queries, inspect tables, and preview dataset results in real time.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Database:</span>
              <select
                value={selectedSqlDb}
                onChange={(e) => setSelectedSqlDb(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-teal-300 font-bold"
              >
                {databases.map((db) => (
                  <option key={db.id} value={db.name}>
                    {db.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold">Presets:</span>
            <button
              onClick={() => setSqlQuery('SELECT * FROM users LIMIT 10;')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-sky-300"
            >
              SELECT * FROM users
            </button>
            <button
              onClick={() => setSqlQuery('SELECT * FROM orders ORDER BY date DESC LIMIT 5;')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-sky-300"
            >
              SELECT * FROM orders
            </button>
            <button
              onClick={() => setSqlQuery('SHOW STATUS LIKE "Innodb%";')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-sky-300"
            >
              SHOW STATUS
            </button>
            <button
              onClick={() => setSqlQuery('SHOW TABLES;')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-sky-300"
            >
              SHOW TABLES
            </button>
          </div>

          {/* SQL Editor Area */}
          <div className="space-y-2">
            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query (SELECT, SHOW, INSERT, UPDATE, EXPLAIN)..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Press Run to execute against MySQL server</span>
              <button
                onClick={handleExecuteSql}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run SQL Query</span>
              </button>
            </div>
          </div>

          {/* Results Visualizer */}
          {queryResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Query OK ({queryResult.rows ? queryResult.rows.length : queryResult.affectedRows} results returned in {queryResult.durationMs} ms)
                </span>
              </div>

              {queryResult.rows && queryResult.columns && (
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        {queryResult.columns.map((col) => (
                          <th key={col} className="p-2">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          {queryResult.columns?.map((col) => (
                            <td key={col} className="p-2 text-slate-200">{String(row[col])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        )
      )}

      {/* Tab 4: Remote MySQL Access */}
      {activeTab === 'remote-access' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Remote MySQL Host Whitelist</h2>
            <p className="text-xs text-slate-400">
              Permit external applications, developer machines, and BI tools to connect directly to MySQL on port 3306.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              placeholder="e.g. 103.175.163.45 or %.clientcorp.in"
              value={newRemoteIp}
              onChange={(e) => setNewRemoteIp(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
            />
            <button
              onClick={() => {
                if (newRemoteIp.trim()) {
                  setRemoteIps((prev) => [...prev, newRemoteIp.trim()]);
                  setNewRemoteIp('');
                  addToast({ type: 'success', title: 'Remote IP Whitelisted' });
                }
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs"
            >
              Add Host
            </button>
          </div>

          <div className="space-y-2 max-w-lg">
            {remoteIps.map((ip) => (
              <div key={ip} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-white">{ip}</span>
                <button
                  onClick={() => setRemoteIps((prev) => prev.filter((i) => i !== ip))}
                  className="text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unified Database & User Creation Wizard Modal */}
      {showCreateWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-400" />
                  <span>Create MySQL Database, User & Assign Privileges</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standard MySQL workflow with Hostname (default: localhost), Credentials, and phpMyAdmin Privileges
                </p>
              </div>
              <button onClick={() => setShowCreateWizard(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDatabaseAndUser} className="space-y-5 text-xs">
              {/* Section 1: Database & Hostname Details */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <h4 className="font-bold text-xs text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>1. Database & Hostname Configuration</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Database Name Suffix</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-slate-400 font-mono text-xs">
                        sitindia_
                      </span>
                      <input
                        type="text"
                        placeholder="app_production"
                        value={dbName}
                        onChange={(e) => setDbName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-r-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Hostname (Default: <code className="text-teal-300">localhost</code>)
                    </label>
                    <input
                      type="text"
                      value={dbHost}
                      onChange={(e) => setDbHost(e.target.value)}
                      placeholder="localhost or %"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-teal-300 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Character Set</label>
                    <select
                      value={dbCharset}
                      onChange={(e) => setDbCharset(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    >
                      <option value="utf8mb4">utf8mb4 (4-byte Unicode / Emojis Supported)</option>
                      <option value="utf8">utf8 (3-byte UTF-8)</option>
                      <option value="latin1">latin1 (ISO 8859-1 Western)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Collation</label>
                    <select
                      value={dbCollation}
                      onChange={(e) => setDbCollation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    >
                      <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci (Recommended)</option>
                      <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                      <option value="utf8mb4_bin">utf8mb4_bin (Binary case-sensitive)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: User Account Credentials */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  <span>2. Database User Credentials</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Username Suffix</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-slate-400 font-mono text-xs">
                        sitindia_
                      </span>
                      <input
                        type="text"
                        placeholder="dbuser"
                        value={dbUsername}
                        onChange={(e) => setDbUsername(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-r-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">User Password</label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-teal-400 hover:text-teal-300 font-bold underline"
                      >
                        ⚡ Generate Strong Password
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password..."
                        value={dbPassword}
                        onChange={(e) => setDbPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-sky-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Granular MySQL Privileges (phpMyAdmin Standard) */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      <span>3. Assign MySQL Privileges ({selectedPrivileges.length} Selected)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Standard MySQL GRANT table rights (refer to <a href="https://www.phpmyadmin.net/docs/" target="_blank" rel="noreferrer" className="text-amber-300 underline">phpMyAdmin Privileges Docs</a>)
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSetAllPrivileges}
                      className="px-2 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[10px] font-bold"
                    >
                      Check All
                    </button>
                    <button
                      type="button"
                      onClick={handleSetStandardPrivileges}
                      className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold"
                    >
                      Web App (CRUD)
                    </button>
                    <button
                      type="button"
                      onClick={handleSetReadOnlyPrivileges}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                    >
                      Read Only
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllPrivileges}
                      className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px]"
                    >
                      Uncheck All
                    </button>
                  </div>
                </div>

                {/* Privileges Categorized Groups */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {/* Category: Data */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-[11px] text-teal-300 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>DATA (DML)</span>
                      <span className="text-[10px] text-slate-400">{MYSQL_DATA_PRIVILEGES.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {MYSQL_DATA_PRIVILEGES.map((p) => {
                        const isChecked = selectedPrivileges.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300 text-xs select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePrivilege(p.id)}
                              className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                            />
                            <span className="font-mono font-semibold">{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: Structure */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-[11px] text-sky-300 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>STRUCTURE (DDL)</span>
                      <span className="text-[10px] text-slate-400">{MYSQL_STRUCTURE_PRIVILEGES.length}</span>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {MYSQL_STRUCTURE_PRIVILEGES.map((p) => {
                        const isChecked = selectedPrivileges.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300 text-xs select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePrivilege(p.id)}
                              className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 bg-slate-950 border-slate-700"
                            />
                            <span className="font-mono font-semibold">{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: Administration */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-[11px] text-amber-300 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>ADMINISTRATION</span>
                      <span className="text-[10px] text-slate-400">{MYSQL_ADMIN_PRIVILEGES.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {MYSQL_ADMIN_PRIVILEGES.map((p) => {
                        const isChecked = selectedPrivileges.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300 text-xs select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePrivilege(p.id)}
                              className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 bg-slate-950 border-slate-700"
                            />
                            <span className="font-mono font-semibold">{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grant Option Toggle */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="checkbox"
                    id="grantOptionWizard"
                    checked={grantOption}
                    onChange={(e) => setGrantOption(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="grantOptionWizard" className="text-slate-200 font-semibold cursor-pointer">
                    WITH GRANT OPTION (Allows this user to grant their own privileges to other accounts)
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateWizard(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-teal-600/30 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Provision Database & User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Privileges Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <span>
                    Edit Privileges for User <code className="text-teal-300">{editingUser.username}@{editingUser.host}</code>
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Update MySQL grant table permissions for this account</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserPrivileges} className="space-y-4 text-xs">
              {/* Presets */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Privileges ({editUserPrivs.length} assigned):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditUserPrivs([...ALL_MYSQL_PRIVILEGES])}
                    className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px]"
                  >
                    Check All
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditUserPrivs([
                        'SELECT',
                        'INSERT',
                        'UPDATE',
                        'DELETE',
                        'CREATE',
                        'ALTER',
                        'INDEX',
                        'DROP',
                        'LOCK TABLES',
                      ])
                    }
                    className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px]"
                  >
                    Standard CRUD
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUserPrivs([])}
                    className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Privileges Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-[10px] text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Data (DML)
                  </div>
                  {MYSQL_DATA_PRIVILEGES.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                      <input
                        type="checkbox"
                        checked={editUserPrivs.includes(p.id)}
                        onChange={() => handleToggleEditPrivilege(p.id)}
                        className="w-3.5 h-3.5 rounded text-teal-600 bg-slate-900 border-slate-700"
                      />
                      <span className="font-mono">{p.label}</span>
                    </label>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="font-bold text-[10px] text-sky-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Structure (DDL)
                  </div>
                  {MYSQL_STRUCTURE_PRIVILEGES.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                      <input
                        type="checkbox"
                        checked={editUserPrivs.includes(p.id)}
                        onChange={() => handleToggleEditPrivilege(p.id)}
                        className="w-3.5 h-3.5 rounded text-sky-600 bg-slate-900 border-slate-700"
                      />
                      <span className="font-mono">{p.label}</span>
                    </label>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-[10px] text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Administration
                  </div>
                  {MYSQL_ADMIN_PRIVILEGES.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                      <input
                        type="checkbox"
                        checked={editUserPrivs.includes(p.id)}
                        onChange={() => handleToggleEditPrivilege(p.id)}
                        className="w-3.5 h-3.5 rounded text-amber-600 bg-slate-900 border-slate-700"
                      />
                      <span className="font-mono">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grant Option */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="editGrantOption"
                  checked={editGrantOption}
                  onChange={(e) => setEditGrantOption(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="editGrantOption" className="text-slate-200 font-semibold cursor-pointer">
                  WITH GRANT OPTION (Allow account to grant assigned permissions)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
                >
                  Save Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick DB Modal */}
      {showQuickDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Create Quick MySQL Database</h3>
            <form onSubmit={handleQuickCreateDb} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Database Name Suffix</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-slate-400 font-mono">
                    sitindia_
                  </span>
                  <input
                    type="text"
                    placeholder="analytics"
                    value={quickDbName}
                    onChange={(e) => setQuickDbName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-r-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Collation</label>
                <select
                  value={quickDbCollation}
                  onChange={(e) => setQuickDbCollation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci (Recommended)</option>
                  <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                  <option value="utf8_general_ci">utf8_general_ci</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuickDbModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 text-white font-semibold"
                >
                  Create Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign User to DB Modal */}
      {assignDbId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Assign User to Database</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select DB User</label>
                <select
                  value={assignUser}
                  onChange={(e) => setAssignUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  {dbUsers.map((u) => (
                    <option key={u.id} value={u.username}>{u.username}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setAssignDbId(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    assignUserToDatabase(assignDbId, assignUser);
                    setAssignDbId(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-teal-600 text-white font-semibold"
                >
                  Grant Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
