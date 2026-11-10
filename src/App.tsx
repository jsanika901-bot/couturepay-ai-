import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { NewBriefModal } from './components/NewBriefModal';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsModal } from './components/SettingsModal';
import type {
  Project,
  ProjectStatus,
  DashboardMetrics,
  SystemStatus,
  DesignerProfile,
  FashionBrief,
  Quotation,
} from './types';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'projects' | 'settings'>('dashboard');
  const [activeStatusFilter, setActiveStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isNewBriefOpen, setIsNewBriefOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [clientPortalProjectId, setClientPortalProjectId] = useState<string | null>(null);
  const [receiptProjectId, setReceiptProjectId] = useState<string | null>(null);

  // Loading indicators
  const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);
  const [generatingAiId, setGeneratingAiId] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Data Fetch
  const refreshAll = async () => {
    try {
      const [statusRes, metricsRes, projectsRes, profileRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/metrics'),
        fetch('/api/projects'),
        fetch('/api/profile'),
      ]);

      if (statusRes.ok) setSystemStatus(await statusRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
    } catch (err) {
      console.error('Failed to load atelier data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Handle Brief Creation
  const handleCreateBrief = async (briefData: Partial<FashionBrief>, autoGenerateAi: boolean) => {
    setIsSubmittingBrief(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create brief.');
      }

      const newProj: Project = await res.json();
      showToast(`Fashion brief created for ${newProj.brief.clientName}!`);

      if (autoGenerateAi) {
        showToast('Synthesizing couture quotation with Gemini AI...', 'info');
        await handleGenerateAiQuotation(newProj.id);
      } else {
        await refreshAll();
        setSelectedProjectId(newProj.id);
      }
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
    } finally {
      setIsSubmittingBrief(false);
    }
  };

  // Handle AI Quotation Generation
  const handleGenerateAiQuotation = async (projectId: string) => {
    setGeneratingAiId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}/generate-quotation`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate quotation.');
      }

      const quotation: Quotation = await res.json();
      await refreshAll();
      setSelectedProjectId(projectId);

      if (quotation.isDemo) {
        showToast('Quotation generated in DEMO mode (AI offline/demo fallback).', 'info');
      } else {
        showToast('Official quotation formulated by Gemini 3.8 Flash!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
    } finally {
      setGeneratingAiId(null);
    }
  };

  // Handle Quotation Update
  const handleUpdateQuotation = async (projectId: string, updatedQuotation: Partial<Quotation>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/quotation`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuotation),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update quotation.');
      }

      showToast('Quotation details saved successfully.');
      await refreshAll();
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
      throw err;
    }
  };

  // Handle Project Status Transition
  const handleUpdateStatus = async (projectId: string, newStatus: ProjectStatus, note?: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update status.');
      }

      showToast(`Commission transitioned to ${newStatus.replace('_', ' ')}.`);
      await refreshAll();
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
      throw err;
    }
  };

  // Handle Project Deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete project.');
      }

      showToast('Commission removed from archive.');
      if (selectedProjectId === projectId) setSelectedProjectId(null);
      if (clientPortalProjectId === projectId) setClientPortalProjectId(null);
      if (receiptProjectId === projectId) setReceiptProjectId(null);
      await refreshAll();
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
    }
  };

  // Handle Atelier Profile Update
  const handleUpdateProfile = async (updated: Partial<DesignerProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Failed to update profile.');
      const newProf = await res.json();
      setProfile(newProf);
      showToast('Atelier profile updated.');
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
      throw err;
    }
  };

  // Handle Reset Demo Database
  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/settings/reset-demo', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reset data.');
      showToast('Atelier database reset to curated showcase commissions.');
      await refreshAll();
    } catch (err) {
      console.error(err);
      showToast((err as Error).message, 'error');
      throw err;
    }
  };

  // Active Project for Dossier Modal
  const activeDossierProject = projects.find((p) => p.id === selectedProjectId) || null;
  // Active Project for Client Portal Modal
  const activeClientPortalProject = projects.find((p) => p.id === clientPortalProjectId) || null;
  // Active Project for Receipt Modal
  const activeReceiptProject = projects.find((p) => p.id === receiptProjectId) || null;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F5F0E6] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewBrief={() => setIsNewBriefOpen(true)}
        systemStatus={systemStatus}
        profile={profile}
        onOpenClientPortalPreview={() => {
          // Open first active project in client portal preview or prompt
          if (projects.length > 0) {
            setClientPortalProjectId(projects[0].id);
          } else {
            showToast('Create a brief first to preview client portal.', 'info');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-mono text-[#E8E2D5]/60">Opening Atelier Suite...</span>
          </div>
        ) : currentTab === 'dashboard' ? (
          <DashboardView
            metrics={metrics}
            projects={projects}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenNewBrief={() => setIsNewBriefOpen(true)}
            onSelectStatusFilter={(st) => {
              setActiveStatusFilter(st);
              setCurrentTab('projects');
            }}
            onOpenClientPortal={(id) => setClientPortalProjectId(id)}
          />
        ) : currentTab === 'projects' ? (
          <ProjectsView
            projects={projects}
            activeFilter={activeStatusFilter}
            setActiveFilter={setActiveStatusFilter}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenNewBrief={() => setIsNewBriefOpen(true)}
            onOpenClientPortal={(id) => setClientPortalProjectId(id)}
            onOpenReceipt={(id) => setReceiptProjectId(id)}
            onDeleteProject={handleDeleteProject}
            onGenerateAiQuotation={handleGenerateAiQuotation}
            generatingId={generatingAiId}
          />
        ) : (
          /* Settings View */
          <div className="max-w-2xl mx-auto py-4">
            <SettingsModal
              isOpen={true}
              onClose={() => setCurrentTab('dashboard')}
              systemStatus={systemStatus}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onResetDemoData={handleResetDemoData}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <NewBriefModal
        isOpen={isNewBriefOpen}
        onClose={() => setIsNewBriefOpen(false)}
        onSubmitBrief={handleCreateBrief}
        isSubmitting={isSubmittingBrief}
      />

      <ProjectDossierModal
        isOpen={Boolean(selectedProjectId)}
        onClose={() => setSelectedProjectId(null)}
        project={activeDossierProject}
        systemStatus={systemStatus}
        onGenerateAiQuotation={handleGenerateAiQuotation}
        onUpdateQuotation={handleUpdateQuotation}
        onUpdateStatus={handleUpdateStatus}
        onOpenReceipt={(id) => {
          setSelectedProjectId(null);
          setReceiptProjectId(id);
        }}
        onOpenClientPortal={(id) => setClientPortalProjectId(id)}
        onPaymentSuccess={async () => {
          await refreshAll();
          showToast('Verified PayPal Sandbox payment captured successfully!', 'success');
        }}
        isGeneratingAi={Boolean(generatingAiId)}
      />

      <ClientPortalModal
        isOpen={Boolean(clientPortalProjectId)}
        onClose={() => setClientPortalProjectId(null)}
        project={activeClientPortalProject}
        systemStatus={systemStatus}
        onApproveQuotation={async (id) => {
          await handleUpdateStatus(id, 'awaiting_payment', 'Quotation approved by client in portal.');
          showToast('Quotation terms approved! PayPal Sandbox checkout is ready.');
        }}
        onPaymentSuccess={async () => {
          await refreshAll();
          showToast('PayPal Sandbox payment verified! Official receipt ready.', 'success');
        }}
        onOpenReceipt={(id) => {
          setClientPortalProjectId(null);
          setReceiptProjectId(id);
        }}
      />

      <ReceiptModal
        isOpen={Boolean(receiptProjectId)}
        onClose={() => setReceiptProjectId(null)}
        project={activeReceiptProject || ({} as Project)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm rounded-xl p-3.5 bg-[#16161C] border border-[#C5A059]/40 shadow-2xl flex items-center gap-2.5 text-xs text-[#F5F0E6] animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toastMessage.type === 'info' ? (
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
