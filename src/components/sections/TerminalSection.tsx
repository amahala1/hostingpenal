import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal as TerminalIcon,
  Key,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Shield,
  Send,
  HelpCircle,
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  text: string;
}

export const TerminalSection: React.FC = () => {
  const { domains, metrics, services, addToast, triggerHaptic } = useApp();

  const [activeTab, setActiveTab] = useState<'console' | 'ssh-keys'>('console');
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'Linux sitindia-node-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64' },
    { id: '2', type: 'system', text: 'SIT India Enterprise Server Management Shell. Type "help" for a list of available commands.\n' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // SSH Keys state
  const [sshKeys, setSshKeys] = useState([
    { id: 'key-1', name: 'Lead Dev MacBook (Ed25519)', fingerprint: 'SHA256:7mG89qWbX4sK...', created: '2026-06-10' },
    { id: 'key-2', name: 'CI/CD Deployment Runner', fingerprint: 'SHA256:9xL01pNmR3yZ...', created: '2026-07-22' },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    triggerHaptic();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const userLine: TerminalLine = {
      id: Math.random().toString(),
      type: 'command',
      text: `sitindia@cluster:~$ ${trimmed}`,
    };

    let responseText = '';
    let responseType: 'output' | 'error' | 'system' = 'output';

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();

    switch (root) {
      case 'help':
        responseText = `Available Commands:
  systemctl status <nginx|mysql|php8.3-fpm|redis>  - Check daemon status
  php -v                                          - Show installed PHP runtime
  mysql -u root -p                                - Connect to MySQL server
  htop / top                                      - Display process summary
  df -h                                           - View disk storage usage
  free -m                                         - Check RAM allocations
  uname -a                                        - View kernel and OS details
  uptime                                          - Show system uptime and load average
  ls -la                                          - List files in current directory
  composer --version                              - Check PHP Composer
  clear                                           - Clear terminal output`;
        break;

      case 'clear':
        setHistory([]);
        setCurrentInput('');
        return;

      case 'php':
        if (parts[1] === '-v' || parts[1] === '--version') {
          responseText = `PHP 8.3.10 (cli) (built: Aug 12 2026 14:22:01) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.3.10, with Zend OPcache v8.3.10, Copyright (c) Zend Technologies`;
        } else {
          responseText = `Usage: php -v or php <script.php>`;
        }
        break;

      case 'mysql':
        responseText = `Welcome to the MariaDB monitor.  Commands end with ; or \\g.
Your MariaDB connection id is 4820
Server version: 10.11.8-MariaDB-0ubuntu0.24.04.1 Ubuntu 24.04
Type 'help;' or '\\h' for help. Type '\\c' to clear the current input statement.`;
        break;

      case 'df':
        responseText = `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  200G   48G  152G  24% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/nvme0n1p2  500M  120M  380M  24% /boot`;
        break;

      case 'free':
        responseText = `               total        used        free      shared  buff/cache   available
Mem:           16384        5939        4120         340        6325       10104
Swap:           4096         120        3976`;
        break;

      case 'uptime':
        responseText = ` 10:15:22 up 14 days, 6:18, 1 user, load average: ${metrics.loadAverage.join(', ')}`;
        break;

      case 'uname':
        responseText = 'Linux sitindia-node-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
        break;

      case 'whoami':
        responseText = 'sitindia (uid=1000 gid=1000 groups=1000(sitindia),27(sudo),33(www-data))';
        break;

      case 'ls':
        responseText = `drwxr-xr-x 12 sitindia sitindia 4096 Aug 17 07:15 .
drwxr-xr-x  4 root     root     4096 Jun 01 10:00 ..
drwxr-xr-x  8 sitindia sitindia 4096 Aug 17 07:10 public_html
drwxr-xr-x  4 sitindia sitindia 4096 Aug 16 22:30 staging
drwxr-xr-x  2 sitindia sitindia 4096 Aug 15 14:00 backups
drwx------  2 sitindia sitindia 4096 Aug 10 18:40 .ssh
-rw-r--r--  1 sitindia sitindia  820 Aug 17 07:05 .env`;
        break;

      case 'pwd':
        responseText = '/home/sitindia';
        break;

      case 'systemctl':
        if (parts[1] === 'status') {
          const srv = parts[2] || 'nginx';
          responseText = `● ${srv}.service - Production High Performance Daemon
     Loaded: loaded (/lib/systemd/system/${srv}.service; enabled; preset: enabled)
     Active: active (running) since Sun 2026-08-03 04:00:12 UTC; 14 days ago
   Main PID: 712 (${srv})
      Tasks: 4 (limit: 18835)
     Memory: 64.2M
        CPU: 18min 42.114s`;
        } else {
          responseText = 'systemctl: syntax: systemctl status <service_name>';
        }
        break;

      case 'htop':
      case 'top':
        responseText = `Tasks: 182 total, 1 running, 181 sleeping, 0 stopped, 0 zombie
%Cpu(s):  ${metrics.cpuUsage}% us,  1.2% sy,  0.0% ni, 94.6% id,  0.1% wa
MiB Mem :  16384.0 total,   4120.5 free,   5939.2 used,   6324.3 buff/cache
MiB Swap:   4096.0 total,   3976.0 free,    120.0 used.  10104.8 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1042 sitindia  20   0  380120 184200  42100 S   4.2   1.1   8:14.22 php-fpm8.3
  890 mysql     20   0 1480920 620400  32100 S   2.1   3.8  24:19.40 mysqld
  712 www-data  20   0  140820  48200  12400 S   1.5   0.3   4:10.15 nginx`;
        break;

      case 'composer':
        responseText = 'Composer version 2.7.7 2026-06-10 14:30:12\nPHP Composer package management tool.';
        break;

      default:
        responseText = `bash: ${trimmed}: command not found. Type "help" for a list of commands.`;
        responseType = 'error';
        break;
    }

    setHistory((prev) => [
      ...prev,
      userLine,
      { id: Math.random().toString(), type: responseType, text: responseText },
    ]);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCurrentInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(nextIdx);
          setCurrentInput(commandHistory[nextIdx]);
        }
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <TerminalIcon className="w-6 h-6 text-emerald-400" />
            <span>Secure Web SSH Terminal & Key Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browser-based root / user shell with instant command execution, htop inspection, and Ed25519 keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'console' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-900 text-slate-300'
            }`}
          >
            SSH Terminal
          </button>
          <button
            onClick={() => setActiveTab('ssh-keys')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ssh-keys' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Authorized SSH Keys ({sshKeys.length})
          </button>
        </div>
      </div>

      {activeTab === 'console' && (
        <div
          className={`rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col overflow-hidden transition-all ${
            isFullScreen ? 'fixed inset-4 z-50' : 'h-[620px]'
          }`}
        >
          {/* Terminal Title Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-300 font-semibold">
                sitindia@cluster-node-01:~ (bash)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCommand('clear')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono"
              >
                clear
              </button>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Clickable Commands */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-slate-400">Quick:</span>
            {['help', 'htop', 'df -h', 'free -m', 'php -v', 'ls -la', 'systemctl status nginx'].map((c) => (
              <button
                key={c}
                onClick={() => handleCommand(c)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white whitespace-nowrap"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Terminal Console Output */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-1.5 cursor-text select-text"
          >
            {history.map((h) => (
              <div
                key={h.id}
                className={`whitespace-pre-wrap leading-relaxed ${
                  h.type === 'command'
                    ? 'text-sky-400 font-bold'
                    : h.type === 'error'
                    ? 'text-rose-400'
                    : h.type === 'system'
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }`}
              >
                {h.text}
              </div>
            ))}

            {/* Input Prompt Row */}
            <div className="flex items-center gap-2 pt-1 text-slate-100">
              <span className="text-emerald-400 font-bold">sitindia@cluster:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none font-mono text-white text-xs p-0 m-0"
                autoFocus
                spellCheck={false}
              />
            </div>
            <div ref={endRef} />
          </div>
        </div>
      )}

      {/* Tab 2: SSH Keys */}
      {activeTab === 'ssh-keys' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="font-bold text-base text-white">Authorized SSH Public Keys</h2>
            <p className="text-xs text-slate-400">
              Authenticate securely via public-key cryptography without typing passwords on port 22.
            </p>
          </div>

          {/* Add Key Form */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="font-semibold text-xs text-white">Register New Public Key (id_ed25519.pub / id_rsa.pub)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Key Label / Machine Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. Workstation Ubuntu Linux"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Key Data</label>
                <input
                  type="text"
                  placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5..."
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (newKeyName.trim() && newKeyValue.trim()) {
                  setSshKeys((prev) => [
                    ...prev,
                    {
                      id: Math.random().toString(),
                      name: newKeyName.trim(),
                      fingerprint: 'SHA256:' + Math.random().toString(36).substring(2, 12),
                      created: 'Today',
                    },
                  ]);
                  setNewKeyName('');
                  setNewKeyValue('');
                  addToast({ type: 'success', title: 'SSH Key Installed' });
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md"
            >
              Add Authorized Key
            </button>
          </div>

          {/* Keys List */}
          <div className="space-y-3">
            {sshKeys.map((k) => (
              <div key={k.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white font-mono">{k.name}</div>
                    <div className="text-slate-400 font-mono text-[11px] mt-0.5">{k.fingerprint} • Created {k.created}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSshKeys((prev) => prev.filter((item) => item.id !== k.id))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                  title="Revoke SSH Key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
