import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import type { SystemStatus, DesignerProfile } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'projects' | 'settings';
  setCurrentTab: (tab: 'dashboard' | 'projects' | 'settings') => void;
  onOpenNewBrief: () => void;
  systemStatus: SystemStatus | null;
  profile: DesignerProfile | null;
  onOpenClientPortalPreview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewBrief,
  systemStatus,
  profile,
  onOpenClientPortalPreview,
}) => {
  return (
    <>
      {/* Desktop & Tablet Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#22222B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#16161C] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <span className="font-serif font-bold text-base">C</span>
              </div>
              <div>
                <span className="font-serif text-lg tracking-wider text-[#F5F0E6] font-semibold group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                  COUTUREPAY AI
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase text-[#C5A059]/80 font-mono">
                  PARIS · ATELIER
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'text-[#D4AF37] font-semibold'
                  : 'text-[#E8E2D5]/70 hover:text-[#F5F0E6]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('projects')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'projects'
                  ? 'text-[#D4AF37] font-semibold'
                  : 'text-[#E8E2D5]/70 hover:text-[#F5F0E6]'
              }`}
            >
              Project Pipeline
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'settings'
                  ? 'text-[#D4AF37] font-semibold'
                  : 'text-[#E8E2D5]/70 hover:text-[#F5F0E6]'
              }`}
            >
              Atelier Settings
            </button>
          </nav>

          {/* Zone 3: Actions & Status */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Status Pills */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16161C] border border-[#22222B] text-[#E8E2D5]/80">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{systemStatus?.paypalConnected ? 'PAYPAL SANDBOX' : 'SANDBOX TEST'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16161C] border border-[#22222B] text-[#C5A059]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{systemStatus?.geminiAvailable ? 'GEMINI 3.8' : 'AI DEMO'}</span>
              </span>
            </div>

            {/* Client Portal Preview Trigger */}
            <button
              onClick={onOpenClientPortalPreview}
              title="Preview client quotation & payment portal"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E8E2D5] bg-[#16161C] hover:bg-[#22222B] border border-[#22222B] rounded-lg transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Client Portal</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewBrief}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] hover:brightness-110 rounded-lg shadow-sm font-semibold transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-[#0A0A0C]" />
              <span>New Fashion Brief</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Optimized for Android / Mobile Thumb Zone) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-t border-[#22222B] pb-safe"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-[#E8E2D5]/60 hover:text-[#E8E2D5]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('projects')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'projects' ? 'text-[#D4AF37]' : 'text-[#E8E2D5]/60 hover:text-[#E8E2D5]'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Projects</span>
          </button>

          <button
            onClick={onOpenNewBrief}
            className="min-h-[44px] flex flex-col items-center justify-center text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0A0A0C] flex items-center justify-center shadow-md -mt-2">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">New Brief</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'settings' ? 'text-[#D4AF37]' : 'text-[#E8E2D5]/60 hover:text-[#E8E2D5]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Atelier</span>
          </button>
        </div>
      </nav>
    </>
  );
};
