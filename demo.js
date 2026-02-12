/**
 * Small Demo for Ad Auction Library
 * Now includes basic + advanced (qualityScore-influenced) auction modes.
 */

const { runAuction, runAdvancedAuction, AuctionManager } = require('./index');
const fs = require('fs');
const path = require('path');

// Load sample data (now includes qualityScore)
const sampleDataPath = path.join(__dirname, 'data/sample-bids.json');
const sampleJson = fs.readFileSync(sampleDataPath, 'utf8');

console.log('=== Ad Auction Simulation Demo ===\n');

// Run basic auction with JSON string (now with second-price)
console.log('1. Running BASIC auction with sample JSON input...');
const result = runAuction(sampleJson);
console.log('Basic Result:', result);

// Run advanced auction
console.log('\n2. Running ADVANCED auction (bid * qualityScore) with sample...');
const advResult = runAdvancedAuction(sampleJson);
console.log('Advanced Result:', advResult);

// Example with object input (no/mixed quality; must be 0 < qs <=1 if provided)
console.log('\n3. Advanced auction with direct object (mixed quality)...');
const bids = [
  { id: 'advX', name: 'TechCorp', bidAmount: 500, qualityScore: 0.95 },
  { id: 'advY', name: 'AdVantage', bidAmount: 450 },
  { id: 'advZ', name: 'MarketPro', bidAmount: 600, qualityScore: 0.85 }
];
const result2 = runAdvancedAuction(bids);
console.log('Advanced Result:', result2);

// Multi-round demo with budget manager
console.log('\n4. Multi-round simulation with AuctionManager (budget tracking)...');
const manager = new AuctionManager(JSON.parse(sampleJson));  // Init from sample
let round1 = manager.runRound(false);  // Basic
console.log('Round 1 (basic):', { winner: round1.winner, finalPrice: round1.finalPrice, remainingD: round1.remainingBudgets.adv4 });
let round2 = manager.runRound(true);  // Advanced
console.log('Round 2 (advanced):', { winner: round2.winner, finalPrice: round2.finalPrice, remainingD: round2.remainingBudgets.adv4 });

console.log('\nDemo completed successfully! Basic uses highest-bid rank + second-price payment; advanced uses quality-weighted rank + second-price.');
console.log('Winner now pays *next competitor\'s bid* (not own bid) per real ad auction systems. AuctionManager prevents budget-exhausted advertisers from future rounds. Backward-compatible where possible.');
