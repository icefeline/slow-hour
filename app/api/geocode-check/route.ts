import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ found: null });
  }

  try {
    const encoded = encodeURIComponent(q.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SlowHourTarotApp/1.0 (daily tarot readings)',
          'Accept-Language': 'en',
        },
      }
    );

    if (!res.ok) return NextResponse.json({ found: null });

    const data = await res.json();

    if (data && data.length > 0) {
      const address = data[0].address ?? {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        '';
      const country = address.country || '';

      if (city && country) {
        return NextResponse.json({ found: `${city.toLowerCase()}, ${country.toLowerCase()}` });
      }
      if (country) {
        return NextResponse.json({ found: country.toLowerCase() });
      }
      // fallback: first two parts of display_name
      const parts = (data[0].display_name as string).split(',');
      const simplified = parts.slice(0, 2).map((p: string) => p.trim()).join(', ').toLowerCase();
      return NextResponse.json({ found: simplified });
    }

    return NextResponse.json({ found: '' });
  } catch {
    return NextResponse.json({ found: null });
  }
}
