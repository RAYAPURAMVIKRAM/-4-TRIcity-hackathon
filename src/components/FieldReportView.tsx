'use client';

import React, { useState } from 'react';
import { ActiveErrandSession, FieldReportData } from '@/types/task';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  FileText, 
  Camera, 
  Download, 
  Share2, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink,
  Compass,
  Radio,
  FileCheck2,
  Building2,
  UserCheck
} from 'lucide-react';

interface FieldReportViewProps {
  session: ActiveErrandSession;
  onBackToChat: () => void;
  onAdvanceVerification: () => void;
}

export const FieldReportView: React.FC<FieldReportViewProps> = ({
  session,
  onBackToChat,
  onAdvanceVerification,
}) => {
  const isCompleted = session.status === 'completed';

  const report: FieldReportData = session.fieldReport || {
    id: `REP-${session.id.replace('ERR-', '')}`,
    taskTitle: session.echoData.task || session.echoData.itemOrTask || session.rawPrompt,
    location: session.echoData.location,
    gpsCoordinates: { lat: 17.9814, lng: 79.5977 },
    verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    counterOrOfficer: 'Window 2 (Birth & Death Registration) • Srikanth R. (Superintendent)',
    writtenSummary:
      'Window 2 is operational today until 4:30 PM. Birth certificates submitted prior to 1st of the month are actively being issued upon presenting token slip and original Aadhaar photocopy. Token line velocity: ~8 tokens per 15 minutes.',
    bulletFindings: [
      'Window 2 active and operating as scheduled.',
      'Daily token distribution cut-off is strictly 1:30 PM.',
      'Required physical documentation: Original Application Slip + 1 xerox of Aadhaar.',
      'Notice board board photograph verified by on-ground proxy.',
    ],
    photoProofUrl:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Geotagged physical photo of Window 2 counter notice board at Municipal Office.',
    tokenNumberOCR: 'TOKEN RANGE TODAY: #01 to #60 ACTIVE',
    verifiedByPartner: session.worker,
    customerFeedbackScore: 5.0,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChat}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to AI Concierge Chat</span>
        </button>
        <span className="rounded-full bg-indigo-100 border border-indigo-300 px-3 py-1 text-xs font-mono font-bold text-indigo-900">
          MODE 2: GROUND VERIFICATION &amp; FIELD REPORT
        </span>
      </div>

      {!isCompleted ? (
        /* In-Progress State: "On-Ground Verification In Progress" */
        <div className="rounded-3xl border border-indigo-200 bg-white p-8 text-center shadow-lg space-y-6">
          <div className="mx-auto relative flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-indigo-600">
            <Radio className="h-12 w-12 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 uppercase font-mono">
              On-Ground Partner Active at Desk
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              On-Ground Verification In Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our partner <strong className="text-slate-900">{session.worker.name}</strong> is physically inspecting{' '}
              <strong className="text-slate-900">{session.echoData.location}</strong>. Capturing counter notice board photographs and confirming requirements with on-duty staff.
            </p>
          </div>

          {/* Stepper for verification progress */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-xs font-medium text-slate-600">
            <div className="rounded-xl bg-slate-50 border p-2 text-center border-emerald-400 bg-emerald-50 text-emerald-800">
              <div className="font-bold">1. At Office</div>
              <div className="text-[10px] text-emerald-600">GPS Verified</div>
            </div>
            <div className="rounded-xl bg-slate-50 border p-2 text-center border-indigo-400 bg-indigo-50 text-indigo-800 animate-pulse">
              <div className="font-bold">2. Counter Check</div>
              <div className="text-[10px] text-indigo-600">In Progress</div>
            </div>
            <div className="rounded-xl bg-slate-50 border p-2 text-center text-slate-400">
              <div className="font-bold">3. Field Report</div>
              <div className="text-[10px]">Generating</div>
            </div>
          </div>

          {/* Fast-forward action for 3-minute classroom jury */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onAdvanceVerification}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simulate Partner Submitting Field Report (Complete)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed State: The Official "Field Report Card" */
        <div className="rounded-3xl border-2 border-emerald-500 bg-white p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Header Certificate Bar */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Task Verified &amp; Signed
                </span>
                <span className="font-mono text-xs text-slate-500">REPORT #{report.id}</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Official On-Ground Field Report
              </h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>{report.location}</span>
                <span className="text-slate-300">•</span>
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Today at {report.verifiedAt}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Service Fee Settled
              </span>
              <div className="text-2xl font-black text-emerald-700">₹25</div>
              <div className="text-[10px] text-slate-500 font-mono">Flat Nominal Fee</div>
            </div>
          </div>

          {/* Written Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              Verified Written Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {report.writtenSummary}
            </p>
          </div>

          {/* Key Findings Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
              Detailed Desk Observations:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {report.bulletFindings.map((finding: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
                >
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="leading-snug">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Proof Viewer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-emerald-600" />
              Geotagged Photo Proof &amp; OCR Notice Board
            </h4>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 group">
              <img
                src={report.photoProofUrl}
                alt="Field Proof"
                className="h-60 w-full object-cover opacity-95 transition-all group-hover:scale-105 group-hover:opacity-100 duration-300"
              />
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/90 p-2.5 backdrop-blur-md border border-slate-700 text-white text-xs">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-[11px] text-slate-300">
                    GPS: 17.9814° N, 79.5977° E (±2.1m precision)
                  </span>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                  {report.tokenNumberOCR}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic px-1">{report.photoCaption}</p>
          </div>

          {/* Partner Signature Card & Share Actions */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={report.verifiedByPartner.avatarUrl}
                alt={report.verifiedByPartner.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Signed by {report.verifiedByPartner.name}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                    ID #042
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Hero Splendor • Two-Wheeler Field Scout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Field Report downloaded as encrypted verification PDF.')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-slate-600" />
                <span>Save PDF</span>
              </button>

              <button
                onClick={() => alert('Report summary copied! Ready to share on WhatsApp.')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
