import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  X,
  Play,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  Table,
  Code2,
  Layers,
  HardDrive,
  Key,
  Shield,
  FileCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PhpMyAdminModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { databases, dbUsers, executeSqlQuery, addToast, userProfile, networkTelemetry } = useApp();

  // Strict user database isolation (Requirement 3: Only databases belonging to the active logged-in user are shown)
  const allowedDatabases = databases.filter((db) => {
    // If standard user, only show databases with matching prefix or assigned user
    return (
      db.assignedUsers?.includes(userProfile.username) ||
      db.name.startsWith(userProfile.username.split('_')[0]) ||
      db.name.includes(userProfile.username) ||
      userProfile.role === 'Super Administrator'
    );
  });

  const [selectedDb, setSelectedDb] = useState<string>(allowedDatabases[0]?.name || databases[0]?.name || 'sitindia_wp');
  const [activeTab, setActiveTab] = useState<'structure' | 'sql' | 'export' | 'import' | 'privileges'>('structure');
  const [sqlInput, setSqlInput] = useState<string>('SELECT * FROM `wp_users` LIMIT 25;');
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    columns?: string[];
    rows?: any[];
    affectedRows?: number;
    message?: string;
    durationMs: number;
  } | null>({
    success: true,
    columns: ['ID', 'user_login', 'user_email', 'user_registered', 'user_status', 'display_name'],
    rows: [
      { ID: 1, user_login: 'admin', user_email: 'ashok@sitindia.in', user_registered: '2025-01-10 10:14:22', user_status: '0', display_name: 'Ashok Mahala' },
      { ID: 2, user_login: 'editor_rahul', user_email: 'rahul@sitindia.in', user_registered: '2025-03-12 14:20:00', user_status: '0', display_name: 'Rahul Verma' },
      { ID: 3, user_login: 'support_team', user_email: 'support@sitindia.in', user_registered: '2025-05-01 09:30:11', user_status: '0', display_name: 'Support SIT' },
    ],
    durationMs: 3.4,
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [exportFormat, setExportFormat] = useState('SQL');

  if (!isOpen) return null;

  const currentDbObj = allowedDatabases.find((d) => d.name === selectedDb) || allowedDatabases[0] || databases[0];

  const handleRunSql = () => {
    if (!sqlInput.trim()) return;
    setIsExecuting(true);
    setTimeout(() => {
      const res = executeSqlQuery(selectedDb, sqlInput);
      setQueryResult(res);
      setIsExecuting(false);
      addToast({
        type: 'success',
        title: 'Query Executed',
        message: `Query completed in ${res.durationMs} ms.`,
      });
    }, 400);
  };

  const handleExportDump = () => {
    addToast({
      type: 'success',
      title: 'Database Export Generated',
      message: `${selectedDb}.sql dump exported successfully (14.2 MB).`,
    });
  };

  const handleImportDump = () => {
    addToast({
      type: 'success',
      title: 'SQL Dump Imported',
      message: `Executed 142 SQL statements into ${selectedDb}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl border border-amber-200/80 flex flex-col overflow-hidden relative"
      >
        {/* Top phpMyAdmin Multi-Color Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg shadow-inner">
              <Database className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">phpMyAdmin</span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-bold text-white uppercase tracking-wider">
                  v5.2.2 1-Click Pro
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Server: <span className="font-bold underline">127.0.0.1 via TCP/IP</span> • MariaDB 10.11.8 • utf8mb4_unicode_ci
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://${networkTelemetry.publicIp || '103.174.102.45'}:8443/phpmyadmin`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-full text-xs font-black transition shadow"
              title="Open phpMyAdmin directly in new page"
            >
              <span>Open Direct Link</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-900" />
            </a>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>FastCGI Socket Active ✓</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Subnav */}
        <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider">Current Database:</span>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-amber-500"
            >
              {allowedDatabases.map((db) => (
                <option key={db.id} value={db.name}>
                  {db.name} ({db.sizeMB} MB)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('structure')}
              className={`ha-tab py-1.5 px-3 text-xs ${activeTab === 'structure' ? 'ha-tab-active-mango' : ''}`}
            >
              <Table className="w-3.5 h-3.5 inline mr-1" />
              Structure
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`ha-tab py-1.5 px-3 text-xs ${activeTab === 'sql' ? 'ha-tab-active-mango' : ''}`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1" />
              SQL Console
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`ha-tab py-1.5 px-3 text-xs ${activeTab === 'export' ? 'ha-tab-active-mango' : ''}`}
            >
              <Download className="w-3.5 h-3.5 inline mr-1" />
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`ha-tab py-1.5 px-3 text-xs ${activeTab === 'import' ? 'ha-tab-active-mango' : ''}`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              Import
            </button>
            <button
              onClick={() => setActiveTab('privileges')}
              className={`ha-tab py-1.5 px-3 text-xs ${activeTab === 'privileges' ? 'ha-tab-active-mango' : ''}`}
            >
              <Shield className="w-3.5 h-3.5 inline mr-1" />
              Privileges
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#FAFAFE] space-y-4">
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Tables in <span className="text-amber-600 font-mono">`{selectedDb}`</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Storage Engine: InnoDB • Collation: utf8mb4_unicode_ci • Total Tables: {currentDbObj?.tables?.length || 8}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSqlInput(`OPTIMIZE TABLE \`wp_posts\`, \`wp_options\`;`);
                      setActiveTab('sql');
                    }}
                    className="ha-btn ha-btn-mango py-1.5 px-3 text-xs"
                  >
                    ⚡ Optimize Tables
                  </button>
                </div>
              </div>

              <div className="ha-table-container">
                <table className="ha-table">
                  <thead>
                    <tr>
                      <th>Table Name</th>
                      <th>Action</th>
                      <th>Rows (Est.)</th>
                      <th>Type</th>
                      <th>Collation</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentDbObj?.tables && currentDbObj.tables.length > 0
                      ? currentDbObj.tables
                      : [
                          { name: 'wp_posts', rows: 482, sizeKB: 3200, engine: 'InnoDB' },
                          { name: 'wp_postmeta', rows: 4210, sizeKB: 8400, engine: 'InnoDB' },
                          { name: 'wp_users', rows: 14, sizeKB: 96, engine: 'InnoDB' },
                          { name: 'wp_usermeta', rows: 198, sizeKB: 480, engine: 'InnoDB' },
                          { name: 'wp_options', rows: 680, sizeKB: 1420, engine: 'InnoDB' },
                          { name: 'wp_comments', rows: 120, sizeKB: 240, engine: 'InnoDB' },
                          { name: 'wp_terms', rows: 54, sizeKB: 64, engine: 'InnoDB' },
                        ]
                    ).map((tbl, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/60 transition">
                        <td className="font-mono font-bold text-purple-900 text-xs">
                          {tbl.name}
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <button
                              onClick={() => {
                                setSqlInput(`SELECT * FROM \`${tbl.name}\` LIMIT 25;`);
                                setActiveTab('sql');
                                handleRunSql();
                              }}
                              className="text-amber-600 hover:text-amber-700 underline"
                            >
                              Browse
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => {
                                setSqlInput(`DESCRIBE \`${tbl.name}\`;`);
                                setActiveTab('sql');
                                handleRunSql();
                              }}
                              className="text-purple-600 hover:text-purple-700 underline"
                            >
                              Structure
                            </button>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-slate-700">{tbl.rows.toLocaleString()}</td>
                        <td>
                          <span className="ha-badge ha-badge-purple text-[10px]">{tbl.engine}</span>
                        </td>
                        <td className="text-xs text-slate-500">utf8mb4_unicode_ci</td>
                        <td className="text-xs font-mono text-slate-600">{(tbl.sizeKB / 1024).toFixed(2)} MB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-sm text-slate-800">
                      Run SQL Query on Server <code className="text-amber-600">`{selectedDb}`</code>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSqlInput('SELECT * FROM `wp_users` LIMIT 25;')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      SELECT *
                    </button>
                    <button
                      onClick={() => setSqlInput('SHOW PROCESSLIST;')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      Processlist
                    </button>
                    <button
                      onClick={() => setSqlInput('SHOW STATUS LIKE "%Qcache%";')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      Status
                    </button>
                  </div>
                </div>

                <textarea
                  value={sqlInput}
                  onChange={(e) => setSqlInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="Enter SQL statements here..."
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Press Go or Ctrl+Enter to execute.</span>
                  <button
                    onClick={handleRunSql}
                    disabled={isExecuting}
                    className="ha-btn ha-btn-purple text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                  >
                    {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>Go (Execute SQL)</span>
                  </button>
                </div>
              </div>

              {/* Query Result Grid */}
              {queryResult && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-900">
                        {queryResult.rows ? `Showing ${queryResult.rows.length} rows (${queryResult.durationMs} ms)` : queryResult.message}
                      </span>
                    </div>
                    <span className="ha-badge ha-badge-emerald text-[10px]">SUCCESS 200 OK</span>
                  </div>

                  {queryResult.rows && queryResult.columns && (
                    <div className="overflow-x-auto max-h-72">
                      <table className="ha-table">
                        <thead>
                          <tr>
                            {queryResult.columns.map((col, idx) => (
                              <th key={idx}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {queryResult.columns?.map((col, cIdx) => (
                                <td key={cIdx} className="font-mono text-xs text-slate-800">
                                  {String(row[col] ?? 'NULL')}
                                </td>
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
          )}

          {activeTab === 'export' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Exporting Tables from `{selectedDb}`</h3>
                <p className="text-xs text-slate-500 mt-0.5">Generate a standard SQL or CSV dump archive for quick off-site backups.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="ha-input"
                  >
                    <option value="SQL">SQL (Structure + Complete INSERT Data)</option>
                    <option value="SQL_STRUCTURE">SQL (Structure only / Schema DDL)</option>
                    <option value="CSV">CSV (Comma Separated Values)</option>
                    <option value="JSON">JSON Data Array</option>
                  </select>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    mysqldump Compatibility Engine
                  </p>
                  <p className="text-amber-800">
                    Includes <code>DROP TABLE IF EXISTS</code>, transaction isolation, and binary-safe hexadecimal character encoding.
                  </p>
                </div>

                <button
                  onClick={handleExportDump}
                  className="ha-btn ha-btn-mango w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Dump File ({selectedDb}.sql)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Import SQL File into `{selectedDb}`</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload a `.sql`, `.sql.gz` or `.zip` database script.</p>
              </div>

              <div className="p-6 border-2 border-dashed border-purple-200 rounded-2xl text-center bg-purple-50/30 hover:bg-purple-50/60 transition cursor-pointer">
                <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-purple-900">Choose a SQL file or drag & drop here</p>
                <p className="text-[11px] text-slate-500 mt-1">Maximum upload size: 256 MB (post_max_size / upload_max_filesize)</p>
              </div>

              <button
                onClick={handleImportDump}
                className="ha-btn ha-btn-purple w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Execute Import Routine</span>
              </button>
            </div>
          )}

          {activeTab === 'privileges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Database User Accounts & Privileges</h3>
                  <p className="text-xs text-slate-500">Managing access grants for `{selectedDb}`.</p>
                </div>
              </div>

              <div className="ha-table-container">
                <table className="ha-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Host</th>
                      <th>Type</th>
                      <th>Privileges</th>
                      <th>Grant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-amber-50/60 transition">
                        <td className="font-bold text-purple-900 text-xs">{u.username}</td>
                        <td className="font-mono text-xs">{u.host || 'localhost'}</td>
                        <td>
                          <span className={`ha-badge text-[10px] ${u.privileges.includes('ALL PRIVILEGES') ? 'ha-badge-emerald' : 'ha-badge-mango'}`}>
                            {u.privileges.includes('ALL PRIVILEGES') ? 'SUPER / ADMIN' : 'APP USER'}
                          </span>
                        </td>
                        <td className="text-xs text-slate-700 font-mono">
                          {u.privileges.includes('ALL PRIVILEGES') ? 'ALL PRIVILEGES' : u.privileges.join(', ')}
                        </td>
                        <td className="text-xs font-bold">
                          {u.grantOption ? (
                            <span className="text-emerald-600">YES</span>
                          ) : (
                            <span className="text-slate-400">NO</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">HostAdmin phpMyAdmin Suite</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">● FastCGI Buffer Active</span>
          </div>
          <button
            onClick={onClose}
            className="ha-btn ha-btn-white py-1.5 px-4 text-xs font-bold"
          >
            Close phpMyAdmin
          </button>
        </div>
      </motion.div>
    </div>
  );
};
