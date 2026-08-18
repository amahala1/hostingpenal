import {
  WebsiteDomain,
  VirtualFile,
  FtpAccount,
  PhpConfig,
  DatabaseRecord,
  DatabaseUser,
  EmailAccount,
  WebmailMessage,
  DnsRecord,
  SslCertificate,
  IpBlockRule,
  ServerService,
  PluginItem,
  BackupSchedule,
  BackupArchive,
  AuditLogEntry,
  UserProfile,
  DomainRedirect,
  ErrorPageConfig,
} from '../types';

export const INITIAL_DOMAINS: WebsiteDomain[] = [
  {
    id: 'dom-1',
    domain: 'sitindia.in',
    type: 'main',
    docRoot: '/home/sitindia/public_html',
    phpVersion: '8.3',
    sslStatus: 'active',
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiry: '2026-11-20',
    forceHttps: true,
    bandwidthUsedMB: 4820,
    bandwidthLimitMB: 50000,
    diskUsedMB: 1840,
    diskLimitMB: 20000,
    visitorsToday: 1420,
    pageViewsToday: 6850,
    directoryPrivacyEnabled: false,
    redirectsCount: 2,
    createdAt: '2025-01-10',
  },
  {
    id: 'dom-2',
    domain: 'api.sitindia.in',
    type: 'subdomain',
    docRoot: '/home/sitindia/public_html/api',
    phpVersion: '8.3',
    sslStatus: 'active',
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiry: '2026-11-20',
    forceHttps: true,
    bandwidthUsedMB: 12400,
    bandwidthLimitMB: 100000,
    diskUsedMB: 520,
    diskLimitMB: 10000,
    visitorsToday: 8900,
    pageViewsToday: 42100,
    directoryPrivacyEnabled: true,
    redirectsCount: 0,
    createdAt: '2025-02-01',
  },
  {
    id: 'dom-3',
    domain: 'shop.sitindia.in',
    type: 'subdomain',
    docRoot: '/home/sitindia/public_html/shop',
    phpVersion: '8.2',
    sslStatus: 'active',
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiry: '2026-10-15',
    forceHttps: true,
    bandwidthUsedMB: 3100,
    bandwidthLimitMB: 50000,
    diskUsedMB: 2400,
    diskLimitMB: 20000,
    visitorsToday: 640,
    pageViewsToday: 3120,
    directoryPrivacyEnabled: false,
    redirectsCount: 1,
    createdAt: '2025-03-12',
  },
  {
    id: 'dom-4',
    domain: 'staging.sitindia.in',
    type: 'subdomain',
    docRoot: '/home/sitindia/staging',
    phpVersion: '8.4',
    sslStatus: 'active',
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiry: '2026-09-30',
    forceHttps: false,
    bandwidthUsedMB: 340,
    bandwidthLimitMB: 10000,
    diskUsedMB: 890,
    diskLimitMB: 10000,
    visitorsToday: 45,
    pageViewsToday: 190,
    directoryPrivacyEnabled: true,
    redirectsCount: 0,
    createdAt: '2025-05-18',
  },
];

export const INITIAL_REDIRECTS: DomainRedirect[] = [
  {
    id: 'red-1',
    domain: 'sitindia.in',
    sourcePath: '/old-about',
    targetUrl: 'https://sitindia.in/about-us',
    type: '301',
    matchType: 'exact',
    status: 'active',
  },
  {
    id: 'red-2',
    domain: 'sitindia.in',
    sourcePath: '/contact-form',
    targetUrl: 'https://sitindia.in/support',
    type: '302',
    matchType: 'exact',
    status: 'active',
  },
  {
    id: 'red-3',
    domain: 'shop.sitindia.in',
    sourcePath: '/deals/*',
    targetUrl: 'https://shop.sitindia.in/special-offers',
    type: '301',
    matchType: 'wildcard',
    status: 'active',
  },
];

export const INITIAL_ERROR_PAGES: ErrorPageConfig[] = [
  {
    code: 404,
    name: '404 Not Found',
    content: `<!DOCTYPE html>
<html>
<head><title>404 - Page Not Found | SIT India</title>
<style>body{font-family:sans-serif;text-align:center;padding:50px;background:#f8fafc;color:#1e293b;}h1{font-size:48px;color:#dc2626;}</style>
</head>
<body>
<h1>404</h1>
<h2>Oops! Page Not Found</h2>
<p>The requested URL was not found on this server.</p>
<a href="/">Return to SIT India Home</a>
</body>
</html>`,
    custom: true,
  },
  {
    code: 403,
    name: '403 Forbidden',
    content: `<!DOCTYPE html>
<html>
<head><title>403 - Forbidden Access</title></head>
<body><h1>403 Forbidden</h1><p>You do not have permission to access this resource.</p></body>
</html>`,
    custom: false,
  },
  {
    code: 500,
    name: '500 Internal Server Error',
    content: `<!DOCTYPE html>
<html>
<head><title>500 - Internal Server Error</title></head>
<body><h1>500 Internal Server Error</h1><p>The server encountered an internal error. Please contact admin@sitindia.in.</p></body>
</html>`,
    custom: true,
  },
  {
    code: 502,
    name: '502 Bad Gateway',
    content: `<!DOCTYPE html>
<html>
<head><title>502 - Bad Gateway</title></head>
<body><h1>502 Bad Gateway</h1><p>Upstream backend service is unavailable.</p></body>
</html>`,
    custom: false,
  },
];

export const INITIAL_FILES: VirtualFile[] = [
  {
    id: 'f-1',
    name: 'public_html',
    path: '/home/sitindia/public_html',
    type: 'folder',
    size: 4096,
    permissions: '0755',
    updatedAt: '2026-08-16 14:20:00',
  },
  {
    id: 'f-2',
    name: 'index.php',
    path: '/home/sitindia/public_html/index.php',
    type: 'file',
    size: 2450,
    permissions: '0644',
    updatedAt: '2026-08-16 16:45:10',
    extension: 'php',
    mimeType: 'text/x-php',
    content: `<?php
/**
 * SIT India - Enterprise Web Portal Entry
 * Powered by HostAdmin Control Panel Engine
 */

require_once __DIR__ . '/config.php';

$pageTitle = "Welcome to SIT India Official Portal";
$currentYear = date("Y");

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>SIT India Digital Network</h1>
            <p>High-Performance Enterprise Cloud Infrastructure</p>
        </div>
    </header>
    <main class="container">
        <section class="hero">
            <h2>Fast, Secure & Always Available</h2>
            <p>Contact our support team at <a href="mailto:support@sitindia.in">support@sitindia.in</a></p>
        </section>
    </main>
    <footer>
        <p>&copy; <?= $currentYear ?> SIT India. All rights reserved.</p>
    </footer>
</body>
</html>
`,
  },
  {
    id: 'f-3',
    name: 'config.php',
    path: '/home/sitindia/public_html/config.php',
    type: 'file',
    size: 1120,
    permissions: '0600',
    updatedAt: '2026-08-15 11:30:22',
    extension: 'php',
    mimeType: 'text/x-php',
    content: `<?php
// SIT India System Database & App Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'sitindia_portal');
define('DB_USER', 'sitindia_admin');
define('DB_PASS', '****************');
define('APP_ENV', 'production');
define('ADMIN_EMAIL', 'admin@sitindia.in');
define('ENABLE_SSL_STRICT', true);
`,
  },
  {
    id: 'f-4',
    name: '.htaccess',
    path: '/home/sitindia/public_html/.htaccess',
    type: 'file',
    size: 680,
    permissions: '0644',
    updatedAt: '2026-08-14 09:12:00',
    extension: 'htaccess',
    mimeType: 'text/plain',
    content: `# SIT India Apache Security & URL Rewrites
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent directory browsing
Options -Indexes

# Block sensitive files
<FilesMatch "^\\.(env|git|htpasswd|json|lock)">
    Order allow,deny
    Deny from all
</FilesMatch>
`,
  },
  {
    id: 'f-5',
    name: 'robots.txt',
    path: '/home/sitindia/public_html/robots.txt',
    type: 'file',
    size: 210,
    permissions: '0644',
    updatedAt: '2026-08-10 08:00:00',
    extension: 'txt',
    mimeType: 'text/plain',
    content: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /staging/
Sitemap: https://sitindia.in/sitemap.xml
`,
  },
  {
    id: 'f-6',
    name: 'api',
    path: '/home/sitindia/public_html/api',
    type: 'folder',
    size: 4096,
    permissions: '0755',
    updatedAt: '2026-08-16 12:10:00',
  },
  {
    id: 'f-7',
    name: 'v1.php',
    path: '/home/sitindia/public_html/api/v1.php',
    type: 'file',
    size: 1540,
    permissions: '0644',
    updatedAt: '2026-08-16 12:15:00',
    extension: 'php',
    mimeType: 'text/x-php',
    content: `<?php
header('Content-Type: application/json');
echo json_encode([
    'service' => 'SIT India REST Gateway',
    'status' => 'operational',
    'version' => '1.0.4',
    'timestamp' => date('c')
]);
`,
  },
  {
    id: 'f-8',
    name: 'assets',
    path: '/home/sitindia/public_html/assets',
    type: 'folder',
    size: 4096,
    permissions: '0755',
    updatedAt: '2026-08-15 15:00:00',
  },
  {
    id: 'f-9',
    name: 'style.css',
    path: '/home/sitindia/public_html/assets/style.css',
    type: 'file',
    size: 3400,
    permissions: '0644',
    updatedAt: '2026-08-15 15:20:00',
    extension: 'css',
    mimeType: 'text/css',
    content: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  color: #1e293b;
  background: #f8fafc;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.header {
  background: linear-gradient(135deg, #1e3a8a, #0284c7);
  color: white;
  padding: 40px 0;
}
`,
  },
  {
    id: 'f-10',
    name: 'ssl',
    path: '/home/sitindia/ssl',
    type: 'folder',
    size: 4096,
    permissions: '0700',
    updatedAt: '2026-08-12 10:00:00',
  },
  {
    id: 'f-11',
    name: 'sitindia.crt',
    path: '/home/sitindia/ssl/sitindia.crt',
    type: 'file',
    size: 2180,
    permissions: '0644',
    updatedAt: '2026-08-12 10:05:00',
    extension: 'crt',
    mimeType: 'text/plain',
    content: `-----BEGIN CERTIFICATE-----
MIIDuzCCAqOgAwIBAgIUW8w1vK7q9qV7...
[Let's Encrypt SSL Certificate for sitindia.in]
-----END CERTIFICATE-----`,
  },
  {
    id: 'f-12',
    name: 'mail',
    path: '/home/sitindia/mail',
    type: 'folder',
    size: 4096,
    permissions: '0750',
    updatedAt: '2026-08-16 09:30:00',
  },
  {
    id: 'f-13',
    name: 'logs',
    path: '/home/sitindia/logs',
    type: 'folder',
    size: 4096,
    permissions: '0755',
    updatedAt: '2026-08-17 07:00:00',
  },
  {
    id: 'f-14',
    name: 'access.log',
    path: '/home/sitindia/logs/access.log',
    type: 'file',
    size: 94800,
    permissions: '0644',
    updatedAt: '2026-08-17 07:42:15',
    extension: 'log',
    mimeType: 'text/plain',
    content: `103.21.14.88 - - [17/Aug/2026:07:40:12 +0530] "GET / HTTP/2.0" 200 4820 "-" "Mozilla/5.0"
103.21.14.88 - - [17/Aug/2026:07:40:13 +0530] "GET /assets/style.css HTTP/2.0" 200 3400 "https://sitindia.in/"
49.36.120.45 - - [17/Aug/2026:07:41:02 +0530] "POST /api/v1.php HTTP/2.0" 200 1540 "-" "PostmanRuntime/7.32"
`,
  },
];

export const INITIAL_FTP_ACCOUNTS: FtpAccount[] = [
  {
    id: 'ftp-1',
    username: 'sitindia_deploy',
    docRoot: '/home/sitindia/public_html',
    quotaMB: 10000,
    usedMB: 1840,
    status: 'active',
    sshAccess: true,
  },
  {
    id: 'ftp-2',
    username: 'sitindia_media',
    docRoot: '/home/sitindia/public_html/assets',
    quotaMB: 5000,
    usedMB: 650,
    status: 'active',
    sshAccess: false,
  },
  {
    id: 'ftp-3',
    username: 'sitindia_dev',
    docRoot: '/home/sitindia/staging',
    quotaMB: 5000,
    usedMB: 890,
    status: 'active',
    sshAccess: true,
  },
];

export const INITIAL_PHP_VERSIONS: PhpConfig[] = [
  {
    version: '8.3',
    defaultForSystem: true,
    fpmStatus: 'running',
    fpmMaxChildren: 50,
    fpmStartServers: 10,
    fpmMinSpare: 5,
    fpmMaxSpare: 20,
    extensions: [
      { name: 'opcache', enabled: true, category: 'Performance', description: 'Zend OPcache bytecode caching accelerator' },
      { name: 'pdo_mysql', enabled: true, category: 'Database', description: 'PHP Data Objects driver for MySQL' },
      { name: 'mysqli', enabled: true, category: 'Database', description: 'Improved MySQL extension' },
      { name: 'curl', enabled: true, category: 'Network', description: 'cURL library for HTTP requests' },
      { name: 'mbstring', enabled: true, category: 'Core', description: 'Multibyte string support' },
      { name: 'gd', enabled: true, category: 'Media', description: 'Image generation and manipulation library' },
      { name: 'imagick', enabled: true, category: 'Media', description: 'ImageMagick wrapper for advanced media rendering' },
      { name: 'redis', enabled: true, category: 'Caching', description: 'PHP extension for interfacing with Redis' },
      { name: 'intl', enabled: true, category: 'Localization', description: 'Internationalization extension' },
      { name: 'zip', enabled: true, category: 'Archiving', description: 'Zip archive reading and writing' },
      { name: 'bcmath', enabled: true, category: 'Math', description: 'Arbitrary precision mathematics' },
      { name: 'soap', enabled: false, category: 'Web Services', description: 'SOAP protocol client & server' },
      { name: 'xdebug', enabled: false, category: 'Debugging', description: 'Step debugging and profiling tool' },
    ],
    iniSettings: {
      memory_limit: '512M',
      upload_max_filesize: '64M',
      post_max_size: '64M',
      max_execution_time: 120,
      max_input_time: 120,
      display_errors: 'Off',
      'date.timezone': 'Asia/Kolkata',
      opcache_enable: 1,
      opcache_memory_consumption: 128,
    },
  },
  {
    version: '8.4',
    defaultForSystem: false,
    fpmStatus: 'running',
    fpmMaxChildren: 30,
    fpmStartServers: 5,
    fpmMinSpare: 2,
    fpmMaxSpare: 10,
    extensions: [
      { name: 'opcache', enabled: true, category: 'Performance', description: 'Zend OPcache bytecode caching accelerator' },
      { name: 'pdo_mysql', enabled: true, category: 'Database', description: 'PHP Data Objects driver for MySQL' },
      { name: 'curl', enabled: true, category: 'Network', description: 'cURL library for HTTP requests' },
      { name: 'mbstring', enabled: true, category: 'Core', description: 'Multibyte string support' },
      { name: 'redis', enabled: true, category: 'Caching', description: 'PHP extension for interfacing with Redis' },
      { name: 'zip', enabled: true, category: 'Archiving', description: 'Zip archive reading and writing' },
    ],
    iniSettings: {
      memory_limit: '256M',
      upload_max_filesize: '32M',
      post_max_size: '32M',
      max_execution_time: 60,
      max_input_time: 60,
      display_errors: 'Off',
      'date.timezone': 'Asia/Kolkata',
    },
  },
  {
    version: '8.2',
    defaultForSystem: false,
    fpmStatus: 'running',
    fpmMaxChildren: 40,
    fpmStartServers: 8,
    fpmMinSpare: 4,
    fpmMaxSpare: 15,
    extensions: [
      { name: 'opcache', enabled: true, category: 'Performance', description: 'Zend OPcache bytecode caching accelerator' },
      { name: 'pdo_mysql', enabled: true, category: 'Database', description: 'PHP Data Objects driver for MySQL' },
      { name: 'gd', enabled: true, category: 'Media', description: 'Image generation and manipulation library' },
      { name: 'curl', enabled: true, category: 'Network', description: 'cURL library for HTTP requests' },
      { name: 'mbstring', enabled: true, category: 'Core', description: 'Multibyte string support' },
    ],
    iniSettings: {
      memory_limit: '256M',
      upload_max_filesize: '32M',
      post_max_size: '32M',
      max_execution_time: 90,
      max_input_time: 90,
      display_errors: 'Off',
      'date.timezone': 'Asia/Kolkata',
    },
  },
  {
    version: '7.4',
    defaultForSystem: false,
    fpmStatus: 'stopped',
    fpmMaxChildren: 20,
    fpmStartServers: 2,
    fpmMinSpare: 1,
    fpmMaxSpare: 5,
    extensions: [
      { name: 'pdo_mysql', enabled: true, category: 'Database', description: 'PHP Data Objects driver for MySQL' },
      { name: 'curl', enabled: true, category: 'Network', description: 'cURL library for HTTP requests' },
      { name: 'mbstring', enabled: true, category: 'Core', description: 'Multibyte string support' },
    ],
    iniSettings: {
      memory_limit: '128M',
      upload_max_filesize: '16M',
      post_max_size: '16M',
      max_execution_time: 30,
      max_input_time: 30,
      display_errors: 'Off',
      'date.timezone': 'Asia/Kolkata',
    },
  },
];

export const INITIAL_DATABASES: DatabaseRecord[] = [
  {
    id: 'db-1',
    name: 'sitindia_geeta_press_jhunjhunu',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 1.1,
    tableCount: 11,
    assignedUsers: ['sitindia_admin', 'sitindia_geetapress'],
    tables: [
      { name: 'wp_posts', rows: 482, sizeKB: 3200, engine: 'InnoDB' },
      { name: 'wp_postmeta', rows: 4210, sizeKB: 8400, engine: 'InnoDB' },
      { name: 'wp_users', rows: 14, sizeKB: 96, engine: 'InnoDB' },
      { name: 'wp_usermeta', rows: 198, sizeKB: 480, engine: 'InnoDB' },
      { name: 'wp_options', rows: 680, sizeKB: 1420, engine: 'InnoDB' },
      { name: 'wp_comments', rows: 120, sizeKB: 240, engine: 'InnoDB' },
      { name: 'wp_terms', rows: 54, sizeKB: 64, engine: 'InnoDB' },
      { name: 'wp_term_relationships', rows: 940, sizeKB: 320, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-2',
    name: 'sitindia_rentbizsitindia',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 1.4,
    tableCount: 14,
    assignedUsers: ['sitindia_rentbizuser', 'sitindia_admin'],
    tables: [
      { name: 'rent_properties', rows: 350, sizeKB: 1800, engine: 'InnoDB' },
      { name: 'rent_tenants', rows: 840, sizeKB: 2100, engine: 'InnoDB' },
      { name: 'rent_invoices', rows: 5200, sizeKB: 6400, engine: 'InnoDB' },
      { name: 'rent_agreements', rows: 410, sizeKB: 1200, engine: 'InnoDB' },
      { name: 'rent_payments', rows: 4900, sizeKB: 5800, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-3',
    name: 'sitindia_schools',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 1.2,
    tableCount: 13,
    assignedUsers: ['sitindia_schoolmgr', 'sitindia_admin'],
    tables: [
      { name: 'students', rows: 2400, sizeKB: 3400, engine: 'InnoDB' },
      { name: 'teachers', rows: 120, sizeKB: 320, engine: 'InnoDB' },
      { name: 'attendance', rows: 48000, sizeKB: 18400, engine: 'InnoDB' },
      { name: 'marks', rows: 32000, sizeKB: 12100, engine: 'InnoDB' },
      { name: 'fee_collections', rows: 14200, sizeKB: 8900, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-4',
    name: 'sitindia_serverhost',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 1.1,
    tableCount: 13,
    assignedUsers: ['sitindia_admin'],
    tables: [
      { name: 'servers', rows: 48, sizeKB: 120, engine: 'InnoDB' },
      { name: 'vps_nodes', rows: 180, sizeKB: 440, engine: 'InnoDB' },
      { name: 'ip_pools', rows: 1024, sizeKB: 820, engine: 'InnoDB' },
      { name: 'bandwidth_logs', rows: 98000, sizeKB: 34000, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-5',
    name: 'sitindia_smsbackupforce',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 1.6,
    tableCount: 16,
    assignedUsers: ['sitindia_smsuser', 'sitindia_admin'],
    tables: [
      { name: 'sms_messages', rows: 128000, sizeKB: 42000, engine: 'InnoDB' },
      { name: 'sms_contacts', rows: 14000, sizeKB: 5800, engine: 'InnoDB' },
      { name: 'sms_templates', rows: 85, sizeKB: 110, engine: 'InnoDB' },
      { name: 'sms_dispatch_queue', rows: 340, sizeKB: 290, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-6',
    name: 'sitindia_portal',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 84.6,
    tableCount: 28,
    assignedUsers: ['sitindia_admin', 'sitindia_app'],
    tables: [
      { name: 'users', rows: 4850, sizeKB: 2450, engine: 'InnoDB' },
      { name: 'posts', rows: 1240, sizeKB: 6800, engine: 'InnoDB' },
      { name: 'comments', rows: 18900, sizeKB: 14200, engine: 'InnoDB' },
      { name: 'options', rows: 350, sizeKB: 120, engine: 'InnoDB' },
      { name: 'audit_events', rows: 34200, sizeKB: 42100, engine: 'InnoDB' },
      { name: 'sessions', rows: 240, sizeKB: 80, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-7',
    name: 'sitindia_shop',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    sizeMB: 142.2,
    tableCount: 42,
    assignedUsers: ['sitindia_admin', 'sitindia_shopuser'],
    tables: [
      { name: 'orders', rows: 9200, sizeKB: 48200, engine: 'InnoDB' },
      { name: 'order_items', rows: 28400, sizeKB: 32100, engine: 'InnoDB' },
      { name: 'products', rows: 1540, sizeKB: 8900, engine: 'InnoDB' },
      { name: 'customers', rows: 6800, sizeKB: 12400, engine: 'InnoDB' },
      { name: 'payments', rows: 9150, sizeKB: 18400, engine: 'InnoDB' },
    ],
  },
  {
    id: 'db-8',
    name: 'sitindia_auth',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
    sizeMB: 12.8,
    tableCount: 8,
    assignedUsers: ['sitindia_admin'],
    tables: [
      { name: 'oauth_clients', rows: 14, sizeKB: 40, engine: 'InnoDB' },
      { name: 'oauth_tokens', rows: 840, sizeKB: 620, engine: 'InnoDB' },
      { name: '2fa_secrets', rows: 4200, sizeKB: 2400, engine: 'InnoDB' },
    ],
  },
];

export const INITIAL_DB_USERS: DatabaseUser[] = [
  {
    id: 'dbu-1',
    username: 'sitindia_admin',
    host: 'localhost',
    privileges: ['ALL PRIVILEGES'],
    createdAt: '2025-01-10',
    assignedDatabases: ['sitindia_geeta_press_jhunjhunu', 'sitindia_rentbizsitindia', 'sitindia_schools', 'sitindia_serverhost', 'sitindia_smsbackupforce', 'sitindia_portal', 'sitindia_shop', 'sitindia_auth'],
    grantOption: true,
  },
  {
    id: 'dbu-2',
    username: 'sitindia_geetapress',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'INDEX', 'ALTER', 'LOCK TABLES'],
    createdAt: '2025-02-14',
    assignedDatabases: ['sitindia_geeta_press_jhunjhunu'],
    grantOption: false,
  },
  {
    id: 'dbu-3',
    username: 'sitindia_rentbizuser',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER'],
    createdAt: '2025-03-01',
    assignedDatabases: ['sitindia_rentbizsitindia'],
    grantOption: false,
  },
  {
    id: 'dbu-4',
    username: 'sitindia_schoolmgr',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TEMPORARY TABLES'],
    createdAt: '2025-03-10',
    assignedDatabases: ['sitindia_schools'],
    grantOption: false,
  },
  {
    id: 'dbu-5',
    username: 'sitindia_smsuser',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE'],
    createdAt: '2025-04-05',
    assignedDatabases: ['sitindia_smsbackupforce'],
    grantOption: false,
  },
  {
    id: 'dbu-6',
    username: 'sitindia_app',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TEMPORARY TABLES'],
    createdAt: '2025-01-15',
    assignedDatabases: ['sitindia_portal'],
    grantOption: false,
  },
  {
    id: 'dbu-7',
    username: 'sitindia_shopuser',
    host: 'localhost',
    privileges: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
    createdAt: '2025-03-12',
    assignedDatabases: ['sitindia_shop'],
    grantOption: false,
  },
];

// Highlighting the 4 user requested email addresses
export const INITIAL_EMAIL_ACCOUNTS: EmailAccount[] = [
  {
    id: 'mail-1',
    email: 'admin@sitindia.in',
    username: 'admin',
    domain: 'sitindia.in',
    quotaMB: 5000,
    usedMB: 680,
    webmailEnabled: true,
    status: 'active',
    unreadCount: 3,
    createdAt: '2025-01-10',
    forwardTo: '',
    autoresponder: {
      enabled: false,
      subject: 'Out of Office - SIT India Admin',
      body: 'Thank you for reaching out to the admin department. We will get back to you within 24 hours.',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
    },
  },
  {
    id: 'mail-2',
    email: 'support@sitindia.in',
    username: 'support',
    domain: 'sitindia.in',
    quotaMB: 10000,
    usedMB: 2420,
    webmailEnabled: true,
    status: 'active',
    unreadCount: 12,
    createdAt: '2025-01-10',
    autoresponder: {
      enabled: true,
      subject: 'Ticket Received [SIT India Helpdesk]',
      body: 'Hello! Thank you for contacting SIT India Support. A representative will attend to your query shortly.',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    },
  },
  {
    id: 'mail-3',
    email: 'info@sitindia.in',
    username: 'info',
    domain: 'sitindia.in',
    quotaMB: 5000,
    usedMB: 410,
    webmailEnabled: true,
    status: 'active',
    unreadCount: 1,
    createdAt: '2025-01-10',
  },
  {
    id: 'mail-4',
    email: 'billing@sitindia.in',
    username: 'billing',
    domain: 'sitindia.in',
    quotaMB: 5000,
    usedMB: 890,
    webmailEnabled: true,
    status: 'active',
    unreadCount: 5,
    createdAt: '2025-01-10',
    forwardTo: 'finance-desk@sitindia.in',
  },
];

export const INITIAL_WEBMAIL_MESSAGES: WebmailMessage[] = [
  {
    id: 'msg-1',
    accountEmail: 'admin@sitindia.in',
    from: 'HostAdmin Security Daemon <security@hostadmin.internal>',
    to: 'admin@sitindia.in',
    subject: '[ALERT] AutoSSL Certificate Renewed for sitindia.in and subdomains',
    date: '2026-08-17 06:15 AM',
    snippet: 'The SSL certificate for sitindia.in, api.sitindia.in, and shop.sitindia.in has been successfully validated and re-issued for 90 days.',
    body: `Hello System Administrator,

This is an automated notification from HostAdmin Security Engine.
The Let's Encrypt wildcard & SAN SSL certificates have been re-issued automatically:

Domains Covered:
- sitindia.in (Apex)
- *.sitindia.in (Wildcard)
- api.sitindia.in
- shop.sitindia.in
- staging.sitindia.in

Issuer: Let's Encrypt Authority X3
Valid Until: 2026-11-20
Status: ACTIVE & ENFORCED WITH HTTP/2 + TLS 1.3

No further action is required from your side.`,
    folder: 'inbox',
    read: false,
    starred: true,
    hasAttachment: false,
  },
  {
    id: 'msg-2',
    accountEmail: 'support@sitindia.in',
    from: 'Rajesh Kumar <rajesh.k@clientcorp.in>',
    to: 'support@sitindia.in',
    subject: 'Inquiry regarding Cloud API Integration & Webhooks',
    date: '2026-08-17 07:10 AM',
    snippet: 'Hi Support Team, We are testing the api.sitindia.in REST endpoints and had a quick question regarding the authentication bearer token refresh rate.',
    body: `Dear SIT India Support,

We are currently integrating with your high-throughput API gateway at https://api.sitindia.in/v1.

Could you please confirm:
1. Is the rate limit 10,000 requests per minute per API key?
2. Does the webhook retry policy use exponential backoff?

Looking forward to your swift response.

Best regards,
Rajesh Kumar
Lead Architect, ClientCorp Tech`,
    folder: 'inbox',
    read: false,
    starred: true,
    hasAttachment: true,
    attachments: [
      { name: 'api-integration-spec.pdf', size: '420 KB', type: 'application/pdf' },
    ],
  },
  {
    id: 'msg-3',
    accountEmail: 'billing@sitindia.in',
    from: 'AWS Cloud Billing <no-reply@amazon.com>',
    to: 'billing@sitindia.in',
    subject: 'Monthly Cloud Infrastructure Tax Invoice #INV-2026-08',
    date: '2026-08-16 11:45 PM',
    snippet: 'Your monthly cloud computing & object storage invoice for August 2026 is ready for review.',
    body: `Greetings SIT India Finance,

Your payment for August 2026 Cloud Hosting & High-Speed Bandwidth Allocation has been processed successfully.
Amount: ₹24,500 INR
Payment Method: Corporate HDFC Credit Card (Ending 4092)

Attached is your official GST tax invoice.`,
    folder: 'inbox',
    read: true,
    starred: false,
    hasAttachment: true,
    attachments: [
      { name: 'Invoice_AUG_2026.pdf', size: '185 KB', type: 'application/pdf' },
    ],
  },
  {
    id: 'msg-4',
    accountEmail: 'info@sitindia.in',
    from: 'Pooja Sharma <pooja@innovatehub.org>',
    to: 'info@sitindia.in',
    subject: 'Partnership Proposal - Digital India Tech Summit 2026',
    date: '2026-08-15 04:30 PM',
    snippet: 'We would love to invite SIT India as our official cloud hosting partner for the upcoming annual technology conference.',
    body: `Hi Team SIT India,

InnovateHub is organizing the National Tech Summit next month in Bengaluru. We would be thrilled to feature SIT India as our Cloud Infrastructure Partner.

Please let us know who we can connect with to discuss sponsorship perks.

Warm regards,
Pooja Sharma`,
    folder: 'inbox',
    read: true,
    starred: false,
  },
];

export const INITIAL_DNS_RECORDS: DnsRecord[] = [
  { id: 'dns-1', domain: 'sitindia.in', name: '@', type: 'A', value: '103.21.14.88', ttl: 3600 },
  { id: 'dns-2', domain: 'sitindia.in', name: 'www', type: 'CNAME', value: 'sitindia.in', ttl: 3600 },
  { id: 'dns-3', domain: 'sitindia.in', name: 'api', type: 'A', value: '103.21.14.88', ttl: 1800 },
  { id: 'dns-4', domain: 'sitindia.in', name: 'shop', type: 'A', value: '103.21.14.88', ttl: 1800 },
  { id: 'dns-5', domain: 'sitindia.in', name: 'staging', type: 'A', value: '103.21.14.92', ttl: 300 },
  { id: 'dns-6', domain: 'sitindia.in', name: 'mail', type: 'A', value: '103.21.14.88', ttl: 3600 },
  { id: 'dns-7', domain: 'sitindia.in', name: '@', type: 'MX', value: 'mail.sitindia.in', ttl: 3600, priority: 10 },
  { id: 'dns-8', domain: 'sitindia.in', name: '@', type: 'TXT', value: 'v=spf1 ip4:103.21.14.88 +a +mx ~all', ttl: 3600 },
  { id: 'dns-9', domain: 'sitindia.in', name: 'default._domainkey', type: 'TXT', value: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyv...', ttl: 3600 },
  { id: 'dns-10', domain: 'sitindia.in', name: '_dmarc', type: 'TXT', value: 'v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:dmarc-reports@sitindia.in', ttl: 3600 },
  { id: 'dns-11', domain: 'sitindia.in', name: '@', type: 'NS', value: 'ns1.hostadmin-dns.com', ttl: 86400 },
  { id: 'dns-12', domain: 'sitindia.in', name: '@', type: 'NS', value: 'ns2.hostadmin-dns.com', ttl: 86400 },
];

export const INITIAL_SSL_CERTS: SslCertificate[] = [
  {
    id: 'ssl-1',
    domain: 'sitindia.in',
    issuer: "Let's Encrypt Authority X3",
    issuedAt: '2026-08-17',
    expiresAt: '2026-11-20',
    type: "Let's Encrypt",
    autoRenew: true,
    domainsCovered: ['sitindia.in', '*.sitindia.in', 'api.sitindia.in', 'shop.sitindia.in', 'staging.sitindia.in'],
    status: 'valid',
  },
  {
    id: 'ssl-2',
    domain: 'shop.sitindia.in',
    issuer: 'DigiCert Global Root G2',
    issuedAt: '2025-10-15',
    expiresAt: '2026-10-15',
    type: 'Custom',
    autoRenew: false,
    domainsCovered: ['shop.sitindia.in', 'secure-checkout.sitindia.in'],
    status: 'valid',
  },
];

export const INITIAL_IP_BLOCKS: IpBlockRule[] = [
  {
    id: 'ip-1',
    ipOrRange: '185.220.101.5',
    reason: 'Repeated failed SSH login attempts (Fail2Ban)',
    blockedAt: '2026-08-16 22:14:00',
    expiresAt: '2026-08-23 22:14:00',
    status: 'active',
  },
  {
    id: 'ip-2',
    ipOrRange: '45.154.255.0/24',
    reason: 'Malicious SQL injection probe on /api endpoint',
    blockedAt: '2026-08-15 14:05:00',
    expiresAt: 'Permanent',
    status: 'active',
  },
  {
    id: 'ip-3',
    ipOrRange: '194.26.29.112',
    reason: 'Spam relay probe on port 25 (Postfix)',
    blockedAt: '2026-08-14 03:19:00',
    expiresAt: '2026-08-21 03:19:00',
    status: 'active',
  },
];

export const INITIAL_SERVICES: ServerService[] = [
  { name: 'nginx', displayName: 'Nginx Web Server', status: 'running', port: '80, 443', memoryMB: 184, cpuPercent: 3.2, uptime: '48 days, 12 hrs' },
  { name: 'apache2', displayName: 'Apache HTTP Server (Backend)', status: 'running', port: '8080', memoryMB: 312, cpuPercent: 4.8, uptime: '48 days, 12 hrs' },
  { name: 'php-fpm83', displayName: 'PHP 8.3 FastCGI Process Manager', status: 'running', port: 'unix socket', memoryMB: 480, cpuPercent: 6.5, uptime: '12 days, 4 hrs' },
  { name: 'mysql', displayName: 'MariaDB / MySQL Database Server', status: 'running', port: '3306', memoryMB: 940, cpuPercent: 5.1, uptime: '48 days, 12 hrs' },
  { name: 'redis', displayName: 'Redis Memory Cache Server', status: 'running', port: '6379', memoryMB: 210, cpuPercent: 1.2, uptime: '30 days, 18 hrs' },
  { name: 'postfix', displayName: 'Postfix Mail Transfer Agent (SMTP)', status: 'running', port: '25, 465, 587', memoryMB: 95, cpuPercent: 0.8, uptime: '48 days, 12 hrs' },
  { name: 'dovecot', displayName: 'Dovecot Secure IMAP / POP3 Server', status: 'running', port: '993, 995', memoryMB: 115, cpuPercent: 0.6, uptime: '48 days, 12 hrs' },
  { name: 'named', displayName: 'BIND9 DNS Name Daemon', status: 'running', port: '53', memoryMB: 85, cpuPercent: 0.4, uptime: '48 days, 12 hrs' },
  { name: 'fail2ban', displayName: 'Fail2ban Intrusion Prevention', status: 'running', port: '-', memoryMB: 64, cpuPercent: 0.2, uptime: '48 days, 12 hrs' },
];

export const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'plg-phpmyadmin',
    name: 'phpMyAdmin Database Manager',
    category: 'Database',
    description: 'Full-featured web interface to manage MySQL & MariaDB databases, run SQL queries, import/export dumps, and edit schemas.',
    version: '5.2.2',
    author: 'phpMyAdmin Devel Team',
    icon: 'Database',
    installed: true,
    active: true,
    rating: 5.0,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    dependencies: [
      { name: 'php8.3-mbstring', version: '>=8.3.0', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-zip', version: '>=1.19', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-gd', version: '>=8.3.0', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'mariadb-client', version: '>=10.11', type: 'system', installed: true, autoResolvable: true },
    ],
    oneClickConfigPath: '/etc/phpmyadmin/config.inc.php',
  },
  {
    id: 'plg-phpmailer',
    name: 'PHPMailer Pro Suite & SMTP Diagnostic',
    category: 'Email',
    description: 'Industry standard PHP email sending library with SMTP auth, SSL/TLS, DKIM signing, HTML templates, and test simulator.',
    version: '6.9.1',
    author: 'Marcus Bointon & PHPMailer Community',
    icon: 'Mail',
    installed: true,
    active: true,
    rating: 5.0,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    dependencies: [
      { name: 'php8.3-openssl', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-intl', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'composer/phpmailer', version: '^6.9', type: 'composer', installed: true, autoResolvable: true },
      { name: 'postfix-mta', version: '>=3.7', type: 'service', installed: true, autoResolvable: true },
    ],
    oneClickConfigPath: '/home/sitindia/public_html/vendor/phpmailer',
  },
  {
    id: 'plg-roundcube',
    name: 'Roundcube Webmail Client',
    category: 'Email',
    description: 'Browser-based multilingual IMAP email client with rich MIME support, address book, search, and spell-checking.',
    version: '1.6.8',
    author: 'Roundcube Community',
    icon: 'Inbox',
    installed: true,
    active: true,
    rating: 4.9,
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    dependencies: [
      { name: 'php8.3-imap', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-intl', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'dovecot-imapd', version: '>=2.3', type: 'service', installed: true, autoResolvable: true },
      { name: 'sqlite3', version: '>=3.40', type: 'system', installed: true, autoResolvable: true },
    ],
  },
  {
    id: 'plg-1',
    name: 'WordPress Toolkit Pro',
    category: 'CMS',
    description: '1-click WordPress install, staging clone, auto-updates, security hardening & plugin sandbox.',
    version: '6.6.1',
    author: 'HostAdmin Engineering',
    icon: 'Globe',
    installed: true,
    active: true,
    rating: 4.9,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    dependencies: [
      { name: 'php8.3-mysqlnd', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-curl', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'php8.3-xml', version: '>=8.3', type: 'php-extension', installed: true, autoResolvable: true },
      { name: 'wp-cli', version: '>=2.10', type: 'system', installed: true, autoResolvable: true },
    ],
  },
  {
    id: 'plg-2',
    name: 'Redis Object Cache Manager',
    category: 'Caching',
    description: 'Lightning-fast in-memory caching for database queries and page micro-caching.',
    version: '2.4.0',
    author: 'Redis Labs Partner',
    icon: 'Zap',
    installed: true,
    active: true,
    rating: 4.8,
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    dependencies: [
      { name: 'redis-server', version: '>=7.2', type: 'service', installed: true, autoResolvable: true },
      { name: 'php8.3-redis', version: '>=6.0', type: 'php-extension', installed: true, autoResolvable: true },
    ],
  },
  {
    id: 'plg-3',
    name: 'Node.js & Python WSGI Manager',
    category: 'DevOps',
    description: 'Run Express, Next.js, Django, and FastAPI apps seamlessly with automatic reverse proxy.',
    version: '3.1.5',
    author: 'CloudStack Devs',
    icon: 'Terminal',
    installed: true,
    active: true,
    rating: 4.7,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dependencies: [
      { name: 'nodejs', version: '>=20.x', type: 'system', installed: true, autoResolvable: true },
      { name: 'npm', version: '>=10.x', type: 'system', installed: true, autoResolvable: true },
      { name: 'python3-venv', version: '>=3.11', type: 'system', installed: true, autoResolvable: true },
    ],
  },
  {
    id: 'plg-4',
    name: 'Cloudflare Edge Accelerator',
    category: 'Security',
    description: 'Direct DNS sync, 1-click APO cache purging, DDoS mitigation & SSL full-strict proxy.',
    version: '1.9.8',
    author: 'Cloudflare Integration',
    icon: 'ShieldCheck',
    installed: true,
    active: true,
    rating: 4.9,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    dependencies: [
      { name: 'curl', version: '>=7.88', type: 'system', installed: true, autoResolvable: true },
    ],
  },
  {
    id: 'plg-5',
    name: 'Docker & Container Engine',
    category: 'DevOps',
    description: 'Deploy isolated Docker containers, microservices, and custom database instances with UI.',
    version: '2.2.0',
    author: 'ContainerCore',
    icon: 'Cpu',
    installed: false,
    active: false,
    rating: 4.6,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    dependencies: [
      { name: 'docker-ce', version: '>=26.1', type: 'system', installed: false, autoResolvable: true },
      { name: 'containerd.io', version: '>=1.7', type: 'system', installed: false, autoResolvable: true },
      { name: 'docker-compose-plugin', version: '>=2.27', type: 'system', installed: false, autoResolvable: true },
    ],
  },
  {
    id: 'plg-6',
    name: 'Automated S3 & Google Drive Backup Sync',
    category: 'Storage',
    description: 'Stream compressed hourly and daily server snapshots directly to encrypted cloud buckets.',
    version: '3.0.1',
    author: 'HostAdmin Storage',
    icon: 'HardDrive',
    installed: true,
    active: true,
    rating: 5.0,
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    dependencies: [
      { name: 'awscli', version: '>=2.15', type: 'system', installed: true, autoResolvable: true },
      { name: 'rclone', version: '>=1.66', type: 'system', installed: true, autoResolvable: true },
    ],
  },
];

export const INITIAL_SYSTEM_VERSION = {
  currentVersion: '2.4.1',
  latestVersion: '2.5.0',
  releaseDate: '2026-08-15',
  hasUpdate: true,
  changelog: [
    {
      version: '2.5.0 Enterprise',
      date: '2026-08-15',
      items: [
        'Added 1-Click PHPMailer Pro integration with interactive SMTP debugging test suite',
        'Integrated 1-Click phpMyAdmin 5.2.2 web database manager with live SQL console',
        'Automatic dependency resolution engine for all plugins, packages, and system upgrades',
        'Multi-color light aesthetic with Mango Gold, Royal Purple, Rose Pink, and Ruby Red accents',
        'AutoSSL v3 engine with zero-downtime certificate renewal & Wildcard SAN verification',
        'PHP 8.4 JIT compiler optimizations and enhanced FastCGI cache purging',
      ],
    },
    {
      version: '2.4.1 (Current)',
      date: '2026-06-20',
      items: [
        'Enhanced File Manager permissions and zip archive extraction',
        'Added ModSecurity CRS v3.3 ruleset with real-time attack anomaly detection',
        'Improved DNS zone records editor with auto-propagation checker',
      ],
    },
  ],
  requiredDependencies: [
    { name: 'libssl3-dev', version: '3.0.2', status: 'ok' as const },
    { name: 'systemd-sysv', version: '252.19', status: 'ok' as const },
    { name: 'mariadb-client-core', version: '10.11.8', status: 'ok' as const },
    { name: 'php8.4-fpm', version: '8.4.0-rc1', status: 'needs_update' as const },
    { name: 'composer-bin', version: '2.7.7', status: 'ok' as const },
  ],
  isUpdating: false,
  updateProgress: 0,
  updateLog: [],
};

export const INITIAL_BACKUP_SCHEDULES: BackupSchedule[] = [
  {
    id: 'sch-1',
    name: 'Daily SIT India Full Backup',
    frequency: 'daily',
    cronExpression: '0 3 * * *',
    time: '03:00 AM IST',
    destination: 'AWS S3',
    scope: 'Full Account',
    retentionCopies: 7,
    lastRun: '2026-08-17 03:00 AM',
    nextRun: '2026-08-18 03:00 AM',
    status: 'active',
  },
  {
    id: 'sch-2',
    name: 'Hourly MySQL Transaction Snapshots',
    frequency: 'custom',
    cronExpression: '0 * * * *',
    time: 'Every hour',
    destination: 'Local Disk',
    scope: 'MySQL Databases',
    retentionCopies: 24,
    lastRun: '2026-08-17 07:00 AM',
    nextRun: '2026-08-17 08:00 AM',
    status: 'active',
  },
  {
    id: 'sch-3',
    name: 'Weekly Homedir Offsite SFTP Sync',
    frequency: 'weekly',
    cronExpression: '0 2 * * 0',
    time: 'Sundays at 02:00 AM',
    destination: 'Remote SFTP',
    scope: 'Homedir Files',
    retentionCopies: 4,
    lastRun: '2026-08-16 02:00 AM',
    nextRun: '2026-08-23 02:00 AM',
    status: 'active',
  },
];

export const INITIAL_BACKUP_ARCHIVES: BackupArchive[] = [
  {
    id: 'arc-1',
    filename: 'backup-sitindia_full-2026-08-17-0300.tar.gz',
    createdAt: '2026-08-17 03:14 AM',
    sizeMB: 2420,
    scope: 'Full Account',
    destination: 'AWS S3 (s3://sitindia-backups/daily)',
    status: 'completed',
  },
  {
    id: 'arc-2',
    filename: 'backup-sitindia_db-2026-08-17-0700.sql.gz',
    createdAt: '2026-08-17 07:02 AM',
    sizeMB: 48.4,
    scope: 'MySQL Databases',
    destination: 'Local Disk (/home/sitindia/backups)',
    status: 'completed',
  },
  {
    id: 'arc-3',
    filename: 'backup-sitindia_full-2026-08-16-0300.tar.gz',
    createdAt: '2026-08-16 03:12 AM',
    sizeMB: 2390,
    scope: 'Full Account',
    destination: 'AWS S3 (s3://sitindia-backups/daily)',
    status: 'completed',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-17 07:40:15',
    adminUser: 'superadmin',
    action: 'Renewed SSL Certificate',
    category: 'Security',
    severity: 'info',
    ipAddress: '103.21.14.88',
    details: "AutoSSL validation verified DNS tokens and updated CRT for sitindia.in and *.sitindia.in",
  },
  {
    id: 'log-2',
    timestamp: '2026-08-17 07:15:20',
    adminUser: 'superadmin',
    action: 'Modified PHP 8.3 FPM Pool Settings',
    category: 'System',
    severity: 'info',
    ipAddress: '103.21.14.88',
    details: 'Increased pm.max_children from 40 to 50 for handling surge traffic on api.sitindia.in',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-17 06:30:10',
    adminUser: 'system_daemon',
    action: 'Automated Daily Backup Complete',
    category: 'System',
    severity: 'info',
    ipAddress: '127.0.0.1',
    details: 'Uploaded 2.42 GB encrypted archive to AWS S3 bucket sitindia-backups',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-16 22:14:02',
    adminUser: 'fail2ban',
    action: 'IP 185.220.101.5 Blocked',
    category: 'Security',
    severity: 'warning',
    ipAddress: '185.220.101.5',
    details: 'Triggered 5 failed password attempts on SSH Port 22 within 60 seconds.',
  },
  {
    id: 'log-5',
    timestamp: '2026-08-16 18:22:45',
    adminUser: 'superadmin',
    action: 'Created Email Account billing@sitindia.in',
    category: 'Email',
    severity: 'info',
    ipAddress: '103.21.14.88',
    details: 'Allocated 5000 MB mailbox quota, enabled Webmail & DKIM signature.',
  },
  {
    id: 'log-6',
    timestamp: '2026-08-16 15:40:12',
    adminUser: 'superadmin',
    action: 'Database sitindia_shop Optimized',
    category: 'Database',
    severity: 'info',
    ipAddress: '103.21.14.88',
    details: 'Ran OPTIMIZE TABLE on `orders` and `order_items`. Reclaimed 14.2 MB disk space.',
  },
  {
    id: 'log-7',
    timestamp: '2026-08-15 14:05:30',
    adminUser: 'mod_security',
    action: 'WAF Rule 942100 Triggered (SQLi)',
    category: 'Security',
    severity: 'critical',
    ipAddress: '45.154.255.18',
    details: 'Blocked malicious UNION SELECT payload targeting /api/v1.php query parameters.',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-admin-1',
  name: 'Ashok Mahala',
  email: 'amahala1@gmail.com',
  username: 'superadmin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Chief Infrastructure Officer & Full-Stack System Administrator managing SIT India enterprise servers, high-availability clusters, and cloud databases.',
  role: 'Super Administrator',
  language: 'English (US)',
  timezone: 'Asia/Kolkata (IST, UTC+5:30)',
  twoFactorEnabled: true,
  sessionTimeoutMinutes: 30,
  themePreference: 'dark',
  fontSizePreference: 'md',
  hapticFeedback: true,
  screenReaderOptimized: false,
  lastLogin: '2026-08-17 07:44 AM IST',
  loginIp: '103.21.14.88 (New Delhi, IN)',
};
