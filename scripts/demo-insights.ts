// Demo script to showcase the insight generator with various scenarios
import { generateActiveInsight, createDrawContext } from '../lib/utils/insight-generator';
import { mockUserChart, mockDailyContexts, mockDrawHistory } from '../lib/data/mock-transits';
import type { TarotCard } from '../lib/types/tarot';

// Mock cards for demo
const mockTowerCard: TarotCard = {
  id: 'major-16',
  name: 'The Tower',
  suite: 'major',
  number: 16,
  uprightMeaning: 'Upheaval reveals truth...',
  reversedMeaning: 'Avoiding necessary change...',
  uprightKeywords: ['upheaval', 'revelation', 'breakdown'],
  reversedKeywords: ['avoidance', 'fear of change'],
  description: 'The Tower represents sudden upheaval',
  imagePath: '/cards/the-tower.svg'
};

const mockHermitCard: TarotCard = {
  id: 'major-9',
  name: 'The Hermit',
  suite: 'major',
  number: 9,
  uprightMeaning: 'Solitude as medicine...',
  reversedMeaning: 'Isolation vs. solitude...',
  uprightKeywords: ['solitude', 'introspection', 'wisdom'],
  reversedKeywords: ['isolation', 'loneliness'],
  description: 'The Hermit represents inner wisdom',
  imagePath: '/cards/the-hermit.svg'
};

console.log('\n🔮 DAILY TAROT ACTIVE INSIGHT GENERATOR - DEMO\n');
console.log('='.repeat(70));

// SCENARIO 1: First time drawing a card
console.log('\n📍 SCENARIO 1: First Draw - The Tower');
console.log('-'.repeat(70));
const scenario1Context = createDrawContext(
  mockTowerCard,
  new Date('2026-01-26'),
  mockDailyContexts.plutoApproaching.dominantTransit.id,
  mockDailyContexts.plutoApproaching.dominantTransit.startDate,
  []
);
const scenario1 = generateActiveInsight(
  mockTowerCard,
  mockUserChart,
  mockDailyContexts.plutoApproaching,
  scenario1Context
);
console.log('Transit:', mockDailyContexts.plutoApproaching.dominantTransit.name);
console.log('Phase:', mockDailyContexts.plutoApproaching.dominantTransit.phase);
console.log('House:', mockDailyContexts.plutoApproaching.dominantTransit.house, '(home & foundation)');
console.log('\n💬 ACTIVE INSIGHT:');
console.log(scenario1.insight);
console.log('\n🏷️  Insight types:', scenario1.insightTypes.join(', '));

// SCENARIO 2: Second draw (repetition)
console.log('\n\n📍 SCENARIO 2: Second Draw - The Tower Returns');
console.log('-'.repeat(70));
const scenario2Context = createDrawContext(
  mockTowerCard,
  new Date('2026-01-26'),
  mockDailyContexts.plutoApproaching.dominantTransit.id,
  mockDailyContexts.plutoApproaching.dominantTransit.startDate,
  mockDrawHistory.secondDraw
);
const scenario2 = generateActiveInsight(
  mockTowerCard,
  mockUserChart,
  mockDailyContexts.plutoApproaching,
  scenario2Context
);
console.log('Transit:', mockDailyContexts.plutoApproaching.dominantTransit.name);
console.log('Draw count:', scenario2Context.drawCount);
console.log('Days since last draw:', scenario2Context.daysSinceLastDraw);
console.log('\n💬 ACTIVE INSIGHT:');
console.log(scenario2.insight);
console.log('\n🏷️  Insight types:', scenario2.insightTypes.join(', '));

// SCENARIO 3: Peak transit phase with supporting transit
console.log('\n\n📍 SCENARIO 3: Peak Transit + Mercury Retrograde');
console.log('-'.repeat(70));
const scenario3Context = createDrawContext(
  mockHermitCard,
  new Date('2026-01-26'),
  mockDailyContexts.saturnPeakWithMercury.dominantTransit.id,
  mockDailyContexts.saturnPeakWithMercury.dominantTransit.startDate,
  []
);
const scenario3 = generateActiveInsight(
  mockHermitCard,
  mockUserChart,
  mockDailyContexts.saturnPeakWithMercury,
  scenario3Context
);
console.log('Dominant Transit:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.name);
console.log('Phase:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.phase);
console.log('Supporting Transit:', mockDailyContexts.saturnPeakWithMercury.supportingTransits[0]?.name);
console.log('House:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.house, '(career & public life)');
console.log('\n💬 ACTIVE INSIGHT:');
console.log(scenario3.insight);
console.log('\n🏷️  Insight types:', scenario3.insightTypes.join(', '));

// SCENARIO 4: Third+ draw (multiple repetitions)
console.log('\n\n📍 SCENARIO 4: Third Draw - Deep Integration');
console.log('-'.repeat(70));
const scenario4Context = createDrawContext(
  mockTowerCard,
  new Date('2026-02-05'),
  mockDailyContexts.plutoApproaching.dominantTransit.id,
  mockDailyContexts.plutoApproaching.dominantTransit.startDate,
  mockDrawHistory.multipleDraws.filter(d => d.cardId === 'tower')
);
const scenario4 = generateActiveInsight(
  mockTowerCard,
  mockUserChart,
  mockDailyContexts.plutoApproaching,
  scenario4Context
);
console.log('Transit:', mockDailyContexts.plutoApproaching.dominantTransit.name);
console.log('Draw count:', scenario4Context.drawCount);
console.log('Days into transit:', scenario4Context.daysIntoTransit);
console.log('\n💬 ACTIVE INSIGHT:');
console.log(scenario4.insight);
console.log('\n🏷️  Insight types:', scenario4.insightTypes.join(', '));

// SCENARIO 5: Integration/Separating phase
console.log('\n\n📍 SCENARIO 5: Separating Phase - Integration Work');
console.log('-'.repeat(70));
const scenario5Context = createDrawContext(
  mockHermitCard,
  new Date('2026-01-26'),
  mockDailyContexts.neptuneSeparating.dominantTransit.id,
  mockDailyContexts.neptuneSeparating.dominantTransit.startDate,
  []
);
const scenario5 = generateActiveInsight(
  mockHermitCard,
  mockUserChart,
  mockDailyContexts.neptuneSeparating,
  scenario5Context
);
console.log('Transit:', mockDailyContexts.neptuneSeparating.dominantTransit.name);
console.log('Phase:', mockDailyContexts.neptuneSeparating.dominantTransit.phase);
console.log('House:', mockDailyContexts.neptuneSeparating.dominantTransit.house, '(subconscious & spirituality)');
console.log('\n💬 ACTIVE INSIGHT:');
console.log(scenario5.insight);
console.log('\n🏷️  Insight types:', scenario5.insightTypes.join(', '));

console.log('\n' + '='.repeat(70));
console.log('\n✨ Demo complete! Each scenario shows how the insight adapts to:');
console.log('   • Transit phase (beginning → peak → separating → integration)');
console.log('   • Repetition (1st, 2nd, 3rd+ draws of same card)');
console.log('   • House placement (personalized to life area)');
console.log('   • Supporting transits (Mercury Rx, Venus, Mars, etc.)');
console.log('\n');
