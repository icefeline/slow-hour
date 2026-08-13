/**
 * ASCII artwork for scent notes.
 *
 * Files live at `public/notes/ascf-<slug>.png`. A note finds its art by
 * slugifying its own name, so most notes need nothing here — `elderflower`
 * finds `ascf-elderflower.png` on its own.
 *
 * Two things do need declaring: NOTE_ART_FAMILY, when several notes should
 * share one drawing (every rose in the deck uses the same rose), and
 * AVAILABLE_ART, which is the list of drawings that actually exist. The list
 * is explicit rather than probed at runtime so a card never fires a request
 * for art that was never drawn.
 *
 * To add a drawing: drop the png into public/notes, then add its slug below.
 */

/** Notes that borrow another note's drawing. */
const NOTE_ART_FAMILY: Record<string, string> = {
  // white rose has its own drawing, so it is deliberately not in this list
  'damask rose': 'rose',
  'rose water': 'rose',
  'jasmine sambac': 'jasmine',
  'jasmine grandiflorum': 'jasmine',
  'orange blossom water': 'orange-blossom',
  'pink pepper': 'pepper',
  'black pepper': 'pepper',
  'orris root': 'orris',
  'wet stone': 'stone',
  'fig leaf': 'fig',
};

/**
 * Drawings that exist in public/notes. Keep alphabetical; the render order
 * comes from the card's accord, not from this list.
 */
const AVAILABLE_ART = new Set([
  'ambergris',
  'beeswax',
  'benzoin',
  'cinnamon',
  'cypress',
  'elderflower',
  'hyssop',
  'labdanum',
  'magnolia',
  'orange-blossom',
  'orris',
  'poppy',
  'rose',
  'seaweed',
  'tomato-leaf',
  'white-rose',
  'ylang-ylang',
]);

/**
 * What fills the empty slots while most notes are still undrawn.
 *
 * Three florals that carry the app's register and sit quietly behind type.
 * They are only ever used to top up after a card's own notes have contributed
 * what they can, and never twice in the same block — a drawing repeated behind
 * one set of notes reads as a tiling error rather than as a composition.
 *
 * As drawings arrive for more notes these get pushed out on their own: a card
 * matching four of its own notes never reaches them.
 */
const PLACEHOLDER_ART = ['elderflower', 'rose', 'magnolia'];

/** 'tomato leaf' → 'tomato-leaf', "dragon's blood" → 'dragons-blood'. */
export function artSlug(note: string): string {
  const family = NOTE_ART_FAMILY[note.toLowerCase()];
  if (family) return family;
  return note
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function artPathFor(note: string): string | null {
  const slug = artSlug(note);
  return AVAILABLE_ART.has(slug) ? `/notes/ascf-${slug}.png` : null;
}

/**
 * Art for a card's accord, in the order the notes are listed, then topped up
 * from the placeholders. Every drawing in the returned list is distinct.
 *
 * A card's own notes come first, so where a drawing exists it is the card's
 * actual material rather than decoration. The placeholders fill what's left.
 */
export function artForNotes(notes: string[], slots = 4): string[] {
  const used = new Set<string>();
  const paths: string[] = [];

  const take = (slug: string) => {
    if (used.has(slug) || paths.length >= slots) return;
    used.add(slug);
    paths.push(`/notes/ascf-${slug}.png`);
  };

  for (const note of notes) {
    const slug = artSlug(note);
    if (AVAILABLE_ART.has(slug)) take(slug);
  }
  for (const slug of PLACEHOLDER_ART) take(slug);

  return paths;
}
