import { NextResponse } from 'next/server';
import { getTodaysCard, getCardForDate } from '@/lib/utils/card-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');
    const birthdate = searchParams.get('birthdate') || undefined;

    let card, isReversed;
    const today = new Date().toISOString().split('T')[0];

    if (seed) {
      // Use seed for testing/shuffling
      const result = getCardForDate(today + '-' + seed, birthdate);
      card = result.card;
      isReversed = result.isReversed;
    } else {
      // Normal date-based card with optional birthdate personalization
      const result = getCardForDate(today, birthdate);
      card = result.card;
      isReversed = result.isReversed;
    }

    return NextResponse.json({
      card,
      isReversed,
      date: today
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get daily card' },
      { status: 500 }
    );
  }
}
