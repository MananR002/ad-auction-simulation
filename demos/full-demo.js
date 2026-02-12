/**
 * Full Demo for Ad Auction Library
 * Demonstrates ALL features: basic/advanced auction, budget manager, event timeline/observability, filtering, second-price, multi-round, etc.
 * Run with: node demos/full-demo.js
 */

const { runAuction, runAdvancedAuction, AuctionManager } = require('../index');
const fs = require('fs');
const path = require('path');

console.log('=== FULL Ad Auction Library Demo ===\n');

// 1. Basic & Advanced single runs
console.log('1. Single-run auctions:');
const sampleJson = fs.readFileSync(path.join(__dirname, '../data/sample-bids.json'), 'utf8');
const basicRes = runAuction(sampleJson);
console.log('Basic:', basicRes);
const advRes = runAdvancedAuction(sampleJson);
console.log('Advanced:', advRes);

// 2. Manager with multi-round, budgets, events
console.log('\n2. Multi-round with AuctionManager + events timeline:');
const manager = new AuctionManager(JSON.parse(sampleJson));
for (let r = 1; r <= 3; r++) {
  const res = manager.runRound(r % 2 === 0);  // Alternate basic/advanced
  console.log(`Round ${r}:`, {
    winner: res.winner,
    finalPrice: res.finalPrice,
    activeCount: res.activeBiddersCount,
    reruns: res.reruns || 0
  });
  // Show events for this round
  const roundEvents = res.events || [];
  console.log(`  Events (${roundEvents.length}):`, roundEvents.map(e => e.type));
}

// 3. Edge: mixed invalid qs + budget exhaust
console.log('\n3. Edge cases (filtering, disqualification, no active):');
const mixed = [
  { id: 'advX', name: 'Tech', bidAmount: 100, qualityScore: 0.9, budget: 300 },
  { id: 'advY', name: 'BadQ', bidAmount: 120, qualityScore: 1.5, budget: 400 },  // Invalid qs -> filtered
  { id: 'advZ', name: 'LowB', bidAmount: 80, budget: 50 }  // Low budget -> may disqualify/rerun
];
const edgeManager = new AuctionManager(mixed);
const edgeRes = edgeManager.runRound(true);
console.log('Edge result:', edgeRes.winner ? `Winner ${edgeRes.winner}` : edgeRes.message);
console.log('Events:', edgeRes.events.map(e => e.type));

// 4. Reset & rerun
console.log('\n4. Reset manager and rerun:');
manager.reset();
const resetRes = manager.runRound(false);
console.log('Post-reset:', resetRes.winner);

console.log('\nFull demo completed! Library now includes clean utilities, events for observability, budget management, and all optimizations.');
