import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { CommandPalette } from './components/CommandPalette';
import { AccessibilityAnnouncer, ToastContainer } from './components/AccessibilityAnnouncer';
import { VpsInstallerModal } from './components/modals/VpsInstallerModal';
import { LiveSshTerminalModal } from './components/modals/LiveSshTerminalModal';
import { RoundcubeWebmailSection } from './components/sections/RoundcubeWebmailSection';
import { PhpMyAdminSection } from './components/sections/PhpMyAdminModal';
import { DashboardOverview } from './components/sections/DashboardOverview';
import { WebsitesSection } from './components/sections/WebsitesSection';
import { FileManagerSection } from './components/sections/FileManagerSection';
import { PhpManagerSection } from './components/sections/PhpManagerSection';
import { DatabaseSection } from './components/sections/DatabaseSection';
import { SslSecuritySection } from './components/sections/SslSecuritySection';
import { EmailHostingSection } from './components/sections/EmailHostingSection';
import { RealDnsEditorSection } from './components/sections/RealDnsEditorSection';
import { ServerMetricsSection } from './components/sections/ServerMetricsSection';
import { TerminalSection } from './components/sections/TerminalSection';
import { BackupsSection } from './components/sections/BackupsSection';
import { PluginsSection } from './components/sections/PluginsSection';
import { AuditLogsSection } from './components/sections/AuditLogsSection';
import { ApiDocsSection } from './components/sections/ApiDocsSection';
import { ProfileSettingsSection } from './components/sections/ProfileSettingsSection';
import { WebsiteHostingWorkspace } from './components/sections/WebsiteHostingWorkspace';
import { UserPanelSection } from './components/sections/UserPanelSection';
import { UserManagementSection } from './components/sections/UserManagementSection';
import { ResellerPortalSection } from './components/sections/ResellerPortalSection';
import './styles/modern-ui.css';
import './styles/modern-ui-domain.css';

const MainContent: React.FC = () => {
  const { isAuthenticated, isAuthRestoring, activeSection, vpsInstallerModalOpen, setVpsInstallerModalOpen, fontSize } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (isAuthRestoring) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FD] text-slate-700">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          Restoring secure session...
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <LoginPage />;
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return <WebsiteHostingWorkspace />;
      case 'user-panel': return <UserPanelSection />;
      case 'users-manager': return <UserManagementSection />;
      case 'reseller-portal': return <ResellerPortalSection />;
      case 'websites': return <WebsitesSection />;
      case 'file-manager': return <FileManagerSection />;
      case 'php-manager': return <PhpManagerSection />;
      case 'databases': return <DatabaseSection />;
      case 'phpmyadmin': return <PhpMyAdminSection />;
      case 'ssl-security': return <SslSecuritySection />;
      case 'email': return <EmailHostingSection />;
      case 'roundcube': return <RoundcubeWebmailSection />;
      case 'dns':
      case 'dns-editor': return <RealDnsEditorSection />;
      case 'metrics': return <ServerMetricsSection />;
      case 'terminal': return <TerminalSection />;
      case 'backups': return <BackupsSection />;
      case 'plugins': return <PluginsSection />;
      case 'audit-logs': return <AuditLogsSection />;
      case 'api-docs': return <ApiDocsSection />;
      case 'profile':
      case 'profile-settings':
      case 'settings': return <ProfileSettingsSection />;
      default: return <WebsitesSection />;
    }
  };
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };
  return (
    <div className={`min-h-screen bg-[#F5F7FB] text-slate-900 ${getFontSizeClass()} flex antialiased ha-app-shell`}>
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300">
        <Header onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto ha-main-content">
          {renderActiveSection()}
        </main>
      </div>
      <VpsInstallerModal isOpen={vpsInstallerModalOpen} onClose={() => setVpsInstallerModalOpen(false)} />
      <LiveSshTerminalModal />
      <CommandPalette />
      <AccessibilityAnnouncer />
      <ToastContainer />
    </div>
  );
};

export default function App() { return <AppProvider><MainContent /></AppProvider>; }
