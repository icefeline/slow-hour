import tzLookup from 'tz-lookup';

/**
 * Turning "born 09:30 in singapore" into an actual instant in time.
 *
 * This used to be done with `date.setHours(9, 30)`, which reads the clock time
 * in whatever zone the server happens to run in — UTC on Vercel. A Singapore
 * birth was therefore placed 8 hours late. Slow planets survive that; the lagna
 * does not, since the ascendant moves a full sign roughly every two hours.
 *
 * The zone comes from the birth coordinates rather than from the user, and the
 * offset is resolved for that date so historical DST is handled by ICU rather
 * than by us.
 */

/** IANA zone for a coordinate, or null when the lookup can't place it. */
export function zoneForCoordinates(latitude: number, longitude: number): string | null {
  // 0,0 is the "we couldn't geocode" sentinel — a point in the Atlantic that
  // tz-lookup will happily answer with Etc/GMT, which would look authoritative.
  if (latitude === 0 && longitude === 0) return null;
  try {
    return tzLookup(latitude, longitude);
  } catch {
    return null;
  }
}

/**
 * The offset (in minutes, east of UTC) that `zone` was on at `utcGuess`.
 *
 * Formats the instant in the target zone, reads the calendar fields back, and
 * measures the gap. Intl carries the historical rules, so 1950s half-hour
 * offsets and long-abolished DST come out right.
 */
function offsetMinutesAt(utcGuess: Date, zone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(utcGuess);
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
  const asUTC = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second'),
  );
  return (asUTC - utcGuess.getTime()) / 60000;
}

/**
 * The UTC instant of a birth given local calendar fields and a zone.
 *
 * Two passes: guess that local == UTC, measure the offset that guess lands in,
 * correct, then re-measure. The second pass matters near DST boundaries, where
 * the first guess can sit on the wrong side of the change.
 */
export function localToUtc(
  year: number, month: number, day: number,
  hours: number, minutes: number,
  zone: string,
): Date {
  const naive = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
  let offset = offsetMinutesAt(new Date(naive), zone);
  let utc = naive - offset * 60000;
  const second = offsetMinutesAt(new Date(utc), zone);
  if (second !== offset) {
    offset = second;
    utc = naive - offset * 60000;
  }
  return new Date(utc);
}

/**
 * The instant a chart should be cast for.
 *
 * `time` is the birth clock time as typed, `zone` comes from the birth
 * coordinates. With no zone (no location given) we fall back to treating the
 * clock time as UTC — the same assumption as before, but now confined to the
 * case where the chart's lagna is already flagged as unavailable.
 *
 * With no time at all, noon local keeps the Moon's position as close as
 * possible to the true one whatever the actual hour was.
 */
export function birthInstant(
  birthDate: Date,
  time: string | undefined,
  zone: string | null,
): { instant: Date; zoneUsed: string | null; timeKnown: boolean } {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  const parsed = time?.match(/^(\d{1,2}):(\d{2})$/);
  const hours = parsed ? Number(parsed[1]) : 12;
  const minutes = parsed ? Number(parsed[2]) : 0;

  if (!zone) {
    return {
      instant: new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0)),
      zoneUsed: null,
      timeKnown: !!parsed,
    };
  }

  return {
    instant: localToUtc(year, month, day, hours, minutes, zone),
    zoneUsed: zone,
    timeKnown: !!parsed,
  };
}
