export type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export type NavSection =
  | 'overview'
  | 'user-panel'
  | 'users-manager'
  | 'websites'
  | 'file-manager'
  | 'php-manager'
  | 'databases'
  | 'phpmyadmin'
  | 'ssl-security'
  | 'email'
  | 'roundcube'
  | 'vps-installer'
  | 'dns'
  | 'dns-editor'
  | 'metrics'
  | 'terminal'
  | 'cron'
  | 'backups'
  | 'plugins'
  | 'audit-logs'
  | 'api-docs'
  | 'profile'
  | 'profile-settings'
  | 'settings';

export interface ServerAccountUser {
  id: string;
  username: string;
  domain: string;
  email: string;
  packageName: string;
  diskQuotaMB: number;
  diskUsedMB: number;
  bandwidthQuotaMB: number;
  bandwidthUsedMB: number;
  dbLimit: number;
  dbCount: number;
  emailLimit: number;
  emailCount: number;
  ftpLimit: number;
  ftpCount: number;
  sshAccess: boolean;
  phpVersion: string;
  sslEnabled: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface VpsNetworkTelemetry {
  publicIp: string;
  ipv6: string;
  hostname: string;
  gateway: string;
  isp: string;
  location: string;
  autoDetected: boolean;
  lastChecked: string;
  totalRamMB: number;
  usedRamMB: number;
  totalDiskGB: number;
  usedDiskGB: number;
  cpuLoadPercent: number;
  activeProcesses: number;
}

export interface WebsiteDomain {
  id: string;
  domain: string;
  type: 'main' | 'subdomain' | 'addon' | 'alias';
  docRoot: string;
  documentRoot?: string;
  phpVersion: string;
  sslStatus: 'active' | 'expired' | 'pending' | 'none';
  sslIssuer?: string;
  sslExpiry?: string;
  forceHttps: boolean;
  bandwidthUsedMB: number;
  bandwidthLimitMB: number;
  diskUsedMB: number;
  diskLimitMB: number;
  visitorsToday: number;
  pageViewsToday: number;
  directoryPrivacyEnabled: boolean;
  redirectsCount: number;
  createdAt: string;
}

export interface DomainRedirect {
  id: string;
  domain: string;
  sourcePath: string;
  targetUrl: string;
  type: '301' | '302';
  matchType: 'exact' | 'wildcard' | 'regex';
  status: 'active' | 'disabled';
}

export interface ErrorPageConfig {
  code: number;
  name: string;
  content: string;
  custom: boolean;
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size: number;
  permissions: string;
  updatedAt: string;
  content?: string;
  extension?: string;
  mimeType?: string;
}

export interface FtpAccount {
  id: string;
  username: string;
  docRoot: string;
  quotaMB: number;
  usedMB: number;
  status: 'active' | 'suspended';
  sshAccess: boolean;
}

export interface PhpConfig {
  version: string;
  defaultForSystem: boolean;
  fpmStatus: 'running' | 'stopped';
  fpmMaxChildren: number;
  fpmStartServers: number;
  fpmMinSpare: number;
  fpmMaxSpare: number;
  extensions: { name: string; enabled: boolean; category: string; description: string }[];
  iniSettings: { [key: string]: string | number | boolean };
}

export interface DatabaseRecord {
  id: string;
  name: string;
  charset: string;
  collation: string;
  sizeMB: number;
  tableCount: number;
  assignedUsers: string[];
  tables?: { name: string; rows: number; sizeKB: number; engine: string }[];
}

export interface DatabaseUser {
  id: string;
  username: string;
  host: string;
  privileges: string[];
  createdAt: string;
  assignedDatabases?: string[];
  grantOption?: boolean;
}

export interface EmailAccount {
  id: string;
  email: string;
  username: string;
  domain: string;
  quotaMB: number;
  usedMB: number;
  webmailEnabled: boolean;
  status: 'active' | 'suspended';
  unreadCount: number;
  createdAt: string;
  forwardTo?: string;
  forwardersCount?: number;
  autoresponderActive?: boolean;
  autoresponder?: {
    enabled: boolean;
    subject: string;
    body: string;
    startDate: string;
    endDate: string;
  };
}

export interface EmailForwarder {
  id: string;
  sourceEmail: string;
  targetEmail: string;
  destinationEmail?: string;
  active: boolean;
}

export interface EmailAutoresponder {
  id: string;
  email: string;
  subject: string;
  body: string;
  active: boolean;
  startDate: string;
  endDate: string;
  intervalHours?: number;
}

export interface WebmailMessage {
  id: string;
  accountEmail: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';
  read: boolean;
  starred: boolean;
  hasAttachment?: boolean;
  attachments?: { name: string; size: string; type: string }[];
}

export interface DnsRecord {
  id: string;
  domain: string;
  name: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA' | 'PTR';
  value: string;
  ttl: number;
  priority?: number;
}

export interface SslCertificate {
  id: string;
  domain: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  validTo?: string;
  type: 'Let\'s Encrypt' | 'Custom' | 'Self-Signed';
  autoRenew: boolean;
  domainsCovered: string[];
  sanDomains?: string[];
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface IpBlockRule {
  id: string;
  ipOrRange: string;
  ipOrCidr?: string;
  reason: string;
  action?: string;
  blockedAt: string;
  createdAt?: string;
  expiresAt: string;
  status: 'active' | 'expired';
}

export type FirewallRule = IpBlockRule;

export interface SecuritySettings {
  twoFactorRequired?: boolean;
  twoFactorEnabled?: boolean;
  hotlinkProtectionEnabled?: boolean;
  hotlinkProtection?: boolean;
  sshPasswordAuth?: boolean;
  modSecurityActive?: boolean;
  wafRuleLevel?: 'low' | 'medium' | 'high' | 'strict';
  bruteForceProtection?: boolean;
  autoSslRenewal?: boolean;
}

export interface ServerService {
  name: string;
  displayName: string;
  status: 'running' | 'stopped' | 'restarting';
  port: number | string;
  memoryMB: number;
  cpuPercent: number;
  uptime: string;
}

export interface PluginDependency {
  name: string;
  version: string;
  type: 'system' | 'php-extension' | 'composer' | 'service';
  installed: boolean;
  autoResolvable: boolean;
}

export interface PluginItem {
  id: string;
  name: string;
  category: 'CMS' | 'Email' | 'Database' | 'Caching' | 'DevOps' | 'Security' | 'Storage' | string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  installed?: boolean;
  enabled?: boolean;
  active?: boolean;
  rating?: number;
  dependencies?: PluginDependency[];
  oneClickConfigPath?: string;
  installLogs?: string[];
  badgeColor?: string;
}

export type SystemPlugin = PluginItem;

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | string;
  cronExpression?: string;
  time?: string;
  destination: string;
  scope: string;
  retentionCopies?: number;
  retentionDays?: number;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'paused';
}

export interface BackupArchive {
  id: string;
  filename: string;
  createdAt: string;
  sizeMB: number;
  scope: string;
  destination: string;
  status: 'completed' | 'in_progress' | 'failed' | string;
  downloadUrl?: string;
}

export type BackupSnapshot = BackupArchive;

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser?: string;
  user?: string;
  action: string;
  category: string;
  severity: 'info' | 'warning' | 'critical' | 'security' | 'error' | string;
  ipAddress?: string;
  ip?: string;
  details: string;
}

export type AuditLog = AuditLogEntry;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  role: 'Super Administrator' | 'Reseller' | 'Site Admin';
  language: string;
  timezone: string;
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  themePreference: ThemeMode;
  fontSizePreference: FontSize;
  hapticFeedback: boolean;
  screenReaderOptimized: boolean;
  lastLogin: string;
  loginIp: string;
}

export interface SystemVersionInfo {
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  hasUpdate: boolean;
  changelog: { version: string; date: string; items: string[] }[];
  requiredDependencies: { name: string; version: string; status: 'ok' | 'needs_update' | 'missing' }[];
  isUpdating: boolean;
  updateProgress: number;
  updateLog: string[];
}

export interface InstallTerminalState {
  isOpen: boolean;
  title: string;
  packageName: string;
  status: 'idle' | 'installing' | 'completed' | 'error';
  logs: string[];
  launchUrl?: string;
  launchText?: string;
}
