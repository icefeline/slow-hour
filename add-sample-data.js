// Run this in browser console to add sample year data
const sampleDates = [
  '2025-01-05', '2025-01-12', '2025-01-20', '2025-01-28',
  '2025-02-03', '2025-02-14', '2025-02-21',
  '2025-03-08', '2025-03-15', '2025-03-22', '2025-03-29',
  '2025-04-05', '2025-04-18', '2025-04-25',
  '2025-05-03', '2025-05-11', '2025-05-19', '2025-05-27',
  '2025-06-04', '2025-06-12', '2025-06-20', '2025-06-28',
  '2025-07-06', '2025-07-14', '2025-07-22', '2025-07-30',
  '2025-08-07', '2025-08-15', '2025-08-23', '2025-08-31',
  '2025-09-08', '2025-09-16', '2025-09-24',
  '2025-10-02', '2025-10-10', '2025-10-18',
  '2025-11-01', '2025-11-09', '2025-11-17', '2025-11-25',
  '2025-12-03', '2025-12-11', '2025-12-19', '2025-12-27'
];

const majorArcanaIds = [
  'major-0', 'major-1', 'major-2', 'major-3', 'major-4', 'major-5',
  'major-6', 'major-7', 'major-8', 'major-9', 'major-10', 'major-11',
  'major-12', 'major-13', 'major-14', 'major-15', 'major-16', 'major-17',
  'major-18', 'major-19', 'major-20', 'major-21'
];

sampleDates.forEach((date, idx) => {
  const cardId = majorArcanaIds[idx % majorArcanaIds.length];
  const isReversed = Math.random() > 0.7; // 30% chance of reversed
  
  localStorage.setItem(`card-${date}`, cardId);
  localStorage.setItem(`reversed-${date}`, isReversed.toString());
  
  // Some have reflections
  if (Math.random() > 0.6) {
    localStorage.setItem(`reflection-${date}`, 'Sample reflection for this day');
  }
});

console.log('Sample data added! Refresh the page to see it.');
