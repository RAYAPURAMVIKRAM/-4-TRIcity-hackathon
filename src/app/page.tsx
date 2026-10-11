'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  ShoppingBag, 
  Wrench, 
  Bike, 
  Send, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Camera, 
  Phone, 
  AlertTriangle,
  Radio,
  Lock,
  ChevronRight,
  Compass,
  Star
} from 'lucide-react';
import { processTrackDispatchWithAI } from '@/lib/gemini';
import { TrackType, SmartContractPriceCard } from '@/types/task';

interface TrackCardData {
  id: TrackType;
  title: string;
  tagline: string;
  badge: string;
  bgUrl: string;
  icon: React.ReactNode;
  samplePrompt: string;
}

const TRACK_CARDS: TrackCardData[] = [
  {
    id: 'info',
    title: 'Need Local Information',
    tagline: 'Desk verification, municipal enquiry, property tax receipts & token lines',
    badge: '📍 Ground Intel & Verification',
    bgUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80',
    icon: <Compass className="h-7 w-7 text-amber-400" />,
    samplePrompt: 'Visit the municipal office counter 2, verify if property tax receipts are being issued offline today.',
  },
  {
    id: 'buy',
    title: 'Buy Custom Product',
    tagline: 'Electronics spare parts corridors, unlisted street apparel & weekly mandis',
    badge: '🛍️ Street Retail & Price Guard',
    bgUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    icon: <ShoppingBag className="h-7 w-7 text-amber-400" />,
    samplePrompt: 'Go to electronics lane in Nakkalagutta, find ESP32 board under ₹450.',
  },
  {
    id: 'worker',
    title: 'Hire Skilled Worker',
    tagline: 'On-demand trusted electrician, plumber, appliance inspection & handywork',
    badge: '🛠️ Verified Local Handyman',
    bgUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    icon: <Wrench className="h-7 w-7 text-amber-400" />,
    samplePrompt: 'Send an experienced electrician to inspect circuit breaker trip in Subedari.',
  },
  {
    id: 'ride',
    title: 'Book a Ride',
    tagline: 'Immediate point-to-point two-wheeler transit across Warangal & Kazipet',
    badge: '🏍️ Direct Two-Wheeler Transit',
    bgUrl: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80',
    icon: <Bike className="h-7 w-7 text-amber-400" />,
    samplePrompt: 'Need an immediate bike ride from Hanamkonda Chowrasta to Kazipet Railway Station.',
  },
];

export default function HomePage() {
  const [selectedTrack, setSelectedTrack] = useState<TrackCardData | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [smartCard, setSmartCard] = useState<SmartContractPriceCard | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployStep, setDeployStep] = useState<1 | 2 | 3>(1);

  // Open Chat Modal for a Track
  const handleOpenTrack = (track: TrackCardData) => {
    setSelectedTrack(track);
    setChatInput(track.samplePrompt);
    setSmartCard(null);
    setIsDeployed(false);
    setDeployStep(1);
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedTrack(null);
    setSmartCard(null);
    setIsDeployed(false);
    setDeployStep(1);
  };

  // Submit Prompt to AI
  const handleSendPrompt = async (promptText?: string) => {
    const text = promptText || chatInput.trim();
    if (!text || !selectedTrack) return;

    setIsProcessing(true);
    try {
      const card = await processTrackDispatchWithAI(text, selectedTrack.id);
      setSmartCard(card);
    } catch (err) {
      console.error('Error during AI dispatch:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Deploy Proxy
  const handleConfirmDeploy = () => {
    setIsDeployed(true);
    setDeployStep(1);
  };

  // Reset Everything
  const handleReset = () => {
    setSelectedTrack(null);
    setSmartCard(null);
    setIsDeployed(false);
    setDeployStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1128] to-[#041c32] text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
        
        {/* Navigation & Hackathon Ribbon */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <span className="text-xl">PG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Proxy<span className="text-amber-400">Grid</span>
                </span>
                <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  NEW CLASSIC 3D
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                The Digital Joint Family Network • Real-World Help On-Demand
              </p>
            </div>
          </div>

          {/* Room & Team Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Warangal &amp; Hanamkonda Grid</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <span>Team VQ • Room B-4-216 (TRI26420)</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-400/30 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Traditional Joint Family Trust ✕ Next-Gen AI Technology</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Real-World Assistance,{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              On-Demand.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Select a service track below to dispatch a trusted human proxy in your city. Enforced with AI safety guardrails, price-cap locks, and zero hidden markups.
          </motion.p>
        </section>

        {/* LANDING VIEW: 4 Massive 3D Visual Cards (1-col on mobile, 2x2 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 [perspective:1000px]">
          {TRACK_CARDS.map((track, idx) => (
            <motion.div
              key={track.id}
              whileHover={{ 
                scale: 1.03, 
                rotateX: 2, 
                rotateY: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenTrack(track)}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group backdrop-blur-md bg-white/5 transition-all duration-300"
            >
              {/* Background Photo with Zoom on Hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${track.bgUrl}')` }}
              />

              {/* Dark Gradient Glassmorphic Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent backdrop-blur-[2px] transition-all group-hover:from-slate-950 group-hover:via-slate-950/80" />

              {/* Card Content */}
              <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900/80 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:border-amber-400/60 transition-colors">
                    {track.icon}
                  </div>
                  <span className="rounded-full bg-slate-900/80 border border-amber-400/40 px-3 py-1 text-xs font-mono font-bold text-amber-300 backdrop-blur-md shadow-md">
                    {track.badge}
                  </span>
                </div>

                {/* Bottom Title, Subtitle, & Call-to-Action */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    <span>{track.title}</span>
                    <ChevronRight className="h-6 w-6 text-amber-400 transform group-hover:translate-x-1.5 transition-transform" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {track.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400">
                    <span>Click to Deploy Assistant</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* AI CHATBOT & SMART CONTRACT MODAL (Sliding 3D Glassmorphism Overlay) */}
      <AnimatePresence>
        {selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl rounded-3xl bg-slate-900/90 border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-2xl text-white my-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    {selectedTrack.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      AI Dispatch Engine
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {selectedTrack.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-slate-300 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!isDeployed ? (
                <>
                  {/* AI Greeting Bubble */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1.5 text-xs sm:text-sm text-slate-200">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Dispatch Assistant</span>
                    </div>
                    <p className="leading-relaxed">
                      &quot;Welcome to ProxyGrid. I am your dispatch assistant. What do you need help with today?&quot;
                    </p>
                  </div>

                  {/* Quick Preset Chip (1-Tap Test) */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Sample Request for this Track:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setChatInput(selectedTrack.samplePrompt);
                        handleSendPrompt(selectedTrack.samplePrompt);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all text-xs text-amber-200 flex items-center justify-between group"
                    >
                      <span className="truncate pr-2 font-medium">{selectedTrack.samplePrompt}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendPrompt();
                    }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your exact requirement or question..."
                      className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3.5 pr-12 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !chatInput.trim()}
                      className="absolute right-2 top-2 h-9 w-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Processing Indicator */}
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-2 py-4 text-xs font-mono text-amber-300">
                      <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                      <span>Verifying safety guardrails &amp; computing nominal pricing...</span>
                    </div>
                  )}

                  {/* SMART CONTRACT & PRICE CARD */}
                  {smartCard && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl p-5 border shadow-xl space-y-4 ${
                        !smartCard.isSafe
                          ? 'bg-red-950/40 border-red-500/40 text-red-200'
                          : 'bg-gradient-to-b from-white/15 to-white/5 border-amber-400/40'
                      }`}
                    >
                      {!smartCard.isSafe ? (
                        /* Unsafe Request Guardrail Triggered */
                        <div className="space-y-2 text-center py-2">
                          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                          <h4 className="text-sm font-bold text-red-300">
                            {smartCard.unsafeMessage}
                          </h4>
                          <p className="text-xs text-red-200/80 leading-relaxed">
                            ProxyGrid maintains strict policies against illegal, hazardous, or unethical physical requests.
                          </p>
                        </div>
                      ) : (
                        /* Safe Smart Contract Card */
                        <>
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                                Smart Contract Decomposed
                              </span>
                              <h4 className="text-base font-black text-white mt-0.5">
                                {smartCard.categoryTitle}
                              </h4>
                            </div>
                            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {smartCard.securityCheck}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-slate-300">
                            <div>
                              📍 <strong>Target Location</strong>: {smartCard.location}
                            </div>
                            <div>
                              🎯 <strong>Mission Objective</strong>: {smartCard.objective}
                            </div>
                            {smartCard.priceGuardText && (
                              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-semibold mt-1">
                                {smartCard.priceGuardText}
                              </div>
                            )}
                          </div>

                          {/* Nominal Fee Breakdown */}
                          <div className="rounded-xl bg-slate-950/60 border border-white/10 p-3.5 text-xs font-mono space-y-1.5">
                            <div className="flex justify-between text-slate-400">
                              <span>Base Partner Dispatch Fee:</span>
                              <span className="text-white font-bold">₹{smartCard.priceBreakdown.baseFee}</span>
                            </div>
                            {smartCard.priceBreakdown.distanceOrServiceFee > 0 && (
                              <div className="flex justify-between text-slate-400">
                                <span>Distance / Service Fee:</span>
                                <span className="text-white font-bold">₹{smartCard.priceBreakdown.distanceOrServiceFee}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-400">
                              <span>Platform Escrow Protocol:</span>
                              <span className="text-white font-bold">₹{smartCard.priceBreakdown.platformFee}</span>
                            </div>
                            <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold text-amber-400">
                              <span>TOTAL ADVANCE:</span>
                              <span className="text-lg font-black">₹{smartCard.priceBreakdown.totalAdvance}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 pt-1 font-sans">
                              {smartCard.priceBreakdown.note}
                            </p>
                          </div>

                          {/* Glowing Gold Action Button */}
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConfirmDeploy}
                            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 py-3.5 text-slate-950 text-sm font-black tracking-wide shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <span>Confirm &amp; Deploy Proxy</span>
                            <ArrowRight className="h-4 w-4" />
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                /* LIVE PROXY DEPLOYMENT TRACKING */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      PROXY DEPLOYMENT ACTIVE
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restart</span>
                    </button>
                  </div>

                  {/* 3-Step Progress Stepper */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2.5 rounded-xl border ${deployStep >= 1 ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' : 'border-white/10 text-slate-500'}`}>
                      <div className="text-[10px] font-mono">01</div>
                      <span>Assigned</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${deployStep >= 2 ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' : 'border-white/10 text-slate-500'}`}>
                      <div className="text-[10px] font-mono">02</div>
                      <span>At Location</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${deployStep >= 3 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold' : 'border-white/10 text-slate-500'}`}>
                      <div className="text-[10px] font-mono">03</div>
                      <span>Completed</span>
                    </div>
                  </div>

                  {/* Partner Profile Box */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Ramesh K."
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Ramesh K. (Proxy Lead)</h4>
                        <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400" /> 4.9
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Bike className="h-3.5 w-3.5 text-amber-400" /> Hero Splendor (TS 03 AB 4421)
                      </p>
                      <p className="text-[11px] text-emerald-400 font-mono mt-1">
                        {deployStep === 1 ? 'Heading to designated site • ETA ~8 mins' : deployStep === 2 ? 'At site counter • Transmitting proof' : 'Mission complete & verified'}
                      </p>
                    </div>
                  </div>

                  {/* Step Control Buttons */}
                  <div className="pt-2 flex gap-2">
                    {deployStep < 3 ? (
                      <button
                        onClick={() => setDeployStep((prev) => (prev + 1) as 2 | 3)}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>Advance to Step {deployStep + 1}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleReset}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Mission Successfully Handed Over (Return Home)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-400 space-y-1">
        <p>
          TriCity AI Hackathon • Room B-4-216 • Team TRI26420
        </p>
        <p className="text-[11px] text-slate-500">
          Lead: <strong className="text-slate-300">Rayapuram Vikram</strong> (CSE AI) • Member: <strong className="text-slate-300">Haseeba Mahanaz</strong> (IT) • Warangal Grid
        </p>
      </footer>
    </div>
  );
}
