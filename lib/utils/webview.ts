/**
 * In-app browser detection.
 *
 * Why this exists at all: every piece of a reader's garden — their name, their
 * birth details, every card they have drawn and everything they have written
 * about them — lives in localStorage and nowhere else. That is the privacy
 * promise, and it is also the whole risk. An in-app browser (Instagram,
 * TikTok, Facebook) gets its own storage partition, so someone who onboards
 * inside Instagram and later opens slowww.garden in Safari does not find a
 * quieter version of their garden. They find an empty one, with no account to
 * restore it from and no error to explain it.
 *
 * Launching through social means most first visits arrive this way, so the
 * cheapest fix is to say so before they have typed anything.
 *
 * Detection is user-agent sniffing, which is imprecise by nature. It is tuned
 * to under-report: a missed webview costs one person their history, but a false
 * positive nags every ordinary visitor to leave a browser they are already in.
 * When in doubt, stay quiet.
 */

export type WebviewHost =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'snapchat'
  | 'twitter'
  | 'linkedin'
  | 'pinterest'
  | 'line'
  | 'wechat'
  | 'generic';

/** Named apps, each matched on a token its webview puts in the UA. */
const NAMED: Array<[WebviewHost, RegExp]> = [
  ['instagram', /Instagram/i],
  // FBAN/FBAV are the Facebook app's own tokens; Messenger carries them too.
  // Messenger is word-bounded on purpose: unbounded, it also matches WeChat's
  // MicroMessenger, and since this list is ordered every WeChat reader would
  // have been told to look for a Facebook menu that isn't there.
  ['facebook', /FBAN|FBAV|FB_IAB|\bMessenger\b/i],
  ['tiktok', /BytedanceWebview|musical_ly|Bytedance|TikTok/i],
  ['snapchat', /Snapchat/i],
  ['twitter', /Twitter/i],
  ['linkedin', /LinkedInApp/i],
  ['pinterest', /Pinterest/i],
  ['line', /\bLine\//i],
  ['wechat', /MicroMessenger/i],
];

/**
 * iOS gives every app the same WebKit engine, so an embedded browser is not
 * distinguishable by engine — only by the absence of Safari's own token. Real
 * Safari says "Safari"; Chrome, Firefox and Edge say CriOS/FxiOS/EdgiOS. A UA
 * with none of those, on iOS, is something's webview.
 *
 * A home-screen install is deliberately excluded: it reports the same way, but
 * it shares Safari's storage, so its garden is not stranded and there is
 * nothing to warn about.
 */
function isGenericIosWebview(ua: string): boolean {
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  if (!isIos) return false;

  const isStandalone =
    typeof navigator !== 'undefined' &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (isStandalone) return false;

  const isKnownBrowser = /Safari|CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  return !isKnownBrowser;
}

/** The app hosting this webview, or null if this looks like a real browser. */
export function detectWebview(): WebviewHost | null {
  if (typeof navigator === 'undefined') return null; // SSR
  const ua = navigator.userAgent || '';

  for (const [host, pattern] of NAMED) {
    if (pattern.test(ua)) return host;
  }

  // Android's in-app browsers set wv, but Android WebView is also how several
  // legitimate browsers are built, so this is only trusted alongside the
  // absence of a Chrome version token.
  if (/Android/i.test(ua) && /; wv\)/i.test(ua)) return 'generic';

  return isGenericIosWebview(ua) ? 'generic' : null;
}

/** What the reader should tap, in the words their app actually uses. */
export function escapeHint(host: WebviewHost): string {
  switch (host) {
    case 'instagram':
    case 'facebook':
    case 'tiktok':
      return 'tap the ··· in the corner, then "open in browser"';
    case 'snapchat':
      return 'tap the ⋮ menu, then "open in browser"';
    case 'line':
      return 'tap the ··· at the bottom, then "open in other browser"';
    case 'wechat':
      return 'tap the ··· at the top, then "open in browser"';
    default:
      return 'look for "open in browser" in this app\'s menu';
  }
}
