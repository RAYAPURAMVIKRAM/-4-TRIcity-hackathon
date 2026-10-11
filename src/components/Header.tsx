'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  MapPin, 
  Radio, 
  Cpu, 
  Users, 
  Key,
  Layers,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'requester' | 'proxy';
  setActiveTab: (tab: 'requester' | 'proxy') => void;
  openTaskCount: number;
  onOpenKeyModal: () => void;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openTaskCount,
  onOpenKeyModal,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl">
      {/* Top Banner - Hackathon Room & Team Identity */}
      <div className="border-b border-slate-800/60 bg-slate-950/70 px-4 py-1 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              TriCity AI Hackathon (Room B-4-216 | Team TRI26420)
            </span>
            <span className="hidden text-slate-600 sm:inline">|</span>
            <span className="hidden items-center gap-1 text-slate-300 sm:inline-flex">
              <Users className="h-3 w-3 text-cyan-400" />
              Team VQ: <strong className="text-white">Rayapuram Vikram</strong> (CSE AI) &amp;{' '}
              <strong className="text-white">Haseeba Mahanaz</strong> (IT)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenKeyModal}
              className="flex items-center gap-1.5 rounded border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
              title="Configure Gemini API Key"
            >
              <Key className="h-3 w-3 text-amber-400" />
              <span>{hasCustomKey ? 'Gemini 2.5 Active' : 'Gemini Fallback Active'}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${hasCustomKey ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Grid: Warangal Metro (17.97°N, 79.59°E)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Proxy<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Grid</span>
              </h1>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                TriCity AI-Thon | Team VQ
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Geofenced Physical Errand Protocol &amp; Autonomous Proxy Dispatch
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
          <button
            id="tab-requester"
            onClick={() => setActiveTab('requester')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'requester'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="h-4 w-4 text-emerald-300" />
            <span>Requester Terminal</span>
          </button>

          <button
            id="tab-proxy"
            onClick={() => setActiveTab('proxy')}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'proxy'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="h-4 w-4 text-cyan-300" />
            <span>Proxy Field View</span>
            {openTaskCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                {openTaskCount}
              </span>
            )}
          </button>
        </div>

        {/* Live Network Active Telemetry */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide">Network Active</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">24 Peer Nodes</span>
          </div>
        </div>
      </div>
    </header>
  );
};
