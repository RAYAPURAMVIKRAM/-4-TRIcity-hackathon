'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatMessage, 
  EchoConfirmationData, 
  UpfrontBookingPricing 
} from '@/types/task';
import { 
  getInitialChatMessages, 
  processChatConversation, 
  generateBookingCardResponse 
} from '@/lib/gemini';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  Coins, 
  Clock, 
  MapPin, 
  Edit3, 
  Rocket, 
  Radio, 
  ShieldCheck, 
  Zap,
  Store,
  Tag,
  AlertCircle
} from 'lucide-react';

interface ConversationalConciergeProps {
  onErrandConfirmed: (echoData: EchoConfirmationData, rawPrompt: string) => void;
}

const UNORGANIZED_PRESETS = [
  {
    icon: '🔌',
    category: 'Electronics Corridor',
    label: 'Arduino / ESP32 Board (Nakkalagutta)',
    prompt: 'Go to the electronics lane in Nakkalagutta, find an Arduino Uno or ESP32 board. Buy only if it is under ₹450.',
  },
  {
    icon: '👕',
    category: 'Street Apparel / Bargain',
    label: 'Oversized Cotton T-shirt (Old Bus Stand)',
    prompt: 'Check the street stall opposite the old bus stand for oversized black cotton T-shirts. If they offer it under ₹250, buy size L.',
  },
  {
    icon: '🍅',
    category: 'Weekly Mandi Produce',
    label: 'Tomatoes 2kg (Warangal Mandi)',
    prompt: 'Go to the vegetable market, check price of country tomatoes. If under ₹30/kg, get 2 kg, else WhatsApp me the price.',
  },
  {
    icon: '🏛️',
    category: 'Pure Ground Info',
    label: 'Property Tax Counter Check (Municipal)',
    prompt: 'Visit the municipal office counter 2, verify if property tax receipts are being issued offline today.',
  },
];

export const ConversationalConcierge: React.FC<ConversationalConciergeProps> = ({
  onErrandConfirmed,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [latestEchoData, setLatestEchoData] = useState<EchoConfirmationData | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    setLastUserPrompt(text);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      await new Promise((r) => setTimeout(r, 600));
      const responseMsg = await processChatConversation(text, messages);
      setMessages((prev) => [...prev, responseMsg]);

      if (responseMsg.echoData) {
        setLatestEchoData(responseMsg.echoData);
      }
    } catch (err) {
      console.error('Error in chat conversation:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionId: string, echoData?: EchoConfirmationData) => {
    if (actionId === 'confirm_booking_card') {
      const data = echoData || latestEchoData;
      if (!data) return;

      setIsTyping(true);
      setTimeout(() => {
        const bookingCardMsg = generateBookingCardResponse(data);
        setMessages((prev) => [...prev, bookingCardMsg]);
        setIsTyping(false);
      }, 500);
    } else if (actionId === 'edit_intent') {
      const editMsg: ChatMessage = {
        id: `edit-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: 'Sure! Please specify your revised item, stall location, or price cap.',
      };
      setMessages((prev) => [...prev, editMsg]);
    } else if (actionId === 'dispatch_offline_proxy') {
      const cardMsg = [...messages].reverse().find((m) => m.echoData);
      if (cardMsg?.echoData) {
        onErrandConfirmed(cardMsg.echoData, lastUserPrompt);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[740px] rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* 1. Header (Offline Market Concierge) */}
      <div className="border-b border-slate-200 bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md">
              <Store className="h-6 w-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                ProxyGrid Offline Market Concierge
              </h2>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                Team VQ
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Proxy for Unorganized Street Vendors &amp; Mandis (Warangal Grid)</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
            Room B-4-216
          </span>
        </div>
      </div>

      {/* 2. Chat Scrollable View Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {!isUser ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                  AI
                </div>
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-bold shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Stage 3: Echo Confirmation Card with Smart Price Guard */}
                {msg.stage === 'echo_confirm' && msg.echoData && (
                  <div className="mt-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-200/80 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Errand Intent &amp; Constraint Verified</span>
                      </span>
                      <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                        {msg.echoData.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700 pt-1">
                      <div>
                        📍 <strong>Stall / Area</strong>: {msg.echoData.location}
                      </div>
                      <div>
                        🔍 <strong>Item</strong>: {msg.echoData.itemOrTask}
                      </div>
                      <div className="rounded-lg bg-emerald-100/90 p-2 text-emerald-950 font-semibold border border-emerald-200 text-[11px] mt-1">
                        🛡️ <strong>Smart Price Guard Rule</strong>: {msg.echoData.priceGuard?.conditionText || 'Verify stall counter price before purchase'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 4: Nominal Upfront Booking & Zero-Advance Pricing Card */}
                {msg.stage === 'booking_card' && msg.pricingData && (
                  <div className="mt-3 rounded-2xl border-2 border-emerald-500 bg-white p-4 sm:p-5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 font-mono">
                          PHASE 1: PROXY DISPATCH
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">
                          Nominal Booking &amp; Zero-Advance Pricing
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Advance to Dispatch</span>
                        <div className="text-2xl font-black text-emerald-600">
                          ₹{msg.pricingData.totalAdvanceToDispatch}
                        </div>
                      </div>
                    </div>

                    {/* Smart Price Guard Guarantee Banner */}
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>{msg.pricingData.guaranteeBadge}</span>
                    </div>

                    {/* Itemized Fee Breakdown */}
                    <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 space-y-1.5 font-mono border border-slate-100">
                      <div className="flex justify-between">
                        <span>Partner Booking / Dispatch Fee:</span>
                        <span className="font-bold text-slate-900">₹{msg.pricingData.bookingFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Local Distance Delivery Fee:</span>
                        <span className="font-bold text-slate-900">₹{msg.pricingData.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 bg-emerald-100/60 p-1 rounded font-bold">
                        <span>Upfront Product Advance:</span>
                        <span>₹{msg.pricingData.productAdvance} (Pay directly at stall!)</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Waiting Charges Policy:</span>
                        <span className="text-emerald-700 font-bold">₹0 (Strictly Free)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Escrow Fee:</span>
                        <span className="font-bold text-slate-900">₹{msg.pricingData.platformFee}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                        <span>TOTAL ADVANCE COMMITMENT:</span>
                        <span className="text-emerald-700">₹{msg.pricingData.totalAdvanceToDispatch}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">
                      💡 <strong>Why Zero Advance?</strong> Street stall prices fluctuate. Our proxy inspects the item on-site, snaps a live counter photo, and presents the quote for your instant approval before you pay a single rupee for the item!
                    </p>
                  </div>
                )}

                {/* Quick Action Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    {msg.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action.actionId, msg.echoData)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                          action.variant === 'emerald'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : action.variant === 'primary'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 text-sm py-2.5 px-5'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {action.actionId === 'confirm_booking_card' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {action.actionId === 'edit_intent' && <Edit3 className="h-3.5 w-3.5" />}
                        {action.actionId === 'dispatch_offline_proxy' && <Rocket className="h-4 w-4" />}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-11">
            <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
            <span>AI Concierge is parsing market constraints &amp; checking price guard...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Unorganized Offline Market Presets (Quick-Tap Chips) */}
      <div className="border-t border-slate-100 bg-white px-4 py-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-500" /> Unorganized Offline Market Test Presets:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {UNORGANIZED_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(preset.prompt)}
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 p-2 text-left transition-all text-xs text-slate-700 active:scale-95 group"
            >
              <span className="text-base shrink-0">{preset.icon}</span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 group-hover:text-emerald-800 text-[11px] truncate">
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{preset.prompt}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chat Input Box */}
      <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="offline-chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g., Go to Nakkalagutta electronics lane, find Arduino Uno under ₹450..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-40 shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
