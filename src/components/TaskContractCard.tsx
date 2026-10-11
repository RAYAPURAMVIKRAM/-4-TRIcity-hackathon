'use client';

import React from 'react';
import { 
  TaskContract,
  Deliverable 
} from '@/types/task';
import { 
  MapPin, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  FileCheck, 
  Camera, 
  Send, 
  Sparkles,
  Layers,
  Compass
} from 'lucide-react';

interface TaskContractCardProps {
  contract: TaskContract;
  onDispatch?: (contract: TaskContract) => void;
  isDispatching?: boolean;
  isAlreadyDispatched?: boolean;
}

export const TaskContractCard: React.FC<TaskContractCardProps> = ({
  contract,
  onDispatch,
  isDispatching = false,
  isAlreadyDispatched = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl">
      {/* Decorative Cyber Top Banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400" />
      
      {/* Contract Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-cyan-400">
              CONTRACT #{contract.id}
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              AI COMPILED &amp; SIGNED
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              Risk: {contract.riskRating}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-white tracking-tight">
            {contract.title}
          </h3>
        </div>

        {/* Dynamic Total Bounty Banner */}
        <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 to-slate-950 p-3 text-right shadow-inner">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center justify-end gap-1">
            <Coins className="h-3 w-3" />
            Total Escrow Bounty
          </div>
          <div className="text-2xl font-black tracking-tight text-emerald-300">
            ₹{contract.bounty.totalBounty}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Base ₹{contract.bounty.baseFare} + Wait ₹{contract.bounty.waitCompensation} + Surge ₹{contract.bounty.prioritySurge}
          </div>
        </div>
      </div>

      {/* Objective & Scope */}
      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
            Objective &amp; Execution Scope
          </h4>
          <p className="mt-1 rounded-lg bg-slate-950/70 border border-slate-800/80 p-3 text-sm text-slate-200 leading-relaxed font-sans">
            {contract.objective}
          </p>
        </div>

        {/* Location & Geofence Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Target Physical Landmark</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {contract.targetLocation}
            </div>
            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <Compass className="h-3 w-3 text-cyan-400" />
              <span>{contract.coordinates.lat.toFixed(4)}° N, {contract.coordinates.lng.toFixed(4)}° E</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Radio className="h-4 w-4 text-cyan-400" />
                <span>Geofence Radius Lock</span>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30">
                ±{contract.geofenceRadiusMeters} meters
              </span>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Est. Duration: <strong className="text-white">{contract.estimatedDurationMins} mins</strong>
              </span>
              <span className="text-emerald-400">GPS Hard-Lock</span>
            </div>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Mandatory Verification Deliverables
          </h4>
          <div className="space-y-2">
            {contract.deliverables.map((del: Deliverable) => (
              <div
                key={del.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-300">
                  {del.type === 'photo' ? (
                    <Camera className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                  )}
                  <span>{del.label}</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  {del.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Protocol & Escrow Guarantee */}
        <div className="rounded-lg border border-slate-800/90 bg-slate-950/70 p-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Escrow &amp; Security Protocol:</span>
            <span className="text-slate-400 font-mono text-[11px]">{contract.securityProtocol}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Bounty funds are automatically locked into smart escrow. Escrow unlocks only after proxy uploads geotagged photo within the ±{contract.geofenceRadiusMeters}m geofence and Gemini Vision passes authenticity checks.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      {onDispatch && (
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {isAlreadyDispatched ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Dispatched to Active Mesh Grid
              </span>
            ) : (
              <span>Ready for immediate peer broadcast</span>
            )}
          </div>

          <button
            id="btn-dispatch-proxy"
            disabled={isDispatching || isAlreadyDispatched}
            onClick={() => onDispatch(contract)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all ${
              isAlreadyDispatched
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 active:scale-95'
            }`}
          >
            {isDispatching ? (
              <>
                <Radio className="h-4 w-4 animate-spin text-slate-950" />
                <span>Broadcasting to Grid...</span>
              </>
            ) : isAlreadyDispatched ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Active in Proxy Field Feed</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Dispatch Proxy to Grid</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
