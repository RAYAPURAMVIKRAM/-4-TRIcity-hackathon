// Unorganized Offline Market Core Types
export type UnorganizedCategory = 
  | 'electronics_corridor' 
  | 'street_apparel' 
  | 'mandi_produce' 
  | 'hardware_parts' 
  | 'ground_info';

export type FulfillmentMode = 
  | 'physical_proxy' 
  | 'ground_report' 
  | 'live_tracking' 
  | 'field_report';

export interface PriceGuardCondition {
  hasPriceCap: boolean;
  priceCapAmount?: number;      // e.g. 450, 250, 30
  unit?: string;                // e.g. "per piece", "per kg"
  conditionText: string;        // e.g. "Buy ONLY if ≤ ₹450"
}

export interface UpfrontBookingPricing {
  bookingFee: number;           // Flat ₹20 (nominal partner commitment fee)
  deliveryFee: number;          // Flat ₹15 (local budget distance rate)
  productAdvance: number;       // STRICTLY ₹0 ("Pay actual bill directly when partner reaches the shop!")
  waitingCharge: number;        // STRICTLY ₹0 (FREE - zero waiting penalty policy)
  platformFee: number;          // ₹5
  totalAdvanceToDispatch: number; // Flat ₹40
  guaranteeBadge: string;       // "🛡️ Smart Price Guard: We will NOT buy the item if price exceeds your specified limit."
}

export interface EchoConfirmationData {
  category: UnorganizedCategory | TaskCategory;
  categoryLabel?: string;
  itemOrTask?: string;
  task?: string;
  location: string;
  priceGuard?: PriceGuardCondition;
  estimatedMinutes: number;
  productCost?: number;
  waitingMinutes?: number;
  fulfillmentMode: FulfillmentMode;
}

export type StallEncounterScenario = 'price_match' | 'price_exceeded';

export interface LiveStallInspection {
  vendorName: string;
  stallLocation: string;
  itemName: string;
  photoProofUrl: string;
  vendorQuotedPrice: number;
  customerPriceCap: number;
  scenario: StallEncounterScenario;
  status: 'inspecting' | 'awaiting_customer_approval' | 'approved_and_paid' | 'bargained' | 'cancelled';
  bargainedPrice?: number;
  paymentMethod?: 'vendor_qr' | 'worker_upi';
  timestamp: string;
}export type TrackType = 'info' | 'buy' | 'worker' | 'ride';

export interface SmartContractPriceCard {
  isSafe: boolean;
  unsafeMessage?: string;
  trackId: TrackType;
  categoryTitle: string;
  taskTitle: string;
  objective: string;
  location: string;
  securityCheck: string;
  priceBreakdown: {
    baseFee: number;
    distanceOrServiceFee: number;
    platformFee: number;
    totalAdvance: number;
    note: string;
  };
  priceGuardText?: string;
  estimatedMinutes: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  completedTasks: number;
  phone: string;
  avatarUrl: string;
  currentLat: number;
  currentLng: number;
}

export interface LiveActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'action' | 'payment' | 'completed' | 'alert';
}

export interface ActiveOfflineSession {
  id: string;
  rawPrompt: string;
  echoData: EchoConfirmationData;
  pricing: UpfrontBookingPricing;
  status: 'assigned' | 'traveling' | 'at_stall' | 'delivering' | 'completed';
  worker: WorkerProfile;
  inspection: LiveStallInspection;
  liveLogs: LiveActivityLog[];
  createdAt: string;
}

// Backwards-Compatible Types for Existing Components
export type TaskCategory = 
  | 'food_shopping' 
  | 'food_stall' 
  | 'info_verification' 
  | 'ground_intel' 
  | 'queue_standin' 
  | 'ticket_purchase'
  | 'express_courier';

export interface CategoryInfo {
  id: TaskCategory;
  name: string;
  tagline: string;
  iconName: string;
  badge: string;
  popularLocations: string[];
}

export interface PricingBreakdown {
  basePartnerFee: number;
  distanceFee: number;
  timeFee: number;
  itemCost: number;
  platformFee: number;
  serviceSubtotal: number;
  totalBudget: number;
}

export interface SmartBudget {
  category: TaskCategory;
  ruleCode: 'RULE A' | 'RULE B' | 'RULE C' | 'RULE D';
  ruleDescription: string;
  itemCost: number;
  baseDeliveryOrPartnerFee: number;
  isDeliveryWaived: boolean;
  deliverySavingsText?: string;
  waitingCharges: number;
  estimatedMinutes: number;
  timeRatePerMin: number;
  timeCharges: number;
  serviceFee: number;
  platformFee: number;
  totalBudget: number;
  serviceSubtotal: number;
  savingsHighlight?: string;
  paymentNote: string;
}

export interface ErrandAnalysis {
  isSafe: boolean;
  safetyBadge: string;
  category: TaskCategory;
  categoryName: string;
  taskTitle: string;
  targetLocation: string;
  deliveryLocation?: string;
  estimatedMinutes: number;
  distanceKm: number;
  clarificationPlan: string[];
  pricing: PricingBreakdown;
  paymentModeNote: string;
  itemsToBuy?: string[];
}

export type OrderStatus = 'placed' | 'assigned' | 'arrived' | 'in_progress' | 'completed';

export interface ErrandOrder {
  id: string;
  prompt: string;
  analysis: ErrandAnalysis;
  status: OrderStatus;
  createdAt: string;
  assignedWorker: WorkerProfile;
  liveLogs: LiveActivityLog[];
  customerPhone?: string;
  destinationCoordinates: {
    lat: number;
    lng: number;
  };
}

export type TaskStatus = 'Open' | 'Assigned' | 'In Progress' | 'Verification' | 'Completed';

export interface Deliverable {
  id: string;
  type: 'photo' | 'note' | 'token_check' | 'video';
  label: string;
  required: boolean;
  completed?: boolean;
}

export interface TaskContract {
  id: string;
  title: string;
  rawPrompt: string;
  objective: string;
  targetLocation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geofenceRadiusMeters: number;
  estimatedDurationMins: number;
  deliverables: Deliverable[];
  bounty: {
    baseFare: number;
    waitCompensation: number;
    prioritySurge: number;
    totalBounty: number;
  };
  status: TaskStatus;
  createdAt: string;
  assignedProxy?: {
    id: string;
    name: string;
    reputation: number;
    proximityMeters: number;
  };
  auditEvidence?: {
    photoUrl?: string;
    fieldNote?: string;
    gpsVerified?: boolean;
    geminiAuditConfidence?: number;
    geminiAuditSummary?: string;
    verifiedAt?: string;
  };
  riskRating: 'Low' | 'Medium' | 'High';
  securityProtocol: string;
}

export interface FieldReportData {
  id: string;
  taskTitle: string;
  location: string;
  gpsCoordinates: { lat: number; lng: number };
  verifiedAt: string;
  counterOrOfficer: string;
  writtenSummary: string;
  bulletFindings: string[];
  photoProofUrl: string;
  photoCaption: string;
  tokenNumberOCR?: string;
  verifiedByPartner: WorkerProfile;
  customerFeedbackScore: number;
}

export interface ActiveErrandSession {
  id: string;
  rawPrompt: string;
  fulfillmentMode: FulfillmentMode;
  echoData: EchoConfirmationData;
  budget: SmartBudget;
  status: 'assigned' | 'at_location' | 'executing' | 'completed';
  worker: WorkerProfile;
  liveLogs: LiveActivityLog[];
  fieldReport?: FieldReportData;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  stage?: 'ingestion' | 'clarification' | 'echo_confirm' | 'booking_card' | 'budget_ready' | 'dispatched';
  echoData?: EchoConfirmationData;
  pricingData?: UpfrontBookingPricing;
  budgetData?: SmartBudget;
  quickActions?: {
    label: string;
    actionId: string;
    variant?: 'primary' | 'secondary' | 'emerald';
  }[];
}
