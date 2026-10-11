'use client';

import React, { useState } from 'react';
import { ErrandOrder, OrderStatus } from '@/types/task';
import { 
  Bike, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  CheckSquare, 
  Sparkles,
  ArrowRight,
  Battery,
  Wifi,
  Radio,
  AlertCircle
} from 'lucide-react';

interface PartnerWorkerAppProps {
  orders: ErrandOrder[];
  onAcceptOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const PartnerWorkerApp: React.FC<PartnerWorkerAppProps> = ({
  orders,
  onAcceptOrder,
  onUpdateStatus,
}) => {
  const [workerOnline, setWorkerOnline] = useState(true);
  const [todayEarnings, setTodayEarnings] = useState(640);
  const [completedCount, setCompletedCount] = useState(6);
  const [activeTab, setActiveTab] = useState<'incoming' | 'active'>('incoming');

  const incomingOrders = orders.filter((o) => o.status === 'placed');
  const activeOrders = orders.filter((o) => o.status !== 'placed' && o.status !== 'completed');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Smartphone Mockup Outer Container */}
      <div className="rounded-3xl border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl overflow-hidden">
        {/* Smartphone Screen Canvas */}
        <div className="rounded-[22px] bg-slate-50 min-h-[640px] flex flex-col overflow-hidden text-slate-900">
          {/* Phone Status Bar */}
          <div className="bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>03:45 PM</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="h-3 w-3" /> 5G
              </span>
              <span className="flex items-center gap-1">
                <Battery className="h-3 w-3" /> 88%
              </span>
            </div>
          </div>

          {/* Worker App Top Header */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full border-2 border-emerald-400 overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Ramesh"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Ramesh K. (Partner ID #042)</h3>
                  <p className="text-[10px] text-slate-300 font-mono">Hero Splendor • TS 03 AB 4421</p>
                </div>
              </div>

              {/* Online / Offline Toggle */}
              <button
                onClick={() => setWorkerOnline(!workerOnline)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  workerOnline
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${workerOnline ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                <span>{workerOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            </div>

            {/* Daily Stats Bar */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-800/60 rounded-xl p-2 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Today&apos;s Earnings</div>
                <div className="text-base font-black text-emerald-400">₹{todayEarnings}</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-2 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Errands Delivered</div>
                <div className="text-base font-black text-white">{completedCount} Completed</div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'incoming'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Incoming Errand Alerts ({incomingOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'active'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bike className="h-3.5 w-3.5" />
              <span>Active Errand ({activeOrders.length})</span>
            </button>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {activeTab === 'incoming' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>WARANGAL CITY CORRIDOR BROADCAST</span>
                  <span className="text-emerald-700 font-bold">Auto-matching enabled</span>
                </div>

                {incomingOrders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 space-y-2">
                    <Bike className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">No Pending Errand Dispatches</p>
                    <p className="text-[11px] text-slate-400">
                      Submit an errand from the <strong>Customer App</strong> to see the worker smartphone alert pop up here instantly!
                    </p>
                  </div>
                ) : (
                  incomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border-2 border-emerald-500 bg-white p-4 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            NEW ERRAND #{order.id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {order.analysis.taskTitle}
                          </h4>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            {order.analysis.targetLocation}
                          </p>
                        </div>

                        {/* Payout Tag */}
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Worker Payout</div>
                          <div className="text-lg font-black text-emerald-700">
                            ₹{order.analysis.pricing.serviceSubtotal}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 space-y-1">
                        <div className="font-semibold text-slate-800">Task Overview:</div>
                        <p className="line-clamp-2">{order.prompt}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Est. Duration: {order.analysis.estimatedMinutes}m</span>
                        <span>Distance: {order.analysis.distanceKm} km</span>
                      </div>

                      <button
                        onClick={() => {
                          onAcceptOrder(order.id);
                          setActiveTab('active');
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Accept Errand &amp; Start Navigation (Earn ₹{order.analysis.pricing.serviceSubtotal})</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeOrders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 space-y-2">
                    <CheckSquare className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">No Active Errand In Execution</p>
                    <p className="text-[11px] text-slate-400">
                      Accept an errand from the Incoming tab to begin on-ground execution.
                    </p>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">ORDER #{order.id}</span>
                          <h4 className="text-sm font-bold text-slate-900">{order.analysis.taskTitle}</h4>
                        </div>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 uppercase">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Navigation directions */}
                      <div className="rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Navigation className="h-5 w-5 text-emerald-400 animate-pulse" />
                          <div>
                            <div className="text-[10px] font-mono text-slate-400 uppercase">Target Coordinates</div>
                            <div className="text-xs font-bold truncate max-w-[200px]">{order.analysis.targetLocation}</div>
                          </div>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(order.analysis.targetLocation)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                        >
                          GPS Map
                        </a>
                      </div>

                      {/* Partner Checklist */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-700">On-Ground Checklist:</div>
                        <div className="space-y-1.5 text-xs text-slate-700">
                          {order.analysis.clarificationPlan.map((step: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{step.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Step Transitions */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {order.status === 'assigned' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'arrived')}
                            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                          >
                            📍 Mark &quot;Arrived at Errand Spot&quot;
                          </button>
                        )}

                        {order.status === 'arrived' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'in_progress')}
                            className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-700"
                          >
                            ⏳ Start &quot;Purchasing / Executing Task&quot;
                          </button>
                        )}

                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => {
                              onUpdateStatus(order.id, 'completed');
                              setTodayEarnings((e) => e + order.analysis.pricing.serviceSubtotal);
                              setCompletedCount((c) => c + 1);
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Task Completed - Release ₹{order.analysis.pricing.serviceSubtotal} Payout</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
