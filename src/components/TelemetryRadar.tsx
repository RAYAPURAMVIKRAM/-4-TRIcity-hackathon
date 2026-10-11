'use client';

import React, { useEffect, useState } from 'react';
import { Radio, MapPin, ShieldCheck, Activity, Users, Compass } from 'lucide-react';

interface ProxyNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  status: 'Online' | 'Busy' | 'Standing By';
  reputation: number;
}

export const TelemetryRadar: React.FC = () => {
  const [nodes, setNodes] = useState<ProxyNode[]>([
    { id: 'PRX-09', name: 'K. Sai Krishna', lat: 17.9814, lng: 79.5977, distanceMeters: 45, status: 'Online', reputation: 98.4 },
    { id: 'PRX-14', name: 'R. Sandeep', lat: 18.0051, lng: 79.5712, distanceMeters: 80, status: 'Online', reputation: 99.1 },
    { id: 'PRX-22', name: 'V. Ananya', lat: 17.9942, lng: 79.5638, distanceMeters: 35, status: 'Standing By', reputation: 97.8 },
    { id: 'PRX-31', name: 'M. Rahul', lat: 17.9780, lng: 79.6010, distanceMeters: 120, status: 'Online', reputation: 96.5 },
  ]);

  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'Telemetry mesh online across Warangal-Hanamkonda corridor',
    'Peer PRX-09 locked in MGM OPD buffer zone [±45m]',
    'Anti-Spoof GPS hardware heartbeat verified for 24 nodes',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        `PRX-22 heartbeat received at Subedari RTO zone (latency 14ms)`,
        `PRX-14 inventory beacon verified at Nakkalagutta retail belt`,
        `Mesh network active: 4 peer proxies within 150m radius`,
        `Geofence cryptographic proof token refreshed (Epoch ${Math.floor(Date.now() / 10000)})`,
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setTelemetryLogs((prev) => [randomLog, ...prev.slice(0, 3)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Warangal Tri-City Proxy Radar
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          4 Proxies in Proximity
        </span>
      </div>

      {/* Radar Visualizer */}
      <div className="mt-4 relative flex aspect-square max-h-[220px] w-full items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden mx-auto">
        {/* Concentric distance rings */}
        <div className="absolute h-44 w-44 rounded-full border border-slate-800/80" />
        <div className="absolute h-32 w-32 rounded-full border border-slate-700/60" />
        <div className="absolute h-20 w-20 rounded-full border border-cyan-500/30 bg-cyan-950/20" />
        <div className="absolute h-10 w-10 rounded-full border border-emerald-500/50 bg-emerald-950/30" />

        {/* Crosshair axes */}
        <div className="absolute h-full w-[1px] bg-slate-800/80" />
        <div className="absolute w-full h-[1px] bg-slate-800/80" />

        {/* Radar sweeping scan line */}
        <div className="absolute inset-0 radar-sweep pointer-events-none">
          <div className="h-1/2 w-1/2 origin-bottom-right bg-gradient-to-tr from-cyan-500/20 to-transparent" />
        </div>

        {/* Center Requester node */}
        <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50">
          <div className="h-2 w-2 rounded-full bg-slate-950" />
        </div>

        {/* Active Proxy Nodes Pinned on Radar */}
        <div 
          className="absolute z-10 flex flex-col items-center group cursor-pointer"
          style={{ top: '28%', left: '68%' }}
          title="PRX-09 (MGM OPD Buffer)"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-white" />
          </span>
          <span className="mt-0.5 rounded bg-slate-900/90 px-1 py-0.2 text-[9px] font-mono text-emerald-300 border border-emerald-500/30">
            PRX-09 (45m)
          </span>
        </div>

        <div 
          className="absolute z-10 flex flex-col items-center group cursor-pointer"
          style={{ top: '65%', left: '25%' }}
          title="PRX-22 (RTO Subedari)"
        >
          <span className="relative flex h-3 w-3">
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400 border border-white" />
          </span>
          <span className="mt-0.5 rounded bg-slate-900/90 px-1 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
            PRX-22 (35m)
          </span>
        </div>

        <div 
          className="absolute z-10 flex flex-col items-center group cursor-pointer"
          style={{ top: '78%', left: '72%' }}
          title="PRX-14 (Nakkalagutta)"
        >
          <span className="relative flex h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span className="mt-0.5 rounded bg-slate-900/90 px-1 py-0.2 text-[9px] font-mono text-teal-300 border border-teal-500/30">
            PRX-14 (80m)
          </span>
        </div>

        {/* Range label */}
        <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-500">
          Scale: 100m
        </div>
      </div>

      {/* Real-time Telemetry Feed Ticker */}
      <div className="mt-3 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Compass className="h-3 w-3 text-cyan-400" /> Live Grid Telemetry
        </div>
        <div className="space-y-1 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 font-mono text-[11px]">
          {telemetryLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400 truncate">
              <span className="text-cyan-400">›</span>
              <span className="truncate">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
