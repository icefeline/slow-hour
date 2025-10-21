import { NextResponse } from 'next/server';
import { getTodaysCard, getCardForDate } from '@/lib/utils/card-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');

    let card, isReversed;

    if (seed) {
      // Use seed for testing/shuffling
      const today = new Date().toISOString().split('T')[0];
      const result = getCardForDate(today + '-' + seed);
      card = result.card;
      isReversed = result.isReversed;
    } else {
      // Normal date-based card
      const result = getTodaysCard();
      card = result.card;
      isReversed = result.isReversed;
    }

    return NextResponse.json({
      card,
      isReversed,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get daily card' },
      { status: 500 }
    );
  }
}
