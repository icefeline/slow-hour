/**
 * Generate sample insights to review tone and content
 */

const { generateInsight } = require('../lib/utils/insight-generator-v2.ts');

// Test cases showing different card + transit combinations
const samples = [
  {
    label: 'The Tower (challenging card) + Pluto square Moon (challenging transit)',
    cardId: 'major-16',
    transit: {
      transitingPlanet: 'Pluto',
      natalPlanet: 'Moon',
      aspectType: 'square',
      phase: 'peak',
      house: 4,
      daysRemaining: 0
    },
    isReversed: false
  },
  {
    label: 'Three of Swords (heartbreak) + Saturn opposite Venus (relationship test)',
    cardId: 'swords-3',
    transit: {
      transitingPlanet: 'Saturn',
      natalPlanet: 'Venus',
      aspectType: 'opposition',
      phase: 'approaching',
      house: 7,
      daysRemaining: 12
    },
    isReversed: false
  },
  {
    label: 'The Star (hope) + Jupiter trine Sun (expansive opportunity)',
    cardId: 'major-17',
    transit: {
      transitingPlanet: 'Jupiter',
      natalPlanet: 'Sun',
      aspectType: 'trine',
      phase: 'peak',
      house: 5,
      daysRemaining: 2
    },
    isReversed: false
  },
  {
    label: 'Two of Cups (connection) + Uranus conjunction Venus (sudden attraction)',
    cardId: 'cups-2',
    transit: {
      transitingPlanet: 'Uranus',
      natalPlanet: 'Venus',
      aspectType: 'conjunction',
      phase: 'approaching',
      house: 7,
      daysRemaining: 8
    },
    isReversed: false
  },
  {
    label: 'Eight of Pentacles (mastery/work) + Saturn trine Mercury (focused learning)',
    cardId: 'pentacles-8',
    transit: {
      transitingPlanet: 'Saturn',
      natalPlanet: 'Mercury',
      aspectType: 'trine',
      phase: 'peak',
      house: 6,
      daysRemaining: 1
    },
    isReversed: false
  }
];

console.log('='.repeat(80));
console.log('SAMPLE INSIGHTS - Testing Emotional Intelligence & Card Connection');
console.log('='.repeat(80));
console.log();

samples.forEach(sample => {
  const insight = generateInsight(sample.cardId, sample.transit, sample.isReversed);

  if (insight) {
    console.log('\n' + '-'.repeat(80));
    console.log(`TEST: ${sample.label}`);
    console.log('-'.repeat(80));
    console.log('\nKEY PHRASE:');
    console.log(insight.keyPhrase);
    console.log('\nINSIGHT:');
    console.log(insight.insight);
    console.log('\nTRANSIT INFO:');
    console.log(insight.transitInfo);
    console.log();
  }
});

console.log('='.repeat(80));
