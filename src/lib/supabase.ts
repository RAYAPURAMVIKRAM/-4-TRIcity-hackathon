/**
 * src/lib/supabase.ts
 * Master Supabase Client & Zero-Crash Demo Fallback for ProxyGrid
 * Team VQ - TriCity AI Hackathon (Room B-4-216)
 * Target: https://rhomwvtmmkwepclzaiuu.supabase.co
 */

import { ErrandOrder } from '@/types/task';
import { INITIAL_ORDERS, PRIMARY_WORKER } from './store';

const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://rhomwvtmmkwepclzaiuu.supabase.co'
).replace(/\/+$/, '');

const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_OJUn4OSw4PYcDmlIjCntNQ_qGeFBWFO'
).trim();

// In-memory fallback cache
let memoryOrders: ErrandOrder[] = [...INITIAL_ORDERS];

interface SupabaseRecord {
  id: string;
  prompt: string;
  status?: string;
  created_at?: string;
  customer_phone?: string;
  category?: string;
  category_name?: string;
  task_title?: string;
  target_location?: string;
  delivery_location?: string;
  estimated_minutes?: number | string;
  distance_km?: number | string;
  base_partner_fee?: number | string;
  platform_fee?: number | string;
  total_budget?: number | string;
  price_guard_text?: string;
}

/**
 * Fetch all active errands with automatic fallback
 */
export async function fetchErrands(): Promise<ErrandOrder[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/proxygrid_errands?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const cloudOrders: ErrandOrder[] = (data as SupabaseRecord[]).map((d) => ({
          id: d.id,
          prompt: d.prompt,
          status: (d.status || 'placed') as any,
          createdAt: d.created_at || new Date().toISOString(),
          customerPhone: d.customer_phone || '+91 98765 43210',
          destinationCoordinates: { lat: 17.9942, lng: 79.5638 },
          assignedWorker: PRIMARY_WORKER,
          liveLogs: [
            {
              id: `log-${d.id}-1`,
              timestamp: 'Just now',
              message: d.price_guard_text || `ProxyGrid order active for ${d.target_location || 'Warangal'}`,
              type: 'info',
            },
          ],
          analysis: {
            isSafe: true,
            safetyBadge: 'Verified Safe & Legal Errand',
            category: (d.category || 'food_stall') as any,
            categoryName: d.category_name || 'Offline Market Proxy',
            taskTitle: d.task_title || d.prompt,
            targetLocation: d.target_location || 'Warangal Local Market',
            deliveryLocation: d.delivery_location || 'Customer Delivery Spot',
            estimatedMinutes: Number(d.estimated_minutes) || 25,
            distanceKm: Number(d.distance_km) || 3.0,
            clarificationPlan: [
              `1. Proxy reaches ${d.target_location || 'target location'}.`,
              '2. Verifies on-site item or counter status.',
              '3. Enforces Smart Price Guard.',
            ],
            pricing: {
              basePartnerFee: Number(d.base_partner_fee) || 40,
              distanceFee: 15,
              timeFee: 0,
              itemCost: 0,
              platformFee: Number(d.platform_fee) || 5,
              serviceSubtotal: 45,
              totalBudget: Number(d.total_budget) || 45,
            },
            paymentModeNote: 'Zero-Advance Booking. Pay goods directly to vendor.',
          },
        }));

        const ids = new Set(cloudOrders.map((o) => o.id));
        const extraLocal = memoryOrders.filter((o) => !ids.has(o.id));
        return [...cloudOrders, ...extraLocal];
      }
    }
  } catch (err) {
    console.warn('[ProxyGrid Supabase] Falling back to pre-seeded memory orders:', err);
  }

  return memoryOrders;
}

/**
 * Save an errand to Supabase and memory store
 */
export async function saveErrand(order: ErrandOrder): Promise<{ success: boolean; synced: boolean }> {
  memoryOrders = [order, ...memoryOrders.filter((o) => o.id !== order.id)];

  try {
    const payload = {
      id: order.id,
      prompt: order.prompt,
      category: order.analysis.category,
      category_name: order.analysis.categoryName,
      task_title: order.analysis.taskTitle,
      status: order.status,
      target_location: order.analysis.targetLocation,
      delivery_location: order.analysis.deliveryLocation || 'Customer Delivery Address',
      customer_phone: order.customerPhone || '+91 98765 43210',
      estimated_minutes: order.analysis.estimatedMinutes,
      distance_km: order.analysis.distanceKm,
      base_partner_fee: order.analysis.pricing.basePartnerFee,
      platform_fee: order.analysis.pricing.platformFee,
      total_budget: order.analysis.pricing.totalBudget,
      assigned_worker_id: order.assignedWorker.id,
      price_guard_text: order.analysis.paymentModeNote,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/proxygrid_errands`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    return { success: true, synced: res.ok };
  } catch (err) {
    console.warn('[ProxyGrid Supabase] Saved locally (cloud sync deferred):', err);
    return { success: true, synced: false };
  }
}

/**
 * Update errand status
 */
export async function updateErrandStatus(orderId: string, status: string): Promise<boolean> {
  memoryOrders = memoryOrders.map((o) => (o.id === orderId ? { ...o, status: status as any } : o));

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/proxygrid_errands?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
