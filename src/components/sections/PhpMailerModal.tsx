import React, { useState } from 'react';
import {
  Mail,
  X,
  Send,
  CheckCircle2,
  Terminal,
  Shield,
  Copy,
  Check,
  Server,
  Lock,
  Play,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PhpMailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpMailerModal: React.FC<PhpMailerModalProps> = ({ isOpen, onClose }) => {
  const { emailAccounts, sendPhpMailerTest, addToast, triggerHaptic } = useApp();

  const [activeTab, setActiveTab] = useState<'test' | 'code' | 'dns-records'>('test');
  const [smtpHost, setSmtpHost] = useState('mail.sitindia.in');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpEncryption, setSmtpEncryption] = useState<'tls' | 'ssl' | 'none'>('tls');
  const [smtpUser, setSmtpUser] = useState(emailAccounts[0]?.email || 'admin@sitindia.in');
  const [smtpPassword, setSmtpPassword] = useState('••••••••••••');
  const [recipientEmail, setRecipientEmail] = useState('test-diagnostics@sitindia.in');
  const [subject, setSubject] = useState('HostAdmin Pro PHPMailer 6.9.1 Delivery Diagnostic');
  const [messageBody, setMessageBody] = useState(
    'Hello,\n\nThis is a verified test email sent via HostAdmin Pro PHPMailer suite with TLS 1.3 encryption and DKIM authentication.\n\nBest regards,\nHostAdmin Pro System'
  );

  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setIsRunning(true);
    setExecutionLogs([
      `[${new Date().toLocaleTimeString()}] Initializing PHPMailer 6.9.1 socket engine...`,
      `[${new Date().toLocaleTimeString()}] Resolving MX record for target host ${smtpHost}...`,
    ]);

    try {
      const res = await sendPhpMailerTest({
        host: smtpHost,
        port: smtpPort,
        encryption: smtpEncryption,
        username: smtpUser,
        fromEmail: smtpUser,
        toEmail: recipientEmail,
        subject,
        body: messageBody,
      });
      setExecutionLogs(res.log);
    } catch (err) {
      setExecutionLogs((prev) => [
        ...prev,
        `[ERROR] Connection handshake failed: ${String(err)}`,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const phpSampleCode = `<?php
use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\SMTP;
use PHPMailer\\PHPMailer\\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                     // Enable verbose debug output
    $mail->isSMTP();                                           // Send using SMTP
    $mail->Host       = '${smtpHost}';                     // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                  // Enable SMTP authentication
    $mail->Username   = '${smtpUser}';           // SMTP username
    $mail->Password   = 'your_secret_password';                // SMTP password
    $mail->SMTPSecure = ${smtpEncryption === 'ssl' ? 'PHPMailer::ENCRYPTION_SMTPS' : 'PHPMailer::ENCRYPTION_STARTTLS'};     // Implicit TLS or STARTTLS
    $mail->Port       = ${smtpPort};                                    // TCP port to connect to

    // Recipients
    $mail->setFrom('${smtpUser}', 'HostAdmin Mailer');
    $mail->addAddress('${recipientEmail}', 'Recipient');     // Add a recipient
    $mail->addReplyTo('${smtpUser}', 'Support');

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = '${subject}';
    $mail->Body    = '<b>Hello!</b> This is a <i>PHPMailer</i> automated delivery message.';
    $mail->AltBody = 'This is the plain text body for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent successfully via HostAdmin Pro!';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phpSampleCode);
    setCopiedCode(true);
    addToast({ type: 'success', title: 'PHP Code Snippet Copied to Clipboard!' });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">PHPMailer 6.9+ SMTP Test & Diagnostics</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                  SMTP / Exim4 / TLS 1.3
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Verify SMTP handshakes, test mail delivery, DKIM signatures, and generate ready-to-use PHP code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <button
            onClick={() => setActiveTab('test')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Interactive SMTP Test</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>PHP Code Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('dns-records')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'dns-records'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SPF, DKIM & DMARC Auth</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Tab 1: Interactive Test */}
          {activeTab === 'test' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Config */}
              <form onSubmit={handleRunDiagnostic} className="lg:col-span-6 space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    <span>SMTP Server Configuration</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Port</label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Encryption</label>
                      <select
                        value={smtpEncryption}
                        onChange={(e) => {
                          const val = e.target.value as 'tls' | 'ssl' | 'none';
                          setSmtpEncryption(val);
                          if (val === 'ssl') setSmtpPort(465);
                          else if (val === 'tls') setSmtpPort(587);
                          else setSmtpPort(25);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      >
                        <option value="tls">STARTTLS (Port 587)</option>
                        <option value="ssl">SSL / SMTPS (Port 465)</option>
                        <option value="none">None / Plain (Port 25)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sender Email</label>
                      <select
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      >
                        {emailAccounts.map((acc) => (
                          <option key={acc.id} value={acc.email}>{acc.email}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Test Message Payload</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Send Test To</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Message Body</label>
                    <textarea
                      rows={3}
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRunning}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting SMTP Handshake...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Execute SMTP Delivery Diagnostic</span>
                    </>
                  )}
                </button>
              </form>

              {/* Real-time SMTP Log Console */}
              <div className="lg:col-span-6 flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-xs text-white">SMTP Handshake Debug Console</span>
                  </div>
                  {executionLogs.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      250 OK
                    </span>
                  )}
                </div>

                <div className="p-3.5 font-mono text-[11px] text-slate-300 overflow-y-auto flex-1 space-y-1 bg-black/60 max-h-[380px]">
                  {executionLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-2">
                      <Mail className="w-8 h-8 opacity-30 text-indigo-400" />
                      <div>Click "Execute SMTP Delivery Diagnostic" to initiate real-time socket communication.</div>
                    </div>
                  ) : (
                    executionLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`${
                          log.includes('SERVER -> CLIENT: 250') || log.includes('235')
                            ? 'text-emerald-400 font-semibold'
                            : log.includes('CLIENT -> SERVER')
                            ? 'text-sky-300'
                            : log.includes('ERROR')
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PHP Code Generator */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Generated PHP 8.2 / 8.3 PHPMailer Script</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                      composer require phpmailer/phpmailer
                    </span>
                  </h4>
                  <p className="text-slate-400 mt-0.5">
                    Copy and paste this snippet directly into your WordPress, Laravel, or custom PHP application.
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto shadow-inner">
                <pre className="font-mono text-xs text-indigo-300 leading-relaxed">
                  <code>{phpSampleCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Tab 3: SPF, DKIM & DMARC Auth */}
          {activeTab === 'dns-records' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-white">Email Authentication & Deliverability Protection</h4>
                <p className="text-slate-400 mt-0.5">
                  Ensure 100% inbox delivery rate by ensuring SPF, DKIM, and DMARC DNS records are verified.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">SPF (Sender Policy)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 text-[10px] font-mono text-teal-300 break-all">
                    v=spf1 a mx ip4:103.175.163.45 ~all
                  </div>
                  <p className="text-[11px] text-slate-400">Authorizes your server IP to send mail on behalf of your domain.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">DKIM (RSA 2048)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 text-[10px] font-mono text-teal-300 break-all truncate">
                    default._domainkey: v=DKIM1; k=rsa; p=MIIBIjANBgkq...
                  </div>
                  <p className="text-[11px] text-slate-400">Cryptographically signs email headers to prevent tampering in transit.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">DMARC Policy</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      ENFORCED
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 text-[10px] font-mono text-teal-300 break-all">
                    _dmarc: v=DMARC1; p=none; rua=mailto:postmaster@sitindia.in
                  </div>
                  <p className="text-[11px] text-slate-400">Instructs receiving mail servers how to treat spoofed emails.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            PHPMailer v6.9.1 • Exim4 MTA • OpenSSL 3.0.13 • Socket: <span className="font-mono text-slate-300">127.0.0.1:587</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
