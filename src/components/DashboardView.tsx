import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Receipt,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  Palette,
  ExternalLink,
} from 'lucide-react';
import type { DashboardMetrics, Project, ProjectStatus } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onOpenNewBrief: () => void;
  onSelectStatusFilter: (status: ProjectStatus | 'all') => void;
  onOpenClientPortal: (projectId: string) => void;
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

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  projects,
  onOpenProject,
  onOpenNewBrief,
  onSelectStatusFilter,
  onOpenClientPortal,
}) => {
  const recentProjects = projects.slice(0, 4);

  // Flatten all recent activities
  const recentActivities = projects
    .flatMap((p) =>
      p.statusHistory.map((h) => ({
        ...h,
        projectId: p.id,
        projectTitle: p.title,
        clientName: p.brief.clientName,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#22222B] bg-[#101014]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161C] border border-[#C5A059]/30 text-xs text-[#E5C378] font-mono mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>COUTUREPAY ATELIER SUITE</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FBF9F5] font-normal tracking-tight leading-tight text-balance">
                From Creative Vision to <span className="italic text-[#D4AF37]">Paid Project</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#E8E2D5]/80 max-w-xl font-light leading-relaxed">
                Transform client couture briefs into professional itemized quotations with Gemini AI.
                Manage commissions through every stage and accept instant, verified PayPal Sandbox payments.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewBrief}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#0A0A0C] font-medium text-xs sm:text-sm font-semibold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
              >
                <span>New Fashion Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectStatusFilter('quotation_prepared')}
                className="px-4 py-2.5 rounded-lg bg-[#16161C] hover:bg-[#22222B] border border-[#22222B] text-[#E8E2D5] font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Review Pending Quotations</span>
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/couture_hero_sketch_1793860139659.jpg"
              alt="Haute Couture Fashion Illustration"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#101014] lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-3 right-3 bg-[#0A0A0C]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#E5C378] border border-[#22222B]">
              HAUTE COUTURE 2026
            </div>
          </div>
        </div>
      </div>

      {/* Core Financial & Project Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#101014] border border-[#22222B] relative overflow-hidden group hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#E8E2D5]/70 mb-2">
            <span>Total Projects</span>
            <FolderKanban className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-[#F5F0E6]">
            {metrics?.totalProjects ?? projects.length}
          </div>
          <div className="mt-1 text-[11px] text-[#E8E2D5]/50 flex items-center gap-1 font-mono">
            <span>Bespoke commissions</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#101014] border border-[#22222B] relative overflow-hidden group hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#E8E2D5]/70 mb-2">
            <span>Pending Quotations</span>
            <Clock className="w-4 h-4 text-[#E5C378]" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-[#E5C378]">
            {metrics?.pendingQuotations ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-[#E8E2D5]/50 flex items-center gap-1 font-mono">
            <span>Awaiting client approval</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#101014] border border-[#22222B] relative overflow-hidden group hover:border-emerald-600/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#E8E2D5]/70 mb-2">
            <span>Paid Projects</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-emerald-400">
            {metrics?.paidProjects ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-[#E8E2D5]/50 flex items-center gap-1 font-mono">
            <span>Verified captures</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#101014] border border-[#22222B] relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#E8E2D5]/70 mb-2">
            <span>Sandbox Volume</span>
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-[#D4AF37]">
            ${(metrics?.sandboxPaymentVolume ?? 0).toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#C5A059] flex items-center gap-1 font-mono">
            <span>[TEST PAYMENTS]</span>
          </div>
        </div>
      </div>

      {/* Interactive Project Pipeline Stages */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#101014] border border-[#22222B]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[#F5F0E6]">
              Couture Commission Pipeline
            </h2>
            <p className="text-xs text-[#E8E2D5]/60">Click any stage to filter active projects</p>
          </div>
          <button
            onClick={() => onSelectStatusFilter('all')}
            className="text-xs font-mono text-[#D4AF37] hover:underline"
          >
            View All ({projects.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(
            [
              'brief_received',
              'quotation_prepared',
              'awaiting_payment',
              'payment_confirmed',
              'in_progress',
              'delivered',
            ] as ProjectStatus[]
          ).map((st) => {
            const count = projects.filter((p) => p.status === st).length;
            const style = statusColors[st];
            return (
              <button
                key={st}
                onClick={() => onSelectStatusFilter(st)}
                className={`p-3 rounded-lg border text-left transition-all ${style.bg} ${style.border} hover:brightness-125 focus:outline-none`}
              >
                <div className="text-[11px] font-medium text-[#E8E2D5]/70 truncate">
                  {statusDisplayNames[st]}
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className={`text-xl font-mono tabular-nums font-bold ${style.text}`}>
                    {count}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#E8E2D5]/40" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Active Commissions & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Commissions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[#F5F0E6]">
              Priority Commissions
            </h2>
            <button
              onClick={() => onSelectStatusFilter('all')}
              className="text-xs text-[#D4AF37] hover:underline font-mono"
            >
              All Projects &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => {
              const statusStyle = statusColors[project.status];
              const amount = project.quotation?.totalAmount || project.brief.budgetMax;
              const currency = project.quotation?.currency || project.brief.currency;

              return (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 rounded-xl bg-[#101014] border border-[#22222B] hover:border-[#C5A059]/40 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#E8E2D5]/60">
                        <span>{project.brief.garmentCategory}</span>
                        <span>&middot;</span>
                        <span>{project.brief.clientName}</span>
                      </div>
                      <h3
                        onClick={() => onOpenProject(project.id)}
                        className="mt-1 font-serif text-base sm:text-lg text-[#F5F0E6] font-medium group-hover:text-[#D4AF37] cursor-pointer transition-colors"
                      >
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 sm:text-right shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-mono border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                      >
                        {statusDisplayNames[project.status]}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1C1C24] flex items-center justify-between text-xs">
                    <div className="font-mono tabular-nums text-[#D4AF37] font-semibold text-sm">
                      {currency} {amount.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenClientPortal(project.id)}
                        title="Open Client Portal View"
                        className="px-2.5 py-1 text-xs text-[#E8E2D5]/80 hover:text-[#F5F0E6] bg-[#16161C] hover:bg-[#22222B] border border-[#22222B] rounded flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-[#C5A059]" />
                        <span>Client View</span>
                      </button>
                      <button
                        onClick={() => onOpenProject(project.id)}
                        className="px-3 py-1 text-xs text-[#0A0A0C] bg-[#D4AF37] hover:bg-[#E5C378] font-semibold rounded transition-colors"
                      >
                        Open Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Atelier Activity Feed & Moodboard Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Atelier Moodboard Visual Card */}
          <div className="rounded-xl border border-[#22222B] bg-[#101014] overflow-hidden">
            <div className="relative h-36">
              <img
                src="/src/assets/images/couture_atelier_moodboard_1793860140607.jpg"
                alt="Atelier Moodboard"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs font-serif font-semibold text-[#F5F0E6]">
                Atelier Moodboard & Textile Curation
              </div>
            </div>
            <div className="p-4 text-xs text-[#E8E2D5]/70 font-light space-y-1">
              <p>
                Real-time swatch specifications, French lace cartography, and silk organza drape ratios
                are automatically embedded into generated client quotations.
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-5 rounded-xl bg-[#101014] border border-[#22222B]">
            <h3 className="font-serif text-base font-semibold text-[#F5F0E6] mb-4 flex items-center justify-between">
              <span>Atelier Activity Feed</span>
              <span className="text-xs font-mono text-[#E8E2D5]/50">Audit History</span>
            </h3>

            <div className="space-y-4">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="shrink-0 w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#F5F0E6]">{act.clientName}</span>
                      <span className="text-[10px] font-mono text-[#E8E2D5]/50">
                        {new Date(act.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[#E8E2D5]/70 font-light leading-relaxed">{act.note}</p>
                    <button
                      onClick={() => onOpenProject(act.projectId)}
                      className="mt-1 text-[11px] font-mono text-[#C5A059] hover:underline"
                    >
                      {act.projectTitle} &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
