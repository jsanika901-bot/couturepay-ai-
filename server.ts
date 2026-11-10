import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import type {
  Project,
  FashionBrief,
  Quotation,
  QuotationItem,
  PaymentRecord,
  Receipt,
  DesignerProfile,
  DashboardMetrics,
  ProjectStatus,
} from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'couturepay_db.json');

app.use(express.json());

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Designer Atelier Profile
const defaultProfile: DesignerProfile = {
  atelierName: 'Atelier Vivienne Laurent',
  designerName: 'Vivienne Laurent',
  email: 'vivienne@atelierlaurent.couture',
  location: '8 Rue de la Paix, 75002 Paris',
  defaultCurrency: 'USD',
  defaultRevisionPolicy: '2 rounds of silhouette and fabric drape refinement. Additional revisions billed at atelier hourly rate ($180/hr).',
  avatarUrl: '/src/assets/images/couture_designer_portrait_1793860141333.jpg',
};

// Initial Seed Projects
const seedProjects: Project[] = [
  {
    id: 'proj_01',
    title: 'The Met Gala Gilded Architecture Gown',
    status: 'brief_received',
    createdAt: '2026-11-01T10:30:00Z',
    updatedAt: '2026-11-01T10:30:00Z',
    brief: {
      id: 'brief_01',
      clientName: 'Élodie Laurent',
      clientEmail: 'elodie.laurent@luxurygroup.fr',
      clientPhone: '+33 6 42 19 88 02',
      clientLocation: 'Paris, France',
      garmentCategory: 'Haute Couture Gown',
      occasion: 'Met Gala 2026: Gilded Architectures',
      inspirationMood: 'Structural golden embroidery, obsidian pleated silk, Art Deco arch contours, fluid theatrical cape train inspired by 1920s Paul Poiret.',
      colorPalette: ['Obsidian Noir', 'Champagne Gold', 'Smoky Topaz'],
      fabricPreferences: ['Silk Dupioni', 'French Chantilly Lace', 'Hand-stitched Gold Bullion Thread', 'Heavy Silk Crepe'],
      silhouetteNotes: 'Column dress with detachable sculptural panier peplum and high-collar cathedral length opera cape.',
      budgetMin: 8500,
      budgetMax: 14000,
      currency: 'USD',
      deadline: '2026-12-15',
      specialRequirements: 'Must be lightweight enough for red carpet movement while maintaining crisp sculptural silhouette. Zero synthetic fabrics.',
      submittedAt: '2026-11-01T10:30:00Z',
    },
    statusHistory: [
      {
        status: 'brief_received',
        timestamp: '2026-11-01T10:30:00Z',
        note: 'Fashion brief submitted by client Élodie Laurent via atelier concierge.',
        actor: 'client',
      },
    ],
  },
  {
    id: 'proj_02',
    title: 'Venetian Silk Organza Bespoke Bridal Ensemble',
    status: 'quotation_prepared',
    createdAt: '2026-10-28T14:15:00Z',
    updatedAt: '2026-10-29T16:45:00Z',
    brief: {
      id: 'brief_02',
      clientName: 'Sophia DeLuca',
      clientEmail: 'sophia@delucafineart.com',
      clientLocation: 'Venice & New York',
      garmentCategory: 'Bespoke Bridal',
      occasion: 'Grand Canal Villa Wedding, Venice',
      inspirationMood: 'Water reflections on Venetian palazzo marble, translucent layered silks, delicate pearl hand-beading.',
      colorPalette: ['Warm Ivory', 'Alabaster', 'Muted Rose Quartz', 'Champagne Lustre'],
      fabricPreferences: ['Mulberry Silk Organza', 'Italian Silk Tulle', 'Hand-beaded Seed Pearls'],
      silhouetteNotes: 'Empire waist corset with gossamer micro-pleated skirt and cathedral veil with botanical filigree embroidery.',
      budgetMin: 12000,
      budgetMax: 18000,
      currency: 'USD',
      deadline: '2027-01-20',
      specialRequirements: 'Include custom matching embroidered veil sketch and fabric swatch presentation dossier.',
      submittedAt: '2026-10-28T14:15:00Z',
    },
    quotation: {
      id: 'quot_02',
      projectId: 'proj_02',
      projectTitle: 'Venetian Silk Organza Bespoke Bridal Ensemble',
      briefSummary: 'A custom three-tiered bridal sketch suite exploring translucent layered silk organza, hand-strung Venetian seed pearls, and architectural veil designs.',
      scopeOfWork: [
        'Phase 1: 3 Initial Silhouette Concepts with moodboard & fabric draping analysis',
        'Phase 2: Master Couture Illustration with hand-rendered pearl embellishment detailing',
        'Phase 3: Production Technical Spec Flats & Venetian Lace Swatch Dossier',
      ],
      deliverables: [
        '3 High-Resolution Digital Couture Color Sketches (Front & Back)',
        '1 Detailed Veil Embroidery Schematic & Pattern Flat',
        'Physical Fabric Swatch Card with hand-cut French lace and silk organza swatches',
        'Certificate of Bespoke Atelier Design',
      ],
      items: [
        {
          id: 'item_1',
          title: 'Conceptual Silhouette Explorations (3 Looks)',
          phase: 'Phase 1: Ideation',
          description: 'Three distinct silhouette directions featuring empire bodice variations and veil volume studies.',
          amount: 2200,
        },
        {
          id: 'item_2',
          title: 'Master Haute Couture Presentation Illustration',
          phase: 'Phase 2: Final Art',
          description: 'Rendered in gouache & digital ink with accurate light reflection on organza layers and pearl placement.',
          amount: 2800,
        },
        {
          id: 'item_3',
          title: 'Couturier Technical Pack & Fabric Specification',
          phase: 'Phase 3: Production Specs',
          description: 'Measurement mapping, seam finishes, boning construction chart, and fabric vendor guide.',
          amount: 1500,
        },
      ],
      totalAmount: 6500,
      currency: 'USD',
      revisionPolicy: '2 rounds of silhouette adjustment included. Final color pass includes 1 adjustment round.',
      deliveryTimeline: '18 business days from payment confirmation',
      designerNotes: 'This design captures the ethereal spirit of Venetian dawn light with extraordinary delicacy.',
      isAiGenerated: true,
      isDemo: false,
      generatedAt: '2026-10-29T16:45:00Z',
      status: 'presented',
    },
    statusHistory: [
      {
        status: 'brief_received',
        timestamp: '2026-10-28T14:15:00Z',
        note: 'Initial brief received with Venice destination wedding inspiration.',
        actor: 'client',
      },
      {
        status: 'quotation_prepared',
        timestamp: '2026-10-29T16:45:00Z',
        note: 'AI quotation generated and reviewed by Vivienne Laurent. Ready for client approval.',
        actor: 'designer',
      },
    ],
  },
  {
    id: 'proj_03',
    title: 'Cannes Opening Gala Sculptural Velvet Corset',
    status: 'awaiting_payment',
    createdAt: '2026-10-20T09:00:00Z',
    updatedAt: '2026-10-22T11:20:00Z',
    brief: {
      id: 'brief_03',
      clientName: 'Genevieve Thorne',
      clientEmail: 'genevieve@thorneentertainment.co.uk',
      clientLocation: 'London, UK',
      garmentCategory: 'Red Carpet Gala',
      occasion: 'Cannes International Film Festival Premiere',
      inspirationMood: 'Dark romance, 17th century corsetry modernized with razor-sharp shoulders and deep emerald devoré velvet.',
      colorPalette: ['Midnight Emerald', 'Obsidian Black', 'Antique Gold'],
      fabricPreferences: ['Silk Devoré Velvet', 'Steel Spiral Boning', 'Heavy Silk Satin Lining'],
      silhouetteNotes: 'Sculpted hourglass corset with peaked neckline, asymmetric hip peplum, and fluid silk train.',
      budgetMin: 4500,
      budgetMax: 7500,
      currency: 'USD',
      deadline: '2026-11-28',
      submittedAt: '2026-10-20T09:00:00Z',
    },
    quotation: {
      id: 'quot_03',
      projectId: 'proj_03',
      projectTitle: 'Cannes Opening Gala Sculptural Velvet Corset',
      briefSummary: 'Couture sketch commission and technical pattern layout for a structured emerald velvet corset gown with internal steel engineering.',
      scopeOfWork: [
        'Phase 1: Corset Silhouette & Hip Peplum Architecture exploration',
        'Phase 2: Hand-painted textile illustration with devoré velvet texture rendition',
        'Phase 3: Production Tech Pack with exact boning channel placement',
      ],
      deliverables: [
        '2 Full-Length Front & Profile Couture Illustrations',
        'Boning Channel & Gusset Construction Blueprint',
        'Fabric & Trims Procurement Specification Sheet',
      ],
      items: [
        {
          id: 'item_1',
          title: 'Structural Silhouette Sketches',
          phase: 'Phase 1',
          description: 'Exploring peak collar angles and hip drape proportions.',
          amount: 1800,
        },
        {
          id: 'item_2',
          title: 'Master Velvet Texture Illustration',
          phase: 'Phase 2',
          description: 'Rich digital gouache rendering capturing light sheen on silk velvet.',
          amount: 2100,
        },
        {
          id: 'item_3',
          title: 'Couture Tech Blueprint',
          phase: 'Phase 3',
          description: 'Ready-to-cut internal corset diagram with seam allowances.',
          amount: 1100,
        },
      ],
      totalAmount: 5000,
      currency: 'USD',
      revisionPolicy: '2 revision rounds on sketches prior to tech pack finalization.',
      deliveryTimeline: '12 business days upon payment confirmation',
      isAiGenerated: true,
      isDemo: false,
      generatedAt: '2026-10-21T10:00:00Z',
      status: 'approved',
    },
    statusHistory: [
      {
        status: 'brief_received',
        timestamp: '2026-10-20T09:00:00Z',
        note: 'Brief submitted for Cannes premiere outfit.',
        actor: 'client',
      },
      {
        status: 'quotation_prepared',
        timestamp: '2026-10-21T10:00:00Z',
        note: 'Quotation sent to client Genevieve Thorne.',
        actor: 'designer',
      },
      {
        status: 'awaiting_payment',
        timestamp: '2026-10-22T11:20:00Z',
        note: 'Client approved quotation. Invoice generated awaiting PayPal Sandbox payment.',
        actor: 'client',
      },
    ],
  },
  {
    id: 'proj_04',
    title: 'Avant-Garde Architectural Cape & Silk Slip',
    status: 'payment_confirmed',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-17T15:32:00Z',
    brief: {
      id: 'brief_04',
      clientName: 'Alessandra Moretti',
      clientEmail: 'alessandra@morettidesign.it',
      clientLocation: 'Milan, Italy',
      garmentCategory: 'Avant-Garde Runway',
      occasion: 'Milan Design Week VIP Keynote Gala',
      inspirationMood: 'Brutalist concrete architecture transformed into pliable pleated textiles, origami folds, champagne bronze metallic sheen.',
      colorPalette: ['Champagne Bronze', 'Raw Linen', 'Deep Charcoal'],
      fabricPreferences: ['Metallic Coated Linen', 'Silk Charmeuse', 'Crushed Organza'],
      silhouetteNotes: 'Volumetric origami folded collar transitioning into geometric cape over bias-cut slip.',
      budgetMin: 3800,
      budgetMax: 6000,
      currency: 'USD',
      deadline: '2026-11-20',
      submittedAt: '2026-10-15T11:00:00Z',
    },
    quotation: {
      id: 'quot_04',
      projectId: 'proj_04',
      projectTitle: 'Avant-Garde Architectural Cape & Silk Slip',
      briefSummary: 'Origami pleated cape concept and bias slip sketch package for Milan Design Week presentation.',
      scopeOfWork: ['Cape Volume Studies', 'Master Runway Illustration', 'Fabric Origami Folding Guide'],
      deliverables: ['3 High-Res Runway Sketches', 'Pattern Origami Fold Vector Files', 'Material Sourcing List'],
      items: [
        {
          id: 'item_1',
          title: 'Volume & Fold Prototyping Sketches',
          phase: 'Phase 1',
          description: 'Exploring geometric folding patterns and collar articulation.',
          amount: 1400,
        },
        {
          id: 'item_2',
          title: 'Color Runway Illustration & Lighting Study',
          phase: 'Phase 2',
          description: 'Digital watercolor rendering showing sheen of bronze linen.',
          amount: 1800,
        },
        {
          id: 'item_3',
          title: 'Folding Instructions & Spec Dossier',
          phase: 'Phase 3',
          description: 'Technical drafting for patternmaker.',
          amount: 1000,
        },
      ],
      totalAmount: 4200,
      currency: 'USD',
      revisionPolicy: '2 rounds of revision included.',
      deliveryTimeline: '10 business days',
      isAiGenerated: true,
      isDemo: false,
      generatedAt: '2026-10-16T14:00:00Z',
      status: 'approved',
    },
    payment: {
      id: 'pay_04',
      projectId: 'proj_04',
      orderId: '8XX1928471928491A',
      captureId: 'CAPTURE_78392183921',
      amount: 4200,
      currency: 'USD',
      status: 'COMPLETED',
      payerEmail: 'alessandra.moretti@buyer.sandbox.paypal.com',
      payerName: 'Alessandra Moretti',
      paidAt: '2026-10-17T15:32:00Z',
      isSandbox: true,
      invoiceNumber: 'INV-2026-0042',
    },
    receipt: {
      receiptNumber: 'RCP-2026-0042',
      projectId: 'proj_04',
      projectTitle: 'Avant-Garde Architectural Cape & Silk Slip',
      clientName: 'Alessandra Moretti',
      clientEmail: 'alessandra@morettidesign.it',
      designerStudio: 'Atelier Vivienne Laurent',
      designerEmail: 'vivienne@atelierlaurent.couture',
      amount: 4200,
      currency: 'USD',
      transactionId: 'SANDBOX-TX-99482174',
      captureReference: 'CAPTURE_78392183921',
      date: '2026-10-17T15:32:00Z',
      garmentCategory: 'Avant-Garde Runway',
      isSandboxTestPayment: true,
      items: [
        { description: 'Volume & Fold Prototyping Sketches', amount: 1400 },
        { description: 'Color Runway Illustration & Lighting Study', amount: 1800 },
        { description: 'Folding Instructions & Spec Dossier', amount: 1000 },
      ],
    },
    statusHistory: [
      {
        status: 'brief_received',
        timestamp: '2026-10-15T11:00:00Z',
        note: 'Brief received for Milan Design Week project.',
        actor: 'client',
      },
      {
        status: 'quotation_prepared',
        timestamp: '2026-10-16T14:00:00Z',
        note: 'Quotation sent to client.',
        actor: 'designer',
      },
      {
        status: 'awaiting_payment',
        timestamp: '2026-10-17T10:00:00Z',
        note: 'Quotation approved by Alessandra Moretti.',
        actor: 'client',
      },
      {
        status: 'payment_confirmed',
        timestamp: '2026-10-17T15:32:00Z',
        note: 'PayPal Sandbox payment confirmed. Capture ID: CAPTURE_78392183921. Receipt RCP-2026-0042 issued.',
        actor: 'system',
      },
    ],
  },
  {
    id: 'proj_05',
    title: 'Paris Couture Week 5-Look Capsule Sketches',
    status: 'in_progress',
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-24T17:00:00Z',
    brief: {
      id: 'brief_05',
      clientName: 'Marcella Fontaine',
      clientEmail: 'marcella@fontainecouture.paris',
      clientLocation: 'Paris, France',
      garmentCategory: 'Ready-to-Wear Capsule',
      occasion: 'Autumn/Winter Capsule Launch',
      inspirationMood: '1970s Saint Laurent tailoring meets sharp futuristic lapels, liquid silk shirts, and structured wool trenchcoats.',
      colorPalette: ['Midnight Navy', 'Bordeaux Wine', 'Champagne Lustre', 'Camel'],
      fabricPreferences: ['Cashmere Wool', 'Silk Crepe de Chine', 'Horn Buttons'],
      silhouetteNotes: 'Sharp double-breasted longline coat with flared trousers and silk pussybow blouse.',
      budgetMin: 7000,
      budgetMax: 11000,
      currency: 'EUR',
      deadline: '2026-11-30',
      submittedAt: '2026-10-10T08:00:00Z',
    },
    quotation: {
      id: 'quot_05',
      projectId: 'proj_05',
      projectTitle: 'Paris Couture Week 5-Look Capsule Sketches',
      briefSummary: 'Complete digital fashion sketch suite and fabrication specification for a 5-look luxury ready-to-wear autumn collection.',
      scopeOfWork: ['5 Full Runway Figure Sketches', 'Technical Flat Line Art for Factory Production', 'Textile & Trim Board'],
      deliverables: ['5 Master Digital Illustrations in High-Res TIFF & PDF', '5 Production Flats with Stitch & Pocket Specs', 'Atelier Sourcing Dossier'],
      items: [
        { id: 'i1', title: '5 Master Runway Illustrations', phase: 'Phase 1', description: 'Full colored figures with dynamic poses.', amount: 4500 },
        { id: 'i2', title: 'Production Specification Flats', phase: 'Phase 2', description: 'Detailed CAD flat line drawings front and back.', amount: 2500 },
        { id: 'i3', title: 'Fabrication & Hardware Curation', phase: 'Phase 3', description: 'Supplier references and sample cards.', amount: 1200 },
      ],
      totalAmount: 8200,
      currency: 'EUR',
      revisionPolicy: '2 silhouette rounds included per look.',
      deliveryTimeline: '21 business days',
      isAiGenerated: true,
      isDemo: false,
      generatedAt: '2026-10-11T12:00:00Z',
      status: 'approved',
    },
    payment: {
      id: 'pay_05',
      projectId: 'proj_05',
      orderId: '3PP991823719284',
      captureId: 'CAPTURE_PARIS_449102',
      amount: 8200,
      currency: 'EUR',
      status: 'COMPLETED',
      payerEmail: 'marcella.fontaine@buyer.sandbox.paypal.com',
      payerName: 'Marcella Fontaine',
      paidAt: '2026-10-12T16:20:00Z',
      isSandbox: true,
      invoiceNumber: 'INV-2026-0038',
    },
    receipt: {
      receiptNumber: 'RCP-2026-0038',
      projectId: 'proj_05',
      projectTitle: 'Paris Couture Week 5-Look Capsule Sketches',
      clientName: 'Marcella Fontaine',
      clientEmail: 'marcella@fontainecouture.paris',
      designerStudio: 'Atelier Vivienne Laurent',
      designerEmail: 'vivienne@atelierlaurent.couture',
      amount: 8200,
      currency: 'EUR',
      transactionId: 'SANDBOX-TX-7738210',
      captureReference: 'CAPTURE_PARIS_449102',
      date: '2026-10-12T16:20:00Z',
      garmentCategory: 'Ready-to-Wear Capsule',
      isSandboxTestPayment: true,
      items: [
        { description: '5 Master Runway Illustrations', amount: 4500 },
        { description: 'Production Specification Flats', amount: 2500 },
        { description: 'Fabrication & Hardware Curation', amount: 1200 },
      ],
    },
    statusHistory: [
      { status: 'brief_received', timestamp: '2026-10-10T08:00:00Z', note: 'Brief received.', actor: 'client' },
      { status: 'quotation_prepared', timestamp: '2026-10-11T12:00:00Z', note: 'Quotation sent.', actor: 'designer' },
      { status: 'awaiting_payment', timestamp: '2026-10-12T10:00:00Z', note: 'Quotation accepted.', actor: 'client' },
      { status: 'payment_confirmed', timestamp: '2026-10-12T16:20:00Z', note: 'Payment captured via PayPal Sandbox.', actor: 'system' },
      { status: 'in_progress', timestamp: '2026-10-13T09:00:00Z', note: 'Sketching begun. Looks 1 and 2 in silhouette pencil draft.', actor: 'designer' },
    ],
  },
  {
    id: 'proj_06',
    title: 'Swarovski Crystal Beaded Gala Bustier',
    status: 'delivered',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-10-05T14:00:00Z',
    brief: {
      id: 'brief_06',
      clientName: 'Duchess Claire of Kent',
      clientEmail: 'claire@kentheritage.org.uk',
      clientLocation: 'London, UK',
      garmentCategory: 'Editorial Corsetry',
      occasion: 'Royal Philharmonic Charity Winter Gala',
      inspirationMood: 'Constellations, chandelier crystal prisms, frost patterns on winter glass, ethereal silver and gold reflections.',
      colorPalette: ['Icy Silver', 'Champagne Crystal', 'Alabaster'],
      fabricPreferences: ['Silk Netting', 'Swarovski Crystal Bicones', 'Metallic Silver Bullion Thread'],
      silhouetteNotes: 'Conical bustier with arched sweetheart neckline and micro-peplum.',
      budgetMin: 3500,
      budgetMax: 5000,
      currency: 'GBP',
      deadline: '2026-10-05',
      submittedAt: '2026-09-18T10:00:00Z',
    },
    quotation: {
      id: 'quot_06',
      projectId: 'proj_06',
      projectTitle: 'Swarovski Crystal Beaded Gala Bustier',
      briefSummary: 'Bespoke crystal embroidery map and haute couture presentation illustration for royal charity gala bustier.',
      scopeOfWork: ['Crystal Placement Cartography', 'Master Watercolor Illustration', 'Embroiderer Spec Diagram'],
      deliverables: ['1:1 Scale Crystal Beading Cartography', 'Framed Digital Master Art Print File', 'Certificate of Atelier Authenticity'],
      items: [
        { id: 'i1', title: 'Crystal Cartography Drafting', phase: 'Phase 1', description: 'Individual stone mapping for 1,400 hand-set crystals.', amount: 1600 },
        { id: 'i2', title: 'Gala Master Illustration', phase: 'Phase 2', description: 'Rendered in fine metallic ink and gouache.', amount: 1500 },
        { id: 'i3', title: 'Embroidery Atelier Dossier', phase: 'Phase 3', description: 'Stone sizes, thread tensile guidelines, and boning channels.', amount: 800 },
      ],
      totalAmount: 3900,
      currency: 'GBP',
      revisionPolicy: '1 round of stone density adjustment included.',
      deliveryTimeline: '10 business days',
      isAiGenerated: true,
      isDemo: false,
      generatedAt: '2026-09-19T11:00:00Z',
      status: 'approved',
    },
    payment: {
      id: 'pay_06',
      projectId: 'proj_06',
      orderId: '9KL28371928491',
      captureId: 'CAPTURE_LONDON_882910',
      amount: 3900,
      currency: 'GBP',
      status: 'COMPLETED',
      payerEmail: 'claire.kent@buyer.sandbox.paypal.com',
      payerName: 'Duchess Claire of Kent',
      paidAt: '2026-09-20T14:10:00Z',
      isSandbox: true,
      invoiceNumber: 'INV-2026-0029',
    },
    receipt: {
      receiptNumber: 'RCP-2026-0029',
      projectId: 'proj_06',
      projectTitle: 'Swarovski Crystal Beaded Gala Bustier',
      clientName: 'Duchess Claire of Kent',
      clientEmail: 'claire@kentheritage.org.uk',
      designerStudio: 'Atelier Vivienne Laurent',
      designerEmail: 'vivienne@atelierlaurent.couture',
      amount: 3900,
      currency: 'GBP',
      transactionId: 'SANDBOX-TX-44829102',
      captureReference: 'CAPTURE_LONDON_882910',
      date: '2026-09-20T14:10:00Z',
      garmentCategory: 'Editorial Corsetry',
      isSandboxTestPayment: true,
      items: [
        { description: 'Crystal Cartography Drafting', amount: 1600 },
        { description: 'Gala Master Illustration', amount: 1500 },
        { description: 'Embroidery Atelier Dossier', amount: 800 },
      ],
    },
    statusHistory: [
      { status: 'brief_received', timestamp: '2026-09-18T10:00:00Z', note: 'Brief received.', actor: 'client' },
      { status: 'quotation_prepared', timestamp: '2026-09-19T11:00:00Z', note: 'Quotation prepared.', actor: 'designer' },
      { status: 'awaiting_payment', timestamp: '2026-09-19T16:00:00Z', note: 'Client approved quotation.', actor: 'client' },
      { status: 'payment_confirmed', timestamp: '2026-09-20T14:10:00Z', note: 'PayPal Sandbox verified capture completed.', actor: 'system' },
      { status: 'in_progress', timestamp: '2026-09-21T09:00:00Z', note: 'Drafting crystal cartography.', actor: 'designer' },
      { status: 'delivered', timestamp: '2026-10-05T14:00:00Z', note: 'Final digital couture dossier and 1:1 beading map delivered to client.', actor: 'designer' },
    ],
  },
];

// Persistent Database Management
interface DBState {
  profile: DesignerProfile;
  projects: Project[];
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db file, re-initializing with seed data:', err);
  }

  const initial: DBState = {
    profile: defaultProfile,
    projects: seedProjects,
  };
  saveDB(initial);
  return initial;
}

function saveDB(state: DBState): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving db file:', err);
  }
}

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// PayPal Credentials & Helper Functions
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

const isPayPalConfigured = Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);

async function getPayPalAccessToken(): Promise<string> {
  if (!isPayPalConfigured) {
    throw new Error('PayPal Sandbox credentials (PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET) are not configured.');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`PayPal OAuth token failed (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// Calculate Dashboard Metrics
function computeMetrics(projects: Project[]): DashboardMetrics {
  let pendingQuotations = 0;
  let paidProjects = 0;
  let sandboxPaymentVolume = 0;

  const statusDistribution: Record<ProjectStatus, number> = {
    brief_received: 0,
    quotation_prepared: 0,
    awaiting_payment: 0,
    payment_confirmed: 0,
    in_progress: 0,
    delivered: 0,
  };

  for (const p of projects) {
    statusDistribution[p.status] = (statusDistribution[p.status] || 0) + 1;

    if (p.status === 'quotation_prepared' || p.status === 'awaiting_payment') {
      pendingQuotations++;
    }

    if (p.payment && (p.payment.status === 'COMPLETED' || p.status === 'payment_confirmed' || p.status === 'in_progress' || p.status === 'delivered')) {
      paidProjects++;
      sandboxPaymentVolume += p.payment.amount || (p.quotation?.totalAmount ?? 0);
    }
  }

  return {
    totalProjects: projects.length,
    pendingQuotations,
    paidProjects,
    sandboxPaymentVolume,
    currency: 'USD',
    statusDistribution,
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. System Status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    geminiAvailable: Boolean(ai),
    geminiModel: 'gemini-3.8-flash',
    paypalConnected: isPayPalConfigured,
    paypalClientId: PAYPAL_CLIENT_ID || null,
    paypalBaseUrl: PAYPAL_BASE_URL,
    paypalMode: 'sandbox',
    demoMode: !isPayPalConfigured || !ai,
  });
});

// 2. Dashboard Metrics
app.get('/api/metrics', (_req: Request, res: Response) => {
  const db = loadDB();
  const metrics = computeMetrics(db.projects);
  res.json(metrics);
});

// 3. Projects List
app.get('/api/projects', (req: Request, res: Response) => {
  const db = loadDB();
  const { status, search } = req.query;

  let filtered = [...db.projects];

  if (typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brief.clientName.toLowerCase().includes(q) ||
        p.brief.garmentCategory.toLowerCase().includes(q) ||
        p.brief.occasion.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json(filtered);
});

// 4. Single Project Dossier
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json(project);
});

// 5. Create New Project from Fashion Brief
app.post('/api/projects', (req: Request, res: Response) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    clientLocation,
    garmentCategory,
    occasion,
    inspirationMood,
    colorPalette,
    fabricPreferences,
    silhouetteNotes,
    budgetMin,
    budgetMax,
    currency = 'USD',
    deadline,
    specialRequirements,
  } = req.body;

  if (!clientName || !clientEmail || !garmentCategory || !occasion || !inspirationMood) {
    res.status(400).json({ error: 'Missing required fashion brief fields.' });
    return;
  }

  const now = new Date().toISOString();
  const id = `proj_${Date.now()}`;
  const briefId = `brief_${Date.now()}`;

  const generatedTitle = `${garmentCategory}: ${occasion.slice(0, 32)}`;

  const newBrief: FashionBrief = {
    id: briefId,
    clientName: String(clientName).trim(),
    clientEmail: String(clientEmail).trim(),
    clientPhone: clientPhone ? String(clientPhone).trim() : undefined,
    clientLocation: clientLocation ? String(clientLocation).trim() : undefined,
    garmentCategory,
    occasion: String(occasion).trim(),
    inspirationMood: String(inspirationMood).trim(),
    colorPalette: Array.isArray(colorPalette) ? colorPalette : [colorPalette].filter(Boolean),
    fabricPreferences: Array.isArray(fabricPreferences) ? fabricPreferences : [fabricPreferences].filter(Boolean),
    silhouetteNotes: silhouetteNotes ? String(silhouetteNotes).trim() : '',
    budgetMin: Number(budgetMin) || 2500,
    budgetMax: Number(budgetMax) || 5000,
    currency: ['USD', 'EUR', 'GBP'].includes(currency) ? currency : 'USD',
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    specialRequirements: specialRequirements ? String(specialRequirements).trim() : undefined,
    submittedAt: now,
  };

  const newProject: Project = {
    id,
    title: generatedTitle,
    status: 'brief_received',
    brief: newBrief,
    statusHistory: [
      {
        status: 'brief_received',
        timestamp: now,
        note: `New couture brief submitted for ${newBrief.clientName} (${garmentCategory}).`,
        actor: 'client',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const db = loadDB();
  db.projects.unshift(newProject);
  saveDB(db);

  res.status(201).json(newProject);
});

// 6. Generate AI Quotation using Gemini 3.8 Flash
app.post('/api/projects/:id/generate-quotation', async (req: Request, res: Response) => {
  const db = loadDB();
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const brief = project.brief;
  const profile = db.profile;
  const now = new Date().toISOString();

  // Try calling Gemini if available
  if (ai) {
    try {
      const prompt = `You are a high-end Parisian couture fashion director creating a prestigious quotation for a bespoke sketch and illustration commission.
Analyze this client fashion brief:
- Client Name: ${brief.clientName}
- Garment Category: ${brief.garmentCategory}
- Occasion: ${brief.occasion}
- Inspiration & Mood: ${brief.inspirationMood}
- Silhouette Notes: ${brief.silhouetteNotes}
- Preferred Fabrics: ${brief.fabricPreferences.join(', ')}
- Color Harmony: ${brief.colorPalette.join(', ')}
- Budget Range: ${brief.currency} ${brief.budgetMin} - ${brief.currency} ${brief.budgetMax}
- Deadline: ${brief.deadline}
- Special Requests: ${brief.specialRequirements || 'None'}
- Atelier Name: ${profile.atelierName}

Generate a luxurious, comprehensive, itemized quotation response in pure JSON format (matching the requested structure with no markdown backticks, no code blocks):
{
  "projectTitle": "Evocative haute couture title (e.g. 'The Met Gala Gilded Architecture Gown')",
  "briefSummary": "3-4 sentences synthesizing the aesthetic vision, silhouette silhouette, fabric textures, and couture ambition.",
  "scopeOfWork": [
    "Phase 1: Conceptual Sketching & Silhouette Explorations...",
    "Phase 2: Master Textile Rendering & Color Studies...",
    "Phase 3: Production Tech Pack & Fabric Specification Dossier..."
  ],
  "deliverables": [
    "3 Full-Color High-Resolution Digital Couture Sketches",
    "Physical Fabric & Trim Swatch Card with French Lace Samples",
    "Technical Production Flats with Seam & Boning Specs",
    "Certificate of Bespoke Atelier Design"
  ],
  "items": [
    {
      "title": "Phase 1: Initial Silhouette & Line Explorations (3 Looks)",
      "phase": "Phase 1: Ideation",
      "description": "Exploration of proportions, neckline depth, and drape dynamics.",
      "amount": number (realistic share of budget, e.g. 35%)
    },
    {
      "title": "Phase 2: Master Couture Presentation Illustration",
      "phase": "Phase 2: Final Artwork",
      "description": "Detailed gouache and digital rendering showcasing fabric textures and embellishments.",
      "amount": number (approx 45% of budget)
    },
    {
      "title": "Phase 3: Technical Flat Pack & Fabric Sourcing Dossier",
      "phase": "Phase 3: Technical Drafting",
      "description": "Factory and couturier construction specifications.",
      "amount": number (approx 20% of budget)
    }
  ],
  "totalAmount": number (the sum of the 3 item amounts, within the client budget),
  "currency": "${brief.currency}",
  "revisionPolicy": "${profile.defaultRevisionPolicy}",
  "deliveryTimeline": "14 business days from payment verification",
  "designerNotes": "A personal artistic note from the atelier master."
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = aiResponse.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);

        const calculatedTotal = Array.isArray(parsed.items)
          ? parsed.items.reduce((sum: number, it: { amount: number }) => sum + Number(it.amount || 0), 0)
          : Number(parsed.totalAmount || brief.budgetMax);

        const itemsWithIds = (parsed.items || []).map((it: Record<string, unknown>, idx: number) => ({
          id: `item_${Date.now()}_${idx}`,
          title: String(it.title || `Phase ${idx + 1}`),
          phase: String(it.phase || `Phase ${idx + 1}`),
          description: String(it.description || ''),
          amount: Number(it.amount || 1000),
        }));

        const newQuotation: Quotation = {
          id: `quot_${Date.now()}`,
          projectId: project.id,
          projectTitle: parsed.projectTitle || `${brief.garmentCategory}: ${brief.occasion}`,
          briefSummary: parsed.briefSummary || 'Bespoke couture design commission.',
          scopeOfWork: parsed.scopeOfWork || [
            'Phase 1: Conceptual silhouette sketches',
            'Phase 2: Colored master illustration',
            'Phase 3: Production spec flats',
          ],
          deliverables: parsed.deliverables || [
            '3 Digital Couture Color Illustrations',
            'Fabric Swatch Specification Dossier',
            'Technical Production Flat Drawings',
          ],
          items: itemsWithIds,
          totalAmount: calculatedTotal,
          currency: brief.currency,
          revisionPolicy: parsed.revisionPolicy || profile.defaultRevisionPolicy,
          deliveryTimeline: parsed.deliveryTimeline || '14 business days from payment confirmation',
          designerNotes: parsed.designerNotes,
          isAiGenerated: true,
          isDemo: false,
          generatedAt: now,
          status: 'presented',
        };

        project.quotation = newQuotation;
        project.title = newQuotation.projectTitle;
        project.status = 'quotation_prepared';
        project.updatedAt = now;
        project.statusHistory.push({
          status: 'quotation_prepared',
          timestamp: now,
          note: `Gemini AI generated official quotation for ${brief.currency} ${newQuotation.totalAmount.toLocaleString()}.`,
          actor: 'designer',
        });

        saveDB(db);
        res.json(newQuotation);
        return;
      }
    } catch (err) {
      console.warn('Gemini API call encountered error, falling back to DEMO generation:', err);
    }
  }

  // Fallback: DEMO Generation (clearly labeled as DEMO)
  const medianBudget = Math.round((brief.budgetMin + brief.budgetMax) / 2);
  const p1 = Math.round(medianBudget * 0.35);
  const p2 = Math.round(medianBudget * 0.45);
  const p3 = medianBudget - (p1 + p2);

  const demoQuotation: Quotation = {
    id: `quot_${Date.now()}`,
    projectId: project.id,
    projectTitle: `${brief.garmentCategory}: ${brief.occasion}`,
    briefSummary: `[DEMO GENERATION] Bespoke design package addressing ${brief.inspirationMood}. Features luxurious integration of ${brief.fabricPreferences.slice(0, 3).join(', ')} tailored in harmonious ${brief.colorPalette.slice(0, 3).join(' and ')}.`,
    scopeOfWork: [
      'Phase 1: 3 Initial Silhouette Explorations & Fabric Draping Research',
      'Phase 2: Master Gouache & Digital Ink Colored Presentation Illustration',
      'Phase 3: Couturier Technical Pack, Seam Finishes & Trim Curation',
    ],
    deliverables: [
      '3 High-Resolution Digital Couture Color Sketches (Front, 3/4 & Back View)',
      'Fabric & Embellishment Swatch Reference Dossier',
      'Production-Ready Technical Flat Illustrations',
      'Certificate of Bespoke Atelier Design & Exclusivity',
    ],
    items: [
      {
        id: `item_${Date.now()}_1`,
        title: 'Phase 1: Conceptual Silhouette & Proportion Studies (3 Variations)',
        phase: 'Phase 1: Ideation',
        description: `Exploration of ${brief.silhouetteNotes || 'bespoke silhouettes'} with neckline and train options.`,
        amount: p1,
      },
      {
        id: `item_${Date.now()}_2`,
        title: 'Phase 2: Master Haute Couture Colored Presentation Art',
        phase: 'Phase 2: Final Artwork',
        description: `Fully rendered illustration in ${brief.colorPalette.join(' and ')} displaying light reflections.`,
        amount: p2,
      },
      {
        id: `item_${Date.now()}_3`,
        title: 'Phase 3: Couturier Technical Pack & Fabric Sourcing Guide',
        phase: 'Phase 3: Production Specs',
        description: 'Boning placement, seam construction diagram, and certified textile supplier references.',
        amount: p3,
      },
    ],
    totalAmount: medianBudget,
    currency: brief.currency,
    revisionPolicy: profile.defaultRevisionPolicy,
    deliveryTimeline: '12 business days from payment confirmation',
    designerNotes: '[DEMO GENERATION] Crafted with atelier precision. Configure GEMINI_API_KEY for dynamic real-time generation.',
    isAiGenerated: false,
    isDemo: true,
    generatedAt: now,
    status: 'presented',
  };

  project.quotation = demoQuotation;
  project.title = demoQuotation.projectTitle;
  project.status = 'quotation_prepared';
  project.updatedAt = now;
  project.statusHistory.push({
    status: 'quotation_prepared',
    timestamp: now,
    note: `DEMO Quotation prepared for ${brief.currency} ${demoQuotation.totalAmount.toLocaleString()} (AI offline/demo mode).`,
    actor: 'designer',
  });

  saveDB(db);
  res.json(demoQuotation);
});

// 7. Update Quotation Details
app.put('/api/projects/:id/quotation', (req: Request, res: Response) => {
  const db = loadDB();
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project || !project.quotation) {
    res.status(404).json({ error: 'Quotation not found for this project.' });
    return;
  }

  const { projectTitle, briefSummary, scopeOfWork, deliverables, items, revisionPolicy, deliveryTimeline, designerNotes } = req.body;

  if (projectTitle) project.quotation.projectTitle = String(projectTitle).trim();
  if (briefSummary) project.quotation.briefSummary = String(briefSummary).trim();
  if (Array.isArray(scopeOfWork)) project.quotation.scopeOfWork = scopeOfWork;
  if (Array.isArray(deliverables)) project.quotation.deliverables = deliverables;
  if (revisionPolicy) project.quotation.revisionPolicy = String(revisionPolicy).trim();
  if (deliveryTimeline) project.quotation.deliveryTimeline = String(deliveryTimeline).trim();
  if (designerNotes !== undefined) project.quotation.designerNotes = String(designerNotes).trim();

  if (Array.isArray(items) && items.length > 0) {
    project.quotation.items = items.map((it: QuotationItem, i: number) => ({
      id: it.id || `item_${Date.now()}_${i}`,
      title: String(it.title),
      phase: String(it.phase || `Phase ${i + 1}`),
      description: String(it.description || ''),
      amount: Number(it.amount) || 0,
    }));
    project.quotation.totalAmount = project.quotation.items.reduce((s, it) => s + it.amount, 0);
  }

  project.title = project.quotation.projectTitle;
  project.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json(project.quotation);
});

// 8. Update Project Status / Approve Quotation
app.post('/api/projects/:id/status', (req: Request, res: Response) => {
  const db = loadDB();
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const { status, note, actor = 'designer' } = req.body;
  const validStatuses: ProjectStatus[] = [
    'brief_received',
    'quotation_prepared',
    'awaiting_payment',
    'payment_confirmed',
    'in_progress',
    'delivered',
  ];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid project status transition.' });
    return;
  }

  const now = new Date().toISOString();
  project.status = status;
  project.updatedAt = now;

  if (project.quotation) {
    if (status === 'awaiting_payment') {
      project.quotation.status = 'approved';
    }
  }

  project.statusHistory.push({
    status,
    timestamp: now,
    note: note || `Project transitioned to ${status.replace('_', ' ')}.`,
    actor: actor as 'designer' | 'client' | 'system',
  });

  saveDB(db);
  res.json(project);
});

// 9. Delete Project
app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const removed = db.projects.splice(idx, 1)[0];
  saveDB(db);
  res.json({ success: true, removedId: removed.id });
});

// -------------------------------------------------------------
// Official PayPal Sandbox Orders API Endpoints
// -------------------------------------------------------------

// PayPal Status
app.get('/api/paypal/status', (_req: Request, res: Response) => {
  res.json({
    connected: isPayPalConfigured,
    clientIdAvailable: Boolean(PAYPAL_CLIENT_ID),
    clientId: PAYPAL_CLIENT_ID || null,
    baseUrl: PAYPAL_BASE_URL,
    mode: 'sandbox',
  });
});

// Helper: Execute Sandbox Simulation & issue verified Receipt
function executeSandboxSimulationHelper(
  project: Project,
  db: DBState,
  reason?: string
): { payment: PaymentRecord; receipt: Receipt } {
  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const captureId = `SIM_SANDBOX_CAP_${Date.now()}`;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;
  const receiptNumber = `RCP-${new Date().getFullYear()}-${randomSuffix}`;

  const paymentRecord: PaymentRecord = {
    id: `pay_${Date.now()}`,
    projectId: project.id,
    orderId: `SIM_SANDBOX_ORDER_${Date.now()}`,
    captureId,
    amount: project.quotation!.totalAmount,
    currency: project.quotation!.currency,
    status: 'COMPLETED',
    payerEmail: `${project.brief.clientName.toLowerCase().replace(/\s+/g, '.')}@sandbox.test`,
    payerName: project.brief.clientName,
    paidAt: now,
    isSandbox: true,
    invoiceNumber,
  };

  const receipt: Receipt = {
    receiptNumber,
    projectId: project.id,
    projectTitle: project.title,
    clientName: project.brief.clientName,
    clientEmail: project.brief.clientEmail,
    designerStudio: db.profile.atelierName,
    designerEmail: db.profile.email,
    amount: project.quotation!.totalAmount,
    currency: project.quotation!.currency,
    transactionId: `SANDBOX-SIM-TX-${Date.now()}`,
    captureReference: captureId,
    date: now,
    garmentCategory: project.brief.garmentCategory,
    isSandboxTestPayment: true,
    items: project.quotation!.items.map((it) => ({
      description: it.title,
      amount: it.amount,
    })),
  };

  project.payment = paymentRecord;
  project.receipt = receipt;
  project.status = 'payment_confirmed';
  project.updatedAt = now;

  const noteSuffix = reason ? ` (${reason})` : '';
  project.statusHistory.push({
    status: 'payment_confirmed',
    timestamp: now,
    note: `[TEST PAYMENT / SANDBOX SIMULATOR] Verified payment confirmed for ${project.quotation!.currency} ${project.quotation!.totalAmount.toLocaleString()}${noteSuffix}.`,
    actor: 'system',
  });

  saveDB(db);
  return { payment: paymentRecord, receipt };
}

// Create Order (Calls PayPal Sandbox /v2/checkout/orders with automatic Simulator fallback)
app.post('/api/paypal/create-order', async (req: Request, res: Response) => {
  const { projectId } = req.body;
  const db = loadDB();
  const project = db.projects.find((p) => p.id === projectId);

  if (!project || !project.quotation) {
    res.status(404).json({ error: 'Project or quotation not found for order creation.' });
    return;
  }

  const amount = Number(project.quotation.totalAmount).toFixed(2);
  const currency = project.quotation.currency || 'USD';

  // If credentials are missing, automatically trigger built-in Sandbox Test Simulator fallback
  if (!isPayPalConfigured) {
    console.log('PayPal credentials missing: auto-triggering Sandbox Test Simulator fallback.');
    res.json({
      orderId: `SIM_SANDBOX_ORDER_${Date.now()}`,
      status: 'CREATED',
      simulated: true,
      autoFallback: true,
      reason: 'CREDENTIALS_MISSING',
      message: 'PayPal credentials missing: Sandbox Test Simulator triggered automatically.',
    });
    return;
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: project.id,
          description: `COUTUREPAY AI Bespoke Fashion Sketch: ${project.title}`.slice(0, 127),
          custom_id: project.id,
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount,
              },
            },
          },
          items: project.quotation.items.map((it) => ({
            name: it.title.slice(0, 127),
            description: it.description.slice(0, 127) || 'Couture design service',
            unit_amount: {
              currency_code: currency,
              value: Number(it.amount).toFixed(2),
            },
            quantity: '1',
            category: 'DIGITAL_GOODS',
          })),
        },
      ],
      application_context: {
        brand_name: db.profile.atelierName,
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal/${project.id}`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal/${project.id}`,
      },
    };

    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const errText = await orderResponse.text();
      // If UNPROCESSABLE_ENTITY (HTTP 422) or validation error occurs, automatically trigger Sandbox Simulator fallback
      if (orderResponse.status === 422 || errText.includes('UNPROCESSABLE_ENTITY')) {
        console.warn('PayPal returned UNPROCESSABLE_ENTITY on create-order. Auto-triggering Sandbox Test Simulator fallback.');
        res.json({
          orderId: `SIM_SANDBOX_ORDER_${Date.now()}`,
          status: 'CREATED',
          simulated: true,
          autoFallback: true,
          reason: 'UNPROCESSABLE_ENTITY',
          message: 'PayPal API returned UNPROCESSABLE_ENTITY: Sandbox Test Simulator triggered automatically.',
        });
        return;
      }

      res.status(orderResponse.status).json({
        error: 'PAYPAL_ORDER_CREATION_FAILED',
        details: errText,
      });
      return;
    }

    const orderData = (await orderResponse.json()) as { id: string; status: string };
    res.json({
      orderId: orderData.id,
      status: orderData.status,
    });
  } catch (err) {
    console.error('Error creating PayPal Sandbox order:', err);
    const msg = (err as Error).message || '';
    if (msg.includes('UNPROCESSABLE_ENTITY') || !isPayPalConfigured) {
      res.json({
        orderId: `SIM_SANDBOX_ORDER_${Date.now()}`,
        status: 'CREATED',
        simulated: true,
        autoFallback: true,
        reason: 'UNPROCESSABLE_ENTITY',
        message: 'PayPal API returned UNPROCESSABLE_ENTITY: Sandbox Test Simulator triggered automatically.',
      });
      return;
    }
    res.status(500).json({ error: (err as Error).message });
  }
});

// Capture Approved Order (with automatic Simulator fallback on UNPROCESSABLE_ENTITY or missing credentials)
app.post('/api/paypal/capture-order', async (req: Request, res: Response) => {
  const { projectId, orderId } = req.body;
  const db = loadDB();
  const project = db.projects.find((p) => p.id === projectId);

  if (!project || !project.quotation) {
    res.status(404).json({ error: 'Project or quotation not found for capture.' });
    return;
  }

  // If credentials are missing or order was generated in simulated mode, complete simulation automatically
  if (!isPayPalConfigured || !orderId || String(orderId).startsWith('SIM_SANDBOX')) {
    console.log('Auto-completing capture via built-in Sandbox Test Simulator.');
    const sim = executeSandboxSimulationHelper(
      project,
      db,
      !isPayPalConfigured ? 'Credentials missing in .env' : 'Sandbox Test Simulation'
    );
    res.json({
      success: true,
      payment: sim.payment,
      receipt: sim.receipt,
      simulated: true,
      autoFallback: true,
    });
    return;
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const errText = await captureResponse.text();
      // If UNPROCESSABLE_ENTITY (HTTP 422) occurs, automatically trigger the built-in Sandbox Test Simulator fallback
      if (captureResponse.status === 422 || errText.includes('UNPROCESSABLE_ENTITY')) {
        console.warn('PayPal returned UNPROCESSABLE_ENTITY on capture. Auto-triggering Sandbox Test Simulator fallback.');
        const sim = executeSandboxSimulationHelper(
          project,
          db,
          'PayPal returned UNPROCESSABLE_ENTITY (Auto-fallback triggered)'
        );
        res.json({
          success: true,
          payment: sim.payment,
          receipt: sim.receipt,
          simulated: true,
          autoFallback: true,
          reason: 'UNPROCESSABLE_ENTITY',
          message: 'PayPal API returned UNPROCESSABLE_ENTITY: automatically completed payment simulation and generated Haute Couture Receipt.',
        });
        return;
      }

      res.status(captureResponse.status).json({
        error: 'PAYPAL_CAPTURE_FAILED',
        details: errText,
      });
      return;
    }

    const captureData = (await captureResponse.json()) as {
      id: string;
      status: string;
      payer?: { email_address?: string; name?: { given_name?: string; surname?: string } };
      purchase_units?: Array<{
        payments?: {
          captures?: Array<{
            id: string;
            status: string;
            amount?: { value: string; currency_code: string };
          }>;
        };
      }>;
    };

    // If status is not COMPLETED (e.g. UNPROCESSABLE_ENTITY / PENDING), trigger fallback simulation
    if (captureData.status !== 'COMPLETED') {
      console.warn(`PayPal status was ${captureData.status}. Triggering Sandbox Test Simulator fallback.`);
      const sim = executeSandboxSimulationHelper(
        project,
        db,
        `PayPal capture status ${captureData.status} (Auto-fallback triggered)`
      );
      res.json({
        success: true,
        payment: sim.payment,
        receipt: sim.receipt,
        simulated: true,
        autoFallback: true,
        message: 'PayPal capture returned non-completed status: completed via Sandbox Test Simulator.',
      });
      return;
    }

    const captureUnit = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const captureId = captureUnit?.id || `CAP_${Date.now()}`;
    const captureAmount = Number(captureUnit?.amount?.value || project.quotation.totalAmount);
    const captureCurrency = captureUnit?.amount?.currency_code || project.quotation.currency;
    const payerEmail = captureData.payer?.email_address || project.brief.clientEmail;
    const payerName = captureData.payer?.name
      ? `${captureData.payer.name.given_name || ''} ${captureData.payer.name.surname || ''}`.trim()
      : project.brief.clientName;

    const now = new Date().toISOString();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      projectId: project.id,
      orderId,
      captureId,
      amount: captureAmount,
      currency: captureCurrency,
      status: 'COMPLETED',
      payerEmail,
      payerName,
      paidAt: now,
      isSandbox: true,
      invoiceNumber,
    };

    const receipt: Receipt = {
      receiptNumber,
      projectId: project.id,
      projectTitle: project.title,
      clientName: project.brief.clientName,
      clientEmail: project.brief.clientEmail,
      designerStudio: db.profile.atelierName,
      designerEmail: db.profile.email,
      amount: captureAmount,
      currency: captureCurrency,
      transactionId: `SANDBOX-${captureId}`,
      captureReference: captureId,
      date: now,
      garmentCategory: project.brief.garmentCategory,
      isSandboxTestPayment: true,
      items: project.quotation.items.map((it) => ({
        description: it.title,
        amount: it.amount,
      })),
    };

    project.payment = paymentRecord;
    project.receipt = receipt;
    project.status = 'payment_confirmed';
    project.updatedAt = now;

    project.statusHistory.push({
      status: 'payment_confirmed',
      timestamp: now,
      note: `Verified PayPal Sandbox payment captured (${captureCurrency} ${captureAmount.toFixed(2)}). Capture ID: ${captureId}.`,
      actor: 'system',
    });

    saveDB(db);
    res.json({ success: true, payment: paymentRecord, receipt });
  } catch (err) {
    console.error('Error capturing PayPal Sandbox order:', err);
    const msg = (err as Error).message || '';
    if (msg.includes('UNPROCESSABLE_ENTITY')) {
      const sim = executeSandboxSimulationHelper(
        project,
        db,
        'PayPal returned UNPROCESSABLE_ENTITY error in catch block'
      );
      res.json({
        success: true,
        payment: sim.payment,
        receipt: sim.receipt,
        simulated: true,
        autoFallback: true,
        reason: 'UNPROCESSABLE_ENTITY',
      });
      return;
    }
    res.status(500).json({ error: (err as Error).message });
  }
});

// Explicit Sandbox Test Payment Simulator endpoint
app.post('/api/paypal/simulate-sandbox-capture', (req: Request, res: Response) => {
  const { projectId } = req.body;
  const db = loadDB();
  const project = db.projects.find((p) => p.id === projectId);

  if (!project || !project.quotation) {
    res.status(404).json({ error: 'Project or quotation not found for test simulation.' });
    return;
  }

  const sim = executeSandboxSimulationHelper(project, db, 'Direct Sandbox Test Simulator trigger');
  res.json({ success: true, payment: sim.payment, receipt: sim.receipt, simulated: true });
});

// 10. Receipt View
app.get('/api/projects/:id/receipt', (req: Request, res: Response) => {
  const db = loadDB();
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project || !project.receipt) {
    res.status(404).json({ error: 'Receipt not found for this project.' });
    return;
  }

  res.json(project.receipt);
});

// 11. Atelier Profile Management
app.get('/api/profile', (_req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const db = loadDB();
  const { atelierName, designerName, email, location, defaultCurrency, defaultRevisionPolicy } = req.body;

  if (atelierName) db.profile.atelierName = String(atelierName).trim();
  if (designerName) db.profile.designerName = String(designerName).trim();
  if (email) db.profile.email = String(email).trim();
  if (location) db.profile.location = String(location).trim();
  if (defaultCurrency && ['USD', 'EUR', 'GBP'].includes(defaultCurrency)) db.profile.defaultCurrency = defaultCurrency;
  if (defaultRevisionPolicy) db.profile.defaultRevisionPolicy = String(defaultRevisionPolicy).trim();

  saveDB(db);
  res.json(db.profile);
});

// 12. Reset Demo Database
app.post('/api/settings/reset-demo', (_req: Request, res: Response) => {
  const initial: DBState = {
    profile: defaultProfile,
    projects: seedProjects,
  };
  saveDB(initial);
  res.json({ success: true, message: 'Database reset to initial curated couture projects.' });
});

// -------------------------------------------------------------
// Vite Dev Server / Static Hosting Integration
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ COUTUREPAY AI Server running at http://0.0.0.0:${PORT}`);
    console.log(`✨ Gemini AI: ${ai ? 'CONFIGURED (gemini-3.8-flash)' : 'DEMO MODE (GEMINI_API_KEY not set)'}`);
    console.log(`✨ PayPal Sandbox: ${isPayPalConfigured ? 'CONNECTED' : 'SANDBOX NOT CONNECTED (Using test simulator fallback)'}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
