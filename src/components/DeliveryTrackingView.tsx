'use client';

import React, { useState } from 'react';
import { ActiveOfflineSession, StallEncounterScenario } from '@/types/task';
import { SimulatedMap } from '@/components/SimulatedMap';
import { OnSiteApprovalModule } from '@/components/OnSiteApprovalModule';
import { 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  Bike, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Store,
  MapPin,
  Camera
} from 'lucide-react';

interface DeliveryTrackingViewProps {
  session: ActiveOfflineSession;
  onUpdateStatus: (newStatus: 'assigned' | 'traveling' | 'at_stall' | 'delivering' | 'completed') => void;
  onSwitchScenario: (scenario: StallEncounterScenario) => void;
  onApproveAndPay: (amount: number, method: 'vendor_qr' | 'worker_upi') => void;
  onBargainRequest: (counterOffer: number) => void;
  onCancelErrand: () => void;
  onBackToChat: () => void;
}

const OFFLINE_STEPS: { key: 'assigned' | 'traveling' | 'at_stall' | 'delivering' | 'completed'; label: string; desc: string }[] = [
  { key: 'assigned', label: 'Proxy Assigned', desc: 'Ramesh heading to market' },
  { key: 'traveling', label: 'Transit to Market', desc: 'Two-wheeler navigating lane' },
  { key: 'at_stall', label: 'At Shop Counter', desc: 'Live photo & price approval' },
  { key: 'delivering', label: 'Item Secured', desc: 'En route to your location' },
  { key: 'completed', label: 'Delivered', desc: 'Handover & OTP verified' },
];

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  session,
  onUpdateStatus,
  onSwitchScenario,
  onApproveAndPay,
  onBargainRequest,
  onCancelErrand,
  onBackToChat,
}) => {
  const [showCall, setShowCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([
    'Ramesh: Namaste! I am on my Hero Splendor heading to the stall now.',
  ]);

  const currentIndex = OFFLINE_STEPS.findIndex((s) => s.key === session.status);

  const handleNextStep = () => {
    if (currentIndex < OFFLINE_STEPS.length - 1) {
      onUpdateStatus(OFFLINE_STEPS[currentIndex + 1].key);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatLog((prev) => [...prev, `You: ${chatInput}`, 'Ramesh: Understood sir! Checking the stall counter.']);
    setChatInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Status Mode */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChat}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Offline Concierge Chat</span>
        </button>
        <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-mono font-bold text-emerald-800">
          OFFLINE PROXY FULFILLMENT: {session.echoData.categoryLabel}
        </span>
      </div>

      {/* Top Banner Status Bar */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Errand #{session.id}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-100">
                <Clock className="h-3.5 w-3.5" />
                Est. {session.echoData.estimatedMinutes} mins
              </span>
              <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-mono text-emerald-200">
                Price Cap: ₹{session.echoData.priceGuard?.priceCapAmount || 'Flexible'}
              </span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight">
              {session.status === 'completed'
                ? '🎉 Errand Completed & Delivered!'
                : session.status === 'at_stall'
                ? '📍 Ramesh is at the Stall Counter — Awaiting Your Price Approval!'
                : `Partner ${session.worker.name} is on your errand!`}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-xl">
              {session.echoData.itemOrTask} • {session.echoData.location}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 text-right border border-white/20">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Advance Paid</span>
            <div className="text-2xl font-black text-white">₹{session.pricing.totalAdvanceToDispatch}</div>
            <span className="text-[10px] text-emerald-100">Zero Advance on Goods</span>
          </div>
        </div>

        {/* Live Status Stepper */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {OFFLINE_STEPS.map((step, idx) => {
              const isPast = idx <= currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={step.key}
                  className={`rounded-2xl p-2.5 transition-all ${
                    isCurrent
                      ? 'bg-white text-slate-900 shadow-lg scale-105'
                      : isPast
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase">
                      0{idx + 1}
                    </span>
                    {isPast && (
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${isCurrent ? 'text-emerald-600' : 'text-emerald-300'}`}
                      />
                    )}
                  </div>
                  <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-slate-900' : 'text-white'}`}>
                    {step.label}
                  </div>
                  <div className={`text-[9px] mt-0.5 leading-tight ${isCurrent ? 'text-slate-500' : 'text-white/70'}`}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CORE INNOVATION MODULE: On-Site Approval & Settlement Card */}
      {session.status === 'at_stall' && (
        <OnSiteApprovalModule
          inspection={session.inspection}
          onSwitchScenario={onSwitchScenario}
          onApproveAndPay={onApproveAndPay}
          onBargainRequest={onBargainRequest}
          onCancelErrand={onCancelErrand}
          onProceedToDelivery={() => onUpdateStatus('delivering')}
        />
      )}

      {/* Main Grid: Partner Profile & Vector Road Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Worker Profile & Action Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Assigned Human Proxy
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" /> Smart Price Guard Armed
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={session.worker.avatarUrl}
                alt={session.worker.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {session.worker.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {session.worker.rating}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-0.5 flex items-center gap-1">
                  <Bike className="h-3.5 w-3.5 text-emerald-600" />
                  {session.worker.vehicle}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {session.worker.completedTasks}+ offline market errands
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCall(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                <span>Call Proxy</span>
              </button>

              <button
                onClick={() => setShowChat(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                <span>Live Chat</span>
              </button>

              <button
                onClick={() => alert('Support hotline: +91 870 244 9999 • Team VQ TriCity Hackathon')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-slate-600" />
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* 3-Minute Jury Fast-Forward Accelerator */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-950 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Jury Evaluation Stage Controller
              </span>
              <span className="rounded bg-indigo-200 px-2 py-0.5 text-[10px] font-mono text-indigo-800">
                Live Simulator
              </span>
            </div>
            <p className="text-xs text-indigo-800 mb-3 leading-relaxed">
              Step through the offline errand workflow (Traveling $\rightarrow$ At Stall Counter $\rightarrow$ Delivering):
            </p>
            <button
              onClick={handleNextStep}
              disabled={session.status === 'completed'}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md"
            >
              <span>Advance Status: {OFFLINE_STEPS[Math.min(currentIndex + 1, 4)].label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Simulated Map */}
        <div className="lg:col-span-7">
          <SimulatedMap
            orderStatus={session.status === 'delivering' ? 'in_progress' : session.status === 'at_stall' ? 'arrived' : session.status === 'assigned' ? 'placed' : 'completed'}
            workerName={session.worker.name}
            vehicle={session.worker.vehicle}
            targetLocation={session.echoData.location}
            liveLogs={session.liveLogs}
          />
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Calling {session.worker.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">{session.worker.phone}</p>
            <p className="text-xs text-slate-600 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
              &quot;Sir, I am right at {session.inspection.vendorName} checking your {session.echoData.itemOrTask}. I have uploaded the live photo proof!&quot;
            </p>
            <button
              onClick={() => setShowCall(false)}
              className="mt-6 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Simulated Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={session.worker.avatarUrl}
                  alt={session.worker.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{session.worker.name}</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold">Live at Shop Counter</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
              {chatLog.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-2xl max-w-[85%] ${
                    m.startsWith('You:')
                      ? 'ml-auto bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message proxy..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendChat}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
