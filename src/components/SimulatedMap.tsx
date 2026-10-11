'use client';

import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Bike, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Maximize2 
} from 'lucide-react';
import { OrderStatus, LiveActivityLog } from '@/types/task';

interface SimulatedMapProps {
  orderStatus: OrderStatus;
  workerName: string;
  vehicle: string;
  targetLocation: string;
  deliveryLocation?: string;
  liveLogs: LiveActivityLog[];
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  orderStatus,
  workerName,
  vehicle,
  targetLocation,
  deliveryLocation,
  liveLogs,
}) => {
  // Animated scooter progress position (0% to 100% along route)
  const [routeProgress, setRouteProgress] = useState(30);

  useEffect(() => {
    switch (orderStatus) {
      case 'placed':
        setRouteProgress(10);
        break;
      case 'assigned':
        setRouteProgress(25);
        break;
      case 'arrived':
        setRouteProgress(55);
        break;
      case 'in_progress':
        setRouteProgress(75);
        break;
      case 'completed':
        setRouteProgress(100);
        break;
    }
  }, [orderStatus]);

  // Coordinates on stylized 500x320 SVG canvas
  // Start (Partner start / hub): (80, 240)
  // Target (Store / Office / Hospital): (260, 110)
  // Delivery destination (Hostel / Home): (420, 220)
  const startX = 80;
  const startY = 240;
  const targetX = 260;
  const targetY = 110;
  const destX = 420;
  const destY = 220;

  // Compute bike marker coordinates based on routeProgress percentage
  let bikeX = startX;
  let bikeY = startY;

  if (routeProgress <= 50) {
    const t = routeProgress / 50;
    bikeX = startX + (targetX - startX) * t;
    bikeY = startY + (targetY - startY) * t;
  } else {
    const t = (routeProgress - 50) / 50;
    bikeX = targetX + (destX - targetX) * t;
    bikeY = targetY + (destY - targetY) * t;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">
            Live City GPS Telemetry • Warangal Grid
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <Navigation className="h-3 w-3 text-emerald-600 animate-spin" />
          <span>Real-time GPS Lock (±2.5m)</span>
        </div>
      </div>

      {/* Styled Vector Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-[#EBF3F5] overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Soft grid pattern for city blocks */}
            <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1E3E8" strokeWidth="1" />
            </pattern>
            {/* Park / Greenery area */}
            <linearGradient id="park-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D5EED8" />
              <stop offset="100%" stopColor="#C3E6C8" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="320" fill="#EBF3F5" />
          <rect width="500" height="320" fill="url(#city-grid)" />

          {/* Water body / Bhadrakali lake representation */}
          <path
            d="M 330 0 Q 370 40 390 90 Q 420 120 480 110 L 500 0 Z"
            fill="#C9E6F2"
            stroke="#B2D8E8"
            strokeWidth="1.5"
          />
          <text x="390" y="50" fill="#6B9CB0" fontSize="10" fontWeight="600">
            Bhadrakali Lake
          </text>

          {/* Public Greenery / NIT Campus area */}
          <rect x="20" y="20" width="130" height="90" rx="8" fill="url(#park-grad)" stroke="#B6DDBB" strokeWidth="1" />
          <text x="35" y="65" fill="#437849" fontSize="10" fontWeight="600">
            NIT Warangal Campus
          </text>

          {/* Major Roads / Arterial Highways */}
          {/* Main Road 1: Hanamkonda to Warangal Station */}
          <path d="M 0 240 L 500 240" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
          <path d="M 0 240 L 500 240" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

          {/* Diagonal Road: Chowrasta to Subedari */}
          <path d="M 80 320 L 260 110 L 450 60" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M 80 320 L 260 110 L 450 60" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

          {/* Cross Street to Hospital */}
          <path d="M 260 110 L 420 220 L 440 320" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M 260 110 L 420 220 L 440 320" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

          {/* Road Labels */}
          <text x="140" y="234" fill="#94A3B8" fontSize="8" fontWeight="bold">
            WARANGAL MAIN HIGHWAY (NH-163)
          </text>
          <text x="150" y="160" fill="#94A3B8" fontSize="8" fontWeight="bold" transform="rotate(-40 150 160)">
            CHOWRASTA ARTERIAL ROAD
          </text>

          {/* Active Navigation Path (Emerald pulsing line) */}
          <path
            d={`M ${startX} ${startY} L ${targetX} ${targetY} L ${destX} ${destY}`}
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-route"
          />

          {/* Point 1: Partner Start Marker */}
          <circle cx={startX} cy={startY} r="7" fill="#64748B" stroke="#FFFFFF" strokeWidth="2" />
          <text x={startX - 30} y={startY + 20} fill="#475569" fontSize="9" fontWeight="bold">
            Partner Base
          </text>

          {/* Point 2: Errand Target Pin (Stall / Office / Hospital) */}
          <g transform={`translate(${targetX - 12}, ${targetY - 26})`}>
            <circle cx="12" cy="12" r="14" fill="#F59E0B" fillOpacity="0.25" />
            <path
              d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="#D97706"
            />
          </g>
          <text x={targetX - 50} y={targetY - 14} fill="#B45309" fontSize="10" fontWeight="bold">
            {targetLocation.slice(0, 20)}...
          </text>

          {/* Point 3: Destination Pin (Customer Gate / Hostel) */}
          <g transform={`translate(${destX - 12}, ${destY - 26})`}>
            <circle cx="12" cy="12" r="14" fill="#10B981" fillOpacity="0.25" />
            <path
              d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="#059669"
            />
          </g>
          <text x={destX - 35} y={destY + 22} fill="#065F46" fontSize="10" fontWeight="bold">
            Your Delivery Point
          </text>

          {/* Moving Animated Scooter Marker */}
          <g transform={`translate(${bikeX - 18}, ${bikeY - 18})`}>
            <circle cx="18" cy="18" r="20" fill="#10B981" fillOpacity="0.35" className="animate-ping" />
            <circle cx="18" cy="18" r="15" fill="#047857" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Scooter Icon glyph */}
            <path
              d="M12 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM15 15h6M19 11l-3 4M13 13h4"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Floating ETA overlay card */}
        <div className="absolute top-3 left-3 rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur-md border border-slate-100 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              {orderStatus === 'completed' ? 'Delivered' : 'Live ETA'}
            </div>
            <div className="text-sm font-black text-slate-900 leading-none mt-0.5">
              {orderStatus === 'completed' ? 'Task Completed' : orderStatus === 'in_progress' ? '5 mins away' : '8-10 mins away'}
            </div>
          </div>
        </div>

        {/* Floating Status Pill */}
        <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/90 text-white px-3 py-1 text-xs font-semibold shadow-md flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{workerName} is {orderStatus.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Live Activity Log Ticker */}
      <div className="border-t border-slate-100 bg-white p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-600" />
            Live Activity Updates
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Automated On-Ground Feed
          </span>
        </div>

        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-xs">
          {liveLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-2 border border-slate-100"
            >
              <span className="mt-0.5 flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex-1">
                <p className="text-slate-800 font-medium leading-snug">{log.message}</p>
                <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
