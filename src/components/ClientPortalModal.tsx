import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Receipt,
  FileCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import type { Project, SystemStatus } from '../types';
import { PayPalCheckoutBox } from './PayPalCheckoutBox';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  systemStatus: SystemStatus | null;
  onApproveQuotation: (projectId: string) => Promise<void>;
  onPaymentSuccess: (project: Project) => void;
  onOpenReceipt: (projectId: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  project,
  systemStatus,
  onApproveQuotation,
  onPaymentSuccess,
  onOpenReceipt,
}) => {
  if (!isOpen || !project) return null;

  const brief = project.brief;
  const quotation = project.quotation;
  const isPaid =
    project.payment?.status === 'COMPLETED' ||
    project.status === 'payment_confirmed' ||
    project.status === 'in_progress' ||
    project.status === 'delivered';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0A0A0C] border border-[#22222B] shadow-2xl my-6 text-[#F5F0E6] flex flex-col max-h-[95vh] overflow-hidden">
        {/* Client Portal Top Navigation */}
        <div className="px-6 py-4 bg-[#101014] border-b border-[#22222B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#16161C] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm">
              C
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                <span>CLIENT PORTAL</span>
                <span>&middot;</span>
                <span className="text-[#E8E2D5]/70">ATELIER VIVIENNE LAURENT</span>
              </div>
              <h2 className="font-serif text-base font-semibold text-[#F5F0E6]">
                Welcome, {brief.clientName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#D4AF37] bg-[#16161C] px-2.5 py-1 rounded border border-[#22222B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE CLIENT ACCESS</span>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#E8E2D5]/60 hover:text-[#F5F0E6] hover:bg-[#16161C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#0E0E12]">
          {/* Welcome Card & Commission Summary */}
          <div className="p-5 rounded-xl bg-[#101014] border border-[#22222B] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">
                  Bespoke Couture Commission
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#F5F0E6] mt-0.5">
                  {project.title}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono text-[#E8E2D5]/50 block">Status</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#16161C] border border-[#C5A059]/40 text-[#D4AF37]">
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8E2D5]/80 font-light leading-relaxed">
              {quotation?.briefSummary || brief.inspirationMood}
            </p>

            <div className="pt-3 border-t border-[#1C1C24] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Category</span>
                <span className="text-[#F5F0E6]">{brief.garmentCategory}</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Occasion</span>
                <span className="text-[#F5F0E6] truncate">{brief.occasion}</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Delivery Target</span>
                <span className="text-[#F5F0E6] font-mono">
                  {new Date(brief.deadline).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Commission Fee</span>
                <span className="text-[#D4AF37] font-mono font-bold">
                  {quotation?.currency || brief.currency}{' '}
                  {(quotation?.totalAmount || brief.budgetMax).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quotation & Scope Details */}
          {quotation ? (
            <div className="p-5 rounded-xl bg-[#101014] border border-[#22222B] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-semibold text-[#F5F0E6]">
                  Itemized Quotation & Deliverables
                </h4>
                {quotation.isDemo && (
                  <span className="text-[10px] font-mono text-[#E5C378] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                    DEMO QUOTATION
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {quotation.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-[#0A0A0C] border border-[#1C1C24] flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="text-[#F5F0E6] font-medium">{item.title}</div>
                      <div className="text-[#E8E2D5]/60 text-[11px] mt-0.5">{item.description}</div>
                    </div>
                    <div className="font-mono tabular-nums text-[#D4AF37] font-semibold ml-4">
                      {quotation.currency} {Number(item.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deliverables Bullet List */}
              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#1C1C24] text-xs space-y-2">
                <span className="font-mono text-[#C5A059] block text-[11px] uppercase tracking-wider font-semibold">
                  Guaranteed Deliverables:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#E8E2D5]/80 font-light">
                  {quotation.deliverables.map((del, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Revision Policy */}
              <div className="text-[11px] font-mono text-[#E8E2D5]/60 pt-1">
                Atelier Policy: {quotation.revisionPolicy}
              </div>

              {/* Project Approval Action (If in quotation_prepared) */}
              {project.status === 'quotation_prepared' && (
                <div className="p-4 rounded-xl bg-[#16161C] border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-sm font-semibold text-[#F5F0E6]">
                      Ready to Commission Your Haute Couture Art?
                    </div>
                    <div className="text-xs text-[#E8E2D5]/70">
                      Approve terms and unlock secure PayPal Sandbox checkout.
                    </div>
                  </div>
                  <button
                    onClick={() => onApproveQuotation(project.id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0A0A0C] font-semibold text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <FileCheck className="w-4 h-4 text-[#0A0A0C]" />
                    <span>Approve Quotation Terms</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-[#101014] border border-[#22222B] text-xs text-[#E8E2D5]/60">
              The atelier director is formulating your bespoke quotation. You will receive an alert once ready.
            </div>
          )}

          {/* Payment & Receipt Area */}
          {(project.status === 'awaiting_payment' || isPaid) && (
            <div className="space-y-4">
              <h4 className="font-serif text-base font-semibold text-[#F5F0E6] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Client Payment & Verified Receipt</span>
              </h4>

              <PayPalCheckoutBox
                project={project}
                systemStatus={systemStatus}
                onPaymentSuccess={onPaymentSuccess}
                onOpenReceipt={() => onOpenReceipt(project.id)}
              />

              {isPaid && (
                <div className="flex items-center justify-center pt-2">
                  <button
                    onClick={() => onOpenReceipt(project.id)}
                    className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#0A0A0C] font-semibold text-xs shadow hover:bg-[#E5C378] transition-colors flex items-center gap-2"
                  >
                    <Receipt className="w-4 h-4 text-[#0A0A0C]" />
                    <span>View & Download Official Receipt</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Milestone Delivery Tracker */}
          {isPaid && (
            <div className="p-5 rounded-xl bg-[#101014] border border-[#22222B] space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[#F5F0E6]">
                Atelier Hand-off Progress
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-emerald-800/40 text-emerald-300">
                  <div className="font-mono text-[10px] text-emerald-400">MILESTONE 1</div>
                  <div className="font-medium mt-1">Payment Captured</div>
                  <div className="text-[11px] text-[#E8E2D5]/60 mt-0.5">Funds verified in Sandbox</div>
                </div>

                <div className={`p-3 rounded-lg bg-[#0A0A0C] border ${
                  project.status === 'in_progress' || project.status === 'delivered'
                    ? 'border-teal-800/40 text-teal-300'
                    : 'border-[#22222B] text-[#E8E2D5]/50'
                }`}>
                  <div className="font-mono text-[10px]">MILESTONE 2</div>
                  <div className="font-medium mt-1">Illustration & Drafting</div>
                  <div className="text-[11px] mt-0.5">
                    {project.status === 'in_progress' ? 'Atelier work in progress' : 'Awaiting start'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg bg-[#0A0A0C] border ${
                  project.status === 'delivered'
                    ? 'border-emerald-800/40 text-emerald-300'
                    : 'border-[#22222B] text-[#E8E2D5]/50'
                }`}>
                  <div className="font-mono text-[10px]">MILESTONE 3</div>
                  <div className="font-medium mt-1">Dossier Delivery</div>
                  <div className="text-[11px] mt-0.5">
                    {project.status === 'delivered' ? 'Delivered to client' : 'Pending completion'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
