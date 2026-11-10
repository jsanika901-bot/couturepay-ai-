import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Receipt as ReceiptIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  Save,
  Palette,
  Layers,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  Send,
  Trash2,
  Plus,
} from 'lucide-react';
import type { Project, ProjectStatus, Quotation, QuotationItem, SystemStatus } from '../types';
import { PayPalCheckoutBox } from './PayPalCheckoutBox';

interface ProjectDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  systemStatus: SystemStatus | null;
  onGenerateAiQuotation: (projectId: string) => Promise<void>;
  onUpdateQuotation: (projectId: string, updatedQuotation: Partial<Quotation>) => Promise<void>;
  onUpdateStatus: (projectId: string, newStatus: ProjectStatus, note?: string) => Promise<void>;
  onOpenReceipt: (projectId: string) => void;
  onOpenClientPortal: (projectId: string) => void;
  onPaymentSuccess: (project: Project) => void;
  isGeneratingAi: boolean;
}

const statusStages: Array<{ id: ProjectStatus; label: string }> = [
  { id: 'brief_received', label: 'Brief Received' },
  { id: 'quotation_prepared', label: 'Quotation Prepared' },
  { id: 'awaiting_payment', label: 'Awaiting Payment' },
  { id: 'payment_confirmed', label: 'Payment Confirmed' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'delivered', label: 'Delivered' },
];

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  isOpen,
  onClose,
  project,
  systemStatus,
  onGenerateAiQuotation,
  onUpdateQuotation,
  onUpdateStatus,
  onOpenReceipt,
  onOpenClientPortal,
  onPaymentSuccess,
  isGeneratingAi,
}) => {
  if (!isOpen || !project) return null;

  const [isEditingQuotation, setIsEditingQuotation] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.quotation?.projectTitle || project.title);
  const [editedSummary, setEditedSummary] = useState(project.quotation?.briefSummary || '');
  const [editedItems, setEditedItems] = useState<QuotationItem[]>(
    project.quotation?.items || []
  );
  const [editedRevisionPolicy, setEditedRevisionPolicy] = useState(
    project.quotation?.revisionPolicy || ''
  );
  const [editedTimeline, setEditedTimeline] = useState(
    project.quotation?.deliveryTimeline || ''
  );
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const brief = project.brief;
  const quotation = project.quotation;
  const isPaid =
    project.payment?.status === 'COMPLETED' ||
    project.status === 'payment_confirmed' ||
    project.status === 'in_progress' ||
    project.status === 'delivered';

  const currentStageIndex = statusStages.findIndex((s) => s.id === project.status);

  const handleSaveQuotationEdit = async () => {
    setIsSavingEdit(true);
    try {
      await onUpdateQuotation(project.id, {
        projectTitle: editedTitle,
        briefSummary: editedSummary,
        items: editedItems,
        revisionPolicy: editedRevisionPolicy,
        deliveryTimeline: editedTimeline,
      });
      setIsEditingQuotation(false);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    setEditedItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddItem = () => {
    setEditedItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        title: 'Additional Atelier Deliverable',
        phase: `Phase ${prev.length + 1}`,
        description: 'Bespoke design specifications',
        amount: 800,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCalculated = editedItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0A0A0C] border border-[#22222B] shadow-2xl my-6 text-[#F5F0E6] flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#22222B] bg-[#101014] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#16161C] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#E8E2D5]/60">
                <span>PROJECT DOSSIER</span>
                <span>&middot;</span>
                <span className="text-[#D4AF37]">{brief.garmentCategory}</span>
              </div>
              <h2 className="font-serif text-lg font-semibold text-[#F5F0E6] truncate max-w-md sm:max-w-xl">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenClientPortal(project.id)}
              className="px-3 py-1.5 rounded-lg bg-[#16161C] hover:bg-[#22222B] border border-[#22222B] text-xs text-[#E8E2D5] font-medium transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Preview Client View</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#E8E2D5]/60 hover:text-[#F5F0E6] hover:bg-[#16161C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="px-6 py-3 bg-[#0E0E12] border-b border-[#22222B] overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {statusStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={stage.id}
                  onClick={() => onUpdateStatus(project.id, stage.id, `Status manually set to ${stage.label}.`)}
                  title="Click to transition to this stage"
                  className={`flex items-center gap-1.5 text-xs font-mono transition-all px-2.5 py-1 rounded-md ${
                    isCurrent
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold'
                      : isPast
                      ? 'text-emerald-400 font-medium'
                      : 'text-[#E8E2D5]/40 hover:text-[#E8E2D5]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#0A0A0C]'
                        : isPast
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-[#1C1C24] text-[#E8E2D5]/40'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section A: Client Fashion Brief Summary */}
          <div className="rounded-xl bg-[#101014] border border-[#22222B] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Client Brief Specifications</span>
              </h3>
              <span className="text-[11px] font-mono text-[#E8E2D5]/50">
                Submitted {new Date(brief.submittedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Client</span>
                <span className="text-[#F5F0E6] font-medium">{brief.clientName}</span>
                <span className="text-[#E8E2D5]/70 block">{brief.clientEmail}</span>
                {brief.clientLocation && <span className="text-[#E8E2D5]/50 block">{brief.clientLocation}</span>}
              </div>

              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Event / Occasion</span>
                <span className="text-[#F5F0E6] font-medium">{brief.occasion}</span>
                <span className="text-[#D4AF37] block font-mono text-[11px]">{brief.garmentCategory}</span>
              </div>

              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px]">Budget Range & Deadline</span>
                <span className="text-[#D4AF37] font-mono font-bold">
                  {brief.currency} {brief.budgetMin.toLocaleString()} – {brief.currency} {brief.budgetMax.toLocaleString()}
                </span>
                <span className="text-[#E8E2D5]/70 block font-mono text-[11px]">
                  Target: {new Date(brief.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Inspiration Narrative */}
            <div className="pt-2 border-t border-[#1C1C24] text-xs space-y-1">
              <span className="text-[#E8E2D5]/50 block text-[11px]">Artistic Inspiration & Moodboard:</span>
              <p className="text-[#E8E2D5]/90 font-light leading-relaxed">{brief.inspirationMood}</p>
            </div>

            {/* Color Swatches & Fabrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1C1C24] text-xs">
              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px] mb-1.5 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-[#D4AF37]" />
                  <span>Color Palette:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brief.colorPalette.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#16161C] border border-[#22222B] text-[#E8E2D5]"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#E8E2D5]/50 block text-[11px] mb-1.5 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#D4AF37]" />
                  <span>Fabric & Trims Curation:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brief.fabricPreferences.map((fab, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#16161C] border border-[#22222B] text-[#C5A059]"
                    >
                      {fab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {brief.silhouetteNotes && (
              <div className="pt-2 border-t border-[#1C1C24] text-xs">
                <span className="text-[#E8E2D5]/50 block text-[11px]">Silhouette & Structural Notes:</span>
                <p className="text-[#E8E2D5]/80 font-light">{brief.silhouetteNotes}</p>
              </div>
            )}
          </div>

          {/* Section B: Official AI Quotation Generator & Breakdown */}
          <div className="rounded-xl bg-[#101014] border border-[#22222B] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Official Couture Quotation</span>
                </h3>
                {quotation && (
                  quotation.isDemo ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 border border-amber-800/40 text-[#E5C378]">
                      DEMO GENERATION
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#16161C] border border-[#C5A059]/40 text-[#D4AF37]">
                      GEMINI 3.8 FLASH
                    </span>
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                {quotation && !isEditingQuotation && (
                  <button
                    onClick={() => {
                      setEditedTitle(quotation.projectTitle);
                      setEditedSummary(quotation.briefSummary);
                      setEditedItems(quotation.items);
                      setEditedRevisionPolicy(quotation.revisionPolicy);
                      setEditedTimeline(quotation.deliveryTimeline);
                      setIsEditingQuotation(true);
                    }}
                    className="px-2.5 py-1 text-xs text-[#E8E2D5]/70 hover:text-[#F5F0E6] bg-[#16161C] border border-[#22222B] rounded flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-[#C5A059]" />
                    <span>Edit Quotation</span>
                  </button>
                )}

                <button
                  onClick={() => onGenerateAiQuotation(project.id)}
                  disabled={isGeneratingAi}
                  className="px-3 py-1 text-xs text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:brightness-110 font-semibold rounded shadow flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{quotation ? 'Regenerate with AI' : 'Generate AI Quotation'}</span>
                </button>
              </div>
            </div>

            {!quotation ? (
              <div className="p-8 text-center rounded-lg bg-[#0A0A0C] border border-dashed border-[#22222B] space-y-3">
                <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto opacity-70" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#F5F0E6]">
                    No Quotation Formulated Yet
                  </h4>
                  <p className="text-xs text-[#E8E2D5]/60 mt-1 max-w-md mx-auto">
                    Click "Generate AI Quotation" to automatically synthesize deliverables,
                    3-phase scope of work, timeline, and pricing based on this client brief.
                  </p>
                </div>
                <button
                  onClick={() => onGenerateAiQuotation(project.id)}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 text-xs font-semibold text-[#0A0A0C] bg-[#D4AF37] hover:bg-[#E5C378] rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0A0C]" />
                  <span>{isGeneratingAi ? 'Synthesizing with Gemini...' : 'Generate Quotation Now'}</span>
                </button>
              </div>
            ) : isEditingQuotation ? (
              /* Quotation In-place Editor */
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">
                    Quotation Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-[#0A0A0C] border border-[#22222B] text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">
                    Brief Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded bg-[#0A0A0C] border border-[#22222B] text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none resize-none"
                  />
                </div>

                {/* Line Items Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#E8E2D5]/60">
                    <span>Itemized Scope Phases</span>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Phase Line</span>
                    </button>
                  </div>

                  {editedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-[#0A0A0C] border border-[#22222B] grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          placeholder="Phase Title"
                          value={item.title}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          className="w-full px-2 py-1 bg-[#16161C] border border-[#22222B] rounded text-[#F5F0E6]"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2 py-1 bg-[#16161C] border border-[#22222B] rounded text-[#E8E2D5]/80"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-[#16161C] border border-[#22222B] rounded text-[#D4AF37] font-mono font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-400/60 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="text-right pt-2 text-xs font-mono text-[#D4AF37]">
                    Calculated Total: {quotation.currency} {totalCalculated.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">
                      Revision Policy
                    </label>
                    <input
                      type="text"
                      value={editedRevisionPolicy}
                      onChange={(e) => setEditedRevisionPolicy(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0A0A0C] border border-[#22222B] rounded text-[#F5F0E6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">
                      Delivery Timeline
                    </label>
                    <input
                      type="text"
                      value={editedTimeline}
                      onChange={(e) => setEditedTimeline(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0A0A0C] border border-[#22222B] rounded text-[#F5F0E6]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingQuotation(false)}
                    className="px-3 py-1.5 text-xs text-[#E8E2D5]/70 hover:text-[#F5F0E6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuotationEdit}
                    disabled={isSavingEdit}
                    className="px-4 py-1.5 text-xs font-semibold bg-[#D4AF37] text-[#0A0A0C] rounded flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Quotation Display View */
              <div className="space-y-4 pt-1">
                <div>
                  <h4 className="font-serif text-base text-[#F5F0E6] font-medium">
                    {quotation.projectTitle}
                  </h4>
                  <p className="mt-1 text-xs text-[#E8E2D5]/80 font-light leading-relaxed">
                    {quotation.briefSummary}
                  </p>
                </div>

                {/* Scope of Work & Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#0A0A0C] border border-[#22222B] space-y-1.5">
                    <span className="font-mono text-[#C5A059] block text-[11px] uppercase tracking-wider font-semibold">
                      Scope of Work:
                    </span>
                    <ul className="space-y-1 text-[#E8E2D5]/80 font-light">
                      {quotation.scopeOfWork.map((sc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#D4AF37] mt-0.5">&middot;</span>
                          <span>{sc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0A0A0C] border border-[#22222B] space-y-1.5">
                    <span className="font-mono text-[#C5A059] block text-[11px] uppercase tracking-wider font-semibold">
                      Deliverables:
                    </span>
                    <ul className="space-y-1 text-[#E8E2D5]/80 font-light">
                      {quotation.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Itemized Breakdown Table */}
                <div className="p-4 rounded-lg bg-[#0A0A0C] border border-[#22222B] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#E8E2D5]/60 pb-1 border-b border-[#1C1C24]">
                    <span>Itemized Commission Phase</span>
                    <span>Amount</span>
                  </div>

                  <div className="space-y-2">
                    {quotation.items.map((it) => (
                      <div key={it.id} className="flex items-start justify-between text-xs py-1">
                        <div>
                          <div className="text-[#F5F0E6] font-medium">{it.title}</div>
                          <div className="text-[#E8E2D5]/60 text-[11px]">{it.description}</div>
                        </div>
                        <div className="font-mono tabular-nums text-[#D4AF37] font-semibold text-right shrink-0 ml-4">
                          {quotation.currency} {Number(it.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1C1C24] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-sm font-semibold text-[#F5F0E6]">
                        Quotation Total
                      </span>
                      <span className="text-[11px] block font-mono text-[#E8E2D5]/60">
                        {quotation.deliveryTimeline}
                      </span>
                    </div>
                    <div className="text-xl font-mono tabular-nums font-bold text-[#D4AF37]">
                      {quotation.currency} {quotation.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Revision terms */}
                <div className="text-[11px] font-mono text-[#E8E2D5]/60 flex items-center justify-between">
                  <span>Revision Terms: {quotation.revisionPolicy}</span>
                  {project.status === 'quotation_prepared' && (
                    <button
                      onClick={() =>
                        onUpdateStatus(
                          project.id,
                          'awaiting_payment',
                          'Quotation approved by client. Awaiting PayPal Sandbox checkout.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#16161C] hover:bg-[#22222B] border border-[#C5A059]/40 text-[#D4AF37] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send to Client (Awaiting Payment)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section C: PayPal Sandbox Checkout Module */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PayPal Sandbox Payment Gateway</span>
            </h3>

            <PayPalCheckoutBox
              project={project}
              systemStatus={systemStatus}
              onPaymentSuccess={onPaymentSuccess}
              onOpenReceipt={() => onOpenReceipt(project.id)}
            />

            {isPaid && (
              <div className="flex items-center justify-end">
                <button
                  onClick={() => onOpenReceipt(project.id)}
                  className="px-4 py-2 text-xs font-semibold text-[#0A0A0C] bg-[#D4AF37] hover:bg-[#E5C378] rounded-lg transition-colors flex items-center gap-2 shadow"
                >
                  <ReceiptIcon className="w-4 h-4 text-[#0A0A0C]" />
                  <span>View Verified Haute Couture Receipt</span>
                </button>
              </div>
            )}
          </div>

          {/* Section D: Status Audit History */}
          <div className="p-4 rounded-xl bg-[#101014] border border-[#22222B] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              Timeline & Audit Log
            </h4>
            <div className="space-y-2">
              {project.statusHistory.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-[#E8E2D5]/50 font-mono">
                      <span className="uppercase text-[#D4AF37]">{item.status.replace('_', ' ')}</span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[#E8E2D5]/80 font-light mt-0.5">{item.note}</p>
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
