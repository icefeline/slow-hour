import { generateActiveInsight, createDrawContext } from '../insight-generator';
import { mockUserChart, mockDailyContexts, mockDrawHistory } from '../../data/mock-transits';
import type { TarotCard } from '../../types/tarot';
import type { CardDraw } from '../../types/astrology';

// Mock cards for testing
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

describe('Insight Generator', () => {

  describe('First time drawing a card', () => {
    it('should generate insight with transit phase and house context, no repetition note', () => {
      const drawContext = createDrawContext(
        mockTowerCard,
        new Date('2026-01-26'),
        mockDailyContexts.plutoApproaching.dominantTransit.id,
        mockDailyContexts.plutoApproaching.dominantTransit.startDate,
        [] // no previous draws
      );

      const result = generateActiveInsight(
        mockTowerCard,
        mockUserChart,
        mockDailyContexts.plutoApproaching,
        drawContext
      );

      console.log('\n=== SCENARIO 1: First Draw ===');
      console.log('Card:', mockTowerCard.name);
      console.log('Transit:', mockDailyContexts.plutoApproaching.dominantTransit.name);
      console.log('Phase:', mockDailyContexts.plutoApproaching.dominantTransit.phase);
      console.log('House:', mockDailyContexts.plutoApproaching.dominantTransit.house);
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insight).toBeTruthy();
      expect(result.insightTypes).not.toContain('repetition_second');
      expect(result.insightTypes).toContain('transit_phase_approaching');
    });
  });

  describe('Second time drawing the same card', () => {
    it('should include repetition awareness', () => {
      const drawContext = createDrawContext(
        mockTowerCard,
        new Date('2026-01-26'),
        mockDailyContexts.plutoApproaching.dominantTransit.id,
        mockDailyContexts.plutoApproaching.dominantTransit.startDate,
        mockDrawHistory.secondDraw
      );

      const result = generateActiveInsight(
        mockTowerCard,
        mockUserChart,
        mockDailyContexts.plutoApproaching,
        drawContext
      );

      console.log('\n=== SCENARIO 2: Second Draw (Repetition) ===');
      console.log('Card:', mockTowerCard.name);
      console.log('Draw Count:', drawContext.drawCount);
      console.log('Days Since Last Draw:', drawContext.daysSinceLastDraw);
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insight).toContain('Tower');
      expect(result.insightTypes).toContain('repetition_second');
    });
  });

  describe('Third+ time drawing the same card', () => {
    it('should acknowledge multiple draws with ordinal language', () => {
      const drawContext = createDrawContext(
        mockTowerCard,
        new Date('2026-02-05'),
        mockDailyContexts.plutoApproaching.dominantTransit.id,
        mockDailyContexts.plutoApproaching.dominantTransit.startDate,
        mockDrawHistory.multipleDraws.filter(d => d.cardId === 'tower') // 2 previous Tower draws
      );

      const result = generateActiveInsight(
        mockTowerCard,
        mockUserChart,
        mockDailyContexts.plutoApproaching,
        drawContext
      );

      console.log('\n=== SCENARIO 3: Third Draw (Multiple Repetitions) ===');
      console.log('Card:', mockTowerCard.name);
      console.log('Draw Count:', drawContext.drawCount);
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insight).toBeTruthy();
      expect(result.insightTypes).toContain('repetition_multiple');
    });
  });

  describe('Peak transit phase', () => {
    it('should emphasize intensity and presence at peak', () => {
      const drawContext = createDrawContext(
        mockTowerCard,
        new Date('2026-01-26'),
        mockDailyContexts.saturnPeakWithMercury.dominantTransit.id,
        mockDailyContexts.saturnPeakWithMercury.dominantTransit.startDate,
        []
      );

      const result = generateActiveInsight(
        mockTowerCard,
        mockUserChart,
        mockDailyContexts.saturnPeakWithMercury,
        drawContext
      );

      console.log('\n=== SCENARIO 4: Peak Transit Phase ===');
      console.log('Card:', mockTowerCard.name);
      console.log('Transit:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.name);
      console.log('Phase:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.phase);
      console.log('Orb:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.orb, 'degrees');
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insightTypes).toContain('transit_phase_peak');
    });
  });

  describe('Supporting transit (Mercury retrograde)', () => {
    it('should weave in Mercury retrograde context', () => {
      const drawContext = createDrawContext(
        mockHermitCard,
        new Date('2026-01-26'),
        mockDailyContexts.saturnPeakWithMercury.dominantTransit.id,
        mockDailyContexts.saturnPeakWithMercury.dominantTransit.startDate,
        []
      );

      const result = generateActiveInsight(
        mockHermitCard,
        mockUserChart,
        mockDailyContexts.saturnPeakWithMercury,
        drawContext
      );

      console.log('\n=== SCENARIO 5: Supporting Transit (Mercury Retrograde) ===');
      console.log('Card:', mockHermitCard.name);
      console.log('Dominant Transit:', mockDailyContexts.saturnPeakWithMercury.dominantTransit.name);
      console.log('Supporting Transit:', mockDailyContexts.saturnPeakWithMercury.supportingTransits[0]?.name);
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insightTypes).toContain('supporting_mercury');
    });
  });

  describe('House-specific insights', () => {
    it('should use card-specific house insight when available', () => {
      const drawContext = createDrawContext(
        mockTowerCard,
        new Date('2026-01-26'),
        mockDailyContexts.plutoApproaching.dominantTransit.id,
        mockDailyContexts.plutoApproaching.dominantTransit.startDate,
        []
      );

      const result = generateActiveInsight(
        mockTowerCard,
        mockUserChart,
        mockDailyContexts.plutoApproaching, // House 4
        drawContext
      );

      console.log('\n=== SCENARIO 6: House-Specific Insight ===');
      console.log('Card:', mockTowerCard.name);
      console.log('House:', mockDailyContexts.plutoApproaching.dominantTransit.house, '(home & foundation)');
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insight).toContain('4th house');
      expect(result.insightTypes).toContain('house_4');
    });
  });

  describe('Integration phase', () => {
    it('should focus on reflection and harvest at end of transit', () => {
      const drawContext = createDrawContext(
        mockHermitCard,
        new Date('2026-01-26'),
        mockDailyContexts.neptuneSeparating.dominantTransit.id,
        mockDailyContexts.neptuneSeparating.dominantTransit.startDate,
        []
      );

      const result = generateActiveInsight(
        mockHermitCard,
        mockUserChart,
        mockDailyContexts.neptuneSeparating,
        drawContext
      );

      console.log('\n=== SCENARIO 7: Integration/Separating Phase ===');
      console.log('Card:', mockHermitCard.name);
      console.log('Transit:', mockDailyContexts.neptuneSeparating.dominantTransit.name);
      console.log('Phase:', mockDailyContexts.neptuneSeparating.dominantTransit.phase);
      console.log('\nGenerated Insight:');
      console.log(result.insight);
      console.log('\nInsight Types:', result.insightTypes);

      expect(result.insightTypes).toContain('transit_phase_separating');
    });
  });

});
