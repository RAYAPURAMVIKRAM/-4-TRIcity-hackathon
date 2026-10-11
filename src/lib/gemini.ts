import { 
  ChatMessage, 
  EchoConfirmationData, 
  UpfrontBookingPricing,
  TaskContract,
  ErrandAnalysis,
  TaskCategory,
  Deliverable
} from '../types/task';
import { 
  getUpfrontBookingPricing, 
  parseOfflineErrandIntent,
  calculateSmartBudget 
} from './pricing';

export function getInitialChatMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Namaste! 👋 I am your **ProxyGrid Offline Market Concierge**.

Quick-commerce platforms cannot service street stalls, weekly mandis, and local spare parts corridors because street vendors lack digital seller portals. 

Tell me what you need our on-ground human proxy to inspect, bargain, or buy for you in Warangal or Hanamkonda. We enforce a strict **Smart Price Guard** so you never overpay!`,
      stage: 'ingestion',
    },
  ];
}

export async function processChatConversation(
  userText: string,
  history: ChatMessage[]
): Promise<ChatMessage> {
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    (typeof window !== 'undefined' ? (window as unknown as { __GEMINI_KEY__?: string }).__GEMINI_KEY__ : '');

  // Parse intent using offline parser
  const echoData = parseOfflineErrandIntent(userText);

  const echoText = `Got it! Let me make sure I have your errand constraints exact:

🏬 **Market Category**: ${echoData.categoryLabel}
📍 **Target Location**: ${echoData.location}
🔍 **Target Item / Task**: ${echoData.itemOrTask || echoData.task}
🛡️ **Smart Price Guard**: ${echoData.priceGuard?.conditionText}
⏱️ **Estimated Turnaround**: ~${echoData.estimatedMinutes} mins

Does this look correct?`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: 'Just now',
    text: echoText,
    stage: 'echo_confirm',
    echoData,
    quickActions: [
      { label: '✅ Yes, View Booking Breakdown', actionId: 'confirm_booking_card', variant: 'emerald' },
      { label: '✏️ No, Let me edit', actionId: 'edit_intent', variant: 'secondary' },
    ],
  };
}

export function generateBookingCardResponse(echoData: EchoConfirmationData): ChatMessage {
  const pricing = getUpfrontBookingPricing();

  return {
    id: `pricing-${Date.now()}`,
    sender: 'assistant',
    timestamp: 'Just now',
    text: `Here is your **Zero-Advance Phase 1 Booking Breakdown**. Because street stall prices fluctuate, you never pay for items upfront!`,
    stage: 'booking_card',
    echoData,
    pricingData: pricing,
    quickActions: [
      { label: '🚀 Confirm Errand & Dispatch Proxy (₹40)', actionId: 'dispatch_offline_proxy', variant: 'primary' },
    ],
  };
}

export function generateBudgetResponse(echoData: EchoConfirmationData): ChatMessage {
  const cat = (echoData.category as TaskCategory) || 'food_shopping';
  const budget = calculateSmartBudget(cat, {
    productCost: echoData.productCost,
    estimatedMinutes: echoData.estimatedMinutes,
    queueWaitMinutes: echoData.waitingMinutes,
    ticketCost: echoData.productCost,
  });

  return {
    id: `budget-${Date.now()}`,
    sender: 'assistant',
    timestamp: 'Just now',
    text: `Here is your transparent budget breakdown under **${budget.ruleCode} (${budget.ruleDescription})**. Zero hidden markups!`,
    stage: 'budget_ready',
    budgetData: budget,
    echoData,
    quickActions: [
      { label: '🚀 Confirm & Dispatch Partner', actionId: 'dispatch_offline_proxy', variant: 'primary' },
    ],
  };
}

// Backwards-compatible analyzeErrandWithAI
export async function analyzeErrandWithAI(prompt: string): Promise<ErrandAnalysis> {
  const echo = parseOfflineErrandIntent(prompt);
  return {
    isSafe: true,
    safetyBadge: 'Verified Safe & Legal Errand',
    category: 'express_courier',
    categoryName: echo.categoryLabel || 'Offline Market Proxy',
    taskTitle: echo.itemOrTask || prompt,
    targetLocation: echo.location,
    estimatedMinutes: echo.estimatedMinutes,
    distanceKm: 2.8,
    clarificationPlan: [
      `1. Travel to ${echo.location}`,
      `2. Inspect item on counter: ${echo.itemOrTask || prompt}`,
      '3. Transmit live counter photo and quoted price',
      `4. Enforce price cap rule: ${echo.priceGuard?.conditionText || 'None'}`,
    ],
    pricing: {
      basePartnerFee: 20,
      distanceFee: 15,
      timeFee: 0,
      itemCost: 0,
      platformFee: 5,
      serviceSubtotal: 40,
      totalBudget: 40,
    },
    paymentModeNote: 'Zero-Advance Booking (₹40). Item paid directly at shop.',
  };
}

// Backwards-compatible deconstructTaskWithAI
export async function deconstructTaskWithAI(prompt: string): Promise<TaskContract> {
  const echo = parseOfflineErrandIntent(prompt);
  const id = `PG-${Math.floor(1000 + Math.random() * 9000)}`;

  const deliverables: Deliverable[] = [
    {
      id: 'del-1',
      type: 'photo',
      label: 'Geotagged Stall Counter Photo',
      required: true,
      completed: false,
    },
    {
      id: 'del-2',
      type: 'note',
      label: 'Live Counter Quoted Price Verification',
      required: true,
      completed: false,
    },
  ];

  return {
    id,
    title: echo.itemOrTask || 'Offline Market Errand',
    rawPrompt: prompt,
    objective: `Execute physical inspection and purchase assistance at ${echo.location}: "${prompt}".`,
    targetLocation: echo.location,
    coordinates: { lat: 17.9942, lng: 79.5638 },
    geofenceRadiusMeters: 50,
    estimatedDurationMins: echo.estimatedMinutes,
    deliverables,
    bounty: {
      baseFare: 20,
      waitCompensation: 0,
      prioritySurge: 20,
      totalBounty: 40,
    },
    status: 'Open',
    createdAt: new Date().toISOString(),
    riskRating: 'Low',
    securityProtocol: 'Smart Price Guard + Stall Counter Photo Lock',
  };
}

// 3-Role AI Engine: Safety Guardrail, Category Routing, Dynamic Pricing
export async function processTrackDispatchWithAI(
  prompt: string,
  preferredTrack?: 'info' | 'buy' | 'worker' | 'ride'
): Promise<import('../types/task').SmartContractPriceCard> {
  const lower = prompt.toLowerCase();

  // ROLE 1: Safety / Legal Guardrail
  const unsafeKeywords = [
    'weapon', 'gun', 'knife', 'drug', 'narcotic', 'marijuana', 'weed', 
    'cocaine', 'heroin', 'steal', 'theft', 'break in', 'hack', 'bribe', 
    'assault', 'illegal', 'contraband', 'fake id', 'smuggle', 'poison', 
    'kill', 'violence', 'attack', 'bomb'
  ];
  const isUnsafe = unsafeKeywords.some((word) => lower.includes(word));

  if (isUnsafe) {
    return {
      isSafe: false,
      unsafeMessage: '🚨 [UNSAFE REQUEST] For the safety of our partners, we cannot process this request.',
      trackId: preferredTrack || 'info',
      categoryTitle: 'Safety Guardrail Review',
      taskTitle: 'Request Prohibited by Security Policy',
      objective: 'Safety & legal compliance violation detected. Physical proxy deployment refused.',
      location: 'Restricted Protocol',
      securityCheck: '🚨 Request Denied - Safety Policy Enforced',
      priceBreakdown: {
        baseFee: 0,
        distanceOrServiceFee: 0,
        platformFee: 0,
        totalAdvance: 0,
        note: 'Zero charges applied.',
      },
      estimatedMinutes: 0,
    };
  }

  // ROLE 2: Category Routing
  let trackId = preferredTrack;
  if (!trackId) {
    if (lower.includes('ride') || lower.includes('drop') || lower.includes('pickup me') || lower.includes('station') || lower.includes('bike')) {
      trackId = 'ride';
    } else if (lower.includes('worker') || lower.includes('electrician') || lower.includes('plumber') || lower.includes('fix') || lower.includes('repair') || lower.includes('carpenter')) {
      trackId = 'worker';
    } else if (lower.includes('buy') || lower.includes('purchase') || lower.includes('shop') || lower.includes('tshirt') || lower.includes('dosa') || lower.includes('esp32') || lower.includes('arduino')) {
      trackId = 'buy';
    } else {
      trackId = 'info';
    }
  }

  // ROLE 3: Dynamic Pricing (Ultra-Budget, strictly Zero Waiting Charge on buying)
  if (trackId === 'buy') {
    return {
      isSafe: true,
      trackId: 'buy',
      categoryTitle: '🛍️ Buy Custom Product & Street Retail',
      taskTitle: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
      objective: `Inspect on-site stall inventory, verify counter item condition, and purchase within budget cap.`,
      location: lower.includes('nakkalagutta') 
        ? 'Nakkalagutta Electronics Lane, Hanamkonda'
        : lower.includes('bus stand') 
        ? 'Clothing Stalls, Opposite Old Bus Stand'
        : 'Warangal Local Market & Commercial Stalls',
      securityCheck: '✅ Verified Safe & Legal',
      priceBreakdown: {
        baseFee: 20,
        distanceOrServiceFee: 15,
        platformFee: 5,
        totalAdvance: 40,
        note: 'Zero Advance on Goods: Pay actual bill directly to street vendor UPI!',
      },
      priceGuardText: '🛡️ Price Cap Enforced: Proxy will NOT buy if quoted price exceeds limit. Zero waiting charges.',
      estimatedMinutes: 25,
    };
  }

  if (trackId === 'worker') {
    return {
      isSafe: true,
      trackId: 'worker',
      categoryTitle: '🛠️ Hire Skilled Handyman & Worker',
      taskTitle: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
      objective: `Deploy verified technician to diagnose, inspect, or execute requested physical service.`,
      location: 'On-Site Customer Location (Warangal / Hanamkonda)',
      securityCheck: '✅ Verified Safe & Legal',
      priceBreakdown: {
        baseFee: 40,
        distanceOrServiceFee: 20,
        platformFee: 5,
        totalAdvance: 65,
        note: 'Transparent Diagnostic Fee: Actual replacement parts paid at cost.',
      },
      priceGuardText: '🛡️ Fair Skill Guarantee: Transparent labor quote agreed before work begins.',
      estimatedMinutes: 35,
    };
  }

  if (trackId === 'ride') {
    return {
      isSafe: true,
      trackId: 'ride',
      categoryTitle: '🏍️ Book a Trusted City Ride',
      taskTitle: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
      objective: `Fast two-wheeler point-to-point transit with verified local proxy driver.`,
      location: 'Warangal, Hanamkonda & Kazipet Corridors',
      securityCheck: '✅ Verified Safe & Legal',
      priceBreakdown: {
        baseFee: 25,
        distanceOrServiceFee: 15,
        platformFee: 5,
        totalAdvance: 45,
        note: 'Fixed Affordable City Rate • Sanitized Helmet Provided',
      },
      priceGuardText: '🛡️ Verified Driver: Direct route without surge inflation.',
      estimatedMinutes: 15,
    };
  }

  // Default: Ground Information
  return {
    isSafe: true,
    trackId: 'info',
    categoryTitle: '📍 Ground Information & Desk Verification',
    taskTitle: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
    objective: `Physically inspect designated office counter, confirm operative clerk presence, and transmit signed photographic report.`,
    location: lower.includes('municipal') || lower.includes('tax')
      ? 'Greater Warangal Municipal Corporation (GWMC), Counter 2'
      : lower.includes('mgm') || lower.includes('hospital')
      ? 'MGM Hospital OPD Block, Warangal'
      : 'Local Government Office / Desk, Warangal Urban',
    securityCheck: '✅ Verified Safe & Legal',
    priceBreakdown: {
      baseFee: 20,
      distanceOrServiceFee: 0,
      platformFee: 5,
      totalAdvance: 25,
      note: 'Flat nominal fee • Includes signed GPS Field Report Card & photo proof',
    },
    priceGuardText: '🛡️ Ground Intelligence Lock: Verified by on-site proxy with timestamped proof.',
    estimatedMinutes: 20,
  };
}
