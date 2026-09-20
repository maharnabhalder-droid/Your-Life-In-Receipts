const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const outputDir = path.join(__dirname, '../src/data');
const publicOutputDir = path.join(__dirname, '../public/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(publicOutputDir)) {
  fs.mkdirSync(publicOutputDir, { recursive: true });
}

console.log('Preprocessing dataset from /data...');

const cardTrans = JSON.parse(fs.readFileSync(path.join(dataDir, 'Augmented_IndiaTransactMultiFacet2024.json'), 'utf-8'));
const dailyTrans = JSON.parse(fs.readFileSync(path.join(dataDir, 'Daily Household Transactions.json'), 'utf-8'));
const spotifyHistory = JSON.parse(fs.readFileSync(path.join(dataDir, 'spotify_history.json'), 'utf-8'));

function parseDDMMYYYY(str) {
  if (!str) return null;
  const s = String(str);
  const parts = s.split(' ');
  const dateParts = parts[0].split('/');
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const timeParts = parts[1] ? parts[1].split(':') : [0, 0, 0];
    const hour = parseInt(timeParts[0] || 0, 10);
    const minute = parseInt(timeParts[1] || 0, 10);
    const second = parseInt(timeParts[2] || 0, 10);
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
  return new Date(s);
}

function determineMood(ts, text, type) {
  const h = new Date(ts).getHours();
  const lower = (text || '').toLowerCase();
  if (h >= 0 && h <= 4) return 'introspective';
  if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('medicine')) return 'melancholic';
  if (lower.includes('gift') || lower.includes('pujan') || lower.includes('diwali') || lower.includes('party')) return 'balanced';
  if (lower.includes('exam') || lower.includes('course') || lower.includes('hbr')) return 'driven';
  if (h >= 22 || h <= 5) return 'restless';
  return 'focused';
}

const normalized = [];

// 1. Spotify Music Records (sample/stratified sample for fast 60fps rendering, e.g. top streams + nocturnal sessions + representative sample across all years)
// We take all late night streams, top artists, plus step sampling across the 149k records to get ~2500 high-density music receipts spanning 2013-2024
const sortedSpotify = spotifyHistory.sort((a,b) => new Date(a.ts) - new Date(b.ts));
const spotStep = Math.max(1, Math.floor(sortedSpotify.length / 2500));

sortedSpotify.forEach((r, idx) => {
  const isLateNight = new Date(r.ts).getHours() <= 4;
  const isTopArtist = ['The Beatles', 'The Killers', 'John Mayer', 'Bob Dylan', 'Paul McCartney'].includes(r.artist_name);
  
  if (idx % spotStep === 0 || isLateNight && idx % 10 === 0 || isTopArtist && idx % 30 === 0) {
    const ts = new Date(r.ts).toISOString();
    const title = r.track_name || 'Unknown Track';
    const artist = r.artist_name || 'Unknown Artist';
    const mood = determineMood(ts, title + ' ' + artist, 'music');

    normalized.push({
      id: `music-${idx}`,
      type: 'music',
      timestamp: ts,
      title: title,
      subtitle: artist,
      tags: ['music', r.platform || 'spotify', r.artist_name || 'artist'].filter(Boolean),
      amount: 0,
      mood,
      text: `Played on ${r.platform || 'Spotify'} (${Math.round((r.ms_played || 0)/1000)}s). Album: ${r.album_name || 'N/A'}. End: ${r.reason_end || 'finished'}.`,
      meta: {
        artist: r.artist_name,
        album: r.album_name,
        ms_played: r.ms_played,
        platform: r.platform,
        skipped: r.skipped === 'TRUE' || r.skipped === true,
        reason_start: r.reason_start,
        reason_end: r.reason_end
      }
    });
  }
});

// 2. Daily Household Transactions (Convert into Purchases, Places, Movies, Events, Messages, Notes, Searches)
dailyTrans.forEach((r, idx) => {
  const d = parseDDMMYYYY(r.Date);
  if (!d || isNaN(d.getTime())) return;
  const ts = d.toISOString();
  const cat = String(r.Category || 'Other');
  const sub = String(r.Subcategory || '');
  const note = String(r.Note || '');
  const amount = Number(r.Amount) || 0;
  const lower = (cat + ' ' + sub + ' ' + note).toLowerCase();

  let type = 'purchase';
  if (sub.toLowerCase().includes('movie') || sub.toLowerCase().includes('netflix') || sub.toLowerCase().includes('hotstar') || sub.toLowerCase().includes('audible')) {
    type = 'movie';
  } else if (cat.toLowerCase().includes('transportation') || note.toLowerCase().includes('place') || sub.toLowerCase().includes('auto') || sub.toLowerCase().includes('train') || sub.toLowerCase().includes('taxi')) {
    type = 'place';
  } else if (cat.toLowerCase().includes('festivals') || sub.toLowerCase().includes('pujan') || sub.toLowerCase().includes('diwali') || sub.toLowerCase().includes('trip')) {
    type = 'event';
  } else if (cat.toLowerCase().includes('gift') || sub.toLowerCase().includes('gift') || note.toLowerCase().includes('farewell')) {
    type = 'message';
  } else if (sub.toLowerCase().includes('kindle') || sub.toLowerCase().includes('edtech') || note.toLowerCase().includes('hbr')) {
    type = 'search';
  } else if (cat.toLowerCase().includes('self-development') || note.toLowerCase().includes('planner') || note.toLowerCase().includes('book')) {
    type = 'note';
  }

  const title = note || sub || cat || 'Transaction';
  const mood = determineMood(ts, title, type);

  normalized.push({
    id: `daily-${idx}`,
    type,
    timestamp: ts,
    title,
    subtitle: `${cat}${sub ? ' • ' + sub : ''}`,
    tags: [cat, sub, r.Mode].filter(Boolean),
    amount,
    mood,
    text: note ? `Note: ${note}` : `${cat} expense via ${r.Mode || 'Cash'}`,
    location: type === 'place' ? { name: note || 'Mumbai Transit' } : undefined,
    meta: {
      category: cat,
      subcategory: sub,
      mode: r.Mode,
      currency: r.Currency || 'INR',
      incomeExpense: r['Income/Expense']
    }
  });
});

// 3. Card Transactions (Augmented India Transact) - sample to keep high density without bloat
const cardStep = Math.max(1, Math.floor(cardTrans.length / 1000));
cardTrans.forEach((r, idx) => {
  if (idx % cardStep === 0) {
    const d = new Date(r.trans_date_trans_time);
    if (isNaN(d.getTime())) return;
    const ts = d.toISOString();
    const merchant = String(r.merchant || 'Store Merchant').replace(/^fraud_/, '');
    const amount = Number(r.amt) || 0;
    const isFraud = r.is_fraud === 1 || r.is_fraud === '1';

    let type = 'purchase';
    if (r.category === 'travel') type = 'place';
    if (r.category === 'entertainment') type = 'movie';

    const mood = isFraud ? 'restless' : determineMood(ts, merchant, type);

    normalized.push({
      id: `card-${r.trans_id || idx}`,
      type,
      timestamp: ts,
      title: merchant,
      subtitle: r.category ? `Card • ${r.category}` : 'Card Purchase',
      tags: [r.category || 'shopping', r.state, isFraud ? 'alert' : 'card'].filter(Boolean),
      amount,
      mood,
      text: `Card transaction at ${merchant}. City: ${r.city || r.state || 'India'}. ${isFraud ? 'Flagged Security Alert.' : ''}`,
      location: (r.lat && r.long) ? { name: `${r.state || 'India'} Location`, lat: r.lat, long: r.long } : undefined,
      meta: {
        merchant,
        category: r.category,
        job: r.job,
        isFraud,
        ccLast4: String(r.cc_num || '').slice(-4) || '4021'
      }
    });
  }
});

// 4. Add synthesized photo stubs linked to travel/events
const photoEvents = normalized.filter(r => r.type === 'place' || r.type === 'event').slice(0, 100);
photoEvents.forEach((ev, idx) => {
  const photoTs = new Date(new Date(ev.timestamp).getTime() + 15 * 60 * 1000).toISOString();
  normalized.push({
    id: `photo-${idx}`,
    type: 'photo',
    timestamp: photoTs,
    title: `Photo Stub #${idx + 101}`,
    subtitle: `Captured at ${ev.title}`,
    tags: ['photo', 'snapshot', ...ev.tags],
    amount: 0,
    mood: ev.mood,
    text: `Thermal Photo Strip captured during ${ev.title}. Geotagged at ${ev.location?.name || 'Local Locus'}.`,
    location: ev.location,
    meta: {
      exposure: '1/250s',
      iso: '400',
      focalLength: '35mm',
      linkedEventId: ev.id
    }
  });
});

// Sort all normalized records chronologically
normalized.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

console.log(`Successfully normalized ${normalized.length} total receipt records!`);

fs.writeFileSync(path.join(outputDir, 'normalized_dataset.json'), JSON.stringify(normalized, null, 2));
fs.writeFileSync(path.join(publicOutputDir, 'normalized_dataset.json'), JSON.stringify(normalized, null, 2));
console.log('Saved src/data/normalized_dataset.json & public/data/normalized_dataset.json');
