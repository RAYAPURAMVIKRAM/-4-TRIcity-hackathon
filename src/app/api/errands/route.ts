import { NextRequest, NextResponse } from 'next/server';
import { fetchErrands, saveErrand, updateErrandStatus } from '@/lib/supabase';
import { PRIMARY_WORKER } from '@/lib/store';
import { ErrandOrder } from '@/types/task';

export async function GET() {
  try {
    const orders = await fetchErrands();
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt || 'General Market Errand';
    const category = body.category || 'food_stall';
    const location = body.location || 'Hanamkonda Chowrasta';
    const budget = Number(body.budget) || 45;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: ErrandOrder = {
      id: orderId,
      prompt,
      status: 'placed',
      createdAt: new Date().toISOString(),
      assignedWorker: PRIMARY_WORKER,
      customerPhone: body.customerPhone || '+91 98765 43210',
      destinationCoordinates: { lat: 17.9942, lng: 79.5638 },
      analysis: {
        isSafe: true,
        safetyBadge: 'Verified Safe & Legal Errand',
        category,
        categoryName: body.categoryName || 'Offline Market Proxy',
        taskTitle: body.taskTitle || prompt,
        targetLocation: location,
        deliveryLocation: body.deliveryLocation || 'Customer Location',
        estimatedMinutes: 25,
        distanceKm: 3.0,
        clarificationPlan: [
          `1. Dispatched proxy to ${location}.`,
          '2. Inspect item and verify price with stallkeeper.',
          '3. Deliver straight to customer.',
        ],
        pricing: {
          basePartnerFee: 40,
          distanceFee: 15,
          timeFee: 0,
          itemCost: 0,
          platformFee: 5,
          serviceSubtotal: 45,
          totalBudget: budget,
        },
        paymentModeNote: 'Zero-Advance Booking. Item cost paid directly to stall.',
      },
      liveLogs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: 'Just now',
          message: `Mission dispatched for ${location}. Smart Price Guard active.`,
          type: 'info',
        },
      ],
    };

    const res = await saveErrand(newOrder);
    return NextResponse.json({ success: true, order: newOrder, synced: res.synced }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }
    const ok = await updateErrandStatus(orderId, status);
    return NextResponse.json({ success: true, synced: ok });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
