/**
 * A scent accord for every card in the deck, in perfumery's three-tier form.
 *
 * The tiers are ordered by volatility, not importance: top notes are what you
 * meet first and lose within minutes, heart notes are the body of the thing,
 * base notes are what is still on skin hours later. That maps onto a day, which
 * is why it suits a one-card-a-day app — see the note at the bottom of this file.
 *
 * Keys are card ids from tarot-deck.ts. All 78 cards are covered.
 */

export interface CardScent {
  /** First impression. Bright, volatile, gone quickly. */
  top: string[];
  /** The body of the accord. */
  heart: string[];
  /** What lingers. */
  base: string[];
}

/**
 * The relations a six-note accord is written in, in render order.
 *
 * These say what each note *does* to the accord, which the three tiers cannot:
 * a tier tells you when a note arrives, not whether it cools or warms. Six
 * notes, one per relation, is also a fixed shape — every card's block is the
 * same height, and the column reads as one voice across the deck.
 */
export const SCENT_RELATIONS = [
  'OPENS WITH',
  'STEADIED BY',
  'COOLED BY',
  'WARMED BY',
  'DEEPENED BY',
  'CLOSES ON',
] as const;

export type ScentRelation = (typeof SCENT_RELATIONS)[number];

/** One note per relation. */
export type CardAccord = Record<ScentRelation, string>;

/**
 * Six-note accords, written a suit at a time.
 *
 * Cards not yet written fall back to the three tiers below, so the deck stays
 * whole while this fills in. Notes are drawn from the same palette the tiers
 * use, so a card reads as the same perfume in either form — except cups-king,
 * whose accord comes from the design and deliberately differs.
 */
export const cardAccords: Record<string, CardAccord> = {
  // ── Cups (water — floral, honeyed, wet) ───────────────────────────────────
  'cups-ace': {
    'OPENS WITH': 'yuzu', 'STEADIED BY': 'magnolia', 'COOLED BY': 'white rose',
    'WARMED BY': 'orange blossom', 'DEEPENED BY': 'ambrette seed', 'CLOSES ON': 'white musk',
  },
  'cups-2': {
    'OPENS WITH': 'neroli', 'STEADIED BY': 'iris', 'COOLED BY': 'bergamot',
    'WARMED BY': 'rose', 'DEEPENED BY': 'jasmine sambac', 'CLOSES ON': 'sandalwood',
  },
  'cups-3': {
    'OPENS WITH': 'mandarin', 'STEADIED BY': 'elderflower', 'COOLED BY': 'white tea',
    'WARMED BY': 'osmanthus', 'DEEPENED BY': 'honey', 'CLOSES ON': 'orris',
  },
  'cups-4': {
    'OPENS WITH': 'green tea', 'STEADIED BY': 'hay', 'COOLED BY': 'cucumber',
    'WARMED BY': 'chamomile', 'DEEPENED BY': 'orris', 'CLOSES ON': 'oakmoss',
  },
  'cups-5': {
    'OPENS WITH': 'petrichor', 'STEADIED BY': 'iris', 'COOLED BY': 'violet',
    'WARMED BY': 'chamomile', 'DEEPENED BY': 'wet stone', 'CLOSES ON': 'oakmoss',
  },
  'cups-6': {
    'OPENS WITH': 'peach', 'STEADIED BY': 'orris', 'COOLED BY': 'mandarin',
    'WARMED BY': 'honey', 'DEEPENED BY': 'rose', 'CLOSES ON': 'vanilla',
  },
  'cups-7': {
    'OPENS WITH': 'blackcurrant bud', 'STEADIED BY': 'blue lotus', 'COOLED BY': 'star anise',
    'WARMED BY': 'tuberose', 'DEEPENED BY': 'poppy', 'CLOSES ON': 'myrrh',
  },
  'cups-8': {
    'OPENS WITH': 'sea salt', 'STEADIED BY': 'cypress', 'COOLED BY': 'mugwort',
    'WARMED BY': 'chamomile', 'DEEPENED BY': 'myrrh', 'CLOSES ON': 'oakmoss',
  },
  'cups-9': {
    'OPENS WITH': 'bergamot', 'STEADIED BY': 'fig', 'COOLED BY': 'cardamom',
    'WARMED BY': 'honey', 'DEEPENED BY': 'jasmine', 'CLOSES ON': 'tonka bean',
  },
  'cups-10': {
    'OPENS WITH': 'neroli', 'STEADIED BY': 'chamomile', 'COOLED BY': 'mandarin',
    'WARMED BY': 'orange blossom', 'DEEPENED BY': 'rose', 'CLOSES ON': 'beeswax',
  },
  'cups-page': {
    'OPENS WITH': 'yuzu', 'STEADIED BY': 'violet', 'COOLED BY': 'seaweed',
    'WARMED BY': 'elderflower', 'DEEPENED BY': 'blue lotus', 'CLOSES ON': 'white musk',
  },
  'cups-knight': {
    'OPENS WITH': 'bergamot', 'STEADIED BY': 'iris', 'COOLED BY': 'neroli',
    'WARMED BY': 'rose', 'DEEPENED BY': 'jasmine sambac', 'CLOSES ON': 'ambergris',
  },
  'cups-queen': {
    'OPENS WITH': 'sea salt', 'STEADIED BY': 'magnolia', 'COOLED BY': 'mandarin',
    'WARMED BY': 'rose', 'DEEPENED BY': 'blue lotus', 'CLOSES ON': 'ambergris',
  },
  // From the design — the one card whose accord was drawn rather than derived.
  'cups-king': {
    'OPENS WITH': 'elderflower', 'STEADIED BY': 'magnolia', 'COOLED BY': 'white rose',
    'WARMED BY': 'orange blossom', 'DEEPENED BY': 'ylang ylang', 'CLOSES ON': 'damask rose',
  },
};

export const cardScents: Record<string, CardScent> = {
  // ── Major Arcana ──────────────────────────────────────────────────────────
  'major-0':  { top: ['bergamot', 'mimosa'],                heart: ['elderflower', 'hay'],                    base: ['white cedar'] },
  'major-1':  { top: ['black pepper', 'bergamot'],          heart: ['tobacco', 'honey'],                      base: ['frankincense', 'labdanum'] },
  'major-2':  { top: ['sea salt', 'yuzu'],                  heart: ['blue lotus', 'orris'],                   base: ['myrrh', 'oakmoss'] },
  'major-3':  { top: ['peach', 'rose'],                     heart: ['tuberose', 'fig', 'honey'],              base: ['sandalwood'] },
  'major-4':  { top: ['black pepper', 'cardamom'],          heart: ['tobacco', 'cedar'],                      base: ['labdanum', 'birch tar'] },
  'major-5':  { top: ['bay laurel', 'cardamom'],            heart: ['frankincense', 'beeswax'],               base: ['sandalwood', 'myrrh'] },
  'major-6':  { top: ['rose', 'neroli'],                    heart: ['jasmine sambac', 'honey'],               base: ['sandalwood', 'ambrette seed'] },
  'major-7':  { top: ['ginger', 'black pepper'],            heart: ['bay laurel', 'tobacco'],                 base: ['cedar', 'vetiver'] },
  'major-8':  { top: ['pink pepper', 'saffron'],            heart: ['rose', 'honey'],                         base: ['sandalwood', 'immortelle'] },
  'major-9':  { top: ['hinoki', 'sage'],                    heart: ['frankincense', 'palo santo'],            base: ['cedar', 'ash'] },
  'major-10': { top: ['star anise', 'cardamom'],            heart: ['cinnamon', 'honey'],                     base: ['tonka bean', 'frankincense'] },
  'major-11': { top: ['yuzu', 'violet leaf'],               heart: ['iris', 'vervain'],                       base: ['vetiver', 'sea salt'] },
  'major-12': { top: ['petrichor', 'violet leaf'],          heart: ['blue lotus', 'oakmoss'],                 base: ['vetiver', 'myrrh'] },
  'major-13': { top: ['rhubarb', 'cypress'],                heart: ['myrrh', 'immortelle'],                   base: ['oakmoss', 'vetiver', 'patchouli'] },
  'major-14': { top: ['bergamot', 'coriander seed'],        heart: ['rose', 'honey', 'chamomile'],            base: ['sandalwood', 'benzoin'] },
  'major-15': { top: ['blackcurrant bud', 'ginger'],        heart: ['tuberose', 'tobacco', 'cacao'],          base: ['labdanum', 'oud', 'birch tar'] },
  'major-16': { top: ['black pepper', 'ginger'],            heart: ["dragon's blood", 'tobacco'],             base: ['birch tar', 'ash'] },
  'major-17': { top: ['neroli', 'mimosa'],                  heart: ['blue lotus', 'rose water'],              base: ['white musk', 'iris'] },
  'major-18': { top: ['mugwort', 'seaweed'],                heart: ['jasmine sambac', 'blue lotus'],          base: ['oakmoss', 'ambergris', 'myrrh'] },
  'major-19': { top: ['orange blossom', 'yuzu'],            heart: ['immortelle', 'honey'],                   base: ['saffron', 'sandalwood'] },
  'major-20': { top: ['frankincense', 'bergamot'],          heart: ['hyssop', 'tuberose'],                    base: ['myrrh', 'oud'] },
  'major-21': { top: ['bergamot', 'cardamom'],              heart: ['rose', 'jasmine', 'fig'],                base: ['sandalwood', 'oakmoss', 'vetiver', 'ambrette'] },

  // ── Cups (water — floral, honeyed, wet) ───────────────────────────────────
  'cups-ace':    { top: ['orange blossom water', 'yuzu'],   heart: ['white rose', 'magnolia'],                          base: ['white musk'] },
  'cups-2':      { top: ['neroli', 'bergamot'],             heart: ['rose', 'jasmine sambac'],                          base: ['sandalwood', 'ambrette seed'] },
  'cups-3':      { top: ['mandarin', 'pink pepper'],        heart: ['osmanthus', 'elderflower', 'honey'],               base: ['white tea'] },
  'cups-4':      { top: ['green tea', 'cucumber'],          heart: ['chamomile', 'hay'],                                base: ['oakmoss', 'orris'] },
  'cups-5':      { top: ['petrichor'],                      heart: ['violet', 'iris', 'chamomile'],                     base: ['oakmoss', 'wet stone'] },
  'cups-6':      { top: ['peach', 'mandarin'],              heart: ['rose', 'honey', 'chamomile'],                      base: ['vanilla', 'orris'] },
  'cups-7':      { top: ['blackcurrant bud', 'star anise'], heart: ['jasmine grandiflorum', 'blue lotus', 'tuberose'],  base: ['poppy', 'myrrh'] },
  'cups-8':      { top: ['sea salt', 'cypress'],            heart: ['mugwort', 'chamomile'],                            base: ['oakmoss', 'myrrh'] },
  'cups-9':      { top: ['bergamot', 'cardamom'],           heart: ['rose', 'jasmine', 'honey', 'fig'],                 base: ['sandalwood', 'tonka bean'] },
  'cups-10':     { top: ['neroli', 'mandarin'],             heart: ['rose', 'orange blossom', 'honey', 'chamomile'],    base: ['sandalwood', 'beeswax', 'benzoin'] },
  'cups-page':   { top: ['yuzu', 'elderflower'],            heart: ['violet', 'blue lotus'],                            base: ['white musk', 'seaweed'] },
  'cups-knight': { top: ['bergamot', 'neroli'],             heart: ['rose', 'jasmine sambac', 'iris'],                  base: ['sandalwood', 'ambergris'] },
  'cups-queen':  { top: ['sea salt', 'mandarin'],           heart: ['rose', 'jasmine', 'blue lotus', 'magnolia'],       base: ['sandalwood', 'ambergris', 'oakmoss'] },
  'cups-king':   { top: ['cypress', 'bergamot'],            heart: ['chamomile', 'champaca', 'tobacco'],                base: ['oakmoss', 'myrrh', 'ambergris'] },

  // ── Swords (air — cool, dry, sharp, bitter) ───────────────────────────────
  'swords-ace':    { top: ['yuzu', 'black pepper'],                heart: ['violet leaf', 'vetiver'],            base: ['hinoki'] },
  'swords-2':      { top: ['bergamot', 'cucumber'],                heart: ['iris', 'violet leaf'],               base: ['white musk'] },
  'swords-3':      { top: ['rhubarb', 'black pepper'],             heart: ['iris', 'wormwood'],                  base: ['wet stone', 'oakmoss'] },
  'swords-4':      { top: ['eucalyptus', 'lavender'],              heart: ['chamomile', 'hinoki'],               base: ['cedar', 'hay'] },
  'swords-5':      { top: ['black pepper', 'ginger'],              heart: ['tobacco', 'wormwood'],               base: ['birch tar'] },
  'swords-6':      { top: ['sea salt', 'bergamot'],                heart: ['violet leaf', 'iris'],               base: ['cypress', 'oakmoss'] },
  'swords-7':      { top: ['black pepper', 'coriander seed'],      heart: ['tobacco', 'tarragon'],               base: ['vetiver', 'ambrette seed'] },
  'swords-8':      { top: ['cypress', 'juniper'],                  heart: ['mugwort', 'wormwood'],               base: ['oakmoss', 'vetiver'] },
  'swords-9':      { top: ['black pepper', 'ginger'],              heart: ['valerian', 'wormwood'],              base: ['myrrh', 'birch tar'] },
  'swords-10':     { top: ['rhubarb', 'black pepper'],             heart: ['iris', 'wormwood', 'tobacco'],       base: ['birch tar', 'oakmoss', 'ash'] },
  'swords-page':   { top: ['yuzu', 'pink pepper'],                 heart: ['violet leaf', 'green tea'],          base: ['vetiver'] },
  'swords-knight': { top: ['black pepper', 'ginger', 'bergamot'],  heart: ['tobacco', 'bay laurel'],             base: ['cedar', 'vetiver'] },
  'swords-queen':  { top: ['bergamot', 'violet leaf'],             heart: ['iris', 'wormwood', 'tarragon'],      base: ['vetiver', 'cypress'] },
  'swords-king':   { top: ['black pepper', 'cardamom'],            heart: ['bay laurel', 'tobacco', 'hinoki'],   base: ['cedar', 'vetiver', 'oakmoss'] },

  // ── Wands (fire — hot, dry, spiced, resinous) ─────────────────────────────
  'wands-ace':    { top: ['ginger', 'pink pepper'],                    heart: ["dragon's blood", 'cinnamon'],                     base: ['cedar'] },
  'wands-2':      { top: ['bergamot', 'black pepper'],                 heart: ['tobacco', 'bay laurel'],                          base: ['cedar', 'frankincense'] },
  'wands-3':      { top: ['bergamot', 'cardamom'],                     heart: ['tobacco', 'saffron'],                             base: ['frankincense', 'sandalwood'] },
  'wands-4':      { top: ['cinnamon', 'orange blossom'],               heart: ['rose', 'honey'],                                  base: ['sandalwood', 'beeswax'] },
  'wands-5':      { top: ['black pepper', 'ginger', 'pink pepper'],    heart: ["dragon's blood", 'tobacco'],                      base: ['cedar', 'hay'] },
  'wands-6':      { top: ['bergamot', 'cardamom'],                     heart: ['bay laurel', 'saffron', 'honey'],                 base: ['frankincense', 'sandalwood'] },
  'wands-7':      { top: ['black pepper', 'ginger'],                   heart: ["dragon's blood", 'tobacco', 'thyme'],             base: ['vetiver', 'cedar'] },
  'wands-8':      { top: ['yuzu', 'ginger', 'pink pepper'],            heart: ['cardamom', 'star anise'],                         base: ['cedar'] },
  'wands-9':      { top: ['black pepper', 'cypress'],                  heart: ['tobacco', 'thyme', "dragon's blood"],             base: ['vetiver', 'oakmoss', 'labdanum'] },
  'wands-10':     { top: ['black pepper'],                             heart: ['tobacco', 'hay', 'cedar'],                        base: ['vetiver', 'labdanum', 'patchouli'] },
  'wands-page':   { top: ['ginger', 'pink pepper', 'yuzu'],            heart: ['cardamom', "dragon's blood"],                     base: ['cedar'] },
  'wands-knight': { top: ['black pepper', 'ginger', 'cinnamon'],       heart: ["dragon's blood", 'tobacco', 'saffron'],           base: ['cedar', 'birch tar'] },
  'wands-queen':  { top: ['pink pepper', 'bergamot'],                  heart: ['rose', 'cinnamon', 'saffron', 'honey'],           base: ['sandalwood', 'labdanum'] },
  'wands-king':   { top: ['black pepper', 'cardamom'],                 heart: ['tobacco', 'bay laurel', "dragon's blood"],        base: ['cedar', 'frankincense', 'labdanum'] },

  // ── Pentacles (earth — waxy, earthy, harvest, quiet) ──────────────────────
  'pentacles-ace':    { top: ['fig leaf', 'carrot seed'],          heart: ['orris', 'beeswax'],                              base: ['sandalwood', 'vetiver'] },
  'pentacles-2':      { top: ['bergamot', 'pink pepper'],          heart: ['ginger', 'honey'],                               base: ['vetiver', 'hay'] },
  'pentacles-3':      { top: ['cardamom', 'black pepper'],         heart: ['hay', 'beeswax', 'tobacco'],                     base: ['sandalwood', 'cedar', 'oakmoss'] },
  'pentacles-4':      { top: ['black pepper'],                     heart: ['patchouli', 'tobacco'],                          base: ['labdanum', 'vetiver', 'oakmoss'] },
  'pentacles-5':      { top: ['cypress', 'wet stone'],             heart: ['mugwort', 'hay'],                                base: ['oakmoss', 'vetiver', 'birch tar'] },
  'pentacles-6':      { top: ['bergamot', 'coriander seed'],       heart: ['fig', 'honey', 'tobacco'],                       base: ['sandalwood', 'beeswax'] },
  'pentacles-7':      { top: ['tomato leaf', 'cardamom'],          heart: ['fig', 'hay', 'honey'],                           base: ['vetiver', 'oakmoss', 'patchouli'] },
  'pentacles-8':      { top: ['black pepper', 'coriander seed'],   heart: ['beeswax', 'hay', 'tobacco'],                     base: ['sandalwood', 'cedar', 'oakmoss'] },
  'pentacles-9':      { top: ['fig', 'bergamot'],                  heart: ['rose', 'honey', 'magnolia'],                     base: ['sandalwood', 'orris', 'beeswax'] },
  'pentacles-10':     { top: ['fig', 'cardamom'],                  heart: ['rose', 'honey', 'tobacco', 'patchouli'],         base: ['sandalwood', 'oakmoss', 'vetiver', 'beeswax', 'orris'] },
  'pentacles-page':   { top: ['fig leaf', 'coriander seed'],       heart: ['carrot seed', 'hay'],                            base: ['vetiver', 'oakmoss'] },
  'pentacles-knight': { top: ['black pepper', 'cardamom'],         heart: ['hay', 'tobacco', 'patchouli'],                   base: ['vetiver', 'cedar', 'oakmoss'] },
  'pentacles-queen':  { top: ['fig', 'cardamom'],                  heart: ['rose', 'honey', 'champaca', 'fenugreek'],        base: ['sandalwood', 'beeswax', 'oakmoss'] },
  'pentacles-king':   { top: ['fig', 'black pepper'],              heart: ['tobacco', 'truffle', 'patchouli'],               base: ['sandalwood', 'oakmoss', 'vetiver', 'labdanum'] },
};

/** The accord for a card, or null if the id is unknown. */
export function getCardScent(cardId: string): CardScent | null {
  return cardScents[cardId] ?? null;
}

/** All notes for a card, top through base, for a single-line rendering. */
export function flattenScent(scent: CardScent): string[] {
  return [...scent.top, ...scent.heart, ...scent.base];
}

/**
 * Count how often each note appears across a set of drawn cards — for a
 * year-in-review ("your year smelled of vetiver, honey and oakmoss"), or to
 * find the through-line in a run of readings. Returns notes most-frequent first.
 */
export function dominantNotes(cardIds: string[], limit = 5): Array<{ note: string; count: number }> {
  const tally = new Map<string, number>();
  for (const id of cardIds) {
    const scent = cardScents[id];
    if (!scent) continue;
    for (const note of flattenScent(scent)) {
      tally.set(note, (tally.get(note) ?? 0) + 1);
    }
  }
  return [...tally.entries()]
    .map(([note, count]) => ({ note, count }))
    .sort((a, b) => b.count - a.count || a.note.localeCompare(b.note))
    .slice(0, limit);
}
