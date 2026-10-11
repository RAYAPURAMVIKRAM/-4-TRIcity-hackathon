'use client';

import React, { useState } from 'react';
import { ErrandAnalysis, TaskCategory, ErrandOrder } from '@/types/task';
import { POPULAR_CATEGORIES, PRIMARY_WORKER } from '@/lib/store';
import { analyzeErrandWithAI } from '@/lib/gemini';
import { 
  Utensils, 
  FileSearch, 
  Users, 
  Bike, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle,
  Coins,
  Send,
  Zap,
  Phone
} from 'lucide-react';

interface CustomerAppProps {
  onOrderCreated: (order: ErrandOrder) => void;
}

const PRESET_PROMPTS = [
  {
    label: 'Famous Dosa Stall',
    category: 'food_stall' as TaskCategory,
    badge: 'Street Food',
    prompt: 'Go to the famous dosa stall near Hanamkonda chowrasta, buy 2 special ghee dosas, call me for payment at the stall, and deliver to my hostel.',
  },
  {
    label: 'Municipal Office Counter 2',
    category: 'ground_intel' as TaskCategory,
    badge: 'Govt Enquiry',
    prompt: 'Visit Warangal Municipal Office, ask the clerk at Window 2 if birth certificates can be collected today, and WhatsApp me the details.',
  },
  {
    label: 'MGM Hospital OPD Queue',
    category: 'queue_standin' as TaskCategory,
    badge: 'Queue Stand-in',
    prompt: 'Stand in the token queue at MGM Hospital OPD for 30 minutes until I arrive.',
  },
];

export const CustomerApp: React.FC<CustomerAppProps> = ({ onOrderCreated }) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('food_stall');
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ErrandAnalysis | null>(null);
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');

  const handleSelectCategory = (cat: TaskCategory) => {
    setSelectedCategory(cat);
    const found = PRESET_PROMPTS.find((p) => p.category === cat);
    if (found) {
      setPrompt(found.prompt);
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await analyzeErrandWithAI(prompt.trim());
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing errand:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndDispatch = () => {
    if (!analysis) return;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: ErrandOrder = {
      id: orderId,
      prompt,
      analysis,
      status: 'placed',
      createdAt: new Date().toISOString(),
      assignedWorker: PRIMARY_WORKER,
      customerPhone,
      destinationCoordinates: { lat: 17.9942, lng: 79.5638 },
      liveLogs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: 'Just now',
          message: `Errand placed. Verified Safe & Legal. Dispatched to on-ground partner Ramesh K.`,
          type: 'info',
        },
      ],
    };

    onOrderCreated(newOrder);
  };

  const getCategoryIcon = (id: TaskCategory) => {
    switch (id) {
      case 'food_stall':
        return <Utensils className="h-5 w-5" />;
      case 'ground_intel':
        return <FileSearch className="h-5 w-5" />;
      case 'queue_standin':
        return <Users className="h-5 w-5" />;
      case 'express_courier':
        return <Bike className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Consumer Hero Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>AI-POWERED ON-DEMAND PHYSICAL ERRAND ASSISTANT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Need someone to go somewhere in Warangal?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Whether it&apos;s picking up food from an unlisted roadside stall, holding your place in a hospital line, or checking a government office counter—our vetted bike partners do it for you in minutes.
          </p>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 h-40 w-40 rounded-full bg-indigo-100/40 blur-2xl pointer-events-none" />
      </div>

      {/* 1. Quick-Select Category Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
            Popular City Errand Categories
          </h2>
          <span className="text-xs text-emerald-700 font-semibold">
            Average Response: &lt; 3 mins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {POPULAR_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex flex-col justify-between rounded-2xl p-4 text-left transition-all border ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? 'bg-emerald-200/70 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                  Hotspots: {cat.popularLocations.slice(0, 2).join(', ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Natural Language Task Input Box & Presets */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-1">
            Describe Your Errand Request
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Our AI will parse the physical steps, check safety, verify feasibility, and compute transparent distance &amp; time fees.
          </p>

          <textarea
            id="task-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Tell us exactly what you need our on-ground partner to do, buy, or check..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-normal shadow-inner transition-all"
          />
        </div>

        {/* Quick Test Presets */}
        <div>
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Try Quick Test Presets (Warangal / Hanamkonda):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCategory(p.category);
                  setPrompt(p.prompt);
                }}
                className={`flex flex-col text-left rounded-xl p-3 border transition-all text-xs ${
                  prompt === p.prompt
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-bold text-slate-900">
                  <span>{p.label}</span>
                  <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[9px] text-slate-600 font-normal">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{p.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Analyze & Calculate Cost */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Zero-Crash AI Brain with Instant Offline Heuristics Active</span>
          </div>

          <button
            id="btn-analyze-cost"
            type="button"
            disabled={isAnalyzing || !prompt.trim()}
            onClick={handleAnalyze}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Analyzing &amp; Estimating Cost...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze &amp; Calculate Cost with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. The AI Brain & Transparent Cost Estimator Output Card */}
      {analysis && (
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-3">
          {/* Header & Verification Check 1 */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {analysis.safetyBadge}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Category: {analysis.categoryName}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Est. {analysis.estimatedMinutes} Mins
                </span>
              </div>
              <h3 className="mt-2 text-xl font-black text-slate-900 tracking-tight">
                {analysis.taskTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                Target Landmark: <strong className="text-slate-800">{analysis.targetLocation}</strong>
              </p>
            </div>

            {/* Total Budget Card */}
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Total Estimated Budget
              </span>
              <div className="text-3xl font-black text-emerald-700 leading-none mt-1">
                ₹{analysis.pricing.totalBudget}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Pay Service Fee Now: <strong>₹{analysis.pricing.serviceSubtotal}</strong>
              </div>
            </div>
          </div>

          {/* Check 2: Task Clarification Plan */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
              Check 2: Step-by-Step Task Clarification Plan
            </h4>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                Here is what our on-ground partner will execute step-by-step:
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                {analysis.clarificationPlan.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Check 3: Itemized Fee Calculator */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              Check 3: Transparent Itemized Fee Calculator
            </h4>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Fee Component</th>
                    <th className="py-2.5 px-4">Calculation Basis</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Base Partner Service Fee</td>
                    <td className="py-2.5 px-4 text-slate-500">Standard base dispatch &amp; availability</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      ₹{analysis.pricing.basePartnerFee}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Estimated Travel / Distance Fee</td>
                    <td className="py-2.5 px-4 text-slate-500">
                      ~{analysis.distanceKm} km two-wheeler fuel &amp; transit
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      ₹{analysis.pricing.distanceFee}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Time Consumption Fee</td>
                    <td className="py-2.5 px-4 text-slate-500">
                      ~{analysis.estimatedMinutes} mins waiting &amp; execution
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      ₹{analysis.pricing.timeFee}
                    </td>
                  </tr>
                  {analysis.pricing.itemCost > 0 && (
                    <tr className="bg-amber-50/50">
                      <td className="py-2.5 px-4 font-bold text-amber-900">
                        Estimated Product / Item Cost
                      </td>
                      <td className="py-2.5 px-4 text-amber-700">
                        {analysis.itemsToBuy?.join(', ') || 'Retail products purchase'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-black text-amber-900">
                        ₹{analysis.pricing.itemCost}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Platform Convenience Fee</td>
                    <td className="py-2.5 px-4 text-slate-500">Insurance &amp; GPS Telemetry Escrow</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      ₹{analysis.pricing.platformFee}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-sm">
                    <td className="py-3 px-4 text-slate-900" colSpan={2}>
                      TOTAL ESTIMATED BUDGET
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700 text-base">
                      ₹{analysis.pricing.totalBudget}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Flexible Payment Mode Notice */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>💳 Flexible Payment Mode:</span>
            </div>
            <p className="leading-relaxed">
              {analysis.paymentModeNote}
            </p>
          </div>

          {/* Customer Confirmation Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Immediate dispatch to closest active partner (<strong className="text-slate-800">Ramesh K. - Hero Splendor</strong>)
            </div>

            <button
              id="btn-confirm-dispatch"
              type="button"
              onClick={handleConfirmAndDispatch}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>Confirm Errand &amp; Dispatch Worker (₹{analysis.pricing.serviceSubtotal})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
