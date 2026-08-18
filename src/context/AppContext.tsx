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

  // Navigation & UI state
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  selectedDomain: string;
  setSelectedDomain: (dom: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickActionModal: string | null;
  setQuickActionModal: (modal: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;

  // Modals for 1-Click Tools
  phpMyAdminModalOpen: boolean;
  setPhpMyAdminModalOpen: (open: boolean) => void;
  launchPhpMyAdmin: (dbName?: string) => void;
  phpMailerModalOpen: boolean;
  setPhpMailerModalOpen: (open: boolean) => void;
  launchPhpMailerTest: () => void;
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
  createFile: (path: string, name: string, content?: string) => void;
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
  sendPhpMailerTest: (config: {
    host: string;
    port: number;
    encryption: 'ssl' | 'tls' | 'none';
    username: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
  }) => Promise<{ success: boolean; log: string[] }>;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hostadmin_auth') !== 'false';
  });

  // Navigation
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [selectedDomain, setSelectedDomain] = useState<string>('sitindia.in');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 1-Click Modals
  const [phpMyAdminModalOpen, setPhpMyAdminModalOpen] = useState(false);
  const [phpMailerModalOpen, setPhpMailerModalOpen] = useState(false);
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

  // Auth Functions
  const login = (username?: string, password?: string): boolean => {
    setIsAuthenticated(true);
    localStorage.setItem('hostadmin_auth', 'true');
    addToast({
      type: 'success',
      title: 'Welcome Back, Admin',
      message: `Signed in as ${username || userProfile.username} (Super Administrator).`,
    });
    addAuditLog({
      action: 'Administrator Session Authenticated',
      category: 'Security',
      severity: 'info',
      details: `User ${username || userProfile.username} successfully logged in with 2FA verification.`,
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

  // Launch 1-Click phpMyAdmin (External Web App with direct Database targeting)
  const launchPhpMyAdmin = (dbName?: string) => {
    const url = dbName
      ? `https://phpmyadmin.sitindia.in/index.php?route=/database/structure&db=${encodeURIComponent(dbName)}`
      : `https://phpmyadmin.sitindia.in/`;

    window.open(url, '_blank', 'noopener,noreferrer');

    addAuditLog({
      action: `1-Click phpMyAdmin (External App) Launched${dbName ? ` for ${dbName}` : ''}`,
      category: 'Database',
      severity: 'info',
      details: `Direct SSO session established for MariaDB 10.11 via unix_socket at ${url}`,
    });

    addToast({
      type: 'success',
      title: 'Opening External phpMyAdmin',
      message: dbName
        ? `Directing to database ${dbName} in external window...`
        : 'Opening phpMyAdmin Web App in external window...',
    });
  };

  const launchPhpMailerTest = () => {
    setActiveSection('email');
    setPhpMailerModalOpen(true);
    addToast({
      type: 'info',
      title: 'PHPMailer Diagnostics Opened',
      message: 'Ready to test SMTP handshake and DKIM signing.',
    });
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
      { pct: 15, msg: '[STEP 1/8] Installing Apache 2.4 & Nginx HTTP reverse proxy engine...' },
      { pct: 30, msg: '[STEP 2/8] Compiling PHP 8.2 & PHP 8.3 FPM with modules: pdo_mysql, mbstring, curl, gd, zip, xml, opcache...' },
      { pct: 45, msg: '[STEP 3/8] Deploying MariaDB 10.11 Enterprise Server & configuring unix_socket auth...' },
      { pct: 60, msg: '[STEP 4/8] Installing phpMyAdmin 5.2.2 Web Interface with blowfish_secret auto-encryption...' },
      { pct: 75, msg: '[STEP 5/8] Setting up Exim4 MTA + Dovecot IMAP Server + Roundcube Webmail engine...' },
      { pct: 85, msg: '[STEP 6/8] Installing Composer 2.7.7 CLI & auto-dependency resolver libraries...' },
      { pct: 95, msg: '[STEP 7/8] Configuring Certbot Let\'s Encrypt AutoSSL Wildcard SAN certificate daemon...' },
      { pct: 100, msg: '[STEP 8/8] Hardening UFW firewall (Ports 80, 443, 22, 25, 587, 993, 3306) & starting services!' },
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
    localStorage.setItem('hostadmin_vps_installed', 'true');
    localStorage.setItem('hostadmin_prod_mode', 'true');

    addAuditLog({
      action: 'Automated 1-Click VPS Stack Provisioned',
      category: 'System',
      severity: 'info',
      details: 'Apache, Nginx, PHP 8.3, MariaDB, phpMyAdmin, Exim4, Roundcube, and Composer successfully installed.',
    });

    addToast({
      type: 'success',
      title: 'VPS Auto-Installation Complete!',
      message: 'All web servers, database, phpMyAdmin, mail, and dependencies are 100% active and running live.',
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
        setPhpMailerModalOpen(false);
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
    const serverIp = '103.175.163.45';
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

  // File Manager Actions
  const createFile = (folderPath: string, name: string, content = '') => {
    const fullPath = folderPath.endsWith('/') ? `${folderPath}${name}` : `${folderPath}/${name}`;
    const ext = name.split('.').pop() || 'txt';
    const newFile: VirtualFile = {
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      path: fullPath,
      type: 'file',
      size: content.length || 120,
      permissions: '0644',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      extension: ext,
      mimeType: ext === 'php' ? 'text/x-php' : ext === 'css' ? 'text/css' : 'text/plain',
      content,
    };
    setFiles((prev) => [...prev, newFile]);
    addAuditLog({
      action: `Created File ${name}`,
      category: 'File',
      severity: 'info',
      details: `Saved at path ${fullPath}`,
    });
    addToast({ type: 'success', title: 'File Created', message: name });
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

        activeSection,
        setActiveSection,
        selectedDomain,
        setSelectedDomain,
        commandPaletteOpen,
        setCommandPaletteOpen,
        quickActionModal,
        setQuickActionModal,
        sidebarCollapsed,
        setSidebarCollapsed,

        phpMyAdminModalOpen,
        setPhpMyAdminModalOpen,
        launchPhpMyAdmin,
        phpMailerModalOpen,
        setPhpMailerModalOpen,
        launchPhpMailerTest,
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
