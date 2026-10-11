'use client';

import React, { useState } from 'react';
import { LiveStallInspection, StallEncounterScenario } from '@/types/task';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Coins, 
  QrCode, 
  Store, 
  PhoneCall, 
  MessageSquare, 
  Sparkles, 
  XCircle, 
  ArrowRight,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface OnSiteApprovalModuleProps {
  inspection: LiveStallInspection;
  onSwitchScenario: (scenario: StallEncounterScenario) => void;
  onApproveAndPay: (amount: number, method: 'vendor_qr' | 'worker_upi') => void;
  onBargainRequest: (counterOffer: number) => void;
  onCancelErrand: () => void;
  onProceedToDelivery: () => void;
}

export const OnSiteApprovalModule: React.FC<OnSiteApprovalModuleProps> = ({
  inspection,
  onSwitchScenario,
  onApproveAndPay,
  onBargainRequest,
  onCancelErrand,
  onProceedToDelivery,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [bargainingActive, setBargainingActive] = useState(false);
  const [customBargainPrice, setCustomBargainPrice] = useState(inspection.customerPriceCap);

  const isUnderCap = inspection.vendorQuotedPrice <= inspection.customerPriceCap;
  const isSettled = inspection.status === 'approved_and_paid';
  const isCancelled = inspection.status === 'cancelled';

  const handleStartBargain = () => {
    setBargainingActive(true);
    setTimeout(() => {
      onBargainRequest(inspection.customerPriceCap);
      setBargainingActive(false);
    }, 1200);
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500 bg-white p-5 sm:p-7 shadow-xl space-y-6">
      {/* 1. Header & Live Stall Verification Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              STAGE 2: PROXY AT STALL / SHOP COUNTER
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Store className="h-3.5 w-3.5 text-slate-500" />
              {inspection.vendorName}
            </span>
          </div>

          <h3 className="mt-2 text-xl font-black text-slate-900 tracking-tight">
            Live On-Site Inspection &amp; Price Approval
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>{inspection.stallLocation}</span>
          </p>
        </div>

        {/* 🧪 Judge Sandbox Scenario Toggle */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-2.5 text-right space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-900 flex items-center justify-end gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Jury Scenario Switcher:
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSwitchScenario('price_match')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                inspection.scenario === 'price_match'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Scenario A (Within Cap)
            </button>
            <button
              onClick={() => onSwitchScenario('price_exceeded')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                inspection.scenario === 'price_exceeded'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Scenario B (Exceeds Cap)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Photo Proof & Price Inspection Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Real-time photo stream from the shop counter */}
        <div className="md:col-span-5 relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 group">
          <img
            src={inspection.photoProofUrl}
            alt="Stall Inspection Proof"
            className="h-48 w-full object-cover opacity-90 group-hover:scale-105 transition-all duration-300"
          />
          <div className="absolute top-2 left-2 rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Camera className="h-3 w-3" />
            <span>LIVE CAM • STALL COUNTER</span>
          </div>
          <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-slate-950/80 p-2 text-white text-[11px] backdrop-blur-md border border-slate-700">
            <p className="font-semibold truncate">{inspection.itemName}</p>
            <span className="text-[10px] text-slate-400">Timestamp: {inspection.timestamp} • Geotagged</span>
          </div>
        </div>

        {/* Price Guard Analysis Box */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-500">Your Target Cap</span>
              <div className="text-xl font-bold text-slate-800 mt-0.5">
                ₹{inspection.customerPriceCap}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Max Approved Budget</span>
            </div>

            <div
              className={`rounded-2xl border p-3 text-center transition-all ${
                isUnderCap
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-amber-300 bg-amber-50 text-amber-900'
              }`}
            >
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                Vendor Quoted Price
              </span>
              <div className="text-2xl font-black mt-0.5">
                ₹{inspection.vendorQuotedPrice}
              </div>
              <span className="text-[10px] font-bold">
                {isUnderCap
                  ? `✓ Under Cap by ₹${inspection.customerPriceCap - inspection.vendorQuotedPrice}`
                  : `⚠️ Exceeds Cap by +₹${inspection.vendorQuotedPrice - inspection.customerPriceCap}`}
              </span>
            </div>
          </div>

          {/* Conditional Alert & Decision Logic */}
          {isSettled ? (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Payment Confirmed &amp; Item Secured!</span>
              </div>
              <p className="leading-relaxed">
                ₹{inspection.bargainedPrice || inspection.vendorQuotedPrice} settled directly to vendor QR. Your proxy is packing the items into the delivery thermal bag.
              </p>
              <button
                onClick={onProceedToDelivery}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
              >
                <span>Proceed to Live Delivery Tracking</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Errand Cancelled with Zero Item Penalty</span>
              </div>
              <p>
                Because the vendor quoted above your price cap and refused your terms, the item purchase was rejected without any hidden deduction.
              </p>
            </div>
          ) : isUnderCap ? (
            /* SCENARIO A: Within Cap */
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Smart Price Guard: Price Matched (Under Cap)!</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                The street vendor quoted <strong>₹{inspection.vendorQuotedPrice}</strong>, which is safely within your <strong>₹{inspection.customerPriceCap}</strong> limit. Pay directly via Vendor UPI QR or authorize the worker to settle on your behalf.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Scan &amp; Pay ₹{inspection.vendorQuotedPrice} (Vendor UPI QR)</span>
                </button>

                <button
                  onClick={() => onApproveAndPay(inspection.vendorQuotedPrice, 'worker_upi')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition-all active:scale-95"
                >
                  <Coins className="h-4 w-4 text-emerald-400" />
                  <span>Worker Pays (Reimburse on Handover)</span>
                </button>
              </div>
            </div>
          ) : (
            /* SCENARIO B: Exceeds Cap */
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-4 text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Price Guard Alert: Quoted Price Exceeds Cap!</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                Vendor quoted <strong>₹{inspection.vendorQuotedPrice}</strong> (+₹{inspection.vendorQuotedPrice - inspection.customerPriceCap} over your ₹{inspection.customerPriceCap} cap). Under our Smart Price Guard protocol, our proxy has paused the purchase.
              </p>

              {/* Options: [Approve Higher Price] | [Ask Worker to Bargain] | [Cancel Errand with Zero Item Penalty] */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => onApproveAndPay(inspection.vendorQuotedPrice, 'worker_upi')}
                  className="rounded-xl bg-amber-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition-all text-center"
                >
                  Approve ₹{inspection.vendorQuotedPrice}
                </button>

                <button
                  onClick={handleStartBargain}
                  disabled={bargainingActive}
                  className="rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100 transition-all text-center flex items-center justify-center gap-1"
                >
                  {bargainingActive ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Bargaining...</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>Ask Worker to Bargain</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onCancelErrand}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 transition-all text-center"
                >
                  Cancel Errand (₹0 Penalty)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Vendor UPI QR Payment Modal Simulation */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Vendor Direct QR Settlement
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕ Close
              </button>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">{inspection.vendorName}</h4>
              <p className="text-xs text-slate-500 font-mono">UPI ID: vendor.stall42@okhdfcbank</p>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                ₹{inspection.vendorQuotedPrice}
              </div>
            </div>

            {/* Stylized Simulated QR Code */}
            <div className="mx-auto h-48 w-48 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 flex flex-col items-center justify-center shadow-inner relative group">
              <QrCode className="h-36 w-36 text-slate-800" />
              <span className="text-[10px] font-mono text-slate-500 mt-1">BHIM UPI • GPay • PhonePe</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Direct payment to the street vendor ensures zero intermediaries and instant bill settlement.
            </p>

            <button
              onClick={() => {
                setShowQrModal(false);
                onApproveAndPay(inspection.vendorQuotedPrice, 'vendor_qr');
              }}
              className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
            >
              Simulate UPI Payment Success (₹{inspection.vendorQuotedPrice})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
