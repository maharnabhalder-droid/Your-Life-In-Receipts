const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, '../src/data/normalized_dataset.json');
const receipts = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

console.log('Total receipts:', receipts.length);

// 1. Types breakdown
const typeCounts = {};
receipts.forEach(r => {
  typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
});
console.log('\nTypes count:', typeCounts);

// 2. Beatles breakdown
const beatles = receipts.filter(r => (r.subtitle || r.title || '').includes('The Beatles'));
console.log('\nTotal Beatles plays:', beatles.length);
const beatlesByYear = {};
beatles.forEach(r => {
  const yr = new Date(r.timestamp).getFullYear();
  beatlesByYear[yr] = (beatlesByYear[yr] || 0) + 1;
});
console.log('Beatles by year:', beatlesByYear);

// 2017 Beatles late-night (00:00 - 04:00)
const beatles2017 = beatles.filter(r => new Date(r.timestamp).getFullYear() === 2017);
const beatles2017Late = beatles2017.filter(r => new Date(r.timestamp).getHours() <= 4);
console.log(`2017 Beatles: ${beatles2017.length}, late night (0-4h): ${beatles2017Late.length} (${(beatles2017Late.length/beatles2017.length*100).toFixed(1)}%)`);

// 3. John Mayer breakdown
const mayer = receipts.filter(r => (r.subtitle || r.title || '').includes('John Mayer'));
console.log('\nTotal John Mayer plays:', mayer.length);
const mayerByYear = {};
mayer.forEach(r => {
  const yr = new Date(r.timestamp).getFullYear();
  mayerByYear[yr] = (mayerByYear[yr] || 0) + 1;
});
console.log('John Mayer by year:', mayerByYear);

// 4. The Killers breakdown
const killers = receipts.filter(r => (r.subtitle || r.title || '').includes('The Killers'));
console.log('\nTotal Killers plays:', killers.length);
const killersByYear = {};
killers.forEach(r => {
  const yr = new Date(r.timestamp).getFullYear();
  killersByYear[yr] = (killersByYear[yr] || 0) + 1;
});
console.log('The Killers by year:', killersByYear);

// 5. Day of week breakdown
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayCounts = {};
receipts.forEach(r => {
  const day = days[new Date(r.timestamp).getDay()];
  dayCounts[day] = (dayCounts[day] || 0) + 1;
});
console.log('\nDays of week count:', dayCounts);

// 6. Nocturnal ratio (00:00 - 04:59 vs 00:00 - 04:00)
const late04 = receipts.filter(r => new Date(r.timestamp).getHours() <= 4);
console.log(`\nLate night (00:00 - 04:59): ${late04.length} (${(late04.length/receipts.length*100).toFixed(1)}%)`);

// 7. Music per year
const musicByYear = {};
receipts.filter(r => r.type === 'music').forEach(r => {
  const yr = new Date(r.timestamp).getFullYear();
  musicByYear[yr] = (musicByYear[yr] || 0) + 1;
});
console.log('\nMusic per year:', musicByYear);

// 8. Spending per year (amount > 0)
const spendByYear = {};
const spendCatsByYear = {};
receipts.filter(r => r.amount && r.amount > 0).forEach(r => {
  const yr = new Date(r.timestamp).getFullYear();
  spendByYear[yr] = (spendByYear[yr] || 0) + r.amount;
  if (!spendCatsByYear[yr]) spendCatsByYear[yr] = {};
  const cat = r.subtitle || r.type;
  spendCatsByYear[yr][cat] = (spendCatsByYear[yr][cat] || 0) + r.amount;
});
console.log('\nSpending per year:', spendByYear);
console.log('\nTop spend cat per year:');
Object.keys(spendCatsByYear).forEach(yr => {
  const top = Object.entries(spendCatsByYear[yr]).sort((a,b) => b[1]-a[1])[0];
  console.log(`  ${yr}: Total ₹${Math.round(spendByYear[yr])}, Top Cat: ${top[0]} (₹${Math.round(top[1])})`);
});
