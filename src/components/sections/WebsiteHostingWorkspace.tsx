import React, { useState } from 'react';
import {
  Globe,
  FileCode,
  Database,
  ShieldCheck,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Folder,
  Code2,
  Terminal,
  Lock,
  HardDrive,
  Copy,
  Check,
  AlertCircle,
  FolderPlus,
  FilePlus,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WebsiteHostingWorkspace: React.FC = () => {
  const {
    domains,
    selectedDomain,
    setSelectedDomain,
    files,
    createFile,
    updateFileContent,
    deleteFile,
    databases,
    createDatabase,
    addToast,
    triggerHaptic,
    networkTelemetry,
  } = useApp();

  const currentDomainObj = domains.find((d) => d.domain === selectedDomain) || domains[0] || {
    domain: 'sitindia.in',
    documentRoot: '/home/sitindia/public_html',
    phpVersion: '8.3',
    sslStatus: 'active',
  };

  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'database' | 'domain'>('preview');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // File Editor state
  const [selectedFilePath, setSelectedFilePath] = useState<string>('/home/sitindia/public_html/index.php');
  const selectedFile = files.find((f) => f.path === selectedFilePath) || files[0] || {
    id: 'f-default-1',
    name: 'index.php',
    path: '/home/sitindia/public_html/index.php',
    content: `<?php\n// Welcome to Your Hosted Website!\necho "<h1>Website Hosted Successfully on ${selectedDomain}</h1>";\necho "<p>Server IP: ${networkTelemetry.publicIp}</p>";\n?>`,
    size: 240,
    lastModified: '2026-08-18',
  };

  const [editorCode, setEditorCode] = useState<string>(selectedFile.content || '');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New File modal
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  // Upload file simulation state
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFileToEdit = (path: string) => {
    triggerHaptic();
    setSelectedFilePath(path);
    const target = files.find((f) => f.path === path);
    if (target) {
      setEditorCode(target.content || '');
    }
  };

  const handleSaveFileCode = () => {
    triggerHaptic();
    if (selectedFile) {
      if (selectedFile.id) {
        updateFileContent(selectedFile.id, editorCode);
      }
      addToast({
        type: 'success',
        title: 'File Saved',
        message: `Successfully saved changes to ${selectedFile.name}`,
      });
    }
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const fileName = newFileName.trim();
    const fullPath = `/home/sitindia/public_html/${fileName}`;
    createFile('/home/sitindia/public_html', fileName, newFileContent || `<!-- Custom code for ${fileName} -->\n`, true);

    setShowNewFileModal(false);
    setNewFileName('');
    setNewFileContent('');
    setSelectedFilePath(fullPath);
    setEditorCode(newFileContent || '');
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast({ type: 'info', title: 'Copied', message: `${fieldName} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Website Top Status Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 font-bold shrink-0">
            <Globe className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                {selectedDomain}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Website</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>HTTPS SSL Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Server IP: <strong className="text-slate-800">{networkTelemetry.publicIp}</strong> • Root: <span className="text-sky-600">{currentDomainObj.documentRoot}</span> • PHP {currentDomainObj.phpVersion}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Domain Selector */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none font-mono"
          >
            {domains.map((d) => (
              <option key={d.id} value={d.domain}>{d.domain}</option>
            ))}
          </select>

          <a
            href={`https://${selectedDomain}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <span>Open Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('preview');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'preview'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Website Preview</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('editor');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'editor'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Files & Code Editor</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic();
            setActiveTab('database');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'database'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Config</span>
        </button>
      </div>

      {/* TAB 1: LIVE WEBSITE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-bold text-slate-800">https://{selectedDomain}/</span>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDeviceViewport('desktop')}
                className={`p-1.5 rounded-lg transition ${deviceViewport === 'desktop' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceViewport('tablet')}
                className={`p-1.5 rounded-lg transition ${deviceViewport === 'tablet' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceViewport('mobile')}
                className={`p-1.5 rounded-lg transition ${deviceViewport === 'mobile' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div className="flex justify-center bg-slate-100/60 p-4 rounded-xl min-h-[500px]">
            <div
              className={`bg-white rounded-xl shadow-lg border border-slate-200 transition-all duration-300 overflow-hidden flex flex-col ${
                deviceViewport === 'desktop'
                  ? 'w-full max-w-5xl'
                  : deviceViewport === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              <div className="bg-slate-900 text-white p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-black">{selectedDomain}</h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    HTTP/2 200 OK
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Welcome to your hosted website platform on <strong className="text-white">{selectedDomain}</strong>. Your server is fully configured with Nginx, PHP 8.3 FPM, and MariaDB.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400">Server IP Address</div>
                    <div className="text-sky-400 font-bold text-sm mt-0.5">{networkTelemetry.publicIp}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400">Document Root</div>
                    <div className="text-purple-300 font-bold text-xs truncate mt-0.5">{currentDomainObj.documentRoot}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400">SSL Encryption</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">TLS 1.3 Active</div>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-2xl">
                  🚀
                </div>
                <h3 className="text-xl font-bold text-slate-800">Your Website is Live & Ready</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  You can edit your HTML/PHP files in the Code Editor tab, upload custom files, or connect your MySQL database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FILE MANAGER & CODE EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Tree Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Folder className="w-4 h-4 text-sky-600" />
                <span>Website Files</span>
              </span>

              <button
                onClick={() => setShowNewFileModal(true)}
                className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-bold flex items-center gap-1 transition"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>New File</span>
              </button>
            </div>

            <div className="space-y-1 max-h-[450px] overflow-y-auto">
              {files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => handleSelectFileToEdit(file.path)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between transition ${
                    selectedFilePath === file.path
                      ? 'bg-sky-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 ${selectedFilePath === file.path ? 'text-white' : 'text-sky-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75">{file.size} B</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Code Editor Panel */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-sky-300">
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="font-bold">{selectedFile?.name || 'editor.php'}</span>
              </div>

              <button
                onClick={handleSaveFileCode}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Code</span>
              </button>
            </div>

            <textarea
              rows={16}
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed select-all"
              placeholder="Paste or write your HTML / PHP code here..."
            />
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE & CONFIG */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Database & Configuration</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your MySQL / MariaDB databases and connection strings for your website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Credentials Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
              <h3 className="font-bold text-sm text-sky-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Live Database Connection Details</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Database Host:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">localhost</span>
                    <button onClick={() => copyToClipboard('localhost', 'Host')} className="text-sky-400 hover:text-white">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Database Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 font-bold">sitindia_db</span>
                    <button onClick={() => copyToClipboard('sitindia_db', 'Database Name')} className="text-sky-400 hover:text-white">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Database User:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 font-bold">sitindia_usr</span>
                    <button onClick={() => copyToClipboard('sitindia_usr', 'Database User')} className="text-sky-400 hover:text-white">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PHP DB Connection Code Snippet */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>PHP PDO Database Connection Script</span>
              </h3>

              <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-sky-300 overflow-x-auto border border-slate-800">
{`<?php
$host = "localhost";
$dbname = "sitindia_db";
$user = "sitindia_usr";
$pass = "••••••••••••";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  die("Connection failed: " . $e->getMessage());
}
?>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* NEW FILE MODAL */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Create New Website File</h3>

            <form onSubmit={handleCreateNewFile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. config.php or about.html"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Code / Content</label>
                <textarea
                  rows={5}
                  placeholder="Paste initial HTML or PHP code..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-bold"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
