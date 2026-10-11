'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  AlertTriangle,
  ChevronRight,
  Compass,
  Star,
  MessageCircle,
  QrCode,
  Store,
  Clock,
  Maximize2,
  Minimize2
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
  quickReplies: string[];
}

const TRACK_CARDS: TrackCardData[] = [
  {
    id: 'info',
    title: 'Need Local Information',
    tagline: 'Desk verification, municipal enquiry, property tax receipts & token lines',
    badge: '📍 Ground Intel & Verification',
    bgUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80',
    icon: <Compass className="h-7 w-7 text-orange-400" />,
    samplePrompt: 'Visit the municipal office counter 2, verify if property tax receipts are being issued offline today.',
    quickReplies: [
      'GWMC Municipal Counter 2 Status',
      'MGM Hospital OPD Token Line Check',
      'Property Tax Offline Receipt Verification',
    ],
  },
  {
    id: 'buy',
    title: 'Buy Custom Product',
    tagline: 'Electronics spare parts corridors, unlisted street apparel & weekly mandis',
    badge: '🛍️ Street Retail & Price Guard',
    bgUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    icon: <ShoppingBag className="h-7 w-7 text-orange-400" />,
    samplePrompt: 'Go to electronics lane in Nakkalagutta, find ESP32 board under ₹450.',
    quickReplies: [
      'ESP32 board under ₹450 at Nakkalagutta',
      '2 Special Ghee Dosas at Chowrasta',
      'Oversized black cotton T-shirt under ₹250',
    ],
  },
  {
    id: 'worker',
    title: 'Hire Skilled Worker',
    tagline: 'On-demand trusted electrician, plumber, appliance inspection & handywork',
    badge: '🛠️ Verified Local Handyman',
    bgUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    icon: <Wrench className="h-7 w-7 text-orange-400" />,
    samplePrompt: 'Send an experienced electrician to inspect circuit breaker trip in Subedari.',
    quickReplies: [
      'Electrician for circuit breaker trip',
      'Plumber for water motor valve leak',
      'AC technician for cooling coil check',
    ],
  },
  {
    id: 'ride',
    title: 'Book a Ride',
    tagline: 'Immediate point-to-point two-wheeler transit across Warangal & Kazipet',
    badge: '🏍️ Direct Two-Wheeler Transit',
    bgUrl: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80',
    icon: <Bike className="h-7 w-7 text-orange-400" />,
    samplePrompt: 'Need an immediate bike ride from Hanamkonda Chowrasta to Kazipet Railway Station.',
    quickReplies: [
      'Hanamkonda Chowrasta to Kazipet Station',
      'Subedari to NIT Warangal Main Gate',
      'MGM Hospital to Warangal Bus Stand',
    ],
  },
];

interface ChatBubbleMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  smartCard?: SmartContractPriceCard;
  quickReplies?: string[];
  isDeployed?: boolean;
  deployStep?: 1 | 2 | 3;
}

export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState<TrackCardData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatBubbleMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // When a track card is clicked, slide up the floating WhatsApp-style widget
  const handleOpenTrackChat = (track: TrackCardData) => {
    setActiveTrack(track);
    setIsChatOpen(true);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Initial greeting in continuous thread
    setMessages([
      {
        id: `greet-${Date.now()}`,
        sender: 'ai',
        text: `Namaste! 👋 Welcome to ProxyGrid. You selected "${track.title}". What physical errand or assistance do you need today?`,
        time: nowStr,
        quickReplies: track.quickReplies,
      },
    ]);
  };

  // Send a message from user in the WhatsApp thread
  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputValue.trim();
    if (!text || !activeTrack) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message (Radiant Orange bubble)
    const userMsg: ChatBubbleMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: nowStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      // 3-Role AI Processor
      const card = await processTrackDispatchWithAI(text, activeTrack.id);

      if (!card.isSafe) {
        const aiUnsafeMsg: ChatBubbleMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: card.unsafeMessage || '🚨 [UNSAFE REQUEST] For the safety of our partners, we cannot process this request.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiUnsafeMsg]);
      } else {
        const aiMsg: ChatBubbleMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Got it! I have decomposed your requirement and enforced your Smart Price Guard. Here is your transparent Smart Budget Card:`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          smartCard: card,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Deploy Proxy from the Smart Budget Card inside chat
  const handleDeployProxyFromCard = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isDeployed: true,
            deployStep: 1,
          };
        }
        return msg;
      })
    );
  };

  // Advance deployment stepper
  const handleAdvanceDeployStep = (messageId: string, currentStep: 1 | 2 | 3) => {
    const nextStep = (currentStep + 1) as 1 | 2 | 3;
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            deployStep: nextStep,
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-[#071938] to-slate-950 text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Radiant Glowing Ambient Light Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
        
        {/* Navigation & Hackathon Top Ribbon */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-500/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/25">
              <span className="text-xl">PG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Proxy<span className="text-orange-400">Grid</span>
                </span>
                <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-orange-300">
                  RADIANT BLUE &amp; ORANGE
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium">
                The Digital Joint Family Network • Real-World Help On-Demand
              </p>
            </div>
          </div>

          {/* Hackathon Identity Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-full bg-blue-950/60 border border-blue-500/30 px-3.5 py-1 text-xs text-blue-200 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Warangal &amp; Hanamkonda Grid Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-orange-300 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
              <span>Team VQ • Room B-4-216 (TRI26420)</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-orange-500/20 border border-orange-400/30 px-4 py-1.5 text-xs font-semibold text-orange-300 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>Traditional Joint Family Trust ✕ Next-Gen AI Technology</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Real-World Assistance,{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              On-Demand.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Click any service track below to launch your personal floating WhatsApp-style proxy dispatch assistant.
          </motion.p>
        </section>

        {/* LANDING VIEW: 4 Massive 3D Visual Cards (Framer Motion 3D Tilt) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 [perspective:1000px]">
          {TRACK_CARDS.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ 
                scale: 1.03, 
                rotateX: 2, 
                rotateY: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenTrackChat(track)}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-blue-500/30 hover:border-orange-500/60 shadow-2xl cursor-pointer group backdrop-blur-md bg-slate-900/60 transition-all duration-300"
            >
              {/* Background Photo with Zoom on Hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${track.bgUrl}')` }}
              />

              {/* Radiant Dark Blue Gradient Glassmorphic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-blue-950/20 backdrop-blur-[2px] transition-all group-hover:from-slate-950 group-hover:via-slate-950/85" />

              {/* Card Content */}
              <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900/80 border border-blue-500/30 group-hover:border-orange-500/50 backdrop-blur-md flex items-center justify-center shadow-lg transition-colors">
                    {track.icon}
                  </div>
                  <span className="rounded-full bg-slate-900/80 border border-orange-500/40 px-3 py-1 text-xs font-mono font-bold text-orange-300 backdrop-blur-md shadow-md">
                    {track.badge}
                  </span>
                </div>

                {/* Bottom Title, Subtitle, & Call-to-Action */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-orange-300 transition-colors flex items-center justify-between">
                    <span>{track.title}</span>
                    <ChevronRight className="h-6 w-6 text-orange-400 transform group-hover:translate-x-1.5 transition-transform" />
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-normal">
                    {track.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-400">
                    <span>Click to Open WhatsApp Dispatcher</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* WHATSAPP-STYLE FLOATING CHAT WIDGET (25% to 30% Width on Desktop, Bottom Sheet on Mobile) */}
      <AnimatePresence>
        {isChatOpen && activeTrack && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-4 right-4 z-50 w-full sm:w-[400px] md:w-[28vw] md:min-w-[360px] md:max-w-[440px] h-[72vh] max-h-[660px] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/40 bg-slate-950/95 backdrop-blur-2xl flex flex-col max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-[82vh] max-sm:rounded-b-none"
          >
            {/* WhatsApp Header: Deep Blue with Avatar and Online Indicator */}
            <div className="bg-gradient-to-r from-blue-950 via-[#071938] to-slate-950 border-b border-blue-500/30 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                    <span className="text-sm">AI</span>
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                      ProxyGrid Dispatcher
                    </h3>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • {activeTrack.title}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Minimize Chat Widget"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Continuous WhatsApp Chat Thread Area */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-950/60">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                          : 'bg-slate-900/90 border border-blue-500/30 text-white rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Smart Contract & Price Card (Rendered Directly in WhatsApp Flow) */}
                      {msg.smartCard && (
                        <div className="mt-3 rounded-xl bg-slate-950/80 border border-blue-500/40 p-3 space-y-2.5 text-xs text-blue-100">
                          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                            <span className="font-bold text-orange-400">
                              {msg.smartCard.categoryTitle}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <ShieldCheck className="h-3 w-3" />
                              Safe &amp; Legal
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-300">
                            <div>📍 <strong>Location</strong>: {msg.smartCard.location}</div>
                            <div>🎯 <strong>Task</strong>: {msg.smartCard.objective}</div>
                            {msg.smartCard.priceGuardText && (
                              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 font-semibold text-[10px]">
                                {msg.smartCard.priceGuardText}
                              </div>
                            )}
                          </div>

                          {/* Fee Breakdown Table */}
                          <div className="rounded-lg bg-slate-900 p-2 space-y-1 font-mono text-[11px] border border-white/5">
                            <div className="flex justify-between text-slate-400">
                              <span>Dispatch Base Fee:</span>
                              <span className="text-white font-bold">₹{msg.smartCard.priceBreakdown.baseFee}</span>
                            </div>
                            {msg.smartCard.priceBreakdown.distanceOrServiceFee > 0 && (
                              <div className="flex justify-between text-slate-400">
                                <span>Delivery/Service Fee:</span>
                                <span className="text-white font-bold">₹{msg.smartCard.priceBreakdown.distanceOrServiceFee}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-400">
                              <span>Platform Protocol:</span>
                              <span className="text-white font-bold">₹{msg.smartCard.priceBreakdown.platformFee}</span>
                            </div>
                            <div className="border-t border-white/10 pt-1 flex justify-between font-bold text-orange-400 text-xs">
                              <span>TOTAL ADVANCE:</span>
                              <span className="text-sm font-black">₹{msg.smartCard.priceBreakdown.totalAdvance}</span>
                            </div>
                          </div>

                          {/* Deploy Action Button */}
                          {!msg.isDeployed ? (
                            <button
                              onClick={() => handleDeployProxyFromCard(msg.id)}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                            >
                              <span>Confirm &amp; Deploy Proxy</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            /* Live Mission Stepper In Chat */
                            <div className="space-y-2 pt-1 border-t border-blue-500/30">
                              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                                <span>🟢 MISSION DISPATCHED</span>
                                <span>Step {msg.deployStep || 1} of 3</span>
                              </div>

                              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                                <div className={`p-1 rounded ${(msg.deployStep || 1) >= 1 ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold' : 'bg-slate-900 text-slate-500'}`}>
                                  Assigned
                                </div>
                                <div className={`p-1 rounded ${(msg.deployStep || 1) >= 2 ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold' : 'bg-slate-900 text-slate-500'}`}>
                                  At Site
                                </div>
                                <div className={`p-1 rounded ${(msg.deployStep || 1) >= 3 ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-900 text-slate-500'}`}>
                                  Delivered
                                </div>
                              </div>

                              <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-white/5 flex items-center gap-2">
                                <Bike className="h-4 w-4 text-orange-400 shrink-0" />
                                <span>Ramesh K. (Hero Splendor, 4.9★) deployed.</span>
                              </div>

                              {(msg.deployStep || 1) < 3 ? (
                                <button
                                  onClick={() => handleAdvanceDeployStep(msg.id, msg.deployStep || 1)}
                                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Advance to Step {(msg.deployStep || 1) + 1}</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              ) : (
                                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold text-center flex items-center justify-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>Mission Complete &amp; Handed Over!</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[9px] font-mono text-slate-400 px-1">
                      {msg.time}
                    </span>

                    {/* Quick Replies Chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                        {msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(reply)}
                            className="text-[11px] rounded-full bg-slate-900 hover:bg-orange-500/20 border border-blue-500/30 hover:border-orange-500/40 text-blue-200 hover:text-orange-300 px-3 py-1 transition-all text-left cursor-pointer active:scale-95"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-mono text-orange-300 p-2">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-orange-400" />
                  <span>ProxyGrid AI is typing...</span>
                </div>
              )}

              <div ref={chatScrollRef} />
            </div>

            {/* WhatsApp Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="bg-slate-950 border-t border-blue-500/30 p-2.5 sm:p-3 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your errand requirement..."
                className="flex-1 rounded-2xl bg-slate-900 border border-blue-500/30 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="h-9 w-9 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Re-open Button (Visible when chat is minimized) */}
      {!isChatOpen && activeTrack && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-3 text-slate-950 font-bold text-xs shadow-xl shadow-orange-500/30 border border-orange-300 cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-slate-950" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Open Chat ({activeTrack.title.split(' ')[0]})</span>
        </motion.button>
      )}

      {/* Clean Footer */}
      <footer className="relative z-10 border-t border-blue-500/20 py-6 text-center text-xs text-blue-200/60 space-y-1">
        <p>
          TriCity AI Hackathon • Room B-4-216 • Team TRI26420
        </p>
        <p className="text-[11px] text-blue-300/80">
          Lead: <strong className="text-white">Rayapuram Vikram</strong> (CSE AI) • Member: <strong className="text-white">Haseeba Mahanaz</strong> (IT) • Warangal Grid
        </p>
      </footer>
    </div>
  );
}
