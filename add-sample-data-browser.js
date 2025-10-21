// Paste this script into the browser console to add sample data
// This will populate the year view with sample cards

const sampleDates = [
  // January
  { date: '2025-01-01', cardId: 'major-0', isReversed: false },  // The Fool
  { date: '2025-01-15', cardId: 'major-1', isReversed: false },  // The Magician

  // February
  { date: '2025-02-01', cardId: 'major-2', isReversed: true },   // The High Priestess (reversed)
  { date: '2025-02-14', cardId: 'major-6', isReversed: false },  // The Lovers
  { date: '2025-02-28', cardId: 'major-3', isReversed: false },  // The Empress

  // March
  { date: '2025-03-08', cardId: 'major-17', isReversed: false }, // The Star
  { date: '2025-03-21', cardId: 'major-11', isReversed: true },  // Justice (reversed)

  // April
  { date: '2025-04-01', cardId: 'major-0', isReversed: true },   // The Fool (reversed)
  { date: '2025-04-10', cardId: 'major-9', isReversed: false },  // The Hermit
  { date: '2025-04-22', cardId: 'major-7', isReversed: false },  // The Chariot

  // May
  { date: '2025-05-01', cardId: 'major-8', isReversed: false },  // Strength
  { date: '2025-05-15', cardId: 'major-19', isReversed: false }, // The Sun
  { date: '2025-05-28', cardId: 'major-10', isReversed: true },  // Wheel of Fortune (reversed)

  // June
  { date: '2025-06-06', cardId: 'major-13', isReversed: false }, // Death
  { date: '2025-06-21', cardId: 'major-14', isReversed: false }, // Temperance

  // July
  { date: '2025-07-04', cardId: 'major-15', isReversed: true },  // The Devil (reversed)
  { date: '2025-07-17', cardId: 'major-16', isReversed: false }, // The Tower
  { date: '2025-07-29', cardId: 'major-17', isReversed: true },  // The Star (reversed)

  // August
  { date: '2025-08-08', cardId: 'major-18', isReversed: false }, // The Moon
  { date: '2025-08-20', cardId: 'major-4', isReversed: false },  // The Emperor

  // September
  { date: '2025-09-01', cardId: 'major-5', isReversed: false },  // The Hierophant
  { date: '2025-09-15', cardId: 'major-12', isReversed: true },  // The Hanged Man (reversed)
  { date: '2025-09-28', cardId: 'major-20', isReversed: false }, // Judgement

  // October
  { date: '2025-10-01', cardId: 'major-21', isReversed: false }, // The World
  { date: '2025-10-15', cardId: 'major-2', isReversed: false },  // The High Priestess
  { date: '2025-10-21', cardId: 'major-9', isReversed: true },   // The Hermit (reversed) - TODAY
  { date: '2025-10-31', cardId: 'major-13', isReversed: true },  // Death (reversed)

  // November
  { date: '2025-11-01', cardId: 'major-6', isReversed: true },   // The Lovers (reversed)
  { date: '2025-11-11', cardId: 'major-1', isReversed: true },   // The Magician (reversed)
  { date: '2025-11-25', cardId: 'major-8', isReversed: false },  // Strength

  // December
  { date: '2025-12-01', cardId: 'major-19', isReversed: true },  // The Sun (reversed)
  { date: '2025-12-15', cardId: 'major-17', isReversed: false }, // The Star
  { date: '2025-12-25', cardId: 'major-21', isReversed: false }, // The World
  { date: '2025-12-31', cardId: 'major-0', isReversed: false },  // The Fool
];

// Add all sample cards to localStorage
sampleDates.forEach(({ date, cardId, isReversed }) => {
  localStorage.setItem(`card-${date}`, cardId);
  localStorage.setItem(`reversed-${date}`, isReversed.toString());
});

console.log(`✨ Added ${sampleDates.length} sample cards to localStorage!`);
console.log('🔄 Refresh the page to see the cards in the year view.');

// Optional: Add some sample reflections for a few cards
const sampleReflections = [
  { date: '2025-01-01', reflection: 'Starting the year with The Fool - embracing new beginnings and taking a leap of faith.' },
  { date: '2025-02-14', reflection: 'The Lovers on Valentine\'s Day - a reminder about choices in relationships and alignment with values.' },
  { date: '2025-05-15', reflection: 'The Sun brings joy and optimism today. Feeling grateful and energized.' },
  { date: '2025-10-21', reflection: 'The Hermit reversed - perhaps I need to come out of isolation and connect with others more.' },
];

sampleReflections.forEach(({ date, reflection }) => {
  localStorage.setItem(`reflection-${date}`, reflection);
});

console.log(`📝 Added ${sampleReflections.length} sample reflections.`);
