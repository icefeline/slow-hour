/**
 * Test script for insight generator
 *
 * Run with: npx ts-node scripts/test-insight-generator.ts
 */

import { generateInsight, TransitData } from '../lib/utils/insight-generator-v2.js';

// Test cases
const testCases: Array<{ cardId: string; transit: TransitData; label: string }> = [
  {
    label: 'The Tower + Pluto square Moon (4th house) - Challenging',
    cardId: 'major-16',
    transit: {
      transitingPlanet: 'Pluto',
      natalPlanet: 'Moon',
      aspectType: 'square',
      phase: 'approaching',
      house: 4,
      daysRemaining: 58
    }
  },
  {
    label: 'Death + Saturn return (8th house) - Challenging',
    cardId: 'major-13',
    transit: {
      transitingPlanet: 'Saturn',
      natalPlanet: 'Saturn',
      aspectType: 'conjunction',
      phase: 'peak',
      house: 8
    }
  },
  {
    label: 'The Star + Jupiter trine Venus (11th house) - Expansive',
    cardId: 'major-17',
    transit: {
      transitingPlanet: 'Jupiter',
      natalPlanet: 'Venus',
      aspectType: 'trine',
      phase: 'approaching',
      house: 11,
      daysRemaining: 23
    }
  },
  {
    label: 'Five of Swords + Mars opposite Mercury (3rd house) - Challenging',
    cardId: 'swords-5',
    transit: {
      transitingPlanet: 'Mars',
      natalPlanet: 'Mercury',
      aspectType: 'opposition',
      phase: 'peak',
      house: 3
    }
  },
  {
    label: 'The Hermit + North Node in 12th house - Neutral',
    cardId: 'major-9',
    transit: {
      transitingPlanet: 'North Node',
      natalPlanet: 'Sun',
      aspectType: 'conjunction',
      phase: 'approaching',
      house: 12,
      daysRemaining: 120
    }
  },
  {
    label: 'Three of Cups + Venus trine Moon (5th house) - Expansive',
    cardId: 'cups-3',
    transit: {
      transitingPlanet: 'Venus',
      natalPlanet: 'Moon',
      aspectType: 'trine',
      phase: 'peak',
      house: 5
    }
  },
  {
    label: 'Eight of Swords + Neptune square Sun (1st house) - Challenging',
    cardId: 'swords-8',
    transit: {
      transitingPlanet: 'Neptune',
      natalPlanet: 'Sun',
      aspectType: 'square',
      phase: 'approaching',
      house: 1,
      daysRemaining: 45
    }
  },
  {
    label: 'Ace of Wands + Uranus in 10th house - Expansive',
    cardId: 'wands-ace',
    transit: {
      transitingPlanet: 'Uranus',
      natalPlanet: 'Midheaven',
      aspectType: 'conjunction',
      phase: 'peak',
      house: 10
    }
  },
  {
    label: 'The Fool + Jupiter sextile Sun (9th house) - Expansive',
    cardId: 'major-0',
    transit: {
      transitingPlanet: 'Jupiter',
      natalPlanet: 'Sun',
      aspectType: 'sextile',
      phase: 'approaching',
      house: 9,
      daysRemaining: 12
    }
  }
];

// Run tests
console.log('🔮 Testing Insight Generator\n');
console.log('='.repeat(80) + '\n');

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.label}`);
  console.log('-'.repeat(80));

  const result = generateInsight(testCase.cardId, testCase.transit);

  if (result) {
    console.log(`\n📌 Key Phrase: "${result.keyPhrase}"`);
    console.log(`\n💬 Insight:\n"${result.insight}"`);
    console.log(`\n🎯 Transit Info: "${result.transitInfo}"`);
    console.log(`\n📖 Explanation:`);
    console.log(`   ${result.transitExplanation.transitingPlanet} (${result.transitExplanation.transitingPlanetMeaning}) ${result.transitExplanation.aspectType} ${result.transitExplanation.natalPlanet} (${result.transitExplanation.natalPlanetMeaning})`);
    console.log(`   ${result.transitExplanation.phaseMeaning}`);
  } else {
    console.log('❌ Failed to generate insight');
  }

  console.log('\n' + '='.repeat(80));
});

console.log('\n✅ Testing complete!\n');
