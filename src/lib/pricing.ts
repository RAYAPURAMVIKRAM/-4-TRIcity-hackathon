import { 
  UpfrontBookingPricing, 
  EchoConfirmationData, 
  UnorganizedCategory, 
  PriceGuardCondition,
  LiveStallInspection,
  TaskCategory,
  SmartBudget,
  FulfillmentMode
} from '../types/task';

// Zero-advance upfront booking fee formula
export function getUpfrontBookingPricing(): UpfrontBookingPricing {
  return {
    bookingFee: 20,           // Flat ₹20 partner booking / dispatch fee
    deliveryFee: 15,          // Flat ₹15 local distance delivery fee
    productAdvance: 0,        // STRICTLY ₹0 upfront! Street vendor bills are settled directly.
    waitingCharge: 0,         // STRICTLY ₹0 waiting fees
    platformFee: 5,           // Flat ₹5 platform fee
    totalAdvanceToDispatch: 40, // Total ₹40 advance commitment
    guaranteeBadge: '🛡️ Smart Price Guard: We will NOT buy the item if price exceeds your specified limit.',
  };
}

// Intent and Price Guard constraint parser
export function parseOfflineErrandIntent(prompt: string): EchoConfirmationData {
  const lower = prompt.toLowerCase();

  // Preset 1: Electronics Corridor (Nakkalagutta)
  if (lower.includes('electronics') || lower.includes('arduino') || lower.includes('esp32') || lower.includes('nakkalagutta')) {
    const priceCap = 450;
    return {
      category: 'electronics_corridor',
      categoryLabel: 'Electronics Corridor & Spare Parts',
      itemOrTask: 'Arduino Uno / ESP32 Microcontroller Board',
      task: 'Arduino Uno / ESP32 Microcontroller Board',
      location: 'Electronics Spare Parts Lane, Nakkalagutta',
      priceGuard: {
        hasPriceCap: true,
        priceCapAmount: priceCap,
        unit: 'per piece',
        conditionText: `Buy ONLY if quoted price is ≤ ₹${priceCap}. Verify board pins & sealed pack.`,
      },
      estimatedMinutes: 20,
      fulfillmentMode: 'physical_proxy',
    };
  }

  // Preset 2: Street Apparel / Bargain (Old Bus Stand)
  if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('apparel') || lower.includes('bus stand') || lower.includes('cotton')) {
    const priceCap = 250;
    return {
      category: 'street_apparel',
      categoryLabel: 'Street Apparel & Clothing Stalls',
      itemOrTask: 'Oversized Black Cotton T-Shirt (Size L)',
      task: 'Oversized Black Cotton T-Shirt (Size L)',
      location: 'Clothing Street Stalls, Opposite Old Bus Stand',
      priceGuard: {
        hasPriceCap: true,
        priceCapAmount: priceCap,
        unit: 'per piece',
        conditionText: `Buy ONLY if offered at or under ₹${priceCap}. Check fabric & stitching quality.`,
      },
      estimatedMinutes: 25,
      fulfillmentMode: 'physical_proxy',
    };
  }

  // Preset 3: Weekly Mandi Produce
  if (lower.includes('mandi') || lower.includes('tomato') || lower.includes('vegetable') || lower.includes('market') || lower.includes('kg')) {
    const priceCap = 30;
    return {
      category: 'mandi_produce',
      categoryLabel: 'Weekly Mandi & Local Wholesale Produce',
      itemOrTask: 'Fresh Country Tomatoes (2 kg)',
      task: 'Fresh Country Tomatoes (2 kg)',
      location: 'Warangal Wholesale Vegetable Mandi',
      priceGuard: {
        hasPriceCap: true,
        priceCapAmount: priceCap,
        unit: 'per kg (Total cap: ₹60 for 2kg)',
        conditionText: `Buy 2 kg only if ≤ ₹${priceCap}/kg. If higher, send WhatsApp photo/price quotation.`,
      },
      estimatedMinutes: 18,
      fulfillmentMode: 'physical_proxy',
    };
  }

  // Preset 4: Pure Ground Info / Municipal
  if (lower.includes('municipal') || lower.includes('property tax') || lower.includes('counter 2') || lower.includes('office') || lower.includes('receipt')) {
    return {
      category: 'ground_info',
      categoryLabel: 'Ground Office Verification & Desk Enquiry',
      itemOrTask: 'Property Tax Offline Receipt Issuance Verification',
      task: 'Property Tax Offline Receipt Issuance Verification',
      location: 'Greater Warangal Municipal Corporation (GWMC), Counter 2',
      priceGuard: {
        hasPriceCap: false,
        conditionText: 'Verify clerk operating hours & offline counter collection status. No purchases required.',
      },
      estimatedMinutes: 15,
      fulfillmentMode: 'ground_report',
    };
  }

  // General Unorganized Hardware / Spare Parts / Street Request
  const priceCapMatch = prompt.match(/(?:under|below|max|cap|within|less than|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                        prompt.match(/(?:rs\.?|inr|₹)\s*(\d+)/i);
  const detectedCap = priceCapMatch ? parseInt(priceCapMatch[1], 10) : undefined;

  return {
    category: 'hardware_parts',
    categoryLabel: 'Unorganized Offline Retail & Street Stalls',
    itemOrTask: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
    task: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
    location: 'Warangal Local Market & Commercial Stalls',
    priceGuard: {
      hasPriceCap: !!detectedCap,
      priceCapAmount: detectedCap,
      conditionText: detectedCap 
        ? `Strict Price Guard: Buy ONLY if quoted price is ≤ ₹${detectedCap}.`
        : 'Consult customer via live photo before any financial purchase.',
    },
    estimatedMinutes: 20,
    fulfillmentMode: 'physical_proxy',
  };
}

// Generate simulated stall inspection for Scenario A vs Scenario B
export function createStallInspection(
  echoData: EchoConfirmationData,
  scenario: 'price_match' | 'price_exceeded'
): LiveStallInspection {
  const cap = echoData.priceGuard?.priceCapAmount || 450;

  if (echoData.category === 'electronics_corridor') {
    return {
      vendorName: 'Sri Balaji Electronics & Spares (Stall #14)',
      stallLocation: 'Nakkalagutta Electronics Lane, Hanamkonda',
      itemName: 'Arduino Uno R3 Compatible Board (Atmega328P with Cable)',
      photoProofUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=700&q=80',
      vendorQuotedPrice: scenario === 'price_match' ? 380 : 520,
      customerPriceCap: cap,
      scenario,
      status: 'awaiting_customer_approval',
      timestamp: 'Just now',
    };
  }

  if (echoData.category === 'street_apparel') {
    return {
      vendorName: 'Star Fashion Street Stall',
      stallLocation: 'Opposite Old Bus Stand Complex, Warangal',
      itemName: 'Oversized Black Cotton T-Shirt (220 GSM, Size L)',
      photoProofUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      vendorQuotedPrice: scenario === 'price_match' ? 220 : 320,
      customerPriceCap: echoData.priceGuard?.priceCapAmount || 250,
      scenario,
      status: 'awaiting_customer_approval',
      timestamp: 'Just now',
    };
  }

  if (echoData.category === 'mandi_produce') {
    return {
      vendorName: 'Mandi Stall #42 (Laxman Vegetables)',
      stallLocation: 'Warangal Wholesale Mandi, Shed B',
      itemName: 'Fresh Country Red Tomatoes (2 kg crate weigh-in)',
      photoProofUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80',
      vendorQuotedPrice: scenario === 'price_match' ? 28 : 38,
      customerPriceCap: echoData.priceGuard?.priceCapAmount || 30,
      scenario,
      status: 'awaiting_customer_approval',
      timestamp: 'Just now',
    };
  }

  // Default
  return {
    vendorName: 'Local Market Counter',
    stallLocation: echoData.location,
    itemName: echoData.itemOrTask || echoData.task || 'Market Item',
    photoProofUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=700&q=80',
    vendorQuotedPrice: scenario === 'price_match' ? cap - 50 : cap + 80,
    customerPriceCap: cap,
    scenario,
    status: 'awaiting_customer_approval',
    timestamp: 'Just now',
  };
}

// Backwards-compatible Pricing Helpers
export function calculateSmartBudget(
  category: TaskCategory,
  options: {
    productCost?: number;
    estimatedMinutes?: number;
    queueWaitMinutes?: number;
    ticketCost?: number;
  } = {}
): SmartBudget {
  const estimatedMinutes = options.estimatedMinutes || 25;
  const itemCost = Math.max(0, options.productCost || 0);

  if (category === 'food_shopping' || category === 'food_stall' || category === 'express_courier') {
    const isDeliveryWaived = itemCost >= 299;
    const baseDeliveryOrPartnerFee = isDeliveryWaived ? 0 : 25;
    const platformFee = 5;
    const serviceSubtotal = baseDeliveryOrPartnerFee + platformFee;
    const totalBudget = itemCost + serviceSubtotal;

    return {
      category: 'food_shopping',
      ruleCode: 'RULE A',
      ruleDescription: 'Standard Shopping & Food Errand',
      itemCost,
      baseDeliveryOrPartnerFee,
      isDeliveryWaived,
      deliverySavingsText: isDeliveryWaived ? 'FREE DELIVERY APPLIED 🎉 (Order >= ₹299)' : undefined,
      waitingCharges: 0,
      estimatedMinutes,
      timeRatePerMin: 0,
      timeCharges: 0,
      serviceFee: 0,
      platformFee,
      totalBudget,
      serviceSubtotal,
      savingsHighlight: isDeliveryWaived 
        ? 'You saved ₹25 delivery fee! • Zero Waiting Charges' 
        : 'Zero Waiting Fee Guaranteed • Pay ₹30 Delivery & Platform',
      paymentNote: `Pay service fee now (₹${serviceSubtotal}). Item cost (₹${itemCost}) paid directly to vendor via UPI when partner reaches or on handoff.`,
    };
  }

  if (category === 'info_verification' || category === 'ground_intel') {
    return {
      category: 'info_verification',
      ruleCode: 'RULE B',
      ruleDescription: 'Flat Rate Ground Intelligence & Desk Verification',
      itemCost: 0,
      baseDeliveryOrPartnerFee: 20,
      isDeliveryWaived: false,
      waitingCharges: 0,
      estimatedMinutes: Math.min(25, estimatedMinutes),
      timeRatePerMin: 0,
      timeCharges: 0,
      serviceFee: 0,
      platformFee: 5,
      totalBudget: 25,
      serviceSubtotal: 25,
      savingsHighlight: 'Flat ₹25 City Special • Zero Distance or Time Markup',
      paymentNote: 'Pay flat ₹25 now. Includes signed GPS Field Report Card and verified photo inspection.',
    };
  }

  if (category === 'queue_standin') {
    const waitMins = options.queueWaitMinutes || estimatedMinutes || 30;
    const basePartnerFee = 15;
    const timeRatePerMin = 2;
    const timeCharges = waitMins * timeRatePerMin;
    const platformFee = 5;
    const totalBudget = basePartnerFee + timeCharges + platformFee;

    return {
      category: 'queue_standin',
      ruleCode: 'RULE C',
      ruleDescription: 'Queue Stand-In & Spot Preservation',
      itemCost: 0,
      baseDeliveryOrPartnerFee: basePartnerFee,
      isDeliveryWaived: false,
      waitingCharges: timeCharges,
      estimatedMinutes: waitMins,
      timeRatePerMin,
      timeCharges,
      serviceFee: 0,
      platformFee,
      totalBudget,
      serviceSubtotal: totalBudget,
      savingsHighlight: `Transparent ₹2/min Queue Rate • ₹${timeCharges} for ${waitMins} mins`,
      paymentNote: `Fixed at ₹${totalBudget} for ${waitMins} mins line hold. Handover completed when you arrive.`,
    };
  }

  const ticketCost = Math.max(0, options.ticketCost ?? 100);
  const queueWait = options.queueWaitMinutes || 15;
  const serviceFee = 15;
  const platformFee = 5;
  const extraWaitMins = Math.max(0, queueWait - 10);
  const timeCharges = extraWaitMins * 2;
  const serviceSubtotal = serviceFee + timeCharges + platformFee;
  const totalBudget = ticketCost + serviceSubtotal;

  return {
    category: 'ticket_purchase',
    ruleCode: 'RULE D',
    ruleDescription: 'Physical Ticket Booking & Queue Run',
    itemCost: ticketCost,
    baseDeliveryOrPartnerFee: serviceFee,
    isDeliveryWaived: false,
    waitingCharges: timeCharges,
    estimatedMinutes: queueWait,
    timeRatePerMin: 2,
    timeCharges,
    serviceFee,
    platformFee,
    totalBudget,
    serviceSubtotal,
    savingsHighlight: 'First 10 mins waiting FREE • Nominal ₹15 Service Fee',
    paymentNote: `Pay service & platform fee now (₹${serviceSubtotal}). Ticket cost (₹${ticketCost}) reimbursed on handover or paid to counter.`,
  };
}

export function parseErrandIntent(prompt: string): {
  category: TaskCategory;
  location: string;
  taskSummary: string;
  estimatedMinutes: number;
  productCost?: number;
  waitingMinutes?: number;
  fulfillmentMode: FulfillmentMode;
  needsClarification: boolean;
  clarificationQuestion?: string;
} {
  const lower = prompt.toLowerCase();

  if (lower.includes('dosa') || lower.includes('food') || (lower.includes('buy') && (lower.includes('stall') || lower.includes('eat')))) {
    let location = 'Famous Dosa Stall, Hanamkonda Chowrasta';
    if (lower.includes('subedari')) location = 'Subedari Street Food Lane';
    if (lower.includes('kazipet')) location = 'Kazipet Station Food Circle';
    if (lower.includes('nakkalagutta')) location = 'Nakkalagutta Food Hub';

    const costMatch = prompt.match(/(?:rs\.?|inr|₹|worth|cost|for)\s*(\d+)/i) || prompt.match(/(\d{3,4})\s*(?:rs|rupees|\/-)?/i);
    let productCost = costMatch ? parseInt(costMatch[1], 10) : 150;

    return {
      category: 'food_shopping',
      location,
      taskSummary: 'Purchase fresh street food and deliver to customer destination.',
      estimatedMinutes: 25,
      productCost,
      fulfillmentMode: 'live_tracking',
      needsClarification: false,
    };
  }

  if (lower.includes('municipal') || lower.includes('office') || lower.includes('window') || lower.includes('receipt') || lower.includes('tax')) {
    return {
      category: 'info_verification',
      location: 'Greater Warangal Municipal Corporation (GWMC), Counter 2',
      taskSummary: 'Physically inspect designated desk/counter and submit photographic field report.',
      estimatedMinutes: 20,
      fulfillmentMode: 'field_report',
      needsClarification: false,
    };
  }

  return {
    category: 'food_shopping',
    location: 'Warangal Central Market',
    taskSummary: prompt,
    estimatedMinutes: 20,
    fulfillmentMode: 'live_tracking',
    needsClarification: false,
  };
}
