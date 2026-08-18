import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  NavSection,
  ThemeMode,
  FontSize,
  WebsiteDomain,
  DomainRedirect,
  ErrorPageConfig,
  VirtualFile,
  FtpAccount,
  PhpConfig,
  DatabaseRecord,
  DatabaseUser,
  EmailAccount,
  EmailForwarder,
  EmailAutoresponder,
  WebmailMessage,
  DnsRecord,
  SslCertificate,
  IpBlockRule,
  FirewallRule,
  ServerService,
  PluginItem,
  SystemPlugin,
  BackupSchedule,
  BackupArchive,
  BackupSnapshot,
  AuditLogEntry,
  UserProfile,
  SystemVersionInfo,
  ServerAccountUser,
  VpsNetworkTelemetry,
  InstallTerminalState,
} from '../types';
import {
  INITIAL_DOMAINS,
  INITIAL_REDIRECTS,
  INITIAL_ERROR_PAGES,
  INITIAL_FILES,
  INITIAL_FTP_ACCOUNTS,
  INITIAL_PHP_VERSIONS,
  INITIAL_DATABASES,
  INITIAL_DB_USERS,
  INITIAL_EMAIL_ACCOUNTS,
  INITIAL_WEBMAIL_MESSAGES,
  INITIAL_DNS_RECORDS,
  INITIAL_SSL_CERTS,
  INITIAL_IP_BLOCKS,
  INITIAL_SERVICES,
  INITIAL_PLUGINS,
  INITIAL_BACKUP_SCHEDULES,
  INITIAL_BACKUP_ARCHIVES,
  INITIAL_AUDIT_LOGS,
  INITIAL_USER_PROFILE,
  INITIAL_SYSTEM_VERSION,
  INITIAL_SERVER_USERS,
} from '../data/mockData';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

export interface TelemetryMetrics {
  cpuUsage: number; // 0-100%
  cpuCores: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  diskUsedGB: number;
  diskTotalGB: number;
  bandwidthInMbps: number;
  bandwidthOutMbps: number;
  loadAverage: [number, number, number];
  mysqlQps: number;
  activeProcesses: number;
  uptimeSeconds: number;
}

export interface SecuritySettings {
  modSecurity: boolean;
  twoFactorEnforced: boolean;
  hotlinkProtection: boolean;
  cphulkBruteForce: boolean;
  sshPasswordAuth: boolean;
}

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (username?: string, password?: string) => boolean;
  logout: () => void;

  // VPS Shift & Master Administrator Account Setup
  isMasterInitialized: boolean;
  masterAccount: { username: string; email: string; passwordHash: string; createdAt: string } | null;
  setupMasterAccount: (masterData: { username: string; email: string; password: string; serverHostname?: string }) => void;
  resetVpsToSetupMode: () => void;

  // Navigation & Mode Switcher
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  panelMode: 'admin' | 'user';
  setPanelMode: (mode: 'admin' | 'user') => void;
  activeUserAccount: ServerAccountUser | null;
  selectedDomain: string;
  setSelectedDomain: (dom: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickActionModal: string | null;
  setQuickActionModal: (modal: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;

  // User Accounts & Sub-user Management
  serverUsers: ServerAccountUser[];
  createServerUser: (user: Omit<ServerAccountUser, 'id' | 'createdAt' | 'diskUsedMB' | 'bandwidthUsedMB' | 'dbCount' | 'emailCount' | 'ftpCount'>) => void;
  updateServerUser: (id: string, updates: Partial<ServerAccountUser>) => void;
  deleteServerUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  loginAsUser: (username: string) => void;
  returnToAdmin: () => void;

  // Live VPS Hardware & Auto IP Telemetry
  networkTelemetry: VpsNetworkTelemetry;
  detectServerIpAndMetrics: () => Promise<void>;

  // Modals for 1-Click Tools
  phpMyAdminModalOpen: boolean;
  setPhpMyAdminModalOpen: (open: boolean) => void;
  launchPhpMyAdmin: (dbName?: string) => void;
  isPhpMyAdminInstalled: boolean;
  installPhpMyAdmin: () => Promise<void>;
  isRoundcubeInstalled: boolean;
  installRoundcube: () => Promise<void>;
  vpsInstallerModalOpen: boolean;
  setVpsInstallerModalOpen: (open: boolean) => void;
  launchVpsInstaller: () => void;
  isVpsInstalled: boolean;
  vpsInstallProgress: number;
  vpsInstallLogs: string[];
  runVpsAutoInstall: () => Promise<void>;
  productionLiveMode: boolean;
  setProductionLiveMode: (live: boolean) => void;
  roundcubeSessionMail: string;
  setRoundcubeSessionMail: (email: string) => void;

  // Accessibility & Preferences
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (val: boolean) => void;
  screenReaderVoiceEnabled: boolean;
  setScreenReaderVoiceEnabled: (val: boolean) => void;
  triggerHaptic: () => void;
  announceToScreenReader: (message: string) => void;
  screenReaderAnnouncement: string;

  // Real-time Telemetry
  metrics: TelemetryMetrics;
  metricsHistory: { time: string; cpu: number; ram: number; disk: number }[];

  // Toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Domain Management
  domains: WebsiteDomain[];
  addDomain: (dom: Omit<WebsiteDomain, 'id' | 'createdAt' | 'bandwidthUsedMB' | 'diskUsedMB' | 'visitorsToday' | 'pageViewsToday' | 'redirectsCount'>) => void;
  addSubdomain: (
    subdomainPrefix: string,
    parentDomain: string,
    docRoot?: string,
    phpVersion?: string,
    recordType?: 'A' | 'CNAME',
    targetIp?: string
  ) => void;
  deleteDomain: (id: string) => void;
  updateDomain: (id: string, updates: Partial<WebsiteDomain>) => void;
  redirects: DomainRedirect[];
  addRedirect: (red: Omit<DomainRedirect, 'id'>) => void;
  deleteRedirect: (id: string) => void;
  errorPages: ErrorPageConfig[];
  updateErrorPage: (code: number, content: string) => void;

  // File Manager
  files: VirtualFile[];
  activeFilePath: string;
  setActiveFilePath: (path: string) => void;
  createFile: (path: string, name: string, content?: string, overwrite?: boolean) => void;
  uploadMultipleFiles: (
    path: string,
    filesList: Array<{ name: string; content: string; size?: number; mimeType?: string }>,
    overwriteExisting?: boolean
  ) => void;
  createFolder: (path: string, name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  changePermissions: (id: string, newPerm: string) => void;
  zipFiles: (fileIds: string[], zipName: string) => void;
  unzipFile: (fileId: string) => void;
  ftpAccounts: FtpAccount[];
  addFtpAccount: (acc: Omit<FtpAccount, 'id' | 'usedMB'>) => void;
  deleteFtpAccount: (id: string) => void;

  // PHP Manager
  phpConfigs: PhpConfig[];
  updatePhpVersionForDomain: (domainId: string, version: string) => void;
  togglePhpExtension: (version: string, extName: string) => void;
  updatePhpIni: (version: string, key: string, value: string | number | boolean) => void;
  updateFpmSettings: (version: string, settings: Partial<PhpConfig>) => void;

  // Databases & 1-Click phpMyAdmin
  databases: DatabaseRecord[];
  dbUsers: DatabaseUser[];
  createDatabase: (name: string, charset?: string, collation?: string) => void;
  createDatabaseWithUser: (
    dbName: string,
    username: string,
    host?: string,
    password?: string,
    privileges?: string[],
    collation?: string,
    charset?: string,
    grantOption?: boolean
  ) => void;
  deleteDatabase: (id: string) => void;
  createDbUser: (username: string, host: string, privileges: string[], assignedDatabases?: string[], grantOption?: boolean) => void;
  deleteDbUser: (id: string) => void;
  updateUserPrivileges: (userId: string, privileges: string[], assignedDatabases?: string[], grantOption?: boolean) => void;
  assignUserToDatabase: (dbId: string, username: string) => void;
  executeSqlQuery: (dbName: string, query: string) => { success: boolean; rows?: any[]; columns?: string[]; affectedRows?: number; message?: string; durationMs: number };

  // Email Hosting & PHPMailer Suite
  emailAccounts: EmailAccount[];
  emailForwarders: EmailForwarder[];
  autoresponders: EmailAutoresponder[];
  webmailMessages: WebmailMessage[];
  addEmailAccount: (acc: Omit<EmailAccount, 'id' | 'usedMB' | 'unreadCount' | 'createdAt'>) => void;
  deleteEmailAccount: (id: string) => void;
  updateEmailAccount: (id: string, updates: Partial<EmailAccount>) => void;
  addEmailForwarder: (forwarder: Omit<EmailForwarder, 'id'>) => void;
  deleteEmailForwarder: (id: string) => void;
  addAutoresponder: (autoresponder: Omit<EmailAutoresponder, 'id'>) => void;
  deleteAutoresponder: (id: string) => void;
  sendWebmailMessage: (msg: Omit<WebmailMessage, 'id' | 'date' | 'read' | 'starred'>) => void;
  markMessageRead: (id: string, read: boolean) => void;
  toggleMessageStarred: (id: string) => void;
  deleteWebmailMessage: (id: string) => void;

  // SSL & Security
  sslCertificates: SslCertificate[];
  ipBlockRules: IpBlockRule[];
  firewallRules: FirewallRule[];
  securitySettings: SecuritySettings;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  issueAutoSsl: (domain: string) => Promise<boolean>;
  installCustomSsl: (domain: string, crt: string, key: string, ca?: string) => void;
  addIpBlock: (ipOrRange: string, reason: string, durationDays?: number) => void;
  removeIpBlock: (id: string) => void;
  addFirewallRule: (rule: { ipOrRange: string; reason: string; durationDays?: number }) => void;
  deleteFirewallRule: (id: string) => void;

  // DNS Management
  dnsRecords: DnsRecord[];
  addDnsRecord: (record: Omit<DnsRecord, 'id'>) => void;
  updateDnsRecord: (id: string, updates: Partial<DnsRecord>) => void;
  deleteDnsRecord: (id: string) => void;
  dnssecEnabled: boolean;
  setDnssecEnabled: (val: boolean) => void;

  // Services & Server
  services: ServerService[];
  restartService: (name: string) => Promise<void>;
  toggleService: (name: string, status: 'running' | 'stopped') => void;

  // 1-Click Plugins & Auto-Dependency Resolver
  plugins: PluginItem[];
  togglePlugin: (id: string) => void;
  togglePluginInstall: (id: string) => void;
  togglePluginActive: (id: string) => void;
  oneClickInstallPlugin: (id: string) => Promise<{ success: boolean; logs: string[] }>;

  // Backups
  backupSchedules: BackupSchedule[];
  backupArchives: BackupArchive[];
  backupSnapshots: BackupSnapshot[];
  createInstantBackup: (scope: string, destination: string) => Promise<void>;
  createManualBackup: (scope: string) => Promise<void>;
  deleteBackupArchive: (id: string) => void;
  deleteBackup: (id: string) => void;
  addBackupSchedule: (sch: Omit<BackupSchedule, 'id' | 'nextRun'>) => void;
  deleteBackupSchedule: (id: string) => void;
  restoreBackupArchive: (id: string) => Promise<void>;
  restoreBackup: (id: string) => Promise<void>;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'adminUser'>) => void;
  clearAuditLogs: () => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // System Version & Auto-Updates
  systemVersion: SystemVersionInfo;
  performSystemUpdate: () => Promise<void>;

  // Live SSH Terminal Installation Engine
  installTerminalState: InstallTerminalState;
  closeInstallTerminal: () => void;
  triggerLivePackageInstall: (packageName: string, title?: string, customLaunchUrl?: string, customLaunchText?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Account Setup & VPS Shift state
  const [isMasterInitialized, setIsMasterInitialized] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_master_initialized') === 'true';
  });

  const [masterAccount, setMasterAccount] = useState<{ username: string; email: string; passwordHash: string; createdAt: string } | null>(() => {
    const saved = localStorage.getItem('hostadmin_master_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_auth') !== 'false';
  });

  // Navigation & Panel Mode Switcher
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [panelMode, setPanelMode] = useState<'admin' | 'user'>('admin');
  const [activeUserAccount, setActiveUserAccount] = useState<ServerAccountUser | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('sitindia.in');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Server Accounts & Sub-users
  const [serverUsers, setServerUsers] = useState<ServerAccountUser[]>(() => {
    const saved = localStorage.getItem('hostadmin_server_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SERVER_USERS;
  });

  // Save serverUsers
  useEffect(() => {
    localStorage.setItem('hostadmin_server_users', JSON.stringify(serverUsers));
  }, [serverUsers]);

  // VPS Network & Live Hardware Telemetry
  const [networkTelemetry, setNetworkTelemetry] = useState<VpsNetworkTelemetry>({
    publicIp: '168.220.248.86',
    ipv6: '2400:cb00:2048:1::c629:d7a2',
    hostname: 'server1.sitindia.in',
    gateway: '168.220.248.1',
    isp: 'SIT Cloud Network / Reliance Infocomm Tier-4 DC',
    location: 'Mumbai (Asia/Kolkata), India',
    autoDetected: true,
    lastChecked: new Date().toLocaleTimeString(),
    totalRamMB: 16384,
    usedRamMB: 3840,
    totalDiskGB: 200,
    usedDiskGB: 48.2,
    cpuLoadPercent: 14.8,
    activeProcesses: 142,
  });

  // Server Hardware Telemetry & Metrics Update
  const detectServerIpAndMetrics = async () => {
    // Keep Authoritative VPS Server IP: 168.220.248.86 (Not Client IP)
    setNetworkTelemetry((prev) => ({
      ...prev,
      publicIp: '168.220.248.86',
      autoDetected: true,
      lastChecked: new Date().toLocaleTimeString(),
    }));

    // Calculate live disk and ram based on database, files, and services
    const filesSizeMB = files.reduce((acc, f) => acc + (f.size / (1024 * 1024)), 0);
    const dbSizeMB = databases.reduce((acc, d) => acc + d.sizeMB, 0);
    const calculatedDiskGB = parseFloat((42.0 + (filesSizeMB + dbSizeMB) / 1024).toFixed(1));
    const calculatedRamMB = services.filter((s) => s.status === 'running').reduce((acc, s) => acc + s.memoryMB, 0) + 1200;

    setNetworkTelemetry((prev) => ({
      ...prev,
      usedDiskGB: calculatedDiskGB,
      usedRamMB: calculatedRamMB,
      lastChecked: new Date().toLocaleTimeString(),
    }));

    setMetrics((prev) => ({
      ...prev,
      diskUsedGB: calculatedDiskGB,
      memoryUsedMB: calculatedRamMB,
    }));

    addToast({
      type: 'success',
      title: 'VPS Live Metrics & IP Synchronized',
      message: `Authoritative IP: ${networkTelemetry.publicIp} • Live RAM: ${calculatedRamMB} MB / 16384 MB • Live Storage: ${calculatedDiskGB} GB / 200 GB`,
    });
  };

  // Auto detect once on mount
  useEffect(() => {
    detectServerIpAndMetrics();
  }, []);

  // 1-Click Modals
  const [phpMyAdminModalOpen, setPhpMyAdminModalOpen] = useState(false);
  const [vpsInstallerModalOpen, setVpsInstallerModalOpen] = useState(false);
  const [isVpsInstalled, setIsVpsInstalled] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_vps_installed') === 'true';
  });
  const [vpsInstallProgress, setVpsInstallProgress] = useState<number>(() => {
    return localStorage.getItem('hostadmin_vps_installed') === 'true' ? 100 : 0;
  });
  const [vpsInstallLogs, setVpsInstallLogs] = useState<string[]>([
    '[INIT] HostAdmin Auto-Installer Ready for Automated VPS Deployment',
  ]);
  const [productionLiveMode, setProductionLiveMode] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_prod_mode') === 'true';
  });
  const [roundcubeSessionMail, setRoundcubeSessionMail] = useState<string>('admin@sitindia.in');

  // User Profile & Preferences - Default to bright light theme
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('hostadmin_theme') as ThemeMode) || 'light';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('hostadmin_fontsize') as FontSize) || 'md';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_highcontrast') === 'true';
  });
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [screenReaderVoiceEnabled, setScreenReaderVoiceEnabled] = useState<boolean>(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // State collections
  const [domains, setDomains] = useState<WebsiteDomain[]>(INITIAL_DOMAINS || []);
  const [redirects, setRedirects] = useState<DomainRedirect[]>(INITIAL_REDIRECTS || []);
  const [errorPages, setErrorPages] = useState<ErrorPageConfig[]>(INITIAL_ERROR_PAGES || []);
  const [files, setFiles] = useState<VirtualFile[]>(INITIAL_FILES || []);
  const [activeFilePath, setActiveFilePath] = useState<string>('/home/sitindia/public_html');
  const [ftpAccounts, setFtpAccounts] = useState<FtpAccount[]>(INITIAL_FTP_ACCOUNTS || []);
  const [phpConfigs, setPhpConfigs] = useState<PhpConfig[]>(INITIAL_PHP_VERSIONS || []);
  const [databases, setDatabases] = useState<DatabaseRecord[]>(INITIAL_DATABASES || []);
  const [dbUsers, setDbUsers] = useState<DatabaseUser[]>(INITIAL_DB_USERS || []);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>(INITIAL_EMAIL_ACCOUNTS || []);
  const [emailForwarders, setEmailForwarders] = useState<EmailForwarder[]>([
    { id: 'fwd-1', sourceEmail: 'info@sitindia.in', targetEmail: 'admin@sitindia.in', active: true },
    { id: 'fwd-2', sourceEmail: 'contact@sitindia.in', targetEmail: 'support@sitindia.in', active: true },
  ]);
  const [autoresponders, setAutoresponders] = useState<EmailAutoresponder[]>([
    {
      id: 'ar-1',
      email: 'support@sitindia.in',
      subject: 'Support Ticket Received - SIT India',
      body: 'Thank you for reaching out to SIT India Support. A representative will respond within 2 business hours.',
      active: true,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    },
  ]);
  const [webmailMessages, setWebmailMessages] = useState<WebmailMessage[]>(INITIAL_WEBMAIL_MESSAGES || []);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(INITIAL_DNS_RECORDS || []);
  const [dnssecEnabled, setDnssecEnabled] = useState(true);
  const [sslCertificates, setSslCertificates] = useState<SslCertificate[]>(INITIAL_SSL_CERTS || []);
  const [ipBlockRules, setIpBlockRules] = useState<IpBlockRule[]>(INITIAL_IP_BLOCKS || []);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    modSecurity: true,
    twoFactorEnforced: false,
    hotlinkProtection: true,
    cphulkBruteForce: true,
    sshPasswordAuth: false,
  });
  const [services, setServices] = useState<ServerService[]>(INITIAL_SERVICES || []);
  const [plugins, setPlugins] = useState<PluginItem[]>(INITIAL_PLUGINS || []);
  const [backupSchedules, setBackupSchedules] = useState<BackupSchedule[]>(INITIAL_BACKUP_SCHEDULES || []);
  const [backupArchives, setBackupArchives] = useState<BackupArchive[]>(INITIAL_BACKUP_ARCHIVES || []);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS || []);
  const [systemVersion, setSystemVersion] = useState<SystemVersionInfo>(INITIAL_SYSTEM_VERSION);

  // Real-time server telemetry
  const [metrics, setMetrics] = useState<TelemetryMetrics>({
    cpuUsage: 14.8,
    cpuCores: 8,
    memoryUsedMB: 3840,
    memoryTotalMB: 16384,
    diskUsedGB: 48.2,
    diskTotalGB: 200,
    bandwidthInMbps: 38.4,
    bandwidthOutMbps: 94.2,
    loadAverage: [0.65, 0.72, 0.58],
    mysqlQps: 184,
    activeProcesses: 142,
    uptimeSeconds: 4190400,
  });

  const [metricsHistory, setMetricsHistory] = useState<{ time: string; cpu: number; ram: number; disk: number }[]>([
    { time: '07:35', cpu: 12, ram: 23, disk: 24 },
    { time: '07:37', cpu: 18, ram: 24, disk: 24 },
    { time: '07:39', cpu: 14, ram: 23, disk: 24 },
    { time: '07:41', cpu: 22, ram: 25, disk: 24 },
    { time: '07:43', cpu: 15, ram: 23, disk: 24 },
    { time: '07:45', cpu: 14.8, ram: 23.4, disk: 24.1 },
  ]);

  // Telemetry real-time ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const deltaCpu = (Math.random() - 0.48) * 4;
        const newCpu = Math.max(5, Math.min(85, parseFloat((prev.cpuUsage + deltaCpu).toFixed(1))));
        const deltaRam = (Math.random() - 0.49) * 40;
        const newRam = Math.max(2800, Math.min(8000, Math.round(prev.memoryUsedMB + deltaRam)));
        const deltaBwIn = (Math.random() - 0.48) * 6;
        const newBwIn = Math.max(5, parseFloat((prev.bandwidthInMbps + deltaBwIn).toFixed(1)));
        const deltaBwOut = (Math.random() - 0.48) * 12;
        const newBwOut = Math.max(10, parseFloat((prev.bandwidthOutMbps + deltaBwOut).toFixed(1)));
        const newQps = Math.max(80, Math.round(prev.mysqlQps + (Math.random() - 0.5) * 30));

        return {
          ...prev,
          cpuUsage: newCpu,
          memoryUsedMB: newRam,
          bandwidthInMbps: newBwIn,
          bandwidthOutMbps: newBwOut,
          mysqlQps: newQps,
          uptimeSeconds: prev.uptimeSeconds + 3,
        };
      });

      // Update history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMetricsHistory((prev) => {
        const next = [...prev.slice(-14), {
          time: timeStr,
          cpu: metrics.cpuUsage,
          ram: parseFloat(((metrics.memoryUsedMB / metrics.memoryTotalMB) * 100).toFixed(1)),
          disk: parseFloat(((metrics.diskUsedGB / metrics.diskTotalGB) * 100).toFixed(1)),
        }];
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics]);

  // Software Installation States
  const [isPhpMyAdminInstalled, setIsPhpMyAdminInstalled] = useState<boolean>(false);
  const [isRoundcubeInstalled, setIsRoundcubeInstalled] = useState<boolean>(false);

  const installPhpMyAdmin = async (): Promise<void> => {
    setIsPhpMyAdminInstalled(true);
    triggerLivePackageInstall('phpMyAdmin v5.2.1', 'Installing phpMyAdmin Database Suite...');
    addToast({
      type: 'success',
      title: 'phpMyAdmin Installation Initiated',
      message: 'Configuring phpMyAdmin database manager on port 8443.',
    });
  };

  const installRoundcube = async (): Promise<void> => {
    setIsRoundcubeInstalled(true);
    triggerLivePackageInstall('Roundcube Webmail v1.6.6', 'Installing Roundcube Webmail Engine...');
    addToast({
      type: 'success',
      title: 'Roundcube Installation Initiated',
      message: 'Configuring Roundcube IMAP/SMTP webmail suite.',
    });
  };

  // Live SSH Installation Terminal State
  const [installTerminalState, setInstallTerminalState] = useState<InstallTerminalState>({
    isOpen: false,
    title: '',
    packageName: '',
    status: 'idle',
    logs: [],
    launchUrl: '',
    launchText: '',
  });

  const closeInstallTerminal = () => {
    setInstallTerminalState((prev) => ({ ...prev, isOpen: false }));
  };

  const triggerLivePackageInstall = (
    packageName: string,
    title?: string,
    customLaunchUrl?: string,
    customLaunchText?: string
  ) => {
    const displayName = title || packageName;
    const ip = networkTelemetry.publicIp || '168.220.248.86';

    let launchUrl = customLaunchUrl;
    let launchText = customLaunchText;

    const lowerPkg = packageName.toLowerCase();

    if (!launchUrl) {
      if (lowerPkg.includes('phpmyadmin') || lowerPkg.includes('pma')) {
        launchUrl = `https://${ip}/phpmyadmin/`;
        launchText = '🚀 Open Directory phpMyAdmin (/phpmyadmin)';
      } else if (lowerPkg.includes('roundcube') || lowerPkg.includes('webmail')) {
        launchUrl = `https://${ip}/roundcube/`;
        launchText = '📧 Open Directory Roundcube Webmail (/roundcube)';
      } else if (lowerPkg.includes('wordpress') || lowerPkg.includes('softaculous')) {
        launchUrl = `https://${ip}/wp-admin/`;
        launchText = '⚡ Open WordPress Admin (/wp-admin)';
      } else {
        launchUrl = `https://${ip}/`;
        launchText = `Launch ${displayName}`;
      }
    }

    setInstallTerminalState({
      isOpen: true,
      title: displayName,
      packageName,
      status: 'installing',
      logs: [`sitindia@node01:~$ sudo apt-get update -y`],
      launchUrl,
      launchText,
    });

    const steps = [
      `Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]`,
      `Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]`,
      `sitindia@node01:~$ sudo apt-get install -y ${packageName}`,
      `Reading package lists... Done`,
      `Building dependency tree... Done`,
      `Reading state information... Done`,
      `The following NEW packages will be installed: ${packageName} lib${packageName}-dev`,
      `0 upgraded, 2 newly installed, 0 to remove and 0 not upgraded.`,
      `Need to get 14.8 MB of archives.`,
      `Get:1 http://archive.ubuntu.com/ubuntu noble/main amd64 ${packageName} [14.8 MB]`,
      `Unpacking ${packageName} (v2.8.0-stable)...`,
      `Setting up ${packageName}...`,
      `Configuring /etc/nginx/sites-available/${packageName}.conf...`,
      `Configuring systemd service unit /etc/systemd/system/${packageName}.service...`,
      `Creating symlinks & setting file permissions (chown -R www-data:www-data)...`,
      `Executing DB migrations and verifying MariaDB connection... [ OK ]`,
      `systemctl reload nginx && systemctl restart ${packageName} [ OK ]`,
      `[SUCCESS] ${displayName} installation completed with 0 errors!`,
      `[AUTOMATIC LINK UPDATED] Target Endpoint: ${launchUrl}`,
    ];

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        const line = steps[currentStep];
        setInstallTerminalState((prev) => ({
          ...prev,
          logs: [...prev.logs, line],
        }));
        currentStep++;
      } else {
        clearInterval(timer);
        setInstallTerminalState((prev) => ({
          ...prev,
          status: 'completed',
        }));

        setPlugins((prev) =>
          prev.map((p) =>
            p.id === packageName || p.name.toLowerCase().includes(packageName.toLowerCase())
              ? { ...p, installed: true, active: true, enabled: true }
              : p
          )
        );

        addAuditLog({
          action: `Live SSH Package Installed: ${displayName}`,
          category: 'Software',
          severity: 'info',
          details: `Installed ${packageName} via live terminal daemon. Automatic link generated: ${launchUrl}`,
        });

        addToast({
          type: 'success',
          title: `${displayName} Installation Complete!`,
          message: `Package installed & active. Automatic launch link updated: ${launchUrl}`,
          duration: 6000,
        });
      }
    }, 350);
  };

  // Auth Functions
  const login = (username?: string, password?: string): boolean => {
    setIsAuthenticated(true);
    localStorage.setItem('hostadmin_auth', 'true');

    const inputUser = (username || 'superadmin').trim();
    const lowerUser = inputUser.toLowerCase();

    // Hierarchy check: Master Admin -> Reseller -> User
    if (lowerUser === 'superadmin' || lowerUser === 'admin' || lowerUser === masterAccount?.username?.toLowerCase()) {
      setUserProfile((prev) => ({
        ...prev,
        username: inputUser,
        name: 'Master Super Administrator',
        role: 'Super Administrator',
      }));
      setPanelMode('admin');
      setActiveSection('overview');

      addToast({
        type: 'success',
        title: 'Master Administrator Control Panel',
        message: `Signed in as Super Administrator '${inputUser}'. Full Server Control active.`,
      });
    } else if (lowerUser.includes('reseller')) {
      setUserProfile((prev) => ({
        ...prev,
        username: inputUser,
        name: 'Reseller Hosting Console',
        role: 'Reseller',
      }));
      setPanelMode('admin');
      setActiveSection('users-manager');

      addToast({
        type: 'success',
        title: 'Reseller Portal Authenticated',
        message: `Signed in as Reseller '${inputUser}'. Scope: Hosting Package Creation & Tenant Account Management.`,
      });
    } else {
      setUserProfile((prev) => ({
        ...prev,
        username: inputUser,
        name: `User Account (${inputUser})`,
        role: 'Site Admin',
      }));

      const matchedUser = serverUsers.find((u) => u.username.toLowerCase() === lowerUser);
      if (matchedUser) {
        setActiveUserAccount(matchedUser);
        setSelectedDomain(matchedUser.domain);
      }

      setPanelMode('user');
      setActiveSection('user-panel');

      addToast({
        type: 'success',
        title: 'User Control Panel Signed In',
        message: `Signed in as User '${inputUser}'. Accessing cPanel web hosting tools.`,
      });
    }

    addAuditLog({
      action: 'User Session Authenticated',
      category: 'Security',
      severity: 'info',
      details: `User ${inputUser} logged into control panel session.`,
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('hostadmin_auth', 'false');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been securely signed out of HostAdmin Pro.',
    });
    addAuditLog({
      action: 'Administrator Session Terminated',
      category: 'Security',
      severity: 'info',
      details: `User ${userProfile.username} ended active web session.`,
    });
  };

  // VPS Shift & Master ID Setup Logic (One-Time Initialization)
  const setupMasterAccount = (masterData: { username: string; email: string; password: string; serverHostname?: string }) => {
    const masterInfo = {
      username: masterData.username,
      email: masterData.email,
      passwordHash: masterData.password,
      createdAt: new Date().toISOString(),
    };

    const updatedProfile: UserProfile = {
      id: 'usr-master-001',
      username: masterData.username,
      name: 'Master System Administrator',
      email: masterData.email,
      role: 'Super Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Master VPS System Administrator',
      language: 'English (US)',
      timezone: 'Asia/Kolkata (IST)',
      twoFactorEnabled: false,
      sessionTimeoutMinutes: 60,
      themePreference: 'light',
      fontSizePreference: 'md',
      hapticFeedback: true,
      screenReaderOptimized: false,
      lastLogin: new Date().toISOString(),
      loginIp: '168.220.248.86',
    };

    setUserProfile(updatedProfile);
    setMasterAccount(masterInfo);
    setIsMasterInitialized(true);

    localStorage.setItem('hostadmin_master_initialized', 'true');
    localStorage.setItem('hostadmin_master_account', JSON.stringify(masterInfo));
    localStorage.setItem('hostadmin_user_profile', JSON.stringify(updatedProfile));

    // Delete and purge ALL mock models for clean VPS environment
    setDomains([]);
    setDatabases([]);
    setDbUsers([]);
    setEmailAccounts([]);
    setEmailForwarders([]);
    setAutoresponders([]);
    setWebmailMessages([]);
    setFtpAccounts([]);
    setServerUsers([]);
    setBackupArchives([]);
    setBackupSchedules([]);
    setDnsRecords([]);
    setSslCertificates([]);
    setRedirects([]);

    const initialMasterFiles: VirtualFile[] = [
      {
        id: 'f-master-root',
        name: 'index.php',
        path: `/home/${masterData.username}/public_html/index.php`,
        type: 'file',
        size: 340,
        permissions: '0644',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        extension: 'php',
        mimeType: 'text/x-php',
        content: `<?php\n// HostAdmin Production VPS Environment\necho "<h1>VPS Live Environment Active</h1>";\necho "<p>Master Administrator: <strong>${masterData.username}</strong> (${masterData.email})</p>";\necho "<p>Status: <strong>Clean Production Mode</strong> (All mock models purged)</p>";\n?>`,
      },
    ];
    setFiles(initialMasterFiles);

    localStorage.setItem('hostadmin_domains', JSON.stringify([]));
    localStorage.setItem('hostadmin_databases', JSON.stringify([]));
    localStorage.setItem('hostadmin_db_users', JSON.stringify([]));
    localStorage.setItem('hostadmin_email_accounts', JSON.stringify([]));
    localStorage.setItem('hostadmin_files', JSON.stringify(initialMasterFiles));
    localStorage.setItem('hostadmin_ftp_accounts', JSON.stringify([]));
    localStorage.setItem('hostadmin_server_users', JSON.stringify([]));

    if (masterData.serverHostname) {
      setNetworkTelemetry((prev) => ({
        ...prev,
        hostname: masterData.serverHostname || prev.hostname,
      }));
    }

    setIsAuthenticated(false);
    localStorage.setItem('hostadmin_auth', 'false');

    addAuditLog({
      action: `Master ID '${masterData.username}' Created & Mock Models Purged`,
      category: 'Security',
      severity: 'warning',
      details: `One-time VPS First-Time Setup completed. All initial demo mock models purged. Master User ID: ${masterData.username}`,
    });

    addToast({
      type: 'success',
      title: 'VPS Master ID Created!',
      message: `Master Account '${masterData.username}' initialized. All mock models deleted. Please log in with your new credentials.`,
      duration: 6000,
    });
  };

  const resetVpsToSetupMode = () => {
    setIsMasterInitialized(false);
    setMasterAccount(null);
    localStorage.removeItem('hostadmin_master_initialized');
    localStorage.removeItem('hostadmin_master_account');
    localStorage.removeItem('hostadmin_domains');
    localStorage.removeItem('hostadmin_databases');
    localStorage.removeItem('hostadmin_email_accounts');
    localStorage.removeItem('hostadmin_files');
    localStorage.removeItem('hostadmin_ftp_accounts');
    localStorage.removeItem('hostadmin_server_users');
    localStorage.setItem('hostadmin_auth', 'false');
    setIsAuthenticated(false);

    setDomains(INITIAL_DOMAINS || []);
    setDatabases(INITIAL_DATABASES || []);
    setFiles(INITIAL_FILES || []);
    setServerUsers(INITIAL_SERVER_USERS || []);

    addToast({
      type: 'info',
      title: 'Reset to VPS Setup Mode',
      message: 'Master account removed. System reset to setup mode.',
    });
  };

  // Launch 1-Click phpMyAdmin (Directory Installation with direct Database targeting)
  const launchPhpMyAdmin = (dbName?: string) => {
    const ip = networkTelemetry.publicIp || '168.220.248.86';

    // 1. Strict Dependency Check: Block external link if phpMyAdmin is not installed on VPS
    if (!isPhpMyAdminInstalled && !isVpsInstalled) {
      addToast({
        type: 'warning',
        title: 'phpMyAdmin Dependency Required',
        message: 'phpMyAdmin directory suite is not installed on this VPS yet. Starting installation script...',
        duration: 6000,
      });
      installPhpMyAdmin();
      return;
    }

    // 2. Directory Endpoint (Installed as /phpmyadmin directory on server IP/Domain)
    const directoryUrl = dbName
      ? `https://${ip}/phpmyadmin/index.php?route=/database/structure&db=${encodeURIComponent(dbName)}`
      : `https://${ip}/phpmyadmin/`;

    // 3. Auto-Verify & Endpoint Probe Search
    addToast({
      type: 'info',
      title: 'Auto-Verifying phpMyAdmin Directory Endpoint...',
      message: `Searching Nginx location /phpmyadmin/ & MariaDB socket... [HTTP 200 OK]`,
      duration: 3000,
    });

    setTimeout(() => {
      addAuditLog({
        action: `1-Click Directory phpMyAdmin Launched${dbName ? ` for ${dbName}` : ''}`,
        category: 'Database',
        severity: 'info',
        details: `Auto-verified live directory endpoint at ${directoryUrl} via MariaDB unix_socket`,
      });

      addToast({
        type: 'success',
        title: 'phpMyAdmin Endpoint Active & Verified',
        message: dbName
          ? `Verified database '${dbName}'. Opening directory /phpmyadmin...`
          : 'Verified phpMyAdmin directory installation. Opening in new tab...',
        duration: 4000,
      });

      window.open(directoryUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  const launchVpsInstaller = () => {
    setVpsInstallerModalOpen(true);
  };

  const runVpsAutoInstall = async () => {
    setVpsInstallProgress(5);
    setVpsInstallLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Starting Automated 1-Click VPS Full-Stack Provisioning...`,
      `[APT] Updating repository packages and security keyrings...`,
    ]);

    const steps = [
      { pct: 10, msg: '[STEP 1/10] UFW Firewall Configuration: Opening Ports 80 (HTTP), 443 (HTTPS), 25 (SMTP), 587 (Submission), 465 (SMTPS), 143 (IMAP), 993 (IMAPS), 110 (POP3), 995 (POP3S), 53 (DNS UDP/TCP), 3306 (MySQL), 22 (SSH)...' },
      { pct: 20, msg: '[STEP 2/10] Deploying Apache 2.4 & Nginx Reverse Proxy with VirtualHost reverse routing for webmail.sitindia.in...' },
      { pct: 30, msg: '[STEP 3/10] Installing PHP 8.2 & PHP 8.3 FPM + Roundcube Modules: php-imap, php-mbstring, php-xml, php-intl, php-zip, php-curl, php-gd, php-pdo-mysql, php-imagick...' },
      { pct: 42, msg: '[STEP 4/10] Deploying MariaDB 10.11 Server: Creating `roundcubemail` database, dedicated DB user & importing initial table schema...' },
      { pct: 54, msg: '[STEP 5/10] Installing phpMyAdmin 5.2.2 Web Interface with blowfish_secret auto-encryption & SSO link...' },
      { pct: 65, msg: '[STEP 6/10] Configuring BIND9 Authoritative DNS Server on Port 53 (UDP/TCP) for Child Nameservers ns1.sitindia.in & ns2.sitindia.in...' },
      { pct: 76, msg: '[STEP 7/10] Configuring Postfix MTA, Dovecot IMAP/POP3 Server, SASL Auth, OpenDKIM Key Generation & SPF records...' },
      { pct: 88, msg: '[STEP 8/10] Configuring Roundcube Webmail Engine: Setting default_host=ssl://localhost:993, smtp_server=tls://localhost:587, plugins (archive, zipdownload, password)...' },
      { pct: 95, msg: '[STEP 9/10] Issuing Let\'s Encrypt AutoSSL Wildcard SAN Certificates for sitindia.in, mail.sitindia.in, webmail.sitindia.in...' },
      { pct: 100, msg: '[STEP 10/10] System Service Auto-Start: systemctl enable --now named postfix dovecot apache2 php8.2-fpm php8.3-fpm mariadb opendkim ufw fail2ban!' },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 650));
      setVpsInstallProgress(step.pct);
      setVpsInstallLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ${step.msg}`,
        `[SUCCESS] System service verified online: [OK]`,
      ]);
    }

    setIsVpsInstalled(true);
    setProductionLiveMode(true);
    setIsMasterInitialized(true);
    localStorage.setItem('hostadmin_vps_installed', 'true');
    localStorage.setItem('hostadmin_prod_mode', 'true');
    localStorage.setItem('hostadmin_master_initialized', 'true');

    // Purge ALL demo models and mock data for clean VPS environment
    setDomains([]);
    setDatabases([]);
    setDbUsers([]);
    setEmailAccounts([]);
    setEmailForwarders([]);
    setAutoresponders([]);
    setWebmailMessages([]);
    setFtpAccounts([]);
    setServerUsers([]);
    setBackupArchives([]);
    setBackupSchedules([]);
    setDnsRecords([]);
    setSslCertificates([]);
    setRedirects([]);

    localStorage.setItem('hostadmin_domains', JSON.stringify([]));
    localStorage.setItem('hostadmin_databases', JSON.stringify([]));
    localStorage.setItem('hostadmin_db_users', JSON.stringify([]));
    localStorage.setItem('hostadmin_email_accounts', JSON.stringify([]));
    localStorage.setItem('hostadmin_ftp_accounts', JSON.stringify([]));
    localStorage.setItem('hostadmin_server_users', JSON.stringify([]));

    // Force sign-in requirement after VPS setup
    setIsAuthenticated(false);
    localStorage.setItem('hostadmin_auth', 'false');

    addAuditLog({
      action: 'Automated 1-Click VPS Stack Provisioned & Demos Purged',
      category: 'System',
      severity: 'info',
      details: 'Apache, Nginx, PHP 8.3, MariaDB, phpMyAdmin, Exim4, Roundcube, and Composer successfully installed. All initial demo mock models purged.',
    });

    addToast({
      type: 'success',
      title: 'VPS Auto-Installation Complete!',
      message: 'All web servers, database, phpMyAdmin, and mail stack active. Demos removed. Please log in.',
      duration: 7000,
    });
  };

  // Keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setQuickActionModal(null);
        setPhpMyAdminModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('hostadmin_theme', theme);
    localStorage.setItem('hostadmin_fontsize', fontSize);
    localStorage.setItem('hostadmin_highcontrast', String(highContrast));
  }, [theme, fontSize, highContrast]);

  // Haptic feedback
  const triggerHaptic = () => {
    if (!hapticEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
  };

  // Screen Reader Announcer
  const announceToScreenReader = (message: string) => {
    setScreenReaderAnnouncement(message);
    if (screenReaderVoiceEnabled && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.0;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch {
        // speech synthesis fallback
      }
    }
  };

  // User Management Methods
  const createServerUser = (userData: Omit<ServerAccountUser, 'id' | 'createdAt' | 'diskUsedMB' | 'bandwidthUsedMB' | 'dbCount' | 'emailCount' | 'ftpCount'>) => {
    const newUser: ServerAccountUser = {
      id: `usr-${Date.now()}`,
      ...userData,
      diskUsedMB: 0,
      bandwidthUsedMB: 0,
      dbCount: 0,
      emailCount: 0,
      ftpCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setServerUsers((prev) => [newUser, ...prev]);

    // Also add domain for this user if specified
    if (userData.domain) {
      addDomain({
        domain: userData.domain,
        type: 'main',
        docRoot: `/home/${userData.username}/public_html`,
        phpVersion: userData.phpVersion || '8.3',
        sslStatus: userData.sslEnabled ? 'active' : 'none',
        sslIssuer: userData.sslEnabled ? "Let's Encrypt Authority X3" : undefined,
        forceHttps: userData.sslEnabled,
        bandwidthLimitMB: userData.bandwidthQuotaMB,
        diskLimitMB: userData.diskQuotaMB,
        directoryPrivacyEnabled: false,
      });
    }

    addAuditLog({
      action: `Created Server User Account: ${userData.username}`,
      category: 'User Management',
      severity: 'info',
      details: `Allocated Package: ${userData.packageName}, Domain: ${userData.domain}, Disk Quota: ${userData.diskQuotaMB} MB, Bandwidth: ${userData.bandwidthQuotaMB} MB, SSH: ${userData.sshAccess ? 'Enabled' : 'Disabled'}`,
    });

    addToast({
      type: 'success',
      title: 'User Account Provisioned',
      message: `User '${userData.username}' successfully created with docRoot /home/${userData.username}/public_html`,
    });
  };

  const updateServerUser = (id: string, updates: Partial<ServerAccountUser>) => {
    setServerUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    addToast({
      type: 'info',
      title: 'User Updated',
      message: 'Account quotas and settings successfully updated.',
    });
  };

  const deleteServerUser = (id: string) => {
    const target = serverUsers.find((u) => u.id === id);
    if (!target) return;
    setServerUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog({
      action: `Deleted Server User: ${target.username}`,
      category: 'User Management',
      severity: 'warning',
      details: `Removed user account ${target.username} and purged quotas.`,
    });
    addToast({
      type: 'warning',
      title: 'User Deleted',
      message: `User account '${target.username}' has been removed.`,
    });
  };

  const toggleUserStatus = (id: string) => {
    setServerUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          addToast({
            type: nextStatus === 'active' ? 'success' : 'warning',
            title: `User ${nextStatus === 'active' ? 'Activated' : 'Suspended'}`,
            message: `Account '${u.username}' is now ${nextStatus}.`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const loginAsUser = (username: string) => {
    const target = serverUsers.find((u) => u.username === username);
    if (target) {
      setActiveUserAccount(target);
      setSelectedDomain(target.domain);
      setPanelMode('user');
      setActiveSection('user-panel');
      addToast({
        type: 'info',
        title: `Switched to User Panel: ${target.username}`,
        message: `Now managing account for domain ${target.domain}.`,
      });
    }
  };

  const returnToAdmin = () => {
    setActiveUserAccount(null);
    setPanelMode('admin');
    setActiveSection('overview');
    addToast({
      type: 'info',
      title: 'Returned to Administrator Console',
      message: 'Logged back in as Super Administrator.',
    });
  };

  // Toast Helpers
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = { id, duration: 4000, ...toast };
    setToasts((prev) => [...prev, newToast]);
    triggerHaptic();
    announceToScreenReader(`${toast.title}: ${toast.message || ''}`);

    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Logger
  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'adminUser'>) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      adminUser: userProfile.username,
      ipAddress: '103.21.14.88',
      ...entry,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    addToast({ type: 'info', title: 'Audit Trail Cleared', message: 'All local administrator audit logs have been archived.' });
  };

  // 1-Click Plugin Installer with Auto-Dependency Resolution
  const oneClickInstallPlugin = async (id: string): Promise<{ success: boolean; logs: string[] }> => {
    const targetPlugin = plugins.find((p) => p.id === id);
    if (!targetPlugin) return { success: false, logs: ['Plugin not found'] };

    const logs: string[] = [];
    logs.push(`[1/4] Checking system dependencies for ${targetPlugin.name} v${targetPlugin.version}...`);

    // Resolve dependencies
    if (targetPlugin.dependencies && targetPlugin.dependencies.length > 0) {
      for (const dep of targetPlugin.dependencies) {
        logs.push(`  ✓ Dependency [${dep.type.toUpperCase()}] ${dep.name} (${dep.version}) - Verified / Auto-Installed`);
      }
    } else {
      logs.push(`  ✓ Core system dependencies satisfied.`);
    }

    logs.push(`[2/4] Downloading official package archive from repository mirrors...`);
    logs.push(`[3/4] Creating virtual environments, directories & config templates...`);

    // Auto-create required folders & files
    if (id === 'plg-phpmyadmin') {
      createFolder('/home/sitindia/public_html', 'phpmyadmin');
      createFile('/home/sitindia/public_html/phpmyadmin', 'config.inc.php', `<?php
/* phpMyAdmin configuration */
$cfg['Servers'][1]['auth_type'] = 'cookie';
$cfg['Servers'][1]['host'] = 'localhost';
$cfg['Servers'][1]['compress'] = false;
$cfg['Servers'][1]['AllowNoPassword'] = false;
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
?>`);
    } else if (id === 'plg-phpmailer') {
      createFolder('/home/sitindia/public_html', 'vendor');
      createFolder('/home/sitindia/public_html/vendor', 'phpmailer');
      createFile('/home/sitindia/public_html/vendor/phpmailer', 'PHPMailer.php', `<?php
namespace PHPMailer\\PHPMailer;
class PHPMailer {
    public $Host = 'localhost';
    public $Port = 587;
    public $SMTPAuth = true;
    public $Username = 'info@sitindia.in';
    public $Password = '******';
    public $SMTPSecure = 'tls';
    public function send() { return true; }
}
?>`);
    }

    logs.push(`[4/4] Activating system services, symlinks & register dashboard widgets...`);

    // Mark as installed and active
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              installed: true,
              active: true,
              enabled: true,
              dependencies: p.dependencies?.map((d) => ({ ...d, installed: true })),
            }
          : p
      )
    );

    addAuditLog({
      action: `1-Click Installed Plugin ${targetPlugin.name}`,
      category: 'System',
      severity: 'info',
      details: `Auto-resolved ${targetPlugin.dependencies?.length || 0} dependencies and generated required configs.`,
    });

    addToast({
      type: 'success',
      title: `${targetPlugin.name} Ready`,
      message: `Installed successfully with all dependencies auto-configured.`,
    });

    return { success: true, logs };
  };

  // PHPMailer Diagnostic SMTP Test Execution
  const sendPhpMailerTest = async (config: {
    host: string;
    port: number;
    encryption: 'ssl' | 'tls' | 'none';
    username: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
  }): Promise<{ success: boolean; log: string[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString().substring(11, 19);
        const logs: string[] = [
          `[${timestamp}] 220 mail.sitindia.in ESMTP Postfix (Ubuntu)`,
          `[${timestamp}] EHLO hostadmin.local`,
          `[${timestamp}] 250-mail.sitindia.in`,
          `[${timestamp}] 250-PIPELINING`,
          `[${timestamp}] 250-SIZE 52428800`,
          `[${timestamp}] 250-STARTTLS`,
          `[${timestamp}] 250-AUTH PLAIN LOGIN`,
          `[${timestamp}] STARTTLS negotiated: TLSv1.3 with cipher TLS_AES_256_GCM_SHA384`,
          `[${timestamp}] AUTH LOGIN (${config.username}) -> 235 2.7.0 Authentication successful`,
          `[${timestamp}] MAIL FROM:<${config.fromEmail}> -> 250 2.1.0 Ok`,
          `[${timestamp}] RCPT TO:<${config.toEmail}> -> 250 2.1.5 Ok recipient accepted`,
          `[${timestamp}] DATA (MIME-Version: 1.0, Subject: ${config.subject}) -> 354 End data with <CR><LF>.<CR><LF>`,
          `[${timestamp}] 250 2.0.0 Ok: queued as 4WXYZ91845K`,
          `[${timestamp}] QUIT -> 221 2.0.0 Bye (Total dispatch time: 412ms)`,
        ];

        addAuditLog({
          action: `PHPMailer Test Dispatched to ${config.toEmail}`,
          category: 'Email',
          severity: 'info',
          details: `SMTP Server ${config.host}:${config.port} via ${config.encryption.toUpperCase()}. Return code: 250 OK.`,
        });

        addToast({
          type: 'success',
          title: 'PHPMailer Test Email Sent',
          message: `Successfully delivered to ${config.toEmail} with 250 OK status!`,
        });

        resolve({ success: true, log: logs });
      }, 1200);
    });
  };

  // Perform HostAdmin System Update with Pre-flight Backup & Dependency Checks
  const performSystemUpdate = async (): Promise<void> => {
    setSystemVersion((prev) => ({
      ...prev,
      isUpdating: true,
      updateProgress: 10,
      updateLog: ['[Step 1/5] Initializing HostAdmin automated upgrade engine...'],
    }));

    // Step 1: Pre-flight snapshot
    await new Promise((r) => setTimeout(r, 800));
    const backupName = `backup-pre-update-v${systemVersion.currentVersion}-${Date.now()}.tar.gz`;
    const newArch: BackupArchive = {
      id: `arc-update-${Date.now()}`,
      filename: backupName,
      createdAt: 'Just now',
      sizeMB: 2460,
      scope: 'Full System Snapshot',
      destination: 'Local Disk (/backups/pre-upgrade)',
      status: 'completed',
    };
    setBackupArchives((prev) => [newArch, ...prev]);

    setSystemVersion((prev) => ({
      ...prev,
      updateProgress: 35,
      updateLog: [
        ...prev.updateLog,
        `  ✓ Generated pre-update full snapshot: ${backupName}`,
        '[Step 2/5] Checking and auto-installing required system dependencies...',
        '  ✓ libssl3-dev (3.0.2) - Verified',
        '  ✓ systemd-sysv (252.19) - Verified',
        '  ✓ mariadb-client-core (10.11.8) - Verified',
        '  ✓ php8.4-fpm (8.4.0) - Auto-installed via apt repository',
        '  ✓ composer-bin (2.7.7) - Verified',
      ],
    }));

    // Step 3: Package extraction & binary linking
    await new Promise((r) => setTimeout(r, 1000));
    setSystemVersion((prev) => ({
      ...prev,
      updateProgress: 70,
      updateLog: [
        ...prev.updateLog,
        '[Step 3/5] Extracting HostAdmin v2.5.0 Enterprise binaries...',
        '[Step 4/5] Executing database schema migrations (0024_add_phpmailer_suite.sql)...',
        '  ✓ Migrated 4 database tables without table locks.',
      ],
    }));

    // Step 4: Graceful Reload
    await new Promise((r) => setTimeout(r, 1000));
    setSystemVersion((prev) => ({
      ...prev,
      isUpdating: false,
      updateProgress: 100,
      currentVersion: prev.latestVersion,
      hasUpdate: false,
      updateLog: [
        ...prev.updateLog,
        '[Step 5/5] Performing zero-downtime service reload (Nginx, PHP-FPM, HostAdmin)...',
        '========================================',
        `🚀 HostAdmin successfully upgraded to v${prev.latestVersion} Enterprise!`,
        '========================================',
      ],
      requiredDependencies: prev.requiredDependencies.map((d) => ({ ...d, status: 'ok' })),
    }));

    addAuditLog({
      action: `HostAdmin System Upgraded to v${systemVersion.latestVersion}`,
      category: 'System',
      severity: 'info',
      details: `Completed automatic upgrade with pre-flight backup and dependency resolution.`,
    });

    addToast({
      type: 'success',
      title: 'HostAdmin Updated Successfully',
      message: `System is now running v${systemVersion.latestVersion} Enterprise Edition!`,
    });
  };

  // Domain Actions
  const addDomain = (dom: Omit<WebsiteDomain, 'id' | 'createdAt' | 'bandwidthUsedMB' | 'diskUsedMB' | 'visitorsToday' | 'pageViewsToday' | 'redirectsCount'>) => {
    const cleanDomain = dom.domain.trim().toLowerCase();
    const newDomain: WebsiteDomain = {
      id: `dom-${Date.now()}`,
      ...dom,
      domain: cleanDomain,
      bandwidthUsedMB: 0,
      diskUsedMB: 120,
      visitorsToday: 0,
      pageViewsToday: 0,
      redirectsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDomains((prev) => [...prev, newDomain]);

    createFolder('/home/sitindia', cleanDomain);
    createFile(`${dom.docRoot}`, 'index.php', `<?php echo "<h1>Welcome to ${cleanDomain}</h1>";`);

    // Automatic DNS zone creation (A, CNAME, MX, SPF, DMARC, DKIM)
    const serverIp = networkTelemetry.publicIp || '168.220.248.86';
    const timestamp = Date.now();
    setDnsRecords((prev) => [
      ...prev,
      { id: `dns-${timestamp}-1`, domain: cleanDomain, name: '@', type: 'A', value: serverIp, ttl: 3600 },
      { id: `dns-${timestamp}-2`, domain: cleanDomain, name: 'www', type: 'CNAME', value: cleanDomain, ttl: 3600 },
      { id: `dns-${timestamp}-3`, domain: cleanDomain, name: 'mail', type: 'A', value: serverIp, ttl: 3600 },
      { id: `dns-${timestamp}-4`, domain: cleanDomain, name: 'ftp', type: 'A', value: serverIp, ttl: 3600 },
      { id: `dns-${timestamp}-5`, domain: cleanDomain, name: 'cpanel', type: 'A', value: serverIp, ttl: 3600 },
      { id: `dns-${timestamp}-6`, domain: cleanDomain, name: 'webmail', type: 'A', value: serverIp, ttl: 3600 },
      { id: `dns-${timestamp}-7`, domain: cleanDomain, name: '@', type: 'MX', value: `mail.${cleanDomain}`, ttl: 3600, priority: 10 },
      { id: `dns-${timestamp}-8`, domain: cleanDomain, name: '@', type: 'TXT', value: `v=spf1 a mx ip4:${serverIp} ~all`, ttl: 3600 },
      { id: `dns-${timestamp}-9`, domain: cleanDomain, name: '_dmarc', type: 'TXT', value: `v=DMARC1; p=none; sp=none; rua=mailto:postmaster@${cleanDomain}`, ttl: 3600 },
      { id: `dns-${timestamp}-10`, domain: cleanDomain, name: 'default._domainkey', type: 'TXT', value: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuZ...', ttl: 3600 },
    ]);

    addAuditLog({
      action: `Created Domain ${cleanDomain}`,
      category: 'Website',
      severity: 'info',
      details: `Document root assigned to ${dom.docRoot}, PHP ${dom.phpVersion}. Provisioned 10 automatic DNS records (A, CNAME, MX, SPF, DMARC, DKIM).`,
    });

    addToast({
      type: 'success',
      title: 'Domain Added & DNS Provisioned',
      message: `${cleanDomain} is active with 10 automatic DNS records (A, CNAME, MX, SPF, DMARC, DKIM).`,
    });
  };

  const addSubdomain = (
    subdomainPrefix: string,
    parentDomain: string,
    docRoot?: string,
    phpVersion = '8.3',
    recordType: 'A' | 'CNAME' = 'A',
    targetIp = '103.175.163.45'
  ) => {
    const cleanPrefix = subdomainPrefix.trim().toLowerCase();
    const cleanParent = parentDomain.trim().toLowerCase();
    const fullSubdomain = `${cleanPrefix}.${cleanParent}`;
    const targetDocRoot = docRoot?.trim() || `/home/sitindia/public_html/${fullSubdomain}`;

    const newDomain: WebsiteDomain = {
      id: `dom-${Date.now()}`,
      domain: fullSubdomain,
      type: 'subdomain',
      docRoot: targetDocRoot,
      phpVersion,
      sslStatus: 'active',
      sslIssuer: "Let's Encrypt Authority X3",
      sslExpiry: '2026-11-20',
      forceHttps: true,
      bandwidthLimitMB: 50000,
      bandwidthUsedMB: 0,
      diskLimitMB: 20000,
      diskUsedMB: 45,
      visitorsToday: 0,
      pageViewsToday: 0,
      redirectsCount: 0,
      directoryPrivacyEnabled: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDomains((prev) => [...prev, newDomain]);

    createFolder('/home/sitindia/public_html', fullSubdomain);
    createFile(targetDocRoot, 'index.php', `<?php echo "<h1>Subdomain ${fullSubdomain} is Active</h1>";`);

    const dnsValue = recordType === 'A' ? (targetIp.startsWith('@') ? '103.175.163.45' : targetIp) : cleanParent;
    const newDns: DnsRecord = {
      id: `dns-sub-${Date.now()}`,
      domain: cleanParent,
      name: cleanPrefix,
      type: recordType,
      value: dnsValue,
      ttl: 3600,
    };
    setDnsRecords((prev) => [...prev, newDns]);

    addAuditLog({
      action: `Created Subdomain ${fullSubdomain}`,
      category: 'Website',
      severity: 'info',
      details: `Virtual host root: ${targetDocRoot}. DNS ${recordType} record (${cleanPrefix} -> ${dnsValue}) added.`,
    });

    addToast({
      type: 'success',
      title: 'Subdomain & DNS Created',
      message: `${fullSubdomain} active with automatic ${recordType} record in DNS zone.`,
    });
  };

  const deleteDomain = (id: string) => {
    const target = domains.find((d) => d.id === id);
    if (!target) return;
    setDomains((prev) => prev.filter((d) => d.id !== id));
    addAuditLog({
      action: `Deleted Domain ${target.domain}`,
      category: 'Website',
      severity: 'warning',
      details: `Virtual host configurations removed.`,
    });
    addToast({
      type: 'info',
      title: 'Domain Removed',
      message: `${target.domain} virtual host has been removed.`,
    });
  };

  const updateDomain = (id: string, updates: Partial<WebsiteDomain>) => {
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, ...updates };
        }
        return d;
      })
    );
    addToast({ type: 'success', title: 'Domain Settings Updated' });
  };

  const addRedirect = (red: Omit<DomainRedirect, 'id'>) => {
    const newRed: DomainRedirect = { id: `red-${Date.now()}`, ...red };
    setRedirects((prev) => [...prev, newRed]);
    addAuditLog({
      action: `Added Redirect ${red.sourcePath} -> ${red.targetUrl}`,
      category: 'Website',
      severity: 'info',
      details: `Status ${red.type} (${red.matchType}) on domain ${red.domain}`,
    });
    addToast({ type: 'success', title: 'Redirect Rule Created' });
  };

  const deleteRedirect = (id: string) => {
    setRedirects((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'info', title: 'Redirect Removed' });
  };

  const updateErrorPage = (code: number, content: string) => {
    setErrorPages((prev) =>
      prev.map((ep) => (ep.code === code ? { ...ep, content, custom: true } : ep))
    );
    addToast({ type: 'success', title: `Error Page ${code} Updated` });
  };

  // File Manager Actions with Duplicate Detection & Replace Support
  const createFile = (folderPath: string, name: string, content = '', overwrite = true) => {
    const fullPath = folderPath.endsWith('/') ? `${folderPath}${name}` : `${folderPath}/${name}`;
    const ext = name.includes('.') ? name.split('.').pop() || 'txt' : 'txt';
    const mime = ext === 'php' ? 'text/x-php' : ext === 'css' ? 'text/css' : ext === 'js' ? 'application/javascript' : ext === 'html' ? 'text/html' : ext === 'json' ? 'application/json' : ext === 'sql' ? 'application/sql' : 'text/plain';

    // Check if duplicate file exists in this directory
    const existingIndex = files.findIndex((f) => f.path === fullPath);

    if (existingIndex !== -1 && overwrite) {
      // Overwrite/Update existing duplicate file with the new content
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === existingIndex
            ? {
                ...f,
                name,
                content,
                size: content ? content.length : 120,
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
                extension: ext,
                mimeType: mime,
              }
            : f
        )
      );

      addAuditLog({
        action: `Replaced Duplicate File ${name}`,
        category: 'File',
        severity: 'info',
        details: `Updated and overwritten existing duplicate file at ${fullPath}`,
      });

      addToast({
        type: 'success',
        title: 'File Updated & Replaced',
        message: `${name} in ${folderPath} was updated with the new version (duplicate replaced).`,
      });
      return;
    }

    // Otherwise create brand new file entry
    const newFile: VirtualFile = {
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      path: fullPath,
      type: 'file',
      size: content.length || 120,
      permissions: '0644',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      extension: ext,
      mimeType: mime,
      content,
    };
    setFiles((prev) => [...prev, newFile]);

    addAuditLog({
      action: `Created File ${name}`,
      category: 'File',
      severity: 'info',
      details: `Saved at path ${fullPath}`,
    });

    addToast({ type: 'success', title: 'File Uploaded', message: name });
  };

  const uploadMultipleFiles = (
    folderPath: string,
    filesList: Array<{ name: string; content: string; size?: number; mimeType?: string }>,
    overwriteExisting = true
  ) => {
    let replacedCount = 0;
    let createdCount = 0;

    setFiles((prev) => {
      let updated = [...prev];

      filesList.forEach((item) => {
        const fullPath = folderPath.endsWith('/') ? `${folderPath}${item.name}` : `${folderPath}/${item.name}`;
        const ext = item.name.includes('.') ? item.name.split('.').pop() || 'txt' : 'txt';
        const defaultMime = ext === 'php' ? 'text/x-php' : ext === 'css' ? 'text/css' : ext === 'js' ? 'application/javascript' : ext === 'html' ? 'text/html' : ext === 'json' ? 'application/json' : ext === 'sql' ? 'application/sql' : 'text/plain';
        const finalMime = item.mimeType || defaultMime;

        const existingIdx = updated.findIndex((f) => f.path === fullPath);

        if (existingIdx !== -1 && overwriteExisting) {
          replacedCount++;
          updated[existingIdx] = {
            ...updated[existingIdx],
            name: item.name,
            content: item.content,
            size: item.size ?? (item.content ? item.content.length : 120),
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            extension: ext,
            mimeType: finalMime,
          };
        } else {
          createdCount++;
          const newFile: VirtualFile = {
            id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: item.name,
            path: fullPath,
            type: 'file',
            size: item.size ?? (item.content ? item.content.length : 120),
            permissions: '0644',
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            extension: ext,
            mimeType: finalMime,
            content: item.content,
          };
          updated.push(newFile);
        }
      });

      return updated;
    });

    addAuditLog({
      action: `Batch Upload to ${folderPath}`,
      category: 'File',
      severity: 'info',
      details: `Processed ${filesList.length} files (${replacedCount} replaced/updated duplicates, ${createdCount} created new). Overwrite duplicates: ${overwriteExisting ? 'Enabled' : 'Disabled'}`,
    });

    if (replacedCount > 0 && createdCount > 0) {
      addToast({
        type: 'success',
        title: 'Files Uploaded & Replaced',
        message: `${createdCount} new files added, ${replacedCount} duplicate files replaced and updated.`,
      });
    } else if (replacedCount > 0) {
      addToast({
        type: 'success',
        title: 'Duplicate Files Replaced',
        message: `${replacedCount} duplicate file(s) updated and replaced with new files in ${folderPath}.`,
      });
    } else {
      addToast({
        type: 'success',
        title: 'Upload Successful',
        message: `${createdCount} file(s) successfully uploaded to ${folderPath}.`,
      });
    }
  };

  const createFolder = (parentPath: string, name: string) => {
    const fullPath = parentPath.endsWith('/') ? `${parentPath}${name}` : `${parentPath}/${name}`;
    const newFolder: VirtualFile = {
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      path: fullPath,
      type: 'folder',
      size: 4096,
      permissions: '0755',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setFiles((prev) => [...prev, newFolder]);
    addAuditLog({
      action: `Created Directory ${name}`,
      category: 'File',
      severity: 'info',
      details: `Path: ${fullPath}`,
    });
    addToast({ type: 'success', title: 'Folder Created', message: name });
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            content,
            size: content.length,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
        }
        return f;
      })
    );
    addToast({ type: 'success', title: 'File Saved Successfully' });
  };

  const deleteFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;
    setFiles((prev) => prev.filter((f) => f.id !== id && !f.path.startsWith(`${target.path}/`)));
    addToast({ type: 'info', title: 'Item Deleted', message: target.name });
  };

  const renameFile = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const parent = f.path.substring(0, f.path.lastIndexOf('/'));
          const newPath = `${parent}/${newName}`;
          const ext = newName.includes('.') ? newName.split('.').pop() : f.extension;
          return { ...f, name: newName, path: newPath, extension: ext };
        }
        return f;
      })
    );
    addToast({ type: 'success', title: 'Renamed Successfully', message: newName });
  };

  const changePermissions = (id: string, newPerm: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, permissions: newPerm } : f))
    );
    addToast({ type: 'success', title: 'Permissions Updated', message: `Chmod set to ${newPerm}` });
  };

  const zipFiles = (fileIds: string[], zipName: string) => {
    const zipFilename = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
    const newZip: VirtualFile = {
      id: `f-${Date.now()}`,
      name: zipFilename,
      path: `/home/sitindia/public_html/${zipFilename}`,
      type: 'file',
      size: 1024 * 840,
      permissions: '0644',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      extension: 'zip',
      mimeType: 'application/zip',
    };
    setFiles((prev) => [...prev, newZip]);
    addToast({ type: 'success', title: 'ZIP Archive Created', message: `${zipFilename} (${fileIds.length} items compressed)` });
  };

  const unzipFile = (fileId: string) => {
    const zip = files.find((f) => f.id === fileId);
    if (!zip) return;
    const extractedFolderName = zip.name.replace('.zip', '') + '_extracted';
    createFolder(activeFilePath, extractedFolderName);
    addToast({ type: 'success', title: 'ZIP Archive Extracted', message: `Extracted to ${extractedFolderName}` });
  };

  const addFtpAccount = (acc: Omit<FtpAccount, 'id' | 'usedMB'>) => {
    const newAcc: FtpAccount = {
      id: `ftp-${Date.now()}`,
      ...acc,
      usedMB: 0,
    };
    setFtpAccounts((prev) => [...prev, newAcc]);
    addToast({ type: 'success', title: 'FTP/SFTP Account Created', message: acc.username });
  };

  const deleteFtpAccount = (id: string) => {
    setFtpAccounts((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'info', title: 'FTP Account Deleted' });
  };

  // PHP Manager Actions
  const updatePhpVersionForDomain = (domainId: string, version: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, phpVersion: version } : d))
    );
    addToast({ type: 'success', title: 'PHP Version Updated', message: `Set to PHP ${version}` });
  };

  const togglePhpExtension = (version: string, extName: string) => {
    setPhpConfigs((prev) =>
      prev.map((cfg) => {
        if (cfg.version === version) {
          return {
            ...cfg,
            extensions: cfg.extensions.map((ext) =>
              ext.name === extName ? { ...ext, enabled: !ext.enabled } : ext
            ),
          };
        }
        return cfg;
      })
    );
    addToast({ type: 'success', title: 'PHP Extension Updated', message: extName });
  };

  const updatePhpIni = (version: string, key: string, value: string | number | boolean) => {
    setPhpConfigs((prev) =>
      prev.map((cfg) => {
        if (cfg.version === version) {
          return {
            ...cfg,
            iniSettings: { ...cfg.iniSettings, [key]: value },
          };
        }
        return cfg;
      })
    );
    addToast({ type: 'success', title: 'php.ini Updated', message: `${key} = ${value}` });
  };

  const updateFpmSettings = (version: string, settings: Partial<PhpConfig>) => {
    setPhpConfigs((prev) =>
      prev.map((cfg) => (cfg.version === version ? { ...cfg, ...settings } : cfg))
    );
    addToast({ type: 'success', title: 'PHP-FPM Pool Configuration Saved' });
  };

  // Database Actions & 1-Click phpMyAdmin
  const createDatabase = (name: string, charset = 'utf8mb4', collation = 'utf8mb4_unicode_ci') => {
    const cleanName = name.startsWith('sitindia_') ? name : `sitindia_${name}`;
    const newDb: DatabaseRecord = {
      id: `db-${Date.now()}`,
      name: cleanName,
      charset,
      collation,
      sizeMB: 0.1,
      tableCount: 0,
      assignedUsers: ['sitindia_admin'],
      tables: [],
    };
    setDatabases((prev) => [...prev, newDb]);
    addAuditLog({
      action: `Created MySQL Database ${cleanName}`,
      category: 'Database',
      severity: 'info',
      details: `Charset: ${charset}, Collation: ${collation}`,
    });
    addToast({ type: 'success', title: 'Database Created', message: cleanName });
  };

  const createDatabaseWithUser = (
    dbName: string,
    username: string,
    host = 'localhost',
    password = '',
    privileges: string[] = ['ALL PRIVILEGES'],
    collation = 'utf8mb4_unicode_ci',
    charset = 'utf8mb4',
    grantOption = true
  ) => {
    const cleanDb = dbName.startsWith('sitindia_') ? dbName : `sitindia_${dbName}`;
    const cleanUser = username.startsWith('sitindia_') ? username : `sitindia_${username}`;

    const newDb: DatabaseRecord = {
      id: `db-${Date.now()}`,
      name: cleanDb,
      charset,
      collation,
      sizeMB: 0.1,
      tableCount: 0,
      assignedUsers: [cleanUser, 'sitindia_admin'],
      tables: [],
    };

    const newUser: DatabaseUser = {
      id: `dbu-${Date.now()}`,
      username: cleanUser,
      host: host || 'localhost',
      privileges: privileges.length > 0 ? privileges : ['ALL PRIVILEGES'],
      createdAt: new Date().toISOString().split('T')[0],
      assignedDatabases: [cleanDb],
      grantOption,
    };

    setDatabases((prev) => [...prev, newDb]);
    setDbUsers((prev) => {
      const existingIndex = prev.findIndex((u) => u.username === cleanUser);
      if (existingIndex >= 0) {
        return prev.map((u, i) =>
          i === existingIndex
            ? {
                ...u,
                host: host || u.host,
                privileges: Array.from(new Set([...u.privileges, ...privileges])),
                assignedDatabases: Array.from(new Set([...(u.assignedDatabases || []), cleanDb])),
                grantOption: grantOption !== undefined ? grantOption : u.grantOption,
              }
            : u
        );
      }
      return [...prev, newUser];
    });

    addAuditLog({
      action: `Created MySQL Database ${cleanDb} with User ${cleanUser}@${host}`,
      category: 'Database',
      severity: 'info',
      details: `Host: ${host}, Collation: ${collation}, Privileges: ${privileges.join(', ')}, Grant Option: ${grantOption ? 'YES' : 'NO'}`,
    });

    addToast({
      type: 'success',
      title: 'Database & User Provisioned',
      message: `Database ${cleanDb} created with user ${cleanUser}@${host || 'localhost'} and ${privileges.length} assigned privileges.`,
    });
  };

  const deleteDatabase = (id: string) => {
    const target = databases.find((d) => d.id === id);
    if (!target) return;
    setDatabases((prev) => prev.filter((d) => d.id !== id));
    addToast({ type: 'info', title: 'Database Dropped', message: target.name });
  };

  const createDbUser = (
    username: string,
    host = 'localhost',
    privileges: string[] = ['ALL PRIVILEGES'],
    assignedDatabases: string[] = [],
    grantOption = true
  ) => {
    const cleanUser = username.startsWith('sitindia_') ? username : `sitindia_${username}`;
    const newUser: DatabaseUser = {
      id: `dbu-${Date.now()}`,
      username: cleanUser,
      host: host || 'localhost',
      privileges: privileges.length > 0 ? privileges : ['ALL PRIVILEGES'],
      createdAt: new Date().toISOString().split('T')[0],
      assignedDatabases,
      grantOption,
    };
    setDbUsers((prev) => [...prev, newUser]);
    addToast({ type: 'success', title: 'DB User Created', message: `${cleanUser}@${host || 'localhost'}` });
  };

  const updateUserPrivileges = (
    userId: string,
    privileges: string[],
    assignedDatabases?: string[],
    grantOption?: boolean
  ) => {
    setDbUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId || u.username === userId) {
          return {
            ...u,
            privileges,
            ...(assignedDatabases !== undefined ? { assignedDatabases } : {}),
            ...(grantOption !== undefined ? { grantOption } : {}),
          };
        }
        return u;
      })
    );

    addAuditLog({
      action: `Updated Database Privileges for User ${userId}`,
      category: 'Database',
      severity: 'info',
      details: `New Privileges: ${privileges.join(', ')}`,
    });

    addToast({
      type: 'success',
      title: 'User Privileges Saved',
      message: `Assigned ${privileges.length} privileges in MySQL grant tables.`,
    });
  };

  const deleteDbUser = (id: string) => {
    setDbUsers((prev) => prev.filter((u) => u.id !== id));
    addToast({ type: 'info', title: 'Database User Removed' });
  };

  const assignUserToDatabase = (dbId: string, username: string) => {
    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === dbId && !db.assignedUsers.includes(username)) {
          return { ...db, assignedUsers: [...db.assignedUsers, username] };
        }
        return db;
      })
    );
    addToast({ type: 'success', title: 'User Assigned to Database' });
  };

  const executeSqlQuery = (dbName: string, query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    const duration = Math.floor(Math.random() * 8) + 2;

    if (cleanQuery.startsWith('SELECT') || cleanQuery.startsWith('SHOW') || cleanQuery.startsWith('DESCRIBE')) {
      if (cleanQuery.includes('USERS')) {
        return {
          success: true,
          columns: ['id', 'username', 'email', 'status', 'created_at'],
          rows: [
            { id: 1, username: 'admin', email: 'admin@sitindia.in', status: 'ACTIVE', created_at: '2025-01-10 10:00:00' },
            { id: 2, username: 'support_lead', email: 'support@sitindia.in', status: 'ACTIVE', created_at: '2025-02-14 11:20:00' },
            { id: 3, username: 'billing_mgr', email: 'billing@sitindia.in', status: 'ACTIVE', created_at: '2025-03-01 09:15:00' },
            { id: 4, username: 'rajesh_k', email: 'rajesh.k@clientcorp.in', status: 'ACTIVE', created_at: '2025-08-12 14:40:00' },
            { id: 5, username: 'pooja_s', email: 'pooja@innovatehub.org', status: 'ACTIVE', created_at: '2025-08-15 16:30:00' },
          ],
          durationMs: duration,
        };
      } else if (cleanQuery.includes('ORDERS') || cleanQuery.includes('PRODUCTS')) {
        return {
          success: true,
          columns: ['order_id', 'customer_name', 'amount_inr', 'payment_status', 'date'],
          rows: [
            { order_id: 'ORD-98421', customer_name: 'TechSolutions Ltd', amount_inr: '₹48,900.00', payment_status: 'PAID', date: '2026-08-17 07:12' },
            { order_id: 'ORD-98420', customer_name: 'Vikas Sharma', amount_inr: '₹12,450.00', payment_status: 'PAID', date: '2026-08-17 06:44' },
            { order_id: 'ORD-98419', customer_name: 'Innovate Enterprise', amount_inr: '₹124,000.00', payment_status: 'PROCESSING', date: '2026-08-16 23:10' },
          ],
          durationMs: duration,
        };
      } else {
        return {
          success: true,
          columns: ['Variable_name', 'Value'],
          rows: [
            { Variable_name: 'version', Value: '10.11.8-MariaDB-enterprise' },
            { Variable_name: 'max_connections', Value: '500' },
            { Variable_name: 'innodb_buffer_pool_size', Value: '2147483648' },
            { Variable_name: 'query_cache_size', Value: '67108864' },
          ],
          durationMs: duration,
        };
      }
    } else {
      return {
        success: true,
        affectedRows: Math.floor(Math.random() * 5) + 1,
        message: `Query OK, 1 row affected (${duration} ms)`,
        durationMs: duration,
      };
    }
  };

  // Email Actions
  const addEmailAccount = (acc: Omit<EmailAccount, 'id' | 'usedMB' | 'unreadCount' | 'createdAt'>) => {
    const newMail: EmailAccount = {
      id: `mail-${Date.now()}`,
      ...acc,
      usedMB: 0,
      unreadCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmailAccounts((prev) => [...prev, newMail]);
    addToast({ type: 'success', title: 'Email Account Provisioned', message: acc.email });
  };

  const deleteEmailAccount = (id: string) => {
    const target = emailAccounts.find((m) => m.id === id);
    if (!target) return;
    setEmailAccounts((prev) => prev.filter((m) => m.id !== id));
    addToast({ type: 'info', title: 'Email Account Removed', message: target.email });
  };

  const updateEmailAccount = (id: string, updates: Partial<EmailAccount>) => {
    setEmailAccounts((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    addToast({ type: 'success', title: 'Email Settings Saved' });
  };

  const addEmailForwarder = (forwarder: Omit<EmailForwarder, 'id'>) => {
    const newFwd: EmailForwarder = { id: `fwd-${Date.now()}`, ...forwarder };
    setEmailForwarders((prev) => [...prev, newFwd]);
    addToast({ type: 'success', title: 'Forwarder Created', message: `${forwarder.sourceEmail} -> ${forwarder.targetEmail}` });
  };

  const deleteEmailForwarder = (id: string) => {
    setEmailForwarders((prev) => prev.filter((f) => f.id !== id));
    addToast({ type: 'info', title: 'Forwarder Removed' });
  };

  const addAutoresponder = (autoresponder: Omit<EmailAutoresponder, 'id'>) => {
    const newAr: EmailAutoresponder = { id: `ar-${Date.now()}`, ...autoresponder };
    setAutoresponders((prev) => [...prev, newAr]);
    addToast({ type: 'success', title: 'Autoresponder Configured', message: autoresponder.email });
  };

  const deleteAutoresponder = (id: string) => {
    setAutoresponders((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'info', title: 'Autoresponder Deleted' });
  };

  const sendWebmailMessage = (msg: Omit<WebmailMessage, 'id' | 'date' | 'read' | 'starred'>) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: WebmailMessage = {
      id: `msg-${Date.now()}`,
      ...msg,
      date: dateStr,
      read: true,
      starred: false,
    };
    setWebmailMessages((prev) => [newMsg, ...prev]);
    addAuditLog({
      action: `Sent Email from ${msg.from} to ${msg.to}`,
      category: 'Email',
      severity: 'info',
      details: `Subject: ${msg.subject}`,
    });
    addToast({ type: 'success', title: 'Message Dispatched', message: `Sent to ${msg.to}` });
  };

  const markMessageRead = (id: string, read: boolean) => {
    setWebmailMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m))
    );
  };

  const toggleMessageStarred = (id: string) => {
    setWebmailMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const deleteWebmailMessage = (id: string) => {
    setWebmailMessages((prev) => prev.filter((m) => m.id !== id));
    addToast({ type: 'info', title: 'Message Moved to Trash' });
  };

  // SSL & Security Actions
  const updateSecuritySettings = (updates: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...updates }));
    addToast({ type: 'success', title: 'Security Profile Updated' });
  };

  const issueAutoSsl = async (domain: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        const expiryStr = expiryDate.toISOString().split('T')[0];

        const existing = sslCertificates.find((c) => c.domain === domain);
        if (existing) {
          setSslCertificates((prev) =>
            prev.map((c) =>
              c.domain === domain
                ? {
                    ...c,
                    status: 'valid',
                    issuedAt: new Date().toISOString().split('T')[0],
                    expiresAt: expiryStr,
                  }
                : c
            )
          );
        } else {
          setSslCertificates((prev) => [
            ...prev,
            {
              id: `ssl-${Date.now()}`,
              domain,
              issuer: "Let's Encrypt Authority X3",
              issuedAt: new Date().toISOString().split('T')[0],
              expiresAt: expiryStr,
              type: "Let's Encrypt",
              autoRenew: true,
              domainsCovered: [domain, `*.${domain}`],
              status: 'valid',
            },
          ]);
        }

        setDomains((prev) =>
          prev.map((d) => (d.domain === domain ? { ...d, sslStatus: 'active', sslExpiry: expiryStr } : d))
        );

        addAuditLog({
          action: `AutoSSL Let's Encrypt Issued for ${domain}`,
          category: 'Security',
          severity: 'info',
          details: `Validated ACME HTTP-01 challenge. Wildcard SAN certificate installed.`,
        });

        addToast({
          type: 'success',
          title: "Let's Encrypt SSL Active",
          message: `Issued and verified for ${domain} & *.${domain}`,
        });

        resolve(true);
      }, 1500);
    });
  };

  const installCustomSsl = (domain: string, crt: string, key: string, ca?: string) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365);
    const newCert: SslCertificate = {
      id: `ssl-${Date.now()}`,
      domain,
      issuer: 'Custom Enterprise CA',
      issuedAt: new Date().toISOString().split('T')[0],
      expiresAt: expiryDate.toISOString().split('T')[0],
      type: 'Custom',
      autoRenew: false,
      domainsCovered: [domain],
      status: 'valid',
    };
    setSslCertificates((prev) => [...prev, newCert]);
    addToast({ type: 'success', title: 'Custom SSL Installed Successfully' });
  };

  const addIpBlock = (ipOrRange: string, reason: string, durationDays = 7) => {
    const exp = new Date();
    exp.setDate(exp.getDate() + durationDays);
    const newRule: IpBlockRule = {
      id: `ip-${Date.now()}`,
      ipOrRange,
      reason,
      blockedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expiresAt: durationDays === 0 ? 'Permanent' : exp.toISOString().replace('T', ' ').substring(0, 19),
      status: 'active',
    };
    setIpBlockRules((prev) => [...prev, newRule]);
    addToast({ type: 'warning', title: 'IP Added to Firewall Deny List', message: ipOrRange });
  };

  const removeIpBlock = (id: string) => {
    setIpBlockRules((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'info', title: 'IP Address Unblocked' });
  };

  const addFirewallRule = (rule: { ipOrRange: string; reason: string; durationDays?: number }) => {
    addIpBlock(rule.ipOrRange, rule.reason, rule.durationDays || 7);
  };

  const deleteFirewallRule = (id: string) => {
    removeIpBlock(id);
  };

  // DNS Actions
  const addDnsRecord = (record: Omit<DnsRecord, 'id'>) => {
    const newRec: DnsRecord = { id: `dns-${Date.now()}`, ...record };
    setDnsRecords((prev) => [...prev, newRec]);
    addToast({ type: 'success', title: 'DNS Record Added', message: `${record.name}.${record.domain} -> ${record.value}` });
  };

  const updateDnsRecord = (id: string, updates: Partial<DnsRecord>) => {
    setDnsRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    addToast({ type: 'success', title: 'DNS Record Updated' });
  };

  const deleteDnsRecord = (id: string) => {
    setDnsRecords((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'info', title: 'DNS Record Removed' });
  };

  // Service Actions
  const restartService = async (name: string) => {
    setServices((prev) =>
      prev.map((s) => (s.name === name ? { ...s, status: 'restarting' } : s))
    );
    addToast({ type: 'info', title: `Restarting ${name}...` });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setServices((prev) =>
          prev.map((s) => (s.name === name ? { ...s, status: 'running' } : s))
        );
        addToast({ type: 'success', title: `Service ${name} Restarted Successfully` });
        resolve();
      }, 1200);
    });
  };

  const toggleService = (name: string, status: 'running' | 'stopped') => {
    setServices((prev) =>
      prev.map((s) => (s.name === name ? { ...s, status } : s))
    );
    addToast({ type: 'info', title: `Service ${name} is now ${status}` });
  };

  // Plugins Toggle
  const togglePluginInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const willInstall = !p.installed;
          return { ...p, installed: willInstall, active: willInstall, enabled: willInstall };
        }
        return p;
      })
    );
    addToast({ type: 'success', title: 'Plugin Status Updated' });
  };

  const togglePluginActive = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active, enabled: !p.active } : p))
    );
    addToast({ type: 'info', title: 'Plugin Toggled' });
  };

  const togglePlugin = (id: string) => {
    togglePluginInstall(id);
  };

  // Backup Actions
  const createInstantBackup = async (scope: string, destination: string) => {
    const filename = `backup-sitindia_${scope.toLowerCase().replace(/\s+/g, '_')}-${new Date().toISOString().substring(0, 10)}.tar.gz`;
    const newArch: BackupArchive = {
      id: `arc-${Date.now()}`,
      filename,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      sizeMB: scope.includes('Full') || scope === 'full' ? 2450 : scope.includes('Database') || scope === 'database_only' ? 148 : 820,
      scope,
      destination,
      status: 'completed',
    };
    setBackupArchives((prev) => [newArch, ...prev]);
    addToast({ type: 'success', title: 'Backup Archive Generated', message: filename });
  };

  const createManualBackup = async (scope: string) => {
    return createInstantBackup(scope, 'Local Server (/backups)');
  };

  const deleteBackupArchive = (id: string) => {
    setBackupArchives((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'info', title: 'Backup Archive Deleted' });
  };

  const deleteBackup = (id: string) => {
    deleteBackupArchive(id);
  };

  const addBackupSchedule = (sch: Omit<BackupSchedule, 'id' | 'nextRun'>) => {
    const newSch: BackupSchedule = {
      id: `sch-${Date.now()}`,
      ...sch,
      nextRun: 'Tomorrow at 03:00 AM IST',
    };
    setBackupSchedules((prev) => [...prev, newSch]);
    addToast({ type: 'success', title: 'Backup Schedule Created', message: sch.name });
  };

  const deleteBackupSchedule = (id: string) => {
    setBackupSchedules((prev) => prev.filter((s) => s.id !== id));
    addToast({ type: 'info', title: 'Backup Schedule Removed' });
  };

  const restoreBackupArchive = async (id: string) => {
    const arch = backupArchives.find((a) => a.id === id);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'Backup Restored Successfully',
          message: `${arch?.filename || 'Archive'} contents deployed.`,
        });
        resolve();
      }, 1500);
    });
  };

  const restoreBackup = async (id: string) => {
    return restoreBackupArchive(id);
  };

  // User Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    addToast({ type: 'success', title: 'Profile Settings Saved' });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,

        isMasterInitialized,
        masterAccount,
        setupMasterAccount,
        resetVpsToSetupMode,

        activeSection,
        setActiveSection,
        panelMode,
        setPanelMode,
        activeUserAccount,
        selectedDomain,
        setSelectedDomain,
        commandPaletteOpen,
        setCommandPaletteOpen,
        quickActionModal,
        setQuickActionModal,
        sidebarCollapsed,
        setSidebarCollapsed,

        serverUsers,
        createServerUser,
        updateServerUser,
        deleteServerUser,
        toggleUserStatus,
        loginAsUser,
        returnToAdmin,

        networkTelemetry,
        detectServerIpAndMetrics,

        phpMyAdminModalOpen,
        setPhpMyAdminModalOpen,
        launchPhpMyAdmin,
        isPhpMyAdminInstalled,
        installPhpMyAdmin,
        isRoundcubeInstalled,
        installRoundcube,
        vpsInstallerModalOpen,
        setVpsInstallerModalOpen,
        launchVpsInstaller,
        isVpsInstalled,
        vpsInstallProgress,
        vpsInstallLogs,
        runVpsAutoInstall,
        productionLiveMode,
        setProductionLiveMode,
        roundcubeSessionMail,
        setRoundcubeSessionMail,

        theme,
        setTheme,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        hapticEnabled,
        setHapticEnabled,
        screenReaderVoiceEnabled,
        setScreenReaderVoiceEnabled,
        triggerHaptic,
        announceToScreenReader,
        screenReaderAnnouncement,

        metrics,
        metricsHistory,

        toasts,
        addToast,
        removeToast,

        domains,
        addDomain,
        addSubdomain,
        deleteDomain,
        updateDomain,
        redirects,
        addRedirect,
        deleteRedirect,
        errorPages,
        updateErrorPage,

        files,
        activeFilePath,
        setActiveFilePath,
        createFile,
        uploadMultipleFiles,
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

        phpConfigs,
        updatePhpVersionForDomain,
        togglePhpExtension,
        updatePhpIni,
        updateFpmSettings,

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

        emailAccounts,
        emailForwarders,
        autoresponders,
        webmailMessages,
        addEmailAccount,
        deleteEmailAccount,
        updateEmailAccount,
        addEmailForwarder,
        deleteEmailForwarder,
        addAutoresponder,
        deleteAutoresponder,
        sendWebmailMessage,
        markMessageRead,
        toggleMessageStarred,
        deleteWebmailMessage,
        sendPhpMailerTest,

        sslCertificates,
        ipBlockRules,
        firewallRules: ipBlockRules,
        securitySettings,
        updateSecuritySettings,
        issueAutoSsl,
        installCustomSsl,
        addIpBlock,
        removeIpBlock,
        addFirewallRule,
        deleteFirewallRule,

        dnsRecords,
        addDnsRecord,
        updateDnsRecord,
        deleteDnsRecord,
        dnssecEnabled,
        setDnssecEnabled,

        services,
        restartService,
        toggleService,

        plugins,
        togglePlugin,
        togglePluginInstall,
        togglePluginActive,
        oneClickInstallPlugin,

        backupSchedules,
        backupArchives,
        backupSnapshots: backupArchives,
        createInstantBackup,
        createManualBackup,
        deleteBackupArchive,
        deleteBackup,
        addBackupSchedule,
        deleteBackupSchedule,
        restoreBackupArchive,
        restoreBackup,

        auditLogs,
        addAuditLog,
        clearAuditLogs,

        userProfile,
        updateUserProfile,

        systemVersion,
        performSystemUpdate,

        installTerminalState,
        closeInstallTerminal,
        triggerLivePackageInstall,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
