const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, '../src/data/normalized_dataset.json');
const receipts = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

function findReceiptIds(filterFn, count = 2) {
  const matches = receipts.filter(filterFn);
  if (matches.length < count) {
    console.warn(`Warning: only found ${matches.length} matches for filter.`);
  }
  return matches.slice(0, count).map(r => r.id);
}

// 1. John Mayer
const mayerIds = findReceiptIds(r => (r.subtitle || r.title || '').includes('John Mayer'));
console.log('Disc 1 (John Mayer) IDs:', mayerIds);

// 2. Planner & Beatles
const plannerIds = findReceiptIds(r => (r.text || r.title || '').toLowerCase().includes('planner'));
const beatles2017Ids = findReceiptIds(r => (r.subtitle || r.title || '').includes('The Beatles') && new Date(r.timestamp).getFullYear() === 2017);
const disc2Ids = [...plannerIds.slice(0, 1), ...beatles2017Ids.slice(0, 1)];
console.log('Disc 2 IDs:', disc2Ids);

// 3. Commute
const commuteIds = findReceiptIds(r => r.type === 'place' || (r.subtitle || '').toLowerCase().includes('train'));
console.log('Disc 3 IDs:', commuteIds);

// 4. Beatles Late Night
const beatlesLateIds = findReceiptIds(r => (r.subtitle || r.title || '').includes('The Beatles') && new Date(r.timestamp).getHours() <= 4);
console.log('Disc 4 IDs:', beatlesLateIds);

// 5. Search
const searchIds = findReceiptIds(r => r.type === 'search');
console.log('Disc 5 IDs:', searchIds);

// 6. Caretaker / Health
const healthIds = findReceiptIds(r => (r.tags || []).includes('Health') || (r.text || r.title || '').toLowerCase().includes('doctor') || (r.text || r.title || '').toLowerCase().includes('medicine'));
console.log('Disc 6 IDs:', healthIds);

// 7. Lockdown Rocker / Killers 2020
const killers2020Ids = findReceiptIds(r => (r.subtitle || r.title || '').includes('The Killers') && new Date(r.timestamp).getFullYear() === 2020);
console.log('Disc 7 IDs:', killers2020Ids);

// 8. Cashless / Card
const cardIds = findReceiptIds(r => r.id.startsWith('card-'));
console.log('Disc 8 IDs:', cardIds);

// 9. Friday Peak
const fridayIds = findReceiptIds(r => new Date(r.timestamp).getDay() === 5);
console.log('Disc 9 IDs:', fridayIds);

// 10. Financial Anchor / Investment
const investIds = findReceiptIds(r => (r.tags || []).includes('Investment') || (r.subtitle || r.title || '').toLowerCase().includes('mutual fund'));
console.log('Disc 10 IDs:', investIds);

// Verify ALL IDs exist in receipts
const allIds = [...mayerIds, ...disc2Ids, ...commuteIds, ...beatlesLateIds, ...searchIds, ...healthIds, ...killers2020Ids, ...cardIds, ...fridayIds, ...investIds];
const missing = allIds.filter(id => !receipts.some(r => r.id === id));
console.log('Missing IDs:', missing.length);
