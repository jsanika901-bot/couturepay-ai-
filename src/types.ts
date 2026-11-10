export type ProjectStatus =
  | 'brief_received'
  | 'quotation_prepared'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'in_progress'
  | 'delivered';

export type GarmentCategory =
  | 'Haute Couture Gown'
  | 'Bespoke Bridal'
  | 'Red Carpet Gala'
  | 'Tailored Tuxedo & Suiting'
  | 'Avant-Garde Runway'
  | 'Editorial Corsetry'
  | 'Ready-to-Wear Capsule';

export interface FashionBrief {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientLocation?: string;
  garmentCategory: GarmentCategory;
  occasion: string;
  inspirationMood: string;
  colorPalette: string[];
  fabricPreferences: string[];
  silhouetteNotes: string;
  budgetMin: number;
  budgetMax: number;
  currency: 'USD' | 'EUR' | 'GBP';
  deadline: string;
  specialRequirements?: string;
  submittedAt: string;
}

export interface QuotationItem {
  id: string;
  title: string;
  phase: string;
  description: string;
  amount: number;
}

export interface Quotation {
  id: string;
  projectId: string;
  projectTitle: string;
  briefSummary: string;
  scopeOfWork: string[];
  deliverables: string[];
  items: QuotationItem[];
  totalAmount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  revisionPolicy: string;
  deliveryTimeline: string;
  designerNotes?: string;
  isAiGenerated: boolean;
  isDemo: boolean;
  generatedAt: string;
  status: 'draft' | 'presented' | 'approved' | 'rejected';
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  orderId: string;
  captureId: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  payerEmail?: string;
  payerName?: string;
  paidAt: string;
  isSandbox: boolean;
  invoiceNumber: string;
}

export interface Receipt {
  receiptNumber: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  clientEmail: string;
  designerStudio: string;
  designerEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  captureReference: string;
  date: string;
  garmentCategory: string;
  isSandboxTestPayment: boolean;
  items: { description: string; amount: number }[];
}

export interface StatusHistoryItem {
  status: ProjectStatus;
  timestamp: string;
  note: string;
  actor: 'designer' | 'client' | 'system';
}

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  brief: FashionBrief;
  quotation?: Quotation;
  payment?: PaymentRecord;
  receipt?: Receipt;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignerProfile {
  atelierName: string;
  designerName: string;
  email: string;
  location: string;
  defaultCurrency: 'USD' | 'EUR' | 'GBP';
  defaultRevisionPolicy: string;
  avatarUrl?: string;
}

export interface SystemStatus {
  geminiAvailable: boolean;
  geminiModel: string;
  paypalConnected: boolean;
  paypalClientId: string | null;
  paypalMode: 'sandbox';
  demoMode: boolean;
}

export interface DashboardMetrics {
  totalProjects: number;
  pendingQuotations: number;
  paidProjects: number;
  sandboxPaymentVolume: number;
  currency: string;
  statusDistribution: Record<ProjectStatus, number>;
}
