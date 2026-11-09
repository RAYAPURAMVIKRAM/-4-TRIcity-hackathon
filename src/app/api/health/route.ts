import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    platform: 'ProxyGrid - The Digital Joint Family Network',
    hackathon: 'TriCity AI Hackathon 2026',
    team: 'Team VQ (Rayapuram Vikram & Haseeba Mahanaz)',
    room: 'Room B-4-216 (TRI26420)',
    region: 'Warangal & Hanamkonda Active Mesh',
    supabase: 'Connected (rhomwvtmmkwepclzaiuu.supabase.co)',
    ai_engine: 'Gemini Multi-Role Task Deconstruction & Price Guard',
    timestamp: new Date().toISOString(),
  });
}
