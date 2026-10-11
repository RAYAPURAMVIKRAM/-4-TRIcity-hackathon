import { ErrandOrder, WorkerProfile, CategoryInfo } from '@/types/task';

export const POPULAR_CATEGORIES: CategoryInfo[] = [
  {
    id: 'food_stall',
    name: 'Local Stall Food / Street Vendor',
    tagline: 'Specific street food & stalls not available on Swiggy',
    iconName: 'Utensils',
    badge: 'Popular • High Demand',
    popularLocations: ['Hanamkonda Chowrasta', 'Subedari Dosa Line', 'MGM Junction'],
  },
  {
    id: 'ground_intel',
    name: 'Ground Intel & Office Enquiry',
    tagline: 'Physical verification, office counter queries & spot reports',
    iconName: 'FileSearch',
    badge: 'Official / Verification',
    popularLocations: ['Warangal Municipal GWMC', 'Subedari RTO', 'Collectorate Office'],
  },
  {
    id: 'queue_standin',
    name: 'Queue Stand-in & Physical Tokens',
    tagline: 'Save hours by having our partner hold your spot in lines',
    iconName: 'Users',
    badge: 'Time Saver',
    popularLocations: ['MGM OPD Block', 'RTC Bus Reservation', 'Cinema Ticket Counters'],
  },
  {
    id: 'express_courier',
    name: 'Express Delivery & Bike Courier',
    tagline: 'Urgent document, forgotten key, medicine or parcel courier',
    iconName: 'Bike',
    badge: 'Instant 15-Min Pickup',
    popularLocations: ['Kakatiya University', 'Kazipet Station', 'Nakkalagutta Market'],
  },
];

export const PRIMARY_WORKER: WorkerProfile = {
  id: 'PRX-042',
  name: 'Ramesh K.',
  vehicle: 'Hero Splendor (TS 03 AB 4421)',
  rating: 4.9,
  completedTasks: 328,
  phone: '+91 98480 22341',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  currentLat: 17.9942,
  currentLng: 79.5638,
};

export const INITIAL_ORDERS: ErrandOrder[] = [
  {
    id: 'ORD-8941',
    prompt: 'Go to the famous dosa stall near Hanamkonda chowrasta, buy 2 special ghee dosas, call me for payment at the stall, and deliver to my hostel.',
    status: 'arrived',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    assignedWorker: PRIMARY_WORKER,
    destinationCoordinates: { lat: 18.0012, lng: 79.5694 },
    analysis: {
      isSafe: true,
      safetyBadge: 'Verified Safe & Legal Errand',
      category: 'food_stall',
      categoryName: 'Local Stall Food / Street Vendor',
      taskTitle: 'Fresh Ghee Dosa Pick-up & Delivery',
      targetLocation: 'Famous Dosa Stall, Hanamkonda Chowrasta',
      deliveryLocation: 'Hostel Block 3, Kakatiya University Road',
      estimatedMinutes: 25,
      distanceKm: 3.4,
      itemsToBuy: ['2x Special Ghee Dosa (Est. ₹60 each)'],
      clarificationPlan: [
        '1. Partner rides to the famous dosa stall at Hanamkonda Chowrasta via Hero Splendor bike.',
        '2. Places order for 2 Special Ghee Dosas with stall master.',
        '3. Video/Voice calls customer for direct QR/UPI payment to stallkeeper.',
        '4. Packages food in thermal insulated carrier and delivers straight to hostel gate.',
      ],
      pricing: {
        basePartnerFee: 40,
        distanceFee: 35,
        timeFee: 25,
        itemCost: 120,
        platformFee: 10,
        serviceSubtotal: 110,
        totalBudget: 230,
      },
      paymentModeNote: 'Pay Service & Platform fee now (₹110). Dosa cost (₹120) paid via UPI to stall master or settled on delivery.',
    },
    liveLogs: [
      { id: 'log-1', timestamp: '12 mins ago', message: 'Errand confirmed & partner Ramesh K. dispatched on Hero Splendor.', type: 'info' },
      { id: 'log-2', timestamp: '7 mins ago', message: 'Ramesh is en route towards Hanamkonda Chowrasta (Speed: 34 km/h).', type: 'action' },
      { id: 'log-3', timestamp: 'Just now', message: 'Ramesh has arrived at Hanamkonda Chowrasta stall. Standing by counter.', type: 'action' },
    ],
  },
];
