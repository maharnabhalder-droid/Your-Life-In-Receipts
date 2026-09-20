# 🧾 Your Life, In Receipts — Thermal Paper Storyteller

> **Hackathon Submission**: "Your Life, In Receipts" — 6-Hour Creative Challenge  
> **Concept**: A living thermal-paper printout of a life. Raw Data → Insights → Connections → Story.

---

## 🌟 Concept Overview & Findings (Phase 0)

"Your Life, In Receipts" turns 11 years of raw telemetry data (over 162,000 raw records spanning Spotify streams, household expenses, card transactions, transportation logs, searches, notes, and photos) into an interactive, living thermal paper roll.

### 📖 Central Story: *"The Nocturnal Searcher"*
The dataset tells the intimate coming-of-age story of a young engineer in India:
1. **The Commuter's Acoustic Prelude (2013-2015)**: Local train commutes, acoustic jams, idli-vada breakfasts, and modest student budgets.
2. **The 2 AM Beatles & Shift Era (2016-2017)**: 3,000+ Beatles plays, undated planner purchases, late-night exam prep, doctor visits, and a career transition.
3. **Deep Focus & Family Anchors (2018-2019)**: HBR & Edtech subscriptions, family healthcare coverage, mutual fund SIP investments.
4. **The Sanctuary & Lockdown Beats (2020-2021)**: 24,000+ yearly streams dominated by The Killers, WFH rock sessions, and midnight comfort food.
5. **Digital Autonomy & Modern Tempo (2022-2024)**: Seamless card transactions, balanced multi-genre listening, and confident adult equilibrium.

---

## 🚀 Quick Setup & Local Development

### Prerequisites
- Node.js 18+ and `npm`

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run normalized data pre-processor
npm run preprocess

# 3. Start local Vite development server
npm run dev
```

Open `http://localhost:3000` to launch the experience.

### Testing & Production Build

```bash
# Run engine unit tests (Vitest)
npm run test

# Build production bundle
npm run build

# Preview static build
npm run preview
```

---

## ⏱️ 60-Second Demo Script for Judges

1. **00:00 – 00:10 | Intro & Printing Animation**:
   - Open `/` to watch the live thermal printer counting 11,200 normalized receipts across 11 years. Click **"UNROLL THE STORY"**.

2. **00:10 – 00:25 | The Roll & Life Chapters**:
   - Scroll through **The Roll** (`/roll`). Observe how receipts are grouped into **5 Life Chapters** (e.g., *"The 2 AM Beatles Era"*).
   - Notice the distinct thermal layouts: track lines with waveform stubs for Music, itemized GST lines for Purchases, coordinates & visited stamps for Places, and terminal lines for Searches.

3. **00:25 – 00:35 | Stitched Threads & Moment Drawer**:
   - Click on any receipt (e.g., a 2 AM Beatles stream). Watch stitched thread edges draw connections to related receipts (planner note, late night search, doctor fee). The **Moment Drawer** opens at the bottom explaining *why* they connect.

4. **00:35 – 00:48 | Pattern Lab Analytics**:
   - Navigate to **Pattern Lab** (`/lab`). Show the custom D3 SVG visualizations:
     - 24×9 Hour-of-Day x Category Heatmap (pointing out the 28.9% late-night peak).
     - Chapter Interest Shift Stream.
     - Mood score line timeline.
     - Annual expenditure curve (₹).
     - Recurring Places & Artists Constellation Graph.

5. **00:48 – 00:55 | Discoveries Game Layer**:
   - Open **Discoveries** (`/discoveries`). Show the progress meter and unlock hidden achievements like *"Ghost Pattern Found"* or *"The Turning Point"* to reveal evidence receipts.

6. **00:55 – 01:00 | Finale & Receipt Export**:
   - Open **Finale** (`/finale`) to inspect *"The Receipt of You"* master summary statement. Click **"EXPORT MASTER RECEIPT AS PNG"** to download the high-resolution receipt image!

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + Vite + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (with `@theme` CSS variables, dark "Night Shift" and light "Day Desk" themes meeting WCAG AA)
- **Virtualization**: TanStack Virtual (`@tanstack/react-virtual`) for smooth 60fps scrolling over 11,000+ receipts
- **Web Worker**: Background Web Worker computing thread connection graphs, chapter clustering, and D3 pattern metrics off the main thread
- **State & Routing**: Zustand with `persist` middleware, hash-based URL synchronization for shareable views
- **Command Palette**: `cmdk` dialog triggered with `Ctrl/Cmd + K`
- **Visualization**: D3 modules (`d3-scale`, `d3-shape`, `d3-array`) rendering custom SVGs
- **Export**: `html-to-image` PNG renderer for summary receipts
