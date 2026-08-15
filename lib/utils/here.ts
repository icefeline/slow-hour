/**
 * Where the reader is right now, for the reading page's sunrise and sunset.
 *
 * Not the birth location: the chart is cast for where they were born, but the
 * sun came up over wherever they are this morning, and that is what the margin
 * column is reporting. Those two are the same place for most readers and wildly
 * different for anyone who moved.
 *
 * Coordinates are cached so the permission prompt happens once, not daily, and
 * so a reading can be generated without waiting on the device every time. They
 * are kept only in localStorage, alongside everything else the app knows —
 * nothing is sent anywhere except to this app's own transit route, which uses
 * them to compute two times and does not store them.
 */

const KEY = 'slow-garden-here';

/** A month. Long enough not to nag, short enough that a move is picked up. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface Here {
  latitude: number;
  longitude: number;
  /** When this fix was taken, so it can be aged out. */
  at: number;
}

/** Forget the fix. Used when the reader turns the setting back off. */
export function clearHere(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to do — it was never stored
  }
}

/** Whether a usable fix is already on hand, without asking for one. */
export function hasHere(): boolean {
  return readCache() !== null;
}

function readCache(): Here | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Here;
    if (typeof parsed?.latitude !== 'number' || typeof parsed?.longitude !== 'number') return null;
    if (Date.now() - parsed.at > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * The reader's coordinates, or null.
 *
 * Null is an ordinary outcome, not a failure: the reader may have declined, the
 * device may not know, or the page may not be on a secure origin. The margin
 * simply loses two rows in that case rather than falling back to a sunrise
 * somewhere the reader isn't.
 *
 * Never prompts unless `ask` is true, so this can be called freely on load and
 * only puts the permission dialog up at a moment the caller has chosen.
 */
export async function getHere({ ask = false }: { ask?: boolean } = {}): Promise<Here | null> {
  if (typeof window === 'undefined') return null;

  const cached = readCache();
  if (cached) return cached;
  if (!('geolocation' in navigator)) return null;

  if (!ask) {
    // Only proceed without asking if the reader already said yes at some point.
    try {
      const status = await navigator.permissions?.query({ name: 'geolocation' as PermissionName });
      if (status && status.state !== 'granted') return null;
    } catch {
      // Permissions API unavailable — don't risk an unasked-for prompt.
      return null;
    }
  }

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const here: Here = {
          // Two decimal places is a little over a kilometre: enough for sunrise
          // to the minute, and not a record of anyone's address.
          latitude: Math.round(position.coords.latitude * 100) / 100,
          longitude: Math.round(position.coords.longitude * 100) / 100,
          at: Date.now(),
        };
        try {
          localStorage.setItem(KEY, JSON.stringify(here));
        } catch {
          // not cacheable — still usable for this reading
        }
        resolve(here);
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: MAX_AGE_MS },
    );
  });
}
