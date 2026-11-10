import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Scissors,
  Calendar,
  DollarSign,
  Palette,
  Layers,
  MapPin,
  Mail,
  User,
  Info,
} from 'lucide-react';
import type { GarmentCategory, FashionBrief } from '../types';

interface NewBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBrief: (briefData: Partial<FashionBrief>, autoGenerateAi: boolean) => Promise<void>;
  isSubmitting: boolean;
}

const garmentCategories: GarmentCategory[] = [
  'Haute Couture Gown',
  'Bespoke Bridal',
  'Red Carpet Gala',
  'Tailored Tuxedo & Suiting',
  'Avant-Garde Runway',
  'Editorial Corsetry',
  'Ready-to-Wear Capsule',
];

const colorSuggestions = [
  'Obsidian Noir',
  'Champagne Gold',
  'Venetian Ivory',
  'Muted Rose Quartz',
  'Midnight Emerald',
  'Deep Bordeaux',
  'Antique Bronze',
  'Smoky Alabaster',
];

const fabricSuggestions = [
  'Mulberry Silk Organza',
  'French Chantilly Lace',
  'Silk Dupioni',
  'Silk Devoré Velvet',
  'Heavy Silk Crepe de Chine',
  'Hand-stitched Gold Bullion Thread',
  'Swarovski Crystal Beading',
  'Italian Wool Cashmere',
];

export const NewBriefModal: React.FC<NewBriefModalProps> = ({
  isOpen,
  onClose,
  onSubmitBrief,
  isSubmitting,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [garmentCategory, setGarmentCategory] = useState<GarmentCategory>('Haute Couture Gown');
  const [occasion, setOccasion] = useState('');
  const [inspirationMood, setInspirationMood] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['Obsidian Noir', 'Champagne Gold']);
  const [customColor, setCustomColor] = useState('');
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([
    'Mulberry Silk Organza',
    'French Chantilly Lace',
  ]);
  const [customFabric, setCustomFabric] = useState('');
  const [silhouetteNotes, setSilhouetteNotes] = useState('');
  const [budgetMin, setBudgetMin] = useState<number>(4500);
  const [budgetMax, setBudgetMax] = useState<number>(8500);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [deadline, setDeadline] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [autoGenerateAi, setAutoGenerateAi] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleColor = (col: string) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleAddCustomColor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customColor.trim()) {
      e.preventDefault();
      if (!selectedColors.includes(customColor.trim())) {
        setSelectedColors((prev) => [...prev, customColor.trim()]);
      }
      setCustomColor('');
    }
  };

  const toggleFabric = (fab: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fab) ? prev.filter((f) => f !== fab) : [...prev, fab]
    );
  };

  const handleAddCustomFabric = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customFabric.trim()) {
      e.preventDefault();
      if (!selectedFabrics.includes(customFabric.trim())) {
        setSelectedFabrics((prev) => [...prev, customFabric.trim()]);
      }
      setCustomFabric('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !clientEmail.trim() || !occasion.trim() || !inspirationMood.trim()) {
      setErrorMessage('Please fill in client name, email, occasion, and artistic inspiration.');
      return;
    }

    try {
      await onSubmitBrief(
        {
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim() || undefined,
          clientLocation: clientLocation.trim() || undefined,
          garmentCategory,
          occasion: occasion.trim(),
          inspirationMood: inspirationMood.trim(),
          colorPalette: selectedColors.length ? selectedColors : ['Champagne Gold', 'Obsidian Noir'],
          fabricPreferences: selectedFabrics.length ? selectedFabrics : ['Mulberry Silk Organza'],
          silhouetteNotes: silhouetteNotes.trim(),
          budgetMin: Number(budgetMin) || 3000,
          budgetMax: Number(budgetMax) || 6000,
          currency,
          deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          specialRequirements: specialRequirements.trim() || undefined,
        },
        autoGenerateAi
      );
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  // Quick Pre-fill Template helper for testing
  const handlePreFill = (type: 'bridal' | 'gala' | 'corset') => {
    if (type === 'bridal') {
      setClientName('Eleanor Vance');
      setClientEmail('eleanor.vance@beverlyhills.net');
      setClientLocation('Beverly Hills & Paris');
      setGarmentCategory('Bespoke Bridal');
      setOccasion('Lake Como Villa Renaissance Nuptials');
      setInspirationMood('Ethereal morning mist over Lake Como, layered translucent silks, cascading micro-pearls, dramatic 4-meter cathedral train.');
      setSelectedColors(['Venetian Ivory', 'Champagne Gold', 'Muted Rose Quartz']);
      setSelectedFabrics(['Mulberry Silk Organza', 'French Chantilly Lace', 'Swarovski Crystal Beading']);
      setSilhouetteNotes('Fitted corseted bodice with scalloped lace edges falling into gossamer pleated organza skirt.');
      setBudgetMin(7500);
      setBudgetMax(12000);
      setCurrency('USD');
      setDeadline('2027-02-15');
      setSpecialRequirements('Must include matching embroidered veil sketch and physical swatch card.');
    } else if (type === 'gala') {
      setClientName('Camille D’Orsay');
      setClientEmail('camille@dorsaymedia.fr');
      setClientLocation('Paris, France');
      setGarmentCategory('Red Carpet Gala');
      setOccasion('César Film Awards Ceremony');
      setInspirationMood('Modern gothic luxury, structured architectural shoulders, liquid obsidian silk velvet catching dramatic spotlights.');
      setSelectedColors(['Obsidian Noir', 'Deep Bordeaux', 'Antique Bronze']);
      setSelectedFabrics(['Silk Devoré Velvet', 'Heavy Silk Crepe de Chine']);
      setSilhouetteNotes('Floor-sweeping column with dramatic asymmetric shoulder capelet and thigh slit.');
      setBudgetMin(5000);
      setBudgetMax(9000);
      setCurrency('EUR');
      setDeadline('2026-12-10');
      setSpecialRequirements('Needs 2 rounds of digital color variations before final illustration rendering.');
    } else {
      setClientName('Gwen Sterling');
      setClientEmail('gwen@sterlingfashion.co.uk');
      setClientLocation('London, UK');
      setGarmentCategory('Editorial Corsetry');
      setOccasion('British Fashion Awards Gala');
      setInspirationMood('Sculptural steel boning exposed through sheer netting, astronomical constellation hand-beading.');
      setSelectedColors(['Obsidian Noir', 'Champagne Gold']);
      setSelectedFabrics(['French Chantilly Lace', 'Hand-stitched Gold Bullion Thread']);
      setSilhouetteNotes('Cinched conical bustier with arched sweetheart neckline and micro-peplum.');
      setBudgetMin(3500);
      setBudgetMax(5500);
      setCurrency('GBP');
      setDeadline('2026-11-25');
      setSpecialRequirements('Detailed internal boning channel technical blueprint required.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0A0A0C] border border-[#22222B] shadow-2xl my-8 text-[#F5F0E6] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#22222B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16161C] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37]">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#F5F0E6]">
                New Client Fashion Brief
              </h2>
              <p className="text-xs text-[#E8E2D5]/60">
                Log bespoke couture specifications & launch AI quotation generator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#E8E2D5]/60 hover:text-[#F5F0E6] hover:bg-[#16161C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pre-fill Bar */}
        <div className="px-6 py-2 bg-[#101014] border-b border-[#22222B] flex items-center justify-between text-xs">
          <span className="text-[#E8E2D5]/60 font-mono text-[11px]">Quick Atelier Presets:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePreFill('bridal')}
              className="px-2 py-0.5 rounded bg-[#16161C] hover:bg-[#22222B] text-[#D4AF37] border border-[#C5A059]/30 transition-colors"
            >
              Venetian Bridal
            </button>
            <button
              type="button"
              onClick={() => handlePreFill('gala')}
              className="px-2 py-0.5 rounded bg-[#16161C] hover:bg-[#22222B] text-[#D4AF37] border border-[#C5A059]/30 transition-colors"
            >
              César Gala Velvet
            </button>
            <button
              type="button"
              onClick={() => handlePreFill('corset')}
              className="px-2 py-0.5 rounded bg-[#16161C] hover:bg-[#22222B] text-[#D4AF37] border border-[#C5A059]/30 transition-colors"
            >
              Editorial Corsetry
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Client Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              1. Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Client Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#E8E2D5]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Élodie Laurent"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Client Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#E8E2D5]/40 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="client@luxury.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Location / Atelier City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#E8E2D5]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Paris, France"
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+33 6 12 34 56 78"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Garment Category & Occasion */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              2. Haute Couture Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Garment Category *
                </label>
                <select
                  value={garmentCategory}
                  onChange={(e) => setGarmentCategory(e.target.value as GarmentCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                >
                  {garmentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Occasion & Event *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Met Gala 2026: Gilded Architectures"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Inspiration & Silhouette */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              3. Artistic Vision & Silhouette
            </h3>
            <div>
              <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                Inspiration & Moodboard Narrative *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe references, eras, architecture, mood, lighting, and aesthetic philosophy..."
                value={inspirationMood}
                onChange={(e) => setInspirationMood(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                Silhouette & Structural Anatomy
              </label>
              <input
                type="text"
                placeholder="e.g. Sculptural hourglass corset, drop waist with cathedral opera cape"
                value={silhouetteNotes}
                onChange={(e) => setSilhouetteNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Color Harmony & Fabrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              4. Colors & Fabric Curation
            </h3>

            {/* Colors */}
            <div>
              <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Color Palette Harmony</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {colorSuggestions.map((col) => {
                  const isSelected = selectedColors.includes(col);
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                          : 'bg-[#101014] text-[#E8E2D5]/70 border border-[#22222B] hover:border-[#C5A059]'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Type custom shade & press Enter..."
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                onKeyDown={handleAddCustomColor}
                className="w-full px-3 py-1.5 text-xs rounded bg-[#101014] border border-[#22222B] text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Fabrics */}
            <div>
              <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Fabric & Embellishment Curation</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {fabricSuggestions.map((fab) => {
                  const isSelected = selectedFabrics.includes(fab);
                  return (
                    <button
                      type="button"
                      key={fab}
                      onClick={() => toggleFabric(fab)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#C5A059] text-[#0A0A0C] font-semibold'
                          : 'bg-[#101014] text-[#E8E2D5]/70 border border-[#22222B] hover:border-[#C5A059]'
                      }`}
                    >
                      {fab}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Type custom textile/embellishment & press Enter..."
                value={customFabric}
                onChange={(e) => setCustomFabric(e.target.value)}
                onKeyDown={handleAddCustomFabric}
                className="w-full px-3 py-1.5 text-xs rounded bg-[#101014] border border-[#22222B] text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 5: Budget & Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059]">
              5. Financials & Delivery Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Budget Minimum
                </label>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] font-mono tabular-nums focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Budget Maximum
                </label>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] font-mono tabular-nums focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Target Hand-off Deadline
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#E8E2D5]/40 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8E2D5]/80 mb-1">
                  Special Atelier Conditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zero synthetic fibers, physical swatch card delivery"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101014] border border-[#22222B] text-sm text-[#F5F0E6] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* AI Auto-generate Toggle */}
          <div className="p-4 rounded-xl bg-[#16161C] border border-[#C5A059]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#F5F0E6]">
                  Immediate AI Quotation Generation
                </div>
                <div className="text-[11px] text-[#E8E2D5]/70">
                  Analyze brief with Gemini 3.8 Flash and generate itemized deliverables & pricing
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerateAi}
                onChange={(e) => setAutoGenerateAi(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#22222B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#22222B] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#E8E2D5]/80 hover:text-[#F5F0E6] bg-[#16161C] border border-[#22222B] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] hover:brightness-110 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#0A0A0C]" />
                  <span>Processing Couture Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0A0A0C]" />
                  <span>{autoGenerateAi ? 'Submit & Generate AI Quotation' : 'Submit Brief'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
