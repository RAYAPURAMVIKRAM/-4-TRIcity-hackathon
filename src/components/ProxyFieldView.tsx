'use client';

import React, { useState } from 'react';
import { TaskContract, TaskStatus } from '@/types/task';
import { EvidenceAuditModal } from '@/components/EvidenceAuditModal';
import { 
  Radio, 
  MapPin, 
  Coins, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Sparkles, 
  ArrowUpRight, 
  UserCheck, 
  Filter, 
  Compass, 
  AlertCircle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface ProxyFieldViewProps {
  tasks: TaskContract[];
  onAcceptTask: (taskId: string) => void;
  onStartMovement: (taskId: string) => void;
  onCompleteTask: (taskId: string, evidence: {
    photoUrl: string;
    fieldNote: string;
    gpsVerified: boolean;
    geminiAuditConfidence: number;
    geminiAuditSummary: string;
  }) => void;
}

export const ProxyFieldView: React.FC<ProxyFieldViewProps> = ({
  tasks,
  onAcceptTask,
  onStartMovement,
  onCompleteTask,
}) => {
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');
  const [activeAuditTask, setActiveAuditTask] = useState<TaskContract | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            [Open - Unassigned]
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-400">
            [Assigned - En Route]
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            [In Progress - At Site]
          </span>
        );
      case 'Verification':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-purple-400">
            [Gemini Audit Review]
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            [Audit Settled &amp; Paid]
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Proxy Field Operator Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PROXY IDENTITY</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-1 text-base font-bold text-white flex items-center gap-2">
            <span>PRX-09 (K. Sai Krishna)</span>
          </div>
          <div className="mt-1 text-xs text-emerald-400 font-mono">
            Reputation: 98.4% (38 Tasks Verified)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESCROW WALLET</span>
            <Coins className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1 text-2xl font-black text-white">
            ₹3,420
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            +₹500 locked in active escrow
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CURRENT GPS TELEMETRY</span>
            <Compass className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1 text-sm font-bold text-white truncate">
            Warangal Metro Urban Grid
          </div>
          <div className="mt-1 text-xs text-cyan-400 font-mono">
            Accuracy: ±2.4m (RTK Differential)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>GRID SYSTEM STATUS</span>
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="mt-1 text-sm font-bold text-emerald-400">
            Mesh Synchronized
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            {tasks.filter((t) => t.status === 'Open').length} Unclaimed Errands in Range
          </div>
        </div>
      </div>

      {/* Main Task Feed Header & Filter Tabs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-400" />
              <span>Nearby Available Physical Errands</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Live broadcast queue inside Tri-City Warangal Geofenced Mesh
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {(['All', 'Open', 'Assigned', 'In Progress', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab}
                {tab === 'Open' && (
                  <span className="ml-1.5 rounded-full bg-emerald-400/20 px-1.5 py-0.2 text-[10px] text-emerald-300">
                    {tasks.filter((t) => t.status === 'Open').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards List */}
        <div className="mt-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-12 text-center text-slate-500">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">No errands found matching filter "{filter}"</p>
              <p className="text-xs text-slate-600 mt-1">
                Dispatch an errand from the Requester Terminal to populate the grid.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 transition-all hover:border-slate-700 hover:bg-slate-950/90"
              >
                {/* Status indicator bar on left border */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    task.status === 'Open'
                      ? 'bg-emerald-500'
                      : task.status === 'Assigned'
                      ? 'bg-cyan-500'
                      : task.status === 'In Progress'
                      ? 'bg-amber-500'
                      : 'bg-slate-600'
                  }`}
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left Task Information */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">
                        {task.id}
                      </span>
                      {getStatusBadge(task.status)}
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        Geofence: ±{task.geofenceRadiusMeters}m
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Risk: {task.riskRating}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {task.objective}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {task.targetLocation}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        Est. {task.estimatedDurationMins} mins
                      </span>
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {task.deliverables.length} Deliverables Required
                      </span>
                    </div>
                  </div>

                  {/* Right Bounty & Action Button Area */}
                  <div className="flex flex-col items-end justify-between self-stretch space-y-3">
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Bounty Payout
                      </div>
                      <div className="text-2xl font-black text-emerald-400">
                        ₹{task.bounty.totalBounty}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Instant Escrow
                      </div>
                    </div>

                    {/* State Transition Actions */}
                    <div className="w-full sm:w-auto">
                      {task.status === 'Open' && (
                        <button
                          id={`btn-accept-${task.id}`}
                          onClick={() => onAcceptTask(task.id)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Accept Task</span>
                        </button>
                      )}

                      {task.status === 'Assigned' && (
                        <button
                          id={`btn-start-${task.id}`}
                          onClick={() => onStartMovement(task.id)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-400 transition-all active:scale-95"
                        >
                          <Compass className="h-4 w-4" />
                          <span>Check-in At Location</span>
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          id={`btn-verify-${task.id}`}
                          onClick={() => setActiveAuditTask(task)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-400/20 hover:from-amber-300 hover:to-emerald-300 transition-all active:scale-95"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Submit Proof &amp; Verify</span>
                        </button>
                      )}

                      {task.status === 'Completed' && (
                        <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 text-right font-mono text-[11px] text-emerald-400">
                          <span className="flex items-center gap-1 justify-end font-semibold">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Escrow Settled (100%)
                          </span>
                          {task.auditEvidence?.geminiAuditConfidence && (
                            <span className="text-[10px] text-slate-400">
                              Gemini Match: {task.auditEvidence.geminiAuditConfidence}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evidence Card if Task Completed */}
                {task.status === 'Completed' && task.auditEvidence && (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Sparkles className="h-3.5 w-3.5" />
                        Gemini Vision Audit Certificate
                      </span>
                      <span className="text-[11px]">
                        {new Date(task.auditEvidence.verifiedAt || task.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      {task.auditEvidence.photoUrl && (
                        <div className="md:col-span-3">
                          <img
                            src={task.auditEvidence.photoUrl}
                            alt="Audit Proof"
                            className="h-20 w-full object-cover rounded-lg border border-slate-800"
                          />
                        </div>
                      )}
                      <div className="md:col-span-9 space-y-1">
                        <p className="text-slate-200 text-xs italic">
                          "{task.auditEvidence.fieldNote}"
                        </p>
                        <p className="text-emerald-400 font-mono text-[11px]">
                          ✓ {task.auditEvidence.geminiAuditSummary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Evidence Audit Modal */}
      {activeAuditTask && (
        <EvidenceAuditModal
          task={activeAuditTask}
          isOpen={!!activeAuditTask}
          onClose={() => setActiveAuditTask(null)}
          onCompleteTask={onCompleteTask}
        />
      )}
    </div>
  );
};
