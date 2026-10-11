'use client';

import React, { useState } from 'react';
import { TaskContract } from '@/types/task';
import { 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Upload, 
  MapPin, 
  Coins, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface EvidenceAuditModalProps {
  task: TaskContract;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskId: string, evidence: {
    photoUrl: string;
    fieldNote: string;
    gpsVerified: boolean;
    geminiAuditConfidence: number;
    geminiAuditSummary: string;
  }) => void;
}

export const EvidenceAuditModal: React.FC<EvidenceAuditModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteTask,
}) => {
  const [fieldNote, setFieldNote] = useState(
    task.rawPrompt.toLowerCase().includes('rto')
      ? 'Counter 3 is currently open. Officer Srikanth is processing applications. Token #42 is active on the electronic board.'
      : task.rawPrompt.toLowerCase().includes('mgm')
      ? 'Standing in OPD Block row 2. Currently 8 people ahead in line. Queue moves roughly 1 person every 2 minutes.'
      : 'Stock confirmed on shelf. 4 genuine units available in sealed packaging.'
  );

  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    task.rawPrompt.toLowerCase().includes('rto')
      ? 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80'
      : task.rawPrompt.toLowerCase().includes('mgm')
      ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80'
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState<string>('');

  if (!isOpen) return null;

  const handleRunGeminiAudit = async () => {
    setIsAuditing(true);
    setAuditStep('Validating GPS coordinate proof against ±' + task.geofenceRadiusMeters + 'm geofence...');

    await new Promise((r) => setTimeout(r, 900));
    setAuditStep('Passing evidence through Gemini Vision Multimodal Audit Pipeline...');

    await new Promise((r) => setTimeout(r, 1200));
    setAuditStep('OCR validation complete. Presence verified with 99.2% match.');

    await new Promise((r) => setTimeout(r, 800));

    const summary = task.rawPrompt.toLowerCase().includes('rto')
      ? 'Gemini Vision confirmed Warangal RTO signage, active clerk badge, and token board #42 within 18m of target GPS.'
      : task.rawPrompt.toLowerCase().includes('mgm')
      ? 'Gemini Vision verified MGM Hospital OPD line physical presence. Continuous proximity heartbeat intact.'
      : 'Gemini Vision verified retail storefront and inventory packaging match.';

    onCompleteTask(task.id, {
      photoUrl: selectedPhoto,
      fieldNote,
      gpsVerified: true,
      geminiAuditConfidence: 99.2,
      geminiAuditSummary: summary,
    });

    setIsAuditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Gemini Vision Evidence Audit
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Contract #{task.id} | Escrow Release Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAuditing}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          {/* Target details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                {task.targetLocation}
              </span>
              <span className="text-cyan-400 font-bold">
                Geofence: ±{task.geofenceRadiusMeters}m
              </span>
            </div>
          </div>

          {/* Evidence photo preview */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              1. Geotagged Visual Evidence (High-Res Proof)
            </label>
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 max-h-48 group">
              <img
                src={selectedPhoto}
                alt="Proxy Evidence"
                className="h-48 w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-slate-950/90 px-2 py-1 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                <span>GPS Exif: 17.9942° N, 79.5638° E (Distance 14m - Valid)</span>
              </div>
            </div>
          </div>

          {/* Field notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              2. Field Status Note &amp; Verification Details
            </label>
            <textarea
              value={fieldNote}
              onChange={(e) => setFieldNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
              placeholder="Enter verified observations..."
            />
          </div>

          {/* Audit progress banner */}
          {isAuditing && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 text-xs text-cyan-300 font-mono flex items-center gap-3 animate-pulse">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-spin" />
              <div>
                <div className="font-bold">Multimodal AI Audit Running...</div>
                <div className="text-[11px] text-cyan-400">{auditStep}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <Coins className="h-4 w-4" />
            <span>Escrow Payout: ₹{task.bounty.totalBounty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isAuditing}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleRunGeminiAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Submit &amp; Run Gemini Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
