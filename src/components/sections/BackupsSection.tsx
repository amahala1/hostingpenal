import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardDrive,
  Plus,
  RotateCcw,
  Download,
  Trash2,
  Calendar,
  Cloud,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Archive,
  RefreshCw,
  X,
} from 'lucide-react';
import { BackupSchedule, BackupSnapshot } from '../../types';

export const BackupsSection: React.FC = () => {
  const {
    backupSchedules,
    backupSnapshots,
    createManualBackup,
    restoreBackup,
    deleteBackup,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'snapshots' | 'schedules' | 'destinations'>('snapshots');
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [snapshotScope, setSnapshotScope] = useState<'full' | 'database_only' | 'files_only'>('full');
  const [snapshotNotes, setSnapshotNotes] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    createManualBackup(snapshotScope);
    setShowSnapshotModal(false);
  };

  const handleRestore = (id: string) => {
    triggerHaptic();
    setRestoringId(id);
    setTimeout(() => {
      restoreBackup(id);
      setRestoringId(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-orange-400" />
            <span>Automated Backup Scheduling & Snapshots</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Encrypted tar.zst archives, automated daily cron backups to AWS S3 / SFTP, and 1-click restore points.
          </p>
        </div>

        <button
          onClick={() => setShowSnapshotModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-lg shadow-orange-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Instant Backup</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('snapshots')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'snapshots' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Backup Snapshots ({backupSnapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'schedules' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Automated Cron Schedules ({backupSchedules.length})
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'destinations' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Remote Storage Endpoints (S3 / SFTP)
        </button>
      </div>

      {/* Tab 1: Snapshots List */}
      {activeTab === 'snapshots' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Available Restore Points</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{backupSnapshots.length}</div>
              <div className="text-[11px] text-orange-400 mt-1">AES-256 GCM Encrypted</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Total Backup Size</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {(backupSnapshots.reduce((acc, s) => acc + s.sizeMB, 0) / 1024).toFixed(2)} GB
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Stored in AWS S3 Mumbai</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Latest Full Snapshot</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">Today 03:00</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">Integrity Verified: OK</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Snapshot Archives</h2>
              <span className="text-xs font-mono text-slate-400">Retention: 30 Days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Archive File</th>
                    <th className="pb-3">Scope</th>
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {backupSnapshots.map((snap) => (
                    <tr key={snap.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-semibold text-white flex items-center gap-2">
                        <Archive className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="truncate max-w-[200px]" title={snap.filename}>{snap.filename}</span>
                      </td>

                      <td className="py-3.5 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-mono">
                          {snap.scope.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 text-slate-300">{snap.sizeMB} MB</td>
                      <td className="py-3.5 text-slate-400 font-sans text-xs">{snap.destination}</td>
                      <td className="py-3.5 text-slate-400 text-[11px]">{snap.createdAt}</td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {snap.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRestore(snap.id)}
                            disabled={restoringId === snap.id}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600 text-orange-200 text-xs font-semibold disabled:opacity-50"
                          >
                            {restoringId === snap.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => {
                              addToast({ type: 'success', title: 'Download Started', message: `Downloading ${snap.filename}` });
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Download Archive"
                          >
                            <Download className="w-3.5 h-3.5 text-sky-400" />
                          </button>
                          <button
                            onClick={() => deleteBackup(snap.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                            title="Delete Snapshot"
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

      {/* Tab 2: Cron Schedules */}
      {activeTab === 'schedules' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">Automated Scheduled Backup Jobs</h2>
              <p className="text-xs text-slate-400">Configure crontab automated recurring backups and retention cycles</p>
            </div>
            <button
              onClick={() => {
                addToast({ type: 'info', title: 'Schedule Added', message: 'New daily schedule configured' });
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backupSchedules.map((sch) => (
              <div key={sch.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">{sch.name}</div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    {sch.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div>Frequency: <span className="text-sky-300 capitalize">{sch.frequency}</span></div>
                  <div>Retention: <span className="text-sky-300">{sch.retentionDays} Days</span></div>
                  <div>Scope: <span className="text-slate-400 uppercase">{sch.scope.replace('_', ' ')}</span></div>
                  <div>Storage: <span className="text-slate-400">{sch.destination}</span></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Next scheduled execution: Tonight at 03:00 UTC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Destinations */}
      {activeTab === 'destinations' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="font-bold text-base text-white">Remote Storage Destinations</h2>
            <p className="text-xs text-slate-400">Offsite cloud storage endpoints for disaster recovery</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'AWS S3 (ap-south-1 Mumbai)', bucket: 's3://sitindia-cloud-backups-mumbai', status: 'Connected', enc: 'SSE-KMS' },
              { name: 'Backup SFTP Storage Node', bucket: 'sftp://storage.sitindia.in:2222/vault', status: 'Connected', enc: 'SSH Key' },
              { name: 'Local NVMe RAID-1', bucket: '/home/sitindia/backups', status: 'Primary', enc: 'LUKS' },
            ].map((dst, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">{dst.name}</div>
                    <div className="font-mono text-[11px] text-slate-400 mt-0.5">{dst.bucket} • {dst.enc}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {dst.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instant Snapshot Modal */}
      {showSnapshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Create Instant Server Snapshot</h3>
              <button onClick={() => setShowSnapshotModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSnapshot} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Backup Scope</label>
                <select
                  value={snapshotScope}
                  onChange={(e) => setSnapshotScope(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="full">Full Account (Files + Databases + Mailboxes + SSL)</option>
                  <option value="database_only">Databases Only (All MySQL schemas & users)</option>
                  <option value="files_only">Home Directory & Web Files Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Snapshot Label / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Pre-upgrade restore checkpoint"
                  value={snapshotNotes}
                  onChange={(e) => setSnapshotNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSnapshotModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Generate Backup Snapshot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
