import { NextResponse } from 'next/server';
import { calculateNatalChart, calculateActiveTransits, getDominantTransit } from '@/lib/utils/astrology-calculator';

export async function POST(request: Request) {
  try {
    const { birthDate, birthTime, birthLocation } = await request.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      );
    }

    // Parse birth date
    const [month, day, year] = birthDate.split('/').map(Number);
    const parsedBirthDate = new Date(year, month - 1, day);

    // Calculate natal chart
    const natalChart = await calculateNatalChart(
      parsedBirthDate,
      birthTime || undefined,
      birthLocation || undefined
    );

    if (!natalChart) {
      return NextResponse.json(
        { error: 'Failed to calculate natal chart' },
        { status: 500 }
      );
    }

    // Calculate current active transits
    const activeTransits = await calculateActiveTransits(natalChart);

    // Get the most dominant transit
    const dominantTransit = getDominantTransit(activeTransits);

    if (!dominantTransit) {
      return NextResponse.json(
        { error: 'No active transits found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      dominantTransit,
      allTransits: activeTransits
    });
  } catch (error) {
    console.error('Transit calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate transit' },
      { status: 500 }
    );
  }
}
