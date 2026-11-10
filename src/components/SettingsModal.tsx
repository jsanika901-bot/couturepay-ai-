import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
  Database,
  Building,
  DollarSign,
} from 'lucide-react';
import type { SystemStatus, DesignerProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus | null;
  profile: DesignerProfile | null;
  onUpdateProfile: (updated: Partial<DesignerProfile>) => Promise<void>;
  onResetDemoData: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
  profile,
  onUpdateProfile,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

  const [atelierName, setAtelierName] = useState(profile?.atelierName || 'Atelier Vivienne Laurent');
  const [designerName, setDesignerName] = useState(profile?.designerName || 'Vivienne Laurent');
  const [email, setEmail] = useState(profile?.email || 'vivienne@atelierlaurent.couture');
  const [location, setLocation] = useState(profile?.location || '8 Rue de la Paix, 75002 Paris');
  const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'EUR' | 'GBP'>(
    profile?.defaultCurrency || 'USD'
  );
  const [defaultRevisionPolicy, setDefaultRevisionPolicy] = useState(
    profile?.defaultRevisionPolicy ||
      '2 rounds of silhouette refinement included. Additional revisions billed at atelier hourly rate ($180/hr).'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateProfile({
        atelierName,
        designerName,
        email,
        location,
        defaultCurrency,
        defaultRevisionPolicy,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        'Reset database to initial curated couture commissions? This will restore the 6 showcase projects and atelier profile.'
      )
    ) {
      setIsResetting(true);
      try {
        await onResetDemoData();
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const copyEnvSample = () => {
    const text = `# COUTUREPAY AI CONFIGURATION
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
PAYPAL_CLIENT_ID="your-paypal-sandbox-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-sandbox-client-secret"
PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0A0A0C] border border-[#22222B] shadow-2xl my-6 text-[#F5F0E6] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22222B] bg-[#101014] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#F5F0E6]">
              Atelier Settings & Integrations
            </h2>
            <p className="text-xs text-[#E8E2D5]/60">
              Manage designer studio profile, Gemini AI, and PayPal Sandbox connectivity
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#E8E2D5]/60 hover:text-[#F5F0E6] hover:bg-[#16161C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Atelier profile preferences saved successfully.</span>
            </div>
          )}

          {/* Section 1: System Integrations Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              1. System Status & Integrations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Gemini AI Status Card */}
              <div className="p-4 rounded-xl bg-[#101014] border border-[#22222B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Engine</span>
                  </div>
                  {systemStatus?.geminiAvailable ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/50 text-[#E5C378] border border-amber-800/40">
                      DEMO MODE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#E8E2D5]/70">
                  Model: <span className="text-[#F5F0E6]">gemini-3.8-flash</span>
                </div>
                <p className="text-[11px] text-[#E8E2D5]/60 font-light">
                  {systemStatus?.geminiAvailable
                    ? 'Connected via server-side @google/genai SDK. Real-time couture quotation generation enabled.'
                    : 'GEMINI_API_KEY not configured. High-fidelity demo quotations will be generated with clear DEMO labels.'}
                </p>
              </div>

              {/* PayPal Sandbox Status Card */}
              <div className="p-4 rounded-xl bg-[#101014] border border-[#22222B] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>PayPal Sandbox</span>
                  </div>
                  {systemStatus?.paypalConnected ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                      CONNECTED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/50 text-blue-300 border border-blue-800/40">
                      TEST SIMULATOR
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#E8E2D5]/70">
                  Environment: <span className="text-amber-400">SANDBOX ONLY</span>
                </div>
                <p className="text-[11px] text-[#E8E2D5]/60 font-light">
                  {systemStatus?.paypalConnected
                    ? 'Official PayPal Orders API active. Live sandbox orders created and captured on server.'
                    : 'Sandbox credentials missing in .env. Test Simulator fallback active for end-to-end payment & receipt testing.'}
                </p>
              </div>
            </div>

            {/* Copyable .env setup reference */}
            <div className="p-3.5 rounded-xl bg-[#16161C] border border-[#22222B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#E8E2D5]/70">Environment Variables (.env):</span>
                <button
                  type="button"
                  onClick={copyEnvSample}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedEnv ? 'Copied!' : 'Copy Template'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[#E8E2D5]/70 bg-[#0A0A0C] p-2.5 rounded overflow-x-auto border border-[#22222B]">
{`PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
GEMINI_API_KEY="your_gemini_api_key"`}
              </pre>
            </div>
          </div>

          {/* Section 2: Designer Studio Profile */}
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              2. Atelier Brand Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#E8E2D5]/80 font-medium mb-1">
                  Atelier House Name
                </label>
                <input
                  type="text"
                  value={atelierName}
                  onChange={(e) => setAtelierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#E8E2D5]/80 font-medium mb-1">
                  Head Couturier / Designer
                </label>
                <input
                  type="text"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#E8E2D5]/80 font-medium mb-1">
                  Atelier Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#E8E2D5]/80 font-medium mb-1">
                  Studio City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#E8E2D5]/80 font-medium mb-1">
                  Default Billing Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#E8E2D5]/80 text-xs font-medium mb-1">
                Standard Bespoke Revision Policy
              </label>
              <textarea
                rows={2}
                value={defaultRevisionPolicy}
                onChange={(e) => setDefaultRevisionPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-xs text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-semibold text-[#0A0A0C] bg-[#D4AF37] hover:bg-[#E5C378] rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4 text-[#0A0A0C]" />
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          {/* Section 3: Database & Reset */}
          <div className="p-4 rounded-xl bg-[#101014] border border-[#22222B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-serif text-sm font-semibold text-[#F5F0E6]">
                  Persistent Database Storage
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                ACTIVE (data/couturepay_db.json)
              </span>
            </div>

            <p className="text-xs text-[#E8E2D5]/70 font-light leading-relaxed">
              All fashion briefs, AI quotations, client payment records, and receipts are persisted
              server-side with atomic synchronous writes.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-[#1C1C24]">
              <span className="text-[11px] text-[#E8E2D5]/50">Reset to Initial Curated Projects:</span>
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting...' : 'Reset Demo Database'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
