import React, { useState } from 'react';
import {
  Globe,
  Layers,
  Server,
  ShieldCheck,
  FolderSync,
  Database,
  ArrowRightLeft,
  ShieldAlert,
  FileCode2,
  Mail,
  Radio,
  CalendarClock,
  Filter,
  Users,
  Send,
  Feather,
  HardDriveDownload,
  Clock,
  FileSpreadsheet,
  KeyRound,
  Fingerprint,
  FolderLock,
  Flame,
  FolderGit2,
  Terminal,
  Activity,
  BarChart3,
  FileText,
  Boxes,
  Cpu,
  Gauge,
  Sparkles,
  HelpCircle,
  Ticket,
  MessageSquare,
  FileCode,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  ArrowLeft,
  RefreshCw,
  HardDrive,
  Network,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

interface PanelItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  actionType: 'nav' | 'modal' | 'external' | 'interactive';
  navTarget?: NavSection;
  description: string;
  extraMeta?: string;
}

export const UserPanelSection: React.FC = () => {
  const {
    activeUserAccount,
    panelMode,
    returnToAdmin,
    setActiveSection,
    selectedDomain,
    setSelectedDomain,
    domains,
    networkTelemetry,
    detectServerIpAndMetrics,
    launchPhpMyAdmin,
    setPhpMyAdminModalOpen,
    launchVpsInstaller,
    addToast,
    serverUsers,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppModal, setSelectedAppModal] = useState<PanelItem | null>(null);
  const [installingApp, setInstallingApp] = useState<string | null>(null);

  // Active user details (defaults to primary account if not set)
  const currentUser = activeUserAccount || serverUsers[0] || {
    id: 'u-1',
    username: 'sitindia',
    domain: selectedDomain || 'sitindia.in',
    email: 'admin@sitindia.in',
    packageName: 'Enterprise Pro (Unlimited)',
    diskQuotaMB: 50000,
    diskUsedMB: 6840,
    bandwidthQuotaMB: 200000,
    bandwidthUsedMB: 20680,
    dbLimit: 50,
    dbCount: 4,
    emailLimit: 100,
    emailCount: 6,
    ftpLimit: 20,
    ftpCount: 4,
    sshAccess: true,
    phpVersion: '8.3',
    sslEnabled: true,
    status: 'active',
  };

  const categories = [
    {
      id: 'account-manager',
      title: 'ACCOUNT MANAGER',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'domains',
          title: 'Domains',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-600',
          icon: <Globe className="w-7 h-7 text-emerald-500" />,
          actionType: 'nav',
          navTarget: 'websites',
          description: 'Manage main domains, addon domains, document roots and aliases.',
        },
        {
          id: 'subdomains',
          title: 'Subdomain Management',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-cyan-50 border-cyan-200',
          iconColor: 'text-cyan-600',
          icon: <Layers className="w-7 h-7 text-cyan-500" />,
          actionType: 'nav',
          navTarget: 'websites',
          description: 'Create & route subdomains (e.g. api, webmail, shop, staging).',
        },
        {
          id: 'dns-management',
          title: 'DNS Management',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <Server className="w-7 h-7 text-blue-600" />,
          actionType: 'nav',
          navTarget: 'dns-editor',
          description: 'Manage BIND9 authoritative zone records (A, AAAA, CNAME, MX, TXT, NS).',
        },
        {
          id: 'ssl-certificates',
          title: 'SSL Certificates',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-sky-50 border-sky-200',
          iconColor: 'text-sky-600',
          icon: <ShieldCheck className="w-7 h-7 text-sky-500" />,
          actionType: 'nav',
          navTarget: 'ssl-security',
          description: "Let's Encrypt AutoSSL 90-day certificates & custom RSA/ECDSA keys.",
        },
        {
          id: 'ftp-management',
          title: 'FTP Management',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          icon: <FolderSync className="w-7 h-7 text-amber-500" />,
          actionType: 'nav',
          navTarget: 'file-manager',
          description: 'Configure ProFTPD / Pure-FTPd virtual user accounts and directory quotas.',
        },
        {
          id: 'databases',
          title: 'Databases',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <Database className="w-7 h-7 text-indigo-500" />,
          actionType: 'nav',
          navTarget: 'databases',
          description: 'Create MariaDB/MySQL databases, manage users, and execute SQL queries.',
        },
        {
          id: 'site-redirects',
          title: 'Site Redirects',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          icon: <ArrowRightLeft className="w-7 h-7 text-orange-500" />,
          actionType: 'nav',
          navTarget: 'websites',
          description: 'Setup 301 Permanent and 302 Temporary URL forwarding rules.',
        },
        {
          id: 'hotlink-protection',
          title: 'Hotlink Protection',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-600',
          icon: <ShieldAlert className="w-7 h-7 text-purple-500" />,
          actionType: 'nav',
          navTarget: 'ssl-security',
          description: 'Prevent direct asset leeching (images, zip, mp4) from third-party sites.',
        },
        {
          id: 'php-settings',
          title: 'PHP Settings',
          category: 'ACCOUNT MANAGER',
          iconBg: 'bg-violet-50 border-violet-200',
          iconColor: 'text-violet-600',
          icon: <FileCode2 className="w-7 h-7 text-violet-500" />,
          actionType: 'nav',
          navTarget: 'php-manager',
          description: 'Multi-PHP 8.2/8.3/8.4 runtime switcher, memory_limit, upload_max_filesize.',
        },
      ],
    },
    {
      id: 'email-manager',
      title: 'E-MAIL MANAGER',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'email-accounts',
          title: 'E-mail Accounts',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          icon: <Mail className="w-7 h-7 text-amber-500" />,
          actionType: 'nav',
          navTarget: 'email',
          description: 'Create mailboxes, allocate storage quotas, and configure mail client apps.',
        },
        {
          id: 'autoresponders',
          title: 'Autoresponders',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-teal-50 border-teal-200',
          iconColor: 'text-teal-600',
          icon: <Radio className="w-7 h-7 text-teal-500" />,
          actionType: 'nav',
          navTarget: 'email',
          description: 'Configure automated immediate reply messages for incoming inquiries.',
        },
        {
          id: 'vacation-messages',
          title: 'Vacation Messages',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <CalendarClock className="w-7 h-7 text-blue-500" />,
          actionType: 'nav',
          navTarget: 'email',
          description: 'Scheduled out-of-office autoreplies with custom date ranges.',
        },
        {
          id: 'spam-filters',
          title: 'SPAM Filters',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-rose-50 border-rose-200',
          iconColor: 'text-rose-600',
          icon: <Filter className="w-7 h-7 text-rose-500" />,
          actionType: 'nav',
          navTarget: 'email',
          description: 'Apache SpamAssassin rules, Bayesian scoring, blacklist & whitelist.',
        },
        {
          id: 'mailing-lists',
          title: 'Mailing Lists',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <Users className="w-7 h-7 text-indigo-500" />,
          actionType: 'nav',
          navTarget: 'email',
          description: 'Mailman / Mail group broadcasts for team communications.',
        },
        {
          id: 'mx-records',
          title: 'MX Records',
          category: 'E-MAIL MANAGER',
          iconBg: 'bg-sky-50 border-sky-200',
          iconColor: 'text-sky-600',
          icon: <Send className="w-7 h-7 text-sky-500" />,
          actionType: 'nav',
          navTarget: 'dns-editor',
          description: 'Mail exchanger routing priority (mail.sitindia.in / Google Workspace).',
        },
      ],
    },
    {
      id: 'advanced-features',
      title: 'ADVANCED FEATURES',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'apache-handlers',
          title: 'Apache Handlers',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          icon: <Feather className="w-7 h-7 text-red-500" />,
          actionType: 'interactive',
          description: 'AddHandler directives for CGI, SSI, Python WSGI and custom mime extensions.',
        },
        {
          id: 'backup-restore',
          title: 'Backup and Restore',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <HardDriveDownload className="w-7 h-7 text-blue-500" />,
          actionType: 'nav',
          navTarget: 'backups',
          description: '1-Click full cPanel backups, MySQL dump snapshots, automated schedules.',
        },
        {
          id: 'cron-jobs',
          title: 'Cron Jobs',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-violet-50 border-violet-200',
          iconColor: 'text-violet-600',
          icon: <Clock className="w-7 h-7 text-violet-500" />,
          actionType: 'interactive',
          description: 'Standard Linux cron daemon for scheduled CLI and PHP task execution.',
        },
        {
          id: 'mime-types',
          title: 'MIME types',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-600',
          icon: <FileSpreadsheet className="w-7 h-7 text-emerald-500" />,
          actionType: 'interactive',
          description: 'Define application media types and browser handling extensions.',
        },
        {
          id: 'login-keys',
          title: 'Login Keys',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          icon: <KeyRound className="w-7 h-7 text-amber-500" />,
          actionType: 'interactive',
          description: 'Manage OpenSSH RSA / ED25519 authorized public keys for passwordless access.',
        },
        {
          id: 'two-step-auth',
          title: 'Two-Step Authentication',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-cyan-50 border-cyan-200',
          iconColor: 'text-cyan-600',
          icon: <Fingerprint className="w-7 h-7 text-cyan-500" />,
          actionType: 'interactive',
          description: 'Google Authenticator / Authy TOTP 2FA multi-factor security.',
        },
        {
          id: 'password-dirs',
          title: 'Password Protected Directories',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          icon: <FolderLock className="w-7 h-7 text-orange-500" />,
          actionType: 'interactive',
          description: 'Apache .htaccess and .htpasswd basic authentication folders.',
        },
        {
          id: 'waf-firewall',
          title: 'Web Application Firewall',
          category: 'ADVANCED FEATURES',
          iconBg: 'bg-rose-50 border-rose-200',
          iconColor: 'text-rose-600',
          icon: <Flame className="w-7 h-7 text-rose-500" />,
          actionType: 'nav',
          navTarget: 'ssl-security',
          description: 'ModSecurity OWASP Core Rule Set active real-time attack filter.',
        },
      ],
    },
    {
      id: 'system-info-files',
      title: 'SYSTEM INFO & FILES',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'file-manager',
          title: 'File Manager',
          category: 'SYSTEM INFO & FILES',
          iconBg: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          icon: <FolderGit2 className="w-7 h-7 text-amber-500" />,
          actionType: 'nav',
          navTarget: 'file-manager',
          description: 'Web-based file explorer, code editor, zip/unzip, and permissions tool.',
        },
        {
          id: 'perl-modules',
          title: 'Perl Modules',
          category: 'SYSTEM INFO & FILES',
          iconBg: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-600',
          icon: <Terminal className="w-7 h-7 text-purple-500" />,
          actionType: 'interactive',
          description: 'CPAN Perl package manager and module library installer.',
        },
        {
          id: 'system-info',
          title: 'System Information',
          category: 'SYSTEM INFO & FILES',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <Server className="w-7 h-7 text-indigo-500" />,
          actionType: 'nav',
          navTarget: 'metrics',
          description: 'Linux kernel, CPU architecture, memory allocation, and active daemons.',
        },
        {
          id: 'user-statistics',
          title: 'User statistics',
          category: 'SYSTEM INFO & FILES',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <BarChart3 className="w-7 h-7 text-blue-500" />,
          actionType: 'nav',
          navTarget: 'metrics',
          description: 'AWStats, Webalizer, HTTP hit counts, unique visitors, and bandwidth charts.',
        },
        {
          id: 'site-logs',
          title: 'Site summary & logs',
          category: 'SYSTEM INFO & FILES',
          iconBg: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-600',
          icon: <FileText className="w-7 h-7 text-emerald-500" />,
          actionType: 'nav',
          navTarget: 'audit-logs',
          description: 'Real-time Apache/Nginx access.log and error.log streaming.',
        },
      ],
    },
    {
      id: 'extra-features',
      title: 'EXTRA FEATURES',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'roundcube-webmail',
          title: 'Webmail: Roundcube',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-sky-50 border-sky-200',
          iconColor: 'text-sky-600',
          icon: <Boxes className="w-7 h-7 text-sky-500" />,
          actionType: 'nav',
          navTarget: 'roundcube',
          description: 'Roundcube Webmail Client with IMAP SSL 993 & SMTP 587.',
        },
        {
          id: 'phpmyadmin',
          title: 'phpMyAdmin',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          icon: <Database className="w-7 h-7 text-orange-500" />,
          actionType: 'interactive',
          description: '1-Click Direct SSO to phpMyAdmin 5.2.2 database engine.',
        },
        {
          id: 'imunify360',
          title: 'Imunify360 Plugin',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-600',
          icon: <ShieldCheck className="w-7 h-7 text-emerald-500" />,
          actionType: 'interactive',
          description: 'AI-powered malware scanner, real-time protection, and reputation monitor.',
        },
        {
          id: 'select-php-version',
          title: 'Select PHP version',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <FileCode2 className="w-7 h-7 text-indigo-500" />,
          actionType: 'nav',
          navTarget: 'php-manager',
          description: 'Change PHP version per domain or folder (PHP 8.2, 8.3, 8.4).',
        },
        {
          id: 'setup-python-app',
          title: 'Setup Python App',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          icon: <Cpu className="w-7 h-7 text-yellow-600" />,
          actionType: 'interactive',
          description: 'Passenger WSGI runner for Django, Flask, FastAPI and virtualenvs.',
        },
        {
          id: 'resource-usage',
          title: 'Resource Usage',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-slate-50 border-slate-200',
          iconColor: 'text-slate-600',
          icon: <Gauge className="w-7 h-7 text-slate-600" />,
          actionType: 'nav',
          navTarget: 'metrics',
          description: 'Track CPU limits, I/O usage, IOPS, and EP memory spikes.',
        },
        {
          id: 'softaculous-auto-installer',
          title: 'Softaculous Auto Installer',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-cyan-50 border-cyan-200',
          iconColor: 'text-cyan-600',
          icon: <HardDrive className="w-7 h-7 text-cyan-600" />,
          actionType: 'interactive',
          description: '1-Click installer catalog with 400+ popular web applications.',
        },
        {
          id: 'wordpress-manager',
          title: 'WordPress Manager by Softaculous',
          category: 'EXTRA FEATURES',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <Globe className="w-7 h-7 text-blue-600" />,
          actionType: 'interactive',
          description: 'Manage WP core updates, clone staging, auto-login, and plugin updates.',
        },
      ],
    },
    {
      id: 'support-help',
      title: 'SUPPORT & HELP',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'help',
          title: 'Help',
          category: 'SUPPORT & HELP',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <HelpCircle className="w-7 h-7 text-indigo-500" />,
          actionType: 'interactive',
          description: 'Knowledgebase articles, documentation, server tutorials.',
        },
        {
          id: 'create-ticket',
          title: 'Create Ticket',
          category: 'SUPPORT & HELP',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <Ticket className="w-7 h-7 text-blue-500" />,
          actionType: 'interactive',
          description: 'Submit an urgent priority support ticket to the SIT engineering desk.',
        },
        {
          id: 'messages',
          title: 'Messages',
          category: 'SUPPORT & HELP',
          iconBg: 'bg-teal-50 border-teal-200',
          iconColor: 'text-teal-600',
          icon: <MessageSquare className="w-7 h-7 text-teal-500" />,
          actionType: 'interactive',
          description: 'Server maintenance notices, system announcements, and alerts.',
        },
        {
          id: 'tickets',
          title: 'Tickets',
          category: 'SUPPORT & HELP',
          iconBg: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-600',
          icon: <Ticket className="w-7 h-7 text-purple-500" />,
          actionType: 'interactive',
          description: 'View open tickets, response times, and resolved cases.',
        },
        {
          id: 'api-documentation',
          title: 'API Documentation',
          category: 'SUPPORT & HELP',
          iconBg: 'bg-slate-50 border-slate-200',
          iconColor: 'text-slate-600',
          icon: <FileCode className="w-7 h-7 text-slate-600" />,
          actionType: 'nav',
          navTarget: 'api-docs',
          description: 'REST API endpoints for automating server operations & user accounts.',
        },
      ],
    },
    {
      id: 'softaculous-apps-installer',
      title: 'SOFTACULOUS APPS INSTALLER',
      bgHeader: 'bg-sky-100 text-sky-950 border-sky-200',
      items: [
        {
          id: 'code-with-ai',
          title: 'Code with AI',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-indigo-50 border-indigo-200',
          iconColor: 'text-indigo-600',
          icon: <Sparkles className="w-7 h-7 text-indigo-600" />,
          actionType: 'interactive',
          description: 'Generate full-stack PHP/React web applications powered by Gemini AI.',
        },
        {
          id: 'wordpress-app',
          title: 'WordPress',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: <Globe className="w-7 h-7 text-blue-600" />,
          actionType: 'interactive',
          description: "World's most popular CMS and blogging platform (v6.6+).",
        },
        {
          id: 'joomla',
          title: 'Joomla',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-600',
          icon: <Layers className="w-7 h-7 text-emerald-600" />,
          actionType: 'interactive',
          description: 'Award-winning enterprise content management system.',
        },
        {
          id: 'abantecart',
          title: 'AbanteCart',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-sky-50 border-sky-200',
          iconColor: 'text-sky-600',
          icon: <HardDrive className="w-7 h-7 text-sky-600" />,
          actionType: 'interactive',
          description: 'Free open-source eCommerce platform for merchants.',
        },
        {
          id: 'phpbb',
          title: 'phpBB',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-cyan-50 border-cyan-200',
          iconColor: 'text-cyan-600',
          icon: <Users className="w-7 h-7 text-cyan-600" />,
          actionType: 'interactive',
          description: 'Free bulletin board community forum software.',
        },
        {
          id: 'smf',
          title: 'SMF',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-slate-50 border-slate-200',
          iconColor: 'text-slate-600',
          icon: <Server className="w-7 h-7 text-slate-600" />,
          actionType: 'interactive',
          description: 'Simple Machines Forum software package.',
        },
        {
          id: 'whmcs',
          title: 'WHMCS',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          icon: <CheckCircle2 className="w-7 h-7 text-green-600" />,
          actionType: 'interactive',
          description: 'Web hosting management, automated billing and support desk.',
        },
        {
          id: 'open-real-estate',
          title: 'Open Real Estate',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-teal-50 border-teal-200',
          iconColor: 'text-teal-600',
          icon: <Globe className="w-7 h-7 text-teal-600" />,
          actionType: 'interactive',
          description: 'Real estate agency portal with property listings.',
        },
        {
          id: 'mybb',
          title: 'MyBB',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          icon: <MessageSquare className="w-7 h-7 text-amber-600" />,
          actionType: 'interactive',
          description: 'User-friendly, extensible forum package.',
        },
        {
          id: 'laravel',
          title: 'Laravel',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          icon: <Flame className="w-7 h-7 text-red-600" />,
          actionType: 'interactive',
          description: 'The PHP framework for Web Artisans (Laravel 11.x).',
        },
        {
          id: 'ph7builder',
          title: 'pH7Builder',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-pink-50 border-pink-200',
          iconColor: 'text-pink-600',
          icon: <Users className="w-7 h-7 text-pink-600" />,
          actionType: 'interactive',
          description: 'Social networking & dating web platform.',
        },
        {
          id: 'dolphin',
          title: 'Dolphin',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-sky-50 border-sky-200',
          iconColor: 'text-sky-600',
          icon: <Activity className="w-7 h-7 text-sky-600" />,
          actionType: 'interactive',
          description: 'Community and media portal application.',
        },
        {
          id: 'concrete-cms',
          title: 'Concrete CMS',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-slate-50 border-slate-200',
          iconColor: 'text-slate-600',
          icon: <Layers className="w-7 h-7 text-slate-600" />,
          actionType: 'interactive',
          description: 'In-context web editing content management system.',
        },
        {
          id: 'gallery',
          title: 'Gallery',
          category: 'SOFTACULOUS APPS INSTALLER',
          iconBg: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-600',
          icon: <FolderGit2 className="w-7 h-7 text-purple-600" />,
          actionType: 'interactive',
          description: 'Photo album organizer with tag management.',
        },
      ],
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.actionType === 'nav' && item.navTarget) {
      setActiveSection(item.navTarget);
      return;
    }

    if (item.id === 'phpmyadmin') {
      launchPhpMyAdmin();
      return;
    }

    setSelectedAppModal(item);
  };

  const handleQuickInstall = (item: PanelItem) => {
    setInstallingApp(item.id);
    setTimeout(() => {
      setInstallingApp(null);
      setSelectedAppModal(null);
      addToast({
        type: 'success',
        title: `${item.title} Ready!`,
        message: `${item.title} has been successfully deployed to /home/${currentUser.username}/public_html/${item.id}`,
      });
    }, 1200);
  };

  // Filtered categories based on search query
  const filteredCategories = categories.map((cat) => {
    const matchingItems = cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items: matchingItems };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner with Active User & VPS Telemetry */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 font-bold shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 font-display tracking-tight">
                  User Control Panel
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[11px] font-semibold">
                  Account Active
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Logged in as <span className="font-bold text-slate-900 font-mono">@{currentUser.username}</span> • Managing domain{' '}
                <span className="font-bold text-sky-700 font-mono">{currentUser.domain}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => detectServerIpAndMetrics()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
              title="Sync live VPS IP and hardware statistics"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Live IP</span>
            </button>

            {panelMode === 'user' && (
              <button
                onClick={returnToAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Admin Console</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 flex items-center justify-between">
              <span>Server Public IP</span>
              <Network className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="font-mono font-bold text-slate-900 text-[13px]">
              {networkTelemetry.publicIp}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 flex items-center justify-between">
              <span>Live Disk Space</span>
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="font-mono font-bold text-slate-900 text-[13px]">
              {currentUser.diskUsedMB} MB / {currentUser.diskQuotaMB} MB
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (currentUser.diskUsedMB / currentUser.diskQuotaMB) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 flex items-center justify-between">
              <span>Bandwidth (Monthly)</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="font-mono font-bold text-slate-900 text-[13px]">
              {(currentUser.bandwidthUsedMB / 1024).toFixed(1)} GB / {(currentUser.bandwidthQuotaMB / 1024).toFixed(0)} GB
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (currentUser.bandwidthUsedMB / currentUser.bandwidthQuotaMB) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-slate-500 flex items-center justify-between">
              <span>PHP & SSL Security</span>
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="font-mono font-bold text-slate-900 text-[13px] flex items-center gap-1.5">
              <span>PHP {currentUser.phpVersion}</span>
              <span className="text-emerald-600 text-xs">● SSL Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Fast Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search features, tools, databases, email, or apps (e.g. DNS, FTP, phpMyAdmin, WordPress)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categorized Iconic Grid View matching the uploaded photo */}
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
            {/* Sky Blue Category Header Bar */}
            <div className="bg-sky-100/90 px-4 py-2 border-b border-sky-200/80 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-sky-950 tracking-wider">
                {category.title}
              </h2>
              <span className="text-[11px] font-medium text-sky-800">
                {category.items.length} items
              </span>
            </div>

            {/* Grid of Square/Card Iconic Items */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group flex flex-col items-center justify-center text-center p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-sky-50/50 hover:border-sky-300 hover:shadow-md transition-all duration-150 relative cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-150 group-hover:scale-105 ${item.iconBg} border`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-sky-700 leading-tight transition-colors line-clamp-2">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App / Tool Quick Launch Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAppModal.iconBg} border`}>
                {selectedAppModal.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {selectedAppModal.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedAppModal.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedAppModal.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
              <div className="text-slate-500 text-[11px]">Installation Target:</div>
              <div className="text-slate-900 font-bold">
                /home/{currentUser.username}/public_html/{selectedAppModal.id}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleQuickInstall(selectedAppModal)}
                disabled={installingApp === selectedAppModal.id}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                {installingApp === selectedAppModal.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Deploy 1-Click</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
