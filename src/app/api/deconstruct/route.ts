import { NextRequest, NextResponse } from 'next/server';
import { processChatConversation, generateBudgetResponse } from '@/lib/gemini';
import { parseErrandIntent, calculateSmartBudget } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const parsed = parseErrandIntent(prompt);
    const budget = calculateSmartBudget(parsed.category, {
      productCost: parsed.productCost,
      estimatedMinutes: parsed.estimatedMinutes,
      queueWaitMinutes: parsed.waitingMinutes,
      ticketCost: parsed.productCost,
    });

    const responseMsg = await processChatConversation(prompt, []);

    return NextResponse.json({
      success: true,
      parsed,
      budget,
      responseMsg,
    });
  } catch (err: unknown) {
    console.error('API /api/deconstruct error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
