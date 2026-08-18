import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Settings,
  Terminal,
  RefreshCw,
  Zap,
  Globe,
  Save,
  Layers,
  Package,
  Play,
} from 'lucide-react';

export const PhpManagerSection: React.FC = () => {
  const {
    phpConfigs,
    domains,
    updatePhpVersionForDomain,
    togglePhpExtension,
    updatePhpIni,
    updateFpmSettings,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'domains' | 'extensions' | 'ini' | 'fpm' | 'composer'>('domains');
  const [selectedVersion, setSelectedVersion] = useState<string>('8.3');
  const [extensionCategory, setExtensionCategory] = useState<string>('All');
  const [composerCmd, setComposerCmd] = useState('composer install --optimize-autoloader --no-dev');
  const [composerOutput, setComposerOutput] = useState<string | null>(null);
  const [composerRunning, setComposerRunning] = useState(false);

  const activeConfig = phpConfigs?.find((c) => c.version === selectedVersion) || phpConfigs?.[0];

  const categories = ['All', 'Core', 'Performance', 'Database', 'Caching', 'Media', 'Network', 'Archiving', 'Math', 'Localization', 'Debugging'];

  const filteredExtensions = (activeConfig?.extensions || []).filter((ext) =>
    extensionCategory === 'All' ? true : ext.category === extensionCategory
  );

  const handleRunComposer = () => {
    triggerHaptic();
    setComposerRunning(true);
    setComposerOutput('Executing: ' + composerCmd + '\nLoading composer repositories with package information...\nUpdating dependencies...\n');

    setTimeout(() => {
      setComposerOutput((prev) =>
        prev +
        'Locking current dependency versioning...\n' +
        '  - Installing psr/log (3.0.0): Extracting archive\n' +
        '  - Installing monolog/monolog (3.6.0): Extracting archive\n' +
        '  - Installing illuminate/database (11.8.0): Extracting archive\n' +
        'Generating optimized autoload files...\n' +
        'Classmap generated successfully (1,482 classes).\n' +
        'Composer run finished with Exit Code: 0 (OK)'
      );
      setComposerRunning(false);
      addToast({ type: 'success', title: 'Composer Completed', message: 'Vendor dependencies refreshed.' });
    }, 1400);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileCode className="w-6 h-6 text-indigo-400" />
            <span>PHP & FastCGI Process Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-version PHP runtimes (7.4 to 8.4), extensions, php.ini directives, and Composer workflows.
          </p>
        </div>

        {/* Global Version Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Active PHP:</span>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-xs font-bold focus:outline-none focus:border-sky-500"
          >
            {phpConfigs.map((cfg) => (
              <option key={cfg.version} value={cfg.version}>
                PHP {cfg.version} {cfg.defaultForSystem ? '(System Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('domains')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'domains' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Domain Mappings ({domains.length})
        </button>
        <button
          onClick={() => setActiveTab('extensions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'extensions' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          PHP Extensions ({activeConfig.extensions.length})
        </button>
        <button
          onClick={() => setActiveTab('ini')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ini' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          php.ini Directives
        </button>
        <button
          onClick={() => setActiveTab('fpm')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'fpm' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          PHP-FPM Pool Config
        </button>
        <button
          onClick={() => setActiveTab('composer')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'composer' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Composer Manager
        </button>
      </div>

      {/* Tab 1: Per-Domain Version */}
      {activeTab === 'domains' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">PHP Version Per Domain</h2>
              <p className="text-xs text-slate-400">
                Each domain runs on an isolated PHP FastCGI pool with its own memory boundary and sockets.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400">OPcache Acceleration Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Document Root</th>
                  <th className="pb-3">Assigned PHP Runtime</th>
                  <th className="pb-3">FPM Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {domains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>{dom.domain}</span>
                    </td>
                    <td className="py-3 font-mono text-slate-300">{dom.docRoot}</td>
                    <td className="py-3">
                      <select
                        value={dom.phpVersion}
                        onChange={(e) => updatePhpVersionForDomain(dom.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono font-bold"
                      >
                        <option value="8.4">PHP 8.4</option>
                        <option value="8.3">PHP 8.3</option>
                        <option value="8.2">PHP 8.2</option>
                        <option value="7.4">PHP 7.4</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                        Socket: /run/php/php{dom.phpVersion}-fpm.sock
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: `PHP-FPM Pool Reloaded`,
                            message: `Reloaded worker pool for ${dom.domain}`,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Reload Pool"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: PHP Extensions */}
      {activeTab === 'extensions' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-white">PHP {selectedVersion} Dynamic Extensions</h2>
              <p className="text-xs text-slate-400">Toggle compiled extensions on the fly for PHP {selectedVersion}</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setExtensionCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    extensionCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredExtensions.map((ext) => (
              <div
                key={ext.name}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">{ext.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {ext.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ext.description}</p>
                </div>

                <button
                  onClick={() => togglePhpExtension(selectedVersion, ext.name)}
                  className={`w-10 h-6 rounded-full transition-colors relative shrink-0 focus:outline-none ${
                    ext.enabled ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                  role="switch"
                  aria-checked={ext.enabled}
                  aria-label={`Toggle ${ext.name}`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      ext.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: php.ini Config */}
      {activeTab === 'ini' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">php.ini Directives for PHP {selectedVersion}</h2>
            <p className="text-xs text-slate-400">
              Customize upload caps, memory allocations, execution timers, and OPcache buffers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">memory_limit</label>
              <input
                type="text"
                value={String(activeConfig.iniSettings.memory_limit || '256M')}
                onChange={(e) => updatePhpIni(selectedVersion, 'memory_limit', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Maximum script RAM allocation (e.g. 256M, 512M, 1024M)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">upload_max_filesize</label>
              <input
                type="text"
                value={String(activeConfig.iniSettings.upload_max_filesize || '64M')}
                onChange={(e) => updatePhpIni(selectedVersion, 'upload_max_filesize', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Max size per uploaded file payload</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">post_max_size</label>
              <input
                type="text"
                value={String(activeConfig.iniSettings.post_max_size || '64M')}
                onChange={(e) => updatePhpIni(selectedVersion, 'post_max_size', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Max total HTTP POST body data</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">max_execution_time (seconds)</label>
              <input
                type="number"
                value={Number(activeConfig.iniSettings.max_execution_time || 120)}
                onChange={(e) => updatePhpIni(selectedVersion, 'max_execution_time', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Timeout limit before script execution aborts</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">date.timezone</label>
              <select
                value={String(activeConfig.iniSettings['date.timezone'] || 'Asia/Kolkata')}
                onChange={(e) => updatePhpIni(selectedVersion, 'date.timezone', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">display_errors</label>
              <select
                value={String(activeConfig.iniSettings.display_errors || 'Off')}
                onChange={(e) => updatePhpIni(selectedVersion, 'display_errors', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              >
                <option value="Off">Off (Production Security Recommended)</option>
                <option value="On">On (Development Debugging)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: PHP-FPM Pool Config */}
      {activeTab === 'fpm' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">PHP-FPM Worker Pool Tuning (PHP {selectedVersion})</h2>
            <p className="text-xs text-slate-400">
              Manage dynamic/static process concurrency, spare workers, and request queuing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">pm.max_children</label>
              <input
                type="number"
                value={activeConfig.fpmMaxChildren}
                onChange={(e) => updateFpmSettings(selectedVersion, { fpmMaxChildren: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Max concurrent worker child processes</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">pm.start_servers</label>
              <input
                type="number"
                value={activeConfig.fpmStartServers}
                onChange={(e) => updateFpmSettings(selectedVersion, { fpmStartServers: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Number of children spawned at startup</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">pm.min_spare_servers</label>
              <input
                type="number"
                value={activeConfig.fpmMinSpare}
                onChange={(e) => updateFpmSettings(selectedVersion, { fpmMinSpare: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Minimum idle child processes in reserve</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-slate-300 font-semibold">pm.max_spare_servers</label>
              <input
                type="number"
                value={activeConfig.fpmMaxSpare}
                onChange={(e) => updateFpmSettings(selectedVersion, { fpmMaxSpare: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Maximum idle child processes in reserve</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Composer */}
      {activeTab === 'composer' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">PHP Composer Package Manager</h2>
            <p className="text-xs text-slate-400">
              Run Composer dependency updates, install packages, and generate optimized class autoload maps.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={composerCmd}
                onChange={(e) => setComposerCmd(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:border-sky-500 focus:outline-none"
              />
              <button
                onClick={handleRunComposer}
                disabled={composerRunning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md"
              >
                {composerRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Execute</span>
              </button>
            </div>

            {composerOutput && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                {composerOutput}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
