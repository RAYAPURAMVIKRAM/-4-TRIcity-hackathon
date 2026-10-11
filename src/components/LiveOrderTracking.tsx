'use client';

import React, { useState } from 'react';
import { ErrandOrder, OrderStatus } from '@/types/task';
import { SimulatedMap } from '@/components/SimulatedMap';
import { 
  Phone, 
  MessageSquare, 
  Share2, 
  Star, 
  ShieldCheck, 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LiveOrderTrackingProps {
  order: ErrandOrder;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onNewOrder: () => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Placed', desc: 'Verified & Escrow Locked' },
  { key: 'assigned', label: 'Partner Assigned', desc: 'Ramesh is on the way' },
  { key: 'arrived', label: 'Arrived at Spot', desc: 'At shop/office location' },
  { key: 'in_progress', label: 'Task in Progress', desc: 'Purchasing or standing in line' },
  { key: 'completed', label: 'Completed', desc: 'Delivery & Proof Verified' },
];

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  order,
  onUpdateStatus,
  onNewOrder,
}) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatThread, setChatThread] = useState<string[]>([
    'Ramesh: Hi! I am heading to Hanamkonda chowrasta now. Please keep phone handy.',
  ]);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const handleAdvanceStep = () => {
    if (currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStep = STATUS_STEPS[currentStepIndex + 1].key;
      onUpdateStatus(order.id, nextStep);
    }
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatThread((prev) => [
      ...prev,
      `You: ${chatMessage}`,
      'Ramesh: Got it sir! Will take care of it right away.',
    ]);
    setChatMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status Header */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Order #{order.id}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-100">
                <Clock className="h-3.5 w-3.5" />
                Est. Complete in {order.analysis.estimatedMinutes} mins
              </span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight">
              {order.status === 'completed'
                ? '🎉 Errand Successfully Completed!'
                : `Partner ${order.assignedWorker.name} is on your errand!`}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              {order.analysis.taskTitle} • {order.analysis.targetLocation}
            </p>
          </div>

          <button
            onClick={onNewOrder}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-md hover:bg-emerald-50 transition-all active:scale-95"
          >
            + Create Another Errand
          </button>
        </div>

        {/* Step-by-Step Live Status Bar */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`rounded-xl p-3 transition-all ${
                    isCurrent
                      ? 'bg-white text-slate-900 shadow-lg scale-105'
                      : isPast
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase">
                      Step 0{idx + 1}
                    </span>
                    {isPast && (
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${isCurrent ? 'text-emerald-600' : 'text-emerald-300'}`}
                      />
                    )}
                  </div>
                  <div className={`text-xs font-bold leading-snug ${isCurrent ? 'text-slate-900' : 'text-white'}`}>
                    {step.label}
                  </div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${isCurrent ? 'text-slate-500' : 'text-white/70'}`}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Tracking Dashboard & Worker Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Worker Profile & Action Buttons & Errand Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assigned Worker Profile Card (Swiggy / Rapido Style) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Assigned On-Ground Partner</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="h-4 w-4" /> Background Verified
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={order.assignedWorker.avatarUrl}
                alt={order.assignedWorker.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {order.assignedWorker.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {order.assignedWorker.rating}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-0.5 flex items-center gap-1">
                  <Bike className="h-3.5 w-3.5 text-emerald-600" />
                  {order.assignedWorker.vehicle}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {order.assignedWorker.completedTasks}+ city errands completed
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCallModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                <span>Call Worker</span>
              </button>

              <button
                onClick={() => setShowChatModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => alert(`Live location link for Order #${order.id} copied to clipboard!`)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 text-slate-600" />
                <span>Share Live</span>
              </button>
            </div>
          </div>

          {/* Errand Plan & Itemized Fee Breakdown Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Action Plan &amp; Protocol
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {order.analysis.taskTitle}
              </h4>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">What our partner is executing:</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {order.analysis.clarificationPlan.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-emerald-600">{idx + 1}.</span>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Summary */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Partner Service Fee</span>
                <span className="font-semibold text-slate-900">₹{order.analysis.pricing.basePartnerFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Distance Travel Fee ({order.analysis.distanceKm} km)</span>
                <span className="font-semibold text-slate-900">₹{order.analysis.pricing.distanceFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Time Consumption Fee</span>
                <span className="font-semibold text-slate-900">₹{order.analysis.pricing.timeFee}</span>
              </div>
              {order.analysis.pricing.itemCost > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Product / Item Cost (Direct to vendor)</span>
                  <span className="font-semibold text-amber-700">₹{order.analysis.pricing.itemCost}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Platform Convenience Fee</span>
                <span className="font-semibold text-slate-900">₹{order.analysis.pricing.platformFee}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Estimated Budget</span>
                <span className="text-emerald-700 font-black">₹{order.analysis.pricing.totalBudget}</span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-800">
              💡 {order.analysis.paymentModeNote}
            </div>
          </div>

          {/* Classroom 3-Minute Evaluation Fast-Forward Controls */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Jury Fast-Forward Simulation
              </span>
              <span className="rounded bg-indigo-200 px-2 py-0.5 text-[10px] font-mono text-indigo-800">
                Evaluation Tool
              </span>
            </div>
            <p className="text-xs text-indigo-700 mb-3">
              Click below to simulate real-time progress through all errand stages for the evaluation panel:
            </p>
            <button
              onClick={handleAdvanceStep}
              disabled={order.status === 'completed'}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
            >
              <span>Advance to Next Status: {STATUS_STEPS[Math.min(currentStepIndex + 1, 4)].label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Map & Real-time Telemetry Feed */}
        <div className="lg:col-span-7 space-y-6">
          <SimulatedMap
            orderStatus={order.status}
            workerName={order.assignedWorker.name}
            vehicle={order.assignedWorker.vehicle}
            targetLocation={order.analysis.targetLocation}
            deliveryLocation={order.analysis.deliveryLocation}
            liveLogs={order.liveLogs}
          />
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Calling Partner Ramesh K.</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">{order.assignedWorker.phone}</p>
            <p className="text-xs text-slate-600 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              "Sir, I am right at the Hanamkonda dosa counter. The vendor is packing your 2 ghee dosas now. Calling you for the UPI QR code!"
            </p>
            <button
              onClick={() => setShowCallModal(false)}
              className="mt-6 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Simulated Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={order.assignedWorker.avatarUrl}
                  alt={order.assignedWorker.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{order.assignedWorker.name}</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold">Online • At Errand Spot</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
              {chatThread.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    msg.startsWith('You:')
                      ? 'ml-auto bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message to partner..."
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
