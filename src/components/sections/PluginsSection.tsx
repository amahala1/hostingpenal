import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  ExternalLink,
  Settings,
  Zap,
  Search,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SystemPlugin } from '../../types';

export const PluginsSection: React.FC = () => {
  const { plugins, togglePlugin, addToast, triggerHaptic } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'installer', 'database', 'runtime', 'security', 'monitoring'];

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  const handleToggle = (plugin: SystemPlugin) => {
    triggerHaptic();
    togglePlugin(plugin.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-pink-400" />
            <span>Plugin Ecosystem & Software Modules</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Extend control panel capabilities with Softaculous 1-click apps, Redis caching, Node.js runtime, and CSF firewall.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({ type: 'info', title: 'Repository Checked', message: 'All plugins are on the latest versions.' });
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-sky-400" />
          <span>Check Updates</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedCategory === c
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search plugins & extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{plugin.name}</h3>
                    <div className="text-[11px] font-mono text-slate-400">v{plugin.version} • {plugin.author}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                    plugin.enabled
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {plugin.enabled ? 'Installed' : 'Available'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {plugin.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono uppercase">
                {plugin.category}
              </span>

              <button
                onClick={() => handleToggle(plugin)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  plugin.enabled
                    ? 'bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300'
                    : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-600/30'
                }`}
              >
                {plugin.enabled ? 'Uninstall / Disable' : 'Install Plugin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
