import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Receipt,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
} from 'lucide-react';
import type { Project, ProjectStatus } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  activeFilter: ProjectStatus | 'all';
  setActiveFilter: (filter: ProjectStatus | 'all') => void;
  onOpenProject: (projectId: string) => void;
  onOpenNewBrief: () => void;
  onOpenClientPortal: (projectId: string) => void;
  onOpenReceipt: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onGenerateAiQuotation: (projectId: string) => void;
  generatingId: string | null;
}

const statusDisplayNames: Record<ProjectStatus, string> = {
  brief_received: 'Brief Received',
  quotation_prepared: 'Quotation Prepared',
  awaiting_payment: 'Awaiting Payment',
  payment_confirmed: 'Payment Confirmed',
  in_progress: 'In Progress',
  delivered: 'Delivered',
};

const statusColors: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
  brief_received: { bg: 'bg-blue-950/40', text: 'text-blue-300', border: 'border-blue-800/40' },
  quotation_prepared: { bg: 'bg-amber-950/40', text: 'text-[#E5C378]', border: 'border-[#C5A059]/40' },
  awaiting_payment: { bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-800/40' },
  payment_confirmed: { bg: 'bg-emerald-950/40', text: 'text-emerald-300', border: 'border-emerald-800/40' },
  in_progress: { bg: 'bg-teal-950/40', text: 'text-teal-300', border: 'border-teal-800/40' },
  delivered: { bg: 'bg-stone-900', text: 'text-[#E8E2D5]', border: 'border-stone-700' },
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeFilter,
  setActiveFilter,
  onOpenProject,
  onOpenNewBrief,
  onOpenClientPortal,
  onOpenReceipt,
  onDeleteProject,
  onGenerateAiQuotation,
  generatingId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: Array<{ id: ProjectStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All Commissions' },
    { id: 'brief_received', label: 'Brief Received' },
    { id: 'quotation_prepared', label: 'Quotation Prepared' },
    { id: 'awaiting_payment', label: 'Awaiting Payment' },
    { id: 'payment_confirmed', label: 'Payment Confirmed' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter !== 'all' && p.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.brief.clientName.toLowerCase().includes(q) ||
        p.brief.garmentCategory.toLowerCase().includes(q) ||
        p.brief.occasion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F5F0E6]">
            Couture Project Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#E8E2D5]/70 mt-1">
            Track client briefs, generate AI quotations, and verify PayPal Sandbox commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#E8E2D5]/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search briefs, clients, gowns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#101014] border border-[#22222B] text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none placeholder:text-[#E8E2D5]/30"
            />
          </div>

          <button
            onClick={onOpenNewBrief}
            className="px-3.5 py-2 text-xs font-semibold text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] to-[#C5A059] rounded-lg shadow hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Brief</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Bar (Horizontal scrolling on mobile) */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-[#101014] border border-[#22222B] rounded-xl w-max min-w-full">
          {filterTabs.map((tab) => {
            const count =
              tab.id === 'all' ? projects.length : projects.filter((p) => p.status === tab.id).length;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1C1C24] text-[#D4AF37] font-semibold border border-[#C5A059]/40 shadow-sm'
                    : 'text-[#E8E2D5]/70 hover:text-[#F5F0E6]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#16161C] text-[#E8E2D5]/50'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#101014] border border-[#22222B] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#16161C] border border-[#22222B] flex items-center justify-center text-[#D4AF37] mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">No Commissions Found</h3>
            <p className="text-xs text-[#E8E2D5]/60 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'No projects matching your search criteria. Try a different keyword.'
                : 'No projects currently in this status phase.'}
            </p>
          </div>
          <button
            onClick={onOpenNewBrief}
            className="px-4 py-2 text-xs font-semibold text-[#0A0A0C] bg-[#D4AF37] hover:bg-[#E5C378] rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#0A0A0C]" />
            <span>Create New Fashion Brief</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const statusStyle = statusColors[project.status];
            const hasQuotation = Boolean(project.quotation);
            const isPaid =
              project.payment?.status === 'COMPLETED' ||
              project.status === 'payment_confirmed' ||
              project.status === 'in_progress' ||
              project.status === 'delivered';
            const displayAmount = project.quotation?.totalAmount || project.brief.budgetMax;
            const currency = project.quotation?.currency || project.brief.currency;
            const isGeneratingThis = generatingId === project.id;

            return (
              <div
                key={project.id}
                className="rounded-xl bg-[#101014] border border-[#22222B] hover:border-[#C5A059]/40 transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  {/* Status & Category Strip */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#E8E2D5]/60 truncate">{project.brief.garmentCategory}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                    >
                      {statusDisplayNames[project.status]}
                    </span>
                  </div>

                  {/* Title & Occasion */}
                  <div>
                    <h3
                      onClick={() => onOpenProject(project.id)}
                      className="font-serif text-lg font-medium text-[#F5F0E6] group-hover:text-[#D4AF37] cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#E8E2D5]/60 font-light line-clamp-2">
                      {project.brief.inspirationMood}
                    </p>
                  </div>

                  {/* Client & Date Info */}
                  <div className="pt-2 border-t border-[#1C1C24] flex items-center justify-between text-xs text-[#E8E2D5]/70">
                    <div>
                      <span className="text-[#F5F0E6] font-medium">{project.brief.clientName}</span>
                      {project.brief.clientLocation && (
                        <span className="text-[#E8E2D5]/50 text-[11px] block">
                          {project.brief.clientLocation}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-[#E8E2D5]/50 block">Target Hand-off</span>
                      <span className="text-xs font-mono text-[#E8E2D5]">
                        {new Date(project.brief.deadline).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* AI & PayPal Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pt-1">
                    {hasQuotation ? (
                      project.quotation?.isDemo ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-800/40 text-[#E5C378]">
                          DEMO QUOTATION
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-[#16161C] border border-[#C5A059]/40 text-[#D4AF37] flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>GEMINI 3.8 AI</span>
                        </span>
                      )
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/30 border border-blue-800/30 text-blue-300">
                        BRIEF PENDING QUOTE
                      </span>
                    )}

                    {isPaid ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>SANDBOX PAID</span>
                      </span>
                    ) : project.status === 'awaiting_payment' ? (
                      <span className="px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-300">
                        AWAITING PAYMENT
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Card Bottom / Actions */}
                <div className="p-4 bg-[#0E0E12] border-t border-[#1C1C24] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#E8E2D5]/50 block font-mono">
                      {hasQuotation ? 'Quotation Total' : 'Est. Budget'}
                    </span>
                    <span className="font-mono tabular-nums text-[#D4AF37] font-semibold text-base">
                      {currency} {displayAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If brief only, provide quick 1-click AI generation */}
                    {!hasQuotation && (
                      <button
                        onClick={() => onGenerateAiQuotation(project.id)}
                        disabled={isGeneratingThis}
                        title="Generate AI Quotation"
                        className="px-2.5 py-1.5 rounded bg-[#1C1C24] hover:bg-[#282834] border border-[#C5A059]/40 text-[#D4AF37] font-medium transition-colors flex items-center gap-1"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isGeneratingThis ? 'animate-spin' : ''}`} />
                        <span>{isGeneratingThis ? 'Generating...' : 'AI Quote'}</span>
                      </button>
                    )}

                    {/* Receipt shortcut if paid */}
                    {isPaid && (
                      <button
                        onClick={() => onOpenReceipt(project.id)}
                        title="View Official Receipt"
                        className="p-1.5 rounded text-[#E8E2D5]/70 hover:text-emerald-400 hover:bg-[#16161C] border border-[#22222B] transition-colors"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    )}

                    {/* Client portal preview */}
                    <button
                      onClick={() => onOpenClientPortal(project.id)}
                      title="Open in Client Portal mode"
                      className="p-1.5 rounded text-[#E8E2D5]/70 hover:text-[#D4AF37] hover:bg-[#16161C] border border-[#22222B] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Open Dossier */}
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="px-3 py-1.5 rounded bg-[#D4AF37] hover:bg-[#E5C378] text-[#0A0A0C] font-semibold transition-colors"
                    >
                      Dossier
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      title="Delete commission"
                      className="p-1.5 rounded text-red-400/60 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
