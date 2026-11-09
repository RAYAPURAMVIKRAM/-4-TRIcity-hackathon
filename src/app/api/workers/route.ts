import { NextResponse } from 'next/server';
import { PRIMARY_WORKER } from '@/lib/store';

export async function GET() {
  const workers = [
    PRIMARY_WORKER,
    {
      id: 'PRX-088',
      name: 'Suresh M.',
      vehicle: 'Honda Activa (TS 03 EF 8820)',
      rating: 4.85,
      completedTasks: 215,
      phone: '+91 94401 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      currentLat: 18.0051,
      currentLng: 79.5712,
    },
    {
      id: 'PRX-104',
      name: 'Ananya V.',
      vehicle: 'TVS Jupiter (TS 03 CD 9912)',
      rating: 4.95,
      completedTasks: 410,
      phone: '+91 99887 66554',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      currentLat: 17.9814,
      currentLng: 79.5977,
    }
  ];
  return NextResponse.json(workers);
}
