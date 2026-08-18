import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderTree,
  Folder,
  File,
  FileCode,
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit,
  Lock,
  Archive,
  FolderArchive,
  RefreshCw,
  Search,
  Key,
  ChevronRight,
  Home,
  Check,
  X,
  Copy,
  Users,
  Shield,
  Eye,
  Save,
  Palette,
  Columns,
  Maximize2,
  FileCheck,
} from 'lucide-react';
import { VirtualFile, FtpAccount } from '../../types';

export const FileManagerSection: React.FC = () => {
  const {
    files,
    activeFilePath,
    setActiveFilePath,
    createFile,
    createFolder,
    updateFileContent,
    deleteFile,
    renameFile,
    changePermissions,
    zipFiles,
    unzipFile,
    ftpAccounts,
    addFtpAccount,
    deleteFtpAccount,
    addToast,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'files' | 'ftp'>('files');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Code Editor Modal & Ruler
  const [editingFile, setEditingFile] = useState<VirtualFile | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorTheme, setEditorTheme] = useState<'paper' | 'solarized' | 'github' | 'sublime' | 'vs'>('paper');
  const [activeLine, setActiveLine] = useState<number>(1);
  const [editorSearch, setEditorSearch] = useState('');
  const [editorReplace, setEditorReplace] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const rulerRef = useRef<HTMLDivElement | null>(null);

  // Chmod Permissions Modal
  const [chmodTargetFile, setChmodTargetFile] = useState<VirtualFile | null>(null);
  const [chmodUserR, setChmodUserR] = useState(true);
  const [chmodUserW, setChmodUserW] = useState(true);
  const [chmodUserX, setChmodUserX] = useState(false);
  const [chmodGroupR, setChmodGroupR] = useState(true);
  const [chmodGroupW, setChmodGroupW] = useState(false);
  const [chmodGroupX, setChmodGroupX] = useState(false);
  const [chmodWorldR, setChmodWorldR] = useState(true);
  const [chmodWorldW, setChmodWorldW] = useState(false);
  const [chmodWorldX, setChmodWorldX] = useState(false);

  // New FTP modal
  const [showFtpModal, setShowFtpModal] = useState(false);
  const [ftpUser, setFtpUser] = useState('');
  const [ftpPath, setFtpPath] = useState('/home/sitindia/public_html');
  const [ftpQuota, setFtpQuota] = useState(5000);
  const [ftpSsh, setFtpSsh] = useState(true);

  // Filter files in current directory
  const currentDirectoryFiles = files.filter((f) => {
    const parent = f.path.substring(0, f.path.lastIndexOf('/'));
    const isDirectChild = parent === activeFilePath;
    const matchesSearch = searchQuery
      ? f.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return isDirectChild && matchesSearch;
  });

  const getBreadcrumbs = () => {
    const parts = activeFilePath.split('/').filter(Boolean);
    return parts.map((part, index) => {
      const fullPath = '/' + parts.slice(0, index + 1).join('/');
      return { name: part, path: fullPath };
    });
  };

  const handleOpenFolder = (folder: VirtualFile) => {
    triggerHaptic();
    setActiveFilePath(folder.path);
    setSelectedFileIds([]);
  };

  const handleOpenFileEditor = (file: VirtualFile) => {
    setEditingFile(file);
    setEditorContent(file.content || `<?php\n// File: ${file.name}\n// Created in HostAdmin Pro\n\necho "HostAdmin Pro File System Engine Initialized";\n`);
    setActiveLine(1);
  };

  const handleSaveEditor = () => {
    if (editingFile) {
      updateFileContent(editingFile.id, editorContent);
      setEditingFile(null);
      addToast({
        type: 'success',
        title: 'File Saved',
        message: `${editingFile.name} was successfully updated.`,
      });
    }
  };

  const handleScrollSync = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (rulerRef.current) {
      rulerRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleTextareaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const textBeforeCursor = target.value.substring(0, target.selectionStart);
    const lineNum = textBeforeCursor.split('\n').length;
    setActiveLine(lineNum);
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const textBeforeCursor = target.value.substring(0, target.selectionStart);
    const lineNum = textBeforeCursor.split('\n').length;
    setActiveLine(lineNum);
  };

  const openChmodModal = (file: VirtualFile) => {
    setChmodTargetFile(file);
    const p = file.permissions;
    const digits = p.length === 4 ? p.substring(1) : p;
    const u = parseInt(digits[0] || '6', 10);
    const g = parseInt(digits[1] || '4', 10);
    const w = parseInt(digits[2] || '4', 10);

    setChmodUserR((u & 4) !== 0);
    setChmodUserW((u & 2) !== 0);
    setChmodUserX((u & 1) !== 0);

    setChmodGroupR((g & 4) !== 0);
    setChmodGroupW((g & 2) !== 0);
    setChmodGroupX((g & 1) !== 0);

    setChmodWorldR((w & 4) !== 0);
    setChmodWorldW((w & 2) !== 0);
    setChmodWorldX((w & 1) !== 0);
  };

  const calculateChmodString = () => {
    const u = (chmodUserR ? 4 : 0) + (chmodUserW ? 2 : 0) + (chmodUserX ? 1 : 0);
    const g = (chmodGroupR ? 4 : 0) + (chmodGroupW ? 2 : 0) + (chmodGroupX ? 1 : 0);
    const w = (chmodWorldR ? 4 : 0) + (chmodWorldW ? 2 : 0) + (chmodWorldX ? 1 : 0);
    return `0${u}${g}${w}`;
  };

  const handleSaveChmod = () => {
    if (chmodTargetFile) {
      const newPerm = calculateChmodString();
      changePermissions(chmodTargetFile.id, newPerm);
      setChmodTargetFile(null);
      addToast({
        type: 'success',
        title: 'Permissions Updated',
        message: `${chmodTargetFile.name} chmod set to ${newPerm}`,
      });
    }
  };

  const handleCreateFtpAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ftpUser.trim()) return;
    addFtpAccount({
      username: ftpUser.trim(),
      docRoot: ftpPath,
      quotaMB: ftpQuota,
      status: 'active',
      sshAccess: ftpSsh,
    });
    setShowFtpModal(false);
    setFtpUser('');
  };

  const handleCompressSelected = () => {
    if (selectedFileIds.length === 0) return;
    zipFiles(selectedFileIds, `backup_${Date.now()}.zip`);
    setSelectedFileIds([]);
  };

  const lines = editorContent.split('\n');
  const lineCount = lines.length;
  const wordCount = editorContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = editorContent.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header - Pure Light Indian Web Hosting Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Web File Manager & Code Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browser-based file manager, multi-theme code editor with line ruler, permissions & FTP management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('files')}
            className={`ha-tab ${activeTab === 'files' ? 'ha-tab-active' : ''}`}
          >
            File System
          </button>
          <button
            onClick={() => setActiveTab('ftp')}
            className={`ha-tab ${activeTab === 'ftp' ? 'ha-tab-active-mango' : ''}`}
          >
            FTP Accounts ({ftpAccounts.length})
          </button>
        </div>
      </div>

      {activeTab === 'files' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowNewFileModal(true)}
                className="ha-btn ha-btn-purple text-xs py-2 px-3.5"
              >
                <Plus className="w-4 h-4" />
                <span>New File</span>
              </button>

              <button
                onClick={() => setShowNewFolderModal(true)}
                className="ha-btn ha-btn-mango text-xs py-2 px-3.5"
              >
                <Folder className="w-4 h-4" />
                <span>New Folder</span>
              </button>

              <button
                onClick={() => {
                  createFile(activeFilePath, `script_${Date.now()}.php`, '<?php\n// New script\nphpinfo();\n');
                  addToast({ type: 'success', title: 'File Uploaded', message: 'Created test file in ' + activeFilePath });
                }}
                className="ha-btn ha-btn-white text-xs py-2 px-3.5"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Upload File</span>
              </button>

              {selectedFileIds.length > 0 && (
                <>
                  <button
                    onClick={handleCompressSelected}
                    className="ha-btn ha-btn-pink text-xs py-2 px-3.5"
                  >
                    <FolderArchive className="w-4 h-4" />
                    <span>Zip Selected ({selectedFileIds.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      selectedFileIds.forEach((id) => deleteFile(id));
                      setSelectedFileIds([]);
                    }}
                    className="ha-btn ha-btn-red text-xs py-2 px-3.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search current directory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ha-input pl-9 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Breadcrumb Navigation Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-1.5 text-xs overflow-x-auto shadow-2xs">
            <button
              onClick={() => {
                setActiveFilePath('/home/sitindia');
                setSelectedFileIds([]);
              }}
              className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold"
            >
              <Home className="w-3.5 h-3.5" />
              <span>root</span>
            </button>

            {getBreadcrumbs().map((b, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <button
                  onClick={() => {
                    setActiveFilePath(b.path);
                    setSelectedFileIds([]);
                  }}
                  className={`font-mono font-medium hover:underline flex-shrink-0 ${
                    i === getBreadcrumbs().length - 1 ? 'text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {b.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* File Grid & Table List */}
          <div className="ha-table-container">
            <table className="ha-table">
              <thead>
                <tr>
                  <th className="w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        currentDirectoryFiles.length > 0 &&
                        selectedFileIds.length === currentDirectoryFiles.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFileIds(currentDirectoryFiles.map((f) => f.id));
                        } else {
                          setSelectedFileIds([]);
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Permissions</th>
                  <th>Last Modified</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDirectoryFiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                      No files or directories found in this path.
                    </td>
                  </tr>
                ) : (
                  currentDirectoryFiles.map((file) => {
                    const isSelected = selectedFileIds.includes(file.id);
                    return (
                      <tr
                        key={file.id}
                        className={isSelected ? 'bg-purple-50/80' : ''}
                      >
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFileIds((prev) => [...prev, file.id]);
                              } else {
                                setSelectedFileIds((prev) => prev.filter((id) => id !== file.id));
                              }
                            }}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td>
                          {file.type === 'folder' ? (
                            <button
                              onClick={() => handleOpenFolder(file)}
                              className="flex items-center gap-2.5 text-slate-800 font-bold hover:text-amber-600 text-left transition"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                                <Folder className="w-4 h-4 fill-amber-500 text-amber-600" />
                              </div>
                              <span className="font-mono text-xs">{file.name}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenFileEditor(file)}
                              className="flex items-center gap-2.5 text-slate-800 font-semibold hover:text-purple-600 text-left transition"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                                <FileCode className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-mono text-xs">{file.name}</span>
                            </button>
                          )}
                        </td>
                        <td className="font-mono text-xs text-slate-600">
                          {file.type === 'folder' ? '--' : `${(file.size / 1024).toFixed(1)} KB`}
                        </td>
                        <td>
                          <button
                            onClick={() => openChmodModal(file)}
                            className="ha-badge ha-badge-purple font-mono cursor-pointer hover:bg-purple-200"
                            title="Click to edit chmod permissions"
                          >
                            {file.permissions}
                          </button>
                        </td>
                        <td className="text-xs text-slate-500 font-mono">{file.updatedAt}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {file.type !== 'folder' && (
                              <button
                                onClick={() => handleOpenFileEditor(file)}
                                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                                title="Edit file with live ruler"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => openChmodModal(file)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Permissions (chmod)"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FTP Accounts Section */}
      {activeTab === 'ftp' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">FTP & SFTP System Accounts</h3>
              <p className="text-xs text-slate-500">
                Create dedicated isolated FTP credentials pointing to specific document roots.
              </p>
            </div>
            <button
              onClick={() => setShowFtpModal(true)}
              className="ha-btn ha-btn-purple text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create FTP User</span>
            </button>
          </div>

          <div className="ha-table-container">
            <table className="ha-table">
              <thead>
                <tr>
                  <th>FTP Username</th>
                  <th>Directory Path</th>
                  <th>Quota</th>
                  <th>SSH / SFTP</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {ftpAccounts.map((ftp) => (
                  <tr key={ftp.id}>
                    <td className="font-mono font-bold text-slate-800">{ftp.username}</td>
                    <td className="font-mono text-xs text-slate-600">{ftp.docRoot}</td>
                    <td className="font-mono text-xs">{ftp.quotaMB} MB</td>
                    <td>
                      <span
                        className={`ha-badge ${
                          ftp.sshAccess ? 'ha-badge-emerald' : 'ha-badge-pink'
                        }`}
                      >
                        {ftp.sshAccess ? 'SFTP Port 22' : 'FTP Port 21'}
                      </span>
                    </td>
                    <td>
                      <span className="ha-badge ha-badge-emerald">Active</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteFtpAccount(ftp.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title="Delete FTP Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================================================
          CODE EDITOR MODAL WITH LINE RULER AND MULTIPLE LIGHT THEMES (Req #7)
          ========================================================================== */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-5xl h-[88vh] bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Editor Top Bar */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-white">{editingFile.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase">
                      {editingFile.permissions}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 font-mono truncate max-w-md">{editingFile.path}</p>
                </div>
              </div>

              {/* Top Controls & Theme Selector */}
              <div className="flex items-center gap-2">
                {/* Theme Selector */}
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-semibold">
                  <Palette className="w-3.5 h-3.5 text-white" />
                  <span className="text-[11px] text-white hidden md:inline">Theme:</span>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value as any)}
                    className="bg-white text-slate-800 text-xs font-bold px-2 py-0.5 rounded-md outline-none cursor-pointer"
                  >
                    <option value="paper">Paper Light</option>
                    <option value="solarized">Solarized Light</option>
                    <option value="github">GitHub Light</option>
                    <option value="sublime">Sublime Clean</option>
                    <option value="vs">VS Light</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFindReplace((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1"
                  title="Find & Replace"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Find</span>
                </button>

                <button
                  onClick={handleSaveEditor}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save File</span>
                </button>

                <button
                  onClick={() => setEditingFile(null)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Find & Replace Bar */}
            {showFindReplace && (
              <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-600">Find:</span>
                  <input
                    type="text"
                    value={editorSearch}
                    onChange={(e) => setEditorSearch(e.target.value)}
                    placeholder="Search query..."
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-600">Replace:</span>
                  <input
                    type="text"
                    value={editorReplace}
                    onChange={(e) => setEditorReplace(e.target.value)}
                    placeholder="Replacement..."
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-800 text-xs"
                  />
                </div>
                <button
                  onClick={() => {
                    if (editorSearch) {
                      setEditorContent(editorContent.replaceAll(editorSearch, editorReplace));
                      addToast({ type: 'success', title: 'Replaced All', message: `Replaced occurrences of "${editorSearch}"` });
                    }
                  }}
                  className="ha-btn ha-btn-purple py-1 px-3 text-xs"
                >
                  Replace All
                </button>
              </div>
            )}

            {/* Code Body with Synchronized Ruler */}
            <div className={`flex-1 flex overflow-hidden theme-editor-${editorTheme}`}>
              {/* Ruler Gutter Column */}
              <div
                ref={rulerRef}
                className="editor-ruler-gutter overflow-hidden flex-shrink-0"
              >
                {Array.from({ length: lineCount }).map((_, idx) => {
                  const num = idx + 1;
                  const isCurrent = num === activeLine;
                  return (
                    <div
                      key={idx}
                      className={`h-6 flex items-center justify-end px-1.5 rounded ${
                        isCurrent ? 'editor-ruler-active-line font-bold' : ''
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>

              {/* Textarea Area */}
              <textarea
                ref={textareaRef}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onScroll={handleScrollSync}
                onKeyUp={handleTextareaKeyUp}
                onClick={handleTextareaClick}
                className="editor-textarea-base flex-1 overflow-auto bg-transparent focus:outline-none"
                spellCheck={false}
              />
            </div>

            {/* Editor Bottom Status Bar */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono flex-shrink-0">
              <div className="flex items-center gap-4">
                <span className="font-bold text-purple-700">Line: {activeLine} of {lineCount}</span>
                <span>•</span>
                <span>Words: {wordCount}</span>
                <span>•</span>
                <span>Chars: {charCount}</span>
                <span>•</span>
                <span>Encoding: UTF-8</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="ha-badge ha-badge-emerald">Syntax: PHP/HTML/CSS</span>
                <span>HostAdmin In-Place Engine ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                <span>Create New File</span>
              </h3>
              <button onClick={() => setShowNewFileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">File Name</label>
              <input
                type="text"
                placeholder="index.php or script.js"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="ha-input text-xs"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowNewFileModal(false)} className="ha-btn ha-btn-white text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFileName.trim()) {
                    createFile(activeFilePath, newFileName.trim(), '// New file created\n');
                    setShowNewFileModal(false);
                    setNewFileName('');
                  }
                }}
                className="ha-btn ha-btn-purple text-xs"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-500" />
                <span>Create New Folder</span>
              </h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Folder Name</label>
              <input
                type="text"
                placeholder="assets, includes, public"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="ha-input text-xs"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowNewFolderModal(false)} className="ha-btn ha-btn-white text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    createFolder(activeFilePath, newFolderName.trim());
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }
                }}
                className="ha-btn ha-btn-mango text-xs"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chmod Permissions Modal */}
      {chmodTargetFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                <span>Change File Permissions (Chmod)</span>
              </h3>
              <button onClick={() => setChmodTargetFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Editing permissions for: <span className="font-mono font-bold text-purple-700">{chmodTargetFile.name}</span>
            </div>

            {/* Matrix */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-500 text-left">Scope</div>
              <div className="font-bold text-slate-700">Read (4)</div>
              <div className="font-bold text-slate-700">Write (2)</div>
              <div className="font-bold text-slate-700">Exec (1)</div>

              <div className="text-left text-slate-800 font-bold py-1">Owner</div>
              <input type="checkbox" checked={chmodUserR} onChange={(e) => setChmodUserR(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodUserW} onChange={(e) => setChmodUserW(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodUserX} onChange={(e) => setChmodUserX(e.target.checked)} className="mx-auto rounded" />

              <div className="text-left text-slate-800 font-bold py-1">Group</div>
              <input type="checkbox" checked={chmodGroupR} onChange={(e) => setChmodGroupR(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodGroupW} onChange={(e) => setChmodGroupW(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodGroupX} onChange={(e) => setChmodGroupX(e.target.checked)} className="mx-auto rounded" />

              <div className="text-left text-slate-800 font-bold py-1">Public</div>
              <input type="checkbox" checked={chmodWorldR} onChange={(e) => setChmodWorldR(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodWorldW} onChange={(e) => setChmodWorldW(e.target.checked)} className="mx-auto rounded" />
              <input type="checkbox" checked={chmodWorldX} onChange={(e) => setChmodWorldX(e.target.checked)} className="mx-auto rounded" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
              <span>Resulting Octal Chmod:</span>
              <span className="text-sm px-2 py-0.5 bg-purple-200 rounded">{calculateChmodString()}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setChmodTargetFile(null)} className="ha-btn ha-btn-white text-xs">
                Cancel
              </button>
              <button onClick={handleSaveChmod} className="ha-btn ha-btn-purple text-xs">
                Apply Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FTP Account Modal */}
      {showFtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Create FTP Account</span>
              </h3>
              <button onClick={() => setShowFtpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFtpAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">FTP Username</label>
                <div className="flex">
                  <input
                    type="text"
                    required
                    placeholder="ftp_user"
                    value={ftpUser}
                    onChange={(e) => setFtpUser(e.target.value)}
                    className="ha-input text-xs rounded-r-none"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-xs font-bold text-slate-600 flex items-center">
                    @sitindia.in
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Directory Root</label>
                <input
                  type="text"
                  required
                  value={ftpPath}
                  onChange={(e) => setFtpPath(e.target.value)}
                  className="ha-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quota (MB)</label>
                <input
                  type="number"
                  required
                  value={ftpQuota}
                  onChange={(e) => setFtpQuota(Number(e.target.value))}
                  className="ha-input text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sshToggle"
                  checked={ftpSsh}
                  onChange={(e) => setFtpSsh(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="sshToggle" className="text-xs font-semibold text-slate-700">
                  Allow Secure SFTP (Port 22 SSH)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFtpModal(false)}
                  className="ha-btn ha-btn-white text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="ha-btn ha-btn-purple text-xs">
                  Create FTP User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
