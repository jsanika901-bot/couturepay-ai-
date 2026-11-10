import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Scissors } from 'lucide-react';
import type { Receipt, Project } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen) return null;

  const receipt = project.receipt;
  if (!receipt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#101014] border border-[#22222B] text-center space-y-3">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">No Receipt Generated</h3>
          <p className="text-xs text-[#E8E2D5]/70">
            A receipt is generated automatically upon verified PayPal Sandbox payment capture.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#16161C] border border-[#22222B] text-xs text-[#F5F0E6]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0A0A0C] border border-[#22222B] shadow-2xl my-6 text-[#F5F0E6] flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print px-6 py-4 border-b border-[#22222B] flex items-center justify-between bg-[#101014] shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-base font-semibold text-[#F5F0E6]">
              Verified Atelier Payment Receipt
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#16161C] hover:bg-[#22222B] border border-[#22222B] text-xs text-[#E8E2D5] font-medium transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#E8E2D5]/60 hover:text-[#F5F0E6] hover:bg-[#16161C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Body */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-[#0E0E12] print:bg-white print:text-black space-y-6">
          {/* Watermark Notice */}
          <div className="p-3 rounded-lg border border-dashed border-[#C5A059]/40 bg-[#16161C]/60 print:bg-slate-100 print:border-slate-300 text-center text-xs font-mono text-[#D4AF37] print:text-slate-800">
            [OFFICIAL RECEIPT · TEST PAYMENT / PAYPAL SANDBOX ENVIRONMENT]
          </div>

          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#22222B] print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#D4AF37] text-[#0A0A0C] font-serif font-bold flex items-center justify-center text-sm">
                  C
                </div>
                <h1 className="font-serif text-xl font-bold tracking-wider text-[#FBF9F5] print:text-black">
                  {receipt.designerStudio || 'ATELIER VIVIENNE LAURENT'}
                </h1>
              </div>
              <p className="mt-1 text-xs text-[#E8E2D5]/70 print:text-slate-600 font-mono">
                Haute Couture Sketch Commissions & Atelier Direction
              </p>
              <p className="text-xs text-[#E8E2D5]/50 print:text-slate-500 font-mono">
                {receipt.designerEmail} · Paris Atelier
              </p>
            </div>

            <div className="sm:text-right font-mono text-xs space-y-1">
              <div>
                <span className="text-[#E8E2D5]/50 print:text-slate-500">Receipt No: </span>
                <span className="text-[#F5F0E6] print:text-black font-bold">{receipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/50 print:text-slate-500">Date: </span>
                <span className="text-[#F5F0E6] print:text-black">
                  {new Date(receipt.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/50 print:text-slate-500">Status: </span>
                <span className="text-emerald-400 print:text-emerald-700 font-bold">COMPLETED / CAPTURED</span>
              </div>
            </div>
          </div>

          {/* Client & Commission Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#22222B] print:border-slate-300 text-xs">
            <div>
              <span className="text-[#E8E2D5]/50 print:text-slate-500 font-mono block text-[11px] uppercase tracking-wider mb-1">
                Billed To Client:
              </span>
              <div className="font-serif text-base font-semibold text-[#F5F0E6] print:text-black">
                {receipt.clientName}
              </div>
              <div className="text-[#E8E2D5]/80 print:text-slate-700 font-mono">{receipt.clientEmail}</div>
              {project.brief.clientLocation && (
                <div className="text-[#E8E2D5]/60 print:text-slate-500">{project.brief.clientLocation}</div>
              )}
            </div>

            <div>
              <span className="text-[#E8E2D5]/50 print:text-slate-500 font-mono block text-[11px] uppercase tracking-wider mb-1">
                Couture Commission:
              </span>
              <div className="font-serif text-base font-semibold text-[#F5F0E6] print:text-black">
                {receipt.projectTitle}
              </div>
              <div className="text-[#D4AF37] print:text-slate-700 font-mono text-[11px]">
                {receipt.garmentCategory} · {project.brief.occasion}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3 pb-6 border-b border-[#22222B] print:border-slate-300">
            <div className="flex items-center justify-between text-xs font-mono text-[#E8E2D5]/60 print:text-slate-500 uppercase tracking-wider pb-2 border-b border-[#22222B] print:border-slate-300">
              <span>Item & Deliverable Description</span>
              <span>Amount</span>
            </div>

            <div className="space-y-2">
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#F5F0E6] print:text-black font-light">{item.description}</span>
                  <span className="font-mono tabular-nums text-[#E8E2D5] print:text-black font-medium">
                    {receipt.currency} {Number(item.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="pt-4 flex items-center justify-between border-t border-[#22222B] print:border-slate-300">
              <div>
                <span className="font-serif text-base font-semibold text-[#F5F0E6] print:text-black">
                  Total Paid via PayPal Sandbox
                </span>
                <span className="text-[11px] block font-mono text-emerald-400 print:text-emerald-700">
                  Verified Payment Confirmed
                </span>
              </div>
              <div className="font-mono tabular-nums text-xl font-bold text-[#D4AF37] print:text-black">
                {receipt.currency} {Number(receipt.amount).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Transaction Metadata & Verification */}
          <div className="p-4 rounded-xl bg-[#16161C] print:bg-slate-100 border border-[#22222B] print:border-slate-300 text-xs font-mono space-y-2">
            <div className="flex items-center gap-1.5 text-[#D4AF37] print:text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>PAYPAL ORDERS API CAPTURE RECORD</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#E8E2D5]/70 print:text-slate-600">
              <div>
                <span className="text-[#E8E2D5]/40 print:text-slate-500">Transaction Reference: </span>
                <span className="text-[#F5F0E6] print:text-black select-all">{receipt.transactionId}</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/40 print:text-slate-500">Capture ID: </span>
                <span className="text-[#F5F0E6] print:text-black select-all">{receipt.captureReference}</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/40 print:text-slate-500">Environment: </span>
                <span className="text-amber-400 print:text-amber-800 font-bold">SANDBOX (TEST)</span>
              </div>
              <div>
                <span className="text-[#E8E2D5]/40 print:text-slate-500">Timestamp: </span>
                <span className="text-[#F5F0E6] print:text-black">{receipt.date}</span>
              </div>
            </div>
          </div>

          {/* Atelier Seal / Signature */}
          <div className="pt-4 flex items-center justify-between text-xs text-[#E8E2D5]/50 print:text-slate-500">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif italic">Atelier Vivienne Laurent Haute Couture</span>
            </div>
            <div className="font-mono text-[11px]">COUTUREPAY AI VERIFIED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
