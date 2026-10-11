'use client';

import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Smartphone, 
  Bike, 
  Store, 
  Radio 
} from 'lucide-react';

interface NavbarProps {
  currentView: 'customer' | 'partner';
  setCurrentView: (view: 'customer' | 'partner') => void;
  activeOrderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeOrderCount,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Hackathon Room & Team Identity Bar */}
      <div className="border-b border-slate-100 bg-emerald-50/70 px-4 py-1.5 text-xs text-slate-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
              </span>
              TriCity AI Hackathon (Room B-4-216 | Team TRI26420)
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="hidden text-slate-700 sm:inline">
              Team VQ: <strong className="text-slate-900">Rayapuram Vikram</strong> (CSE AI) &amp;{' '}
              <strong className="text-slate-900">Haseeba Mahanaz</strong> (IT)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[11px]">
              <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>48 Street Proxies Active • Warangal &amp; Hanamkonda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-3.5">
        {/* Brand Logo & Positioning */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Proxy<span className="text-emerald-600">Grid</span>
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Offline Market Proxy
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                Human API for Unorganized Street Vendors &amp; Mandis
              </p>
            </div>
          </div>

          {/* Location Hub */}
          <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 py-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                Warangal, Hanamkonda &amp; Kazipet Corridors
              </div>
              <p className="text-[10px] text-slate-500">
                Smart Price Guard • Zero Advance on Goods
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher: Customer View vs Proxy Field App View */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/90 p-1">
          <button
            id="nav-customer-view"
            onClick={() => setCurrentView('customer')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
              currentView === 'customer'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Smartphone className="h-4 w-4 text-emerald-600" />
            <span>Customer View</span>
            {activeOrderCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {activeOrderCount}
              </span>
            )}
          </button>

          <button
            id="nav-proxy-view"
            onClick={() => setCurrentView('partner')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
              currentView === 'partner'
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Bike className="h-4 w-4 text-emerald-400" />
            <span>Proxy Field App View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
