/**
 * Small Demo for Ad Auction Library
 * Now includes basic + advanced (qualityScore-influenced) auction modes.
 */

const { runAuction, runAdvancedAuction } = require('./index');
const fs = require('fs');
const path = require('path');

// Load sample data (now includes qualityScore)
const sampleDataPath = path.join(__dirname, 'data/sample-bids.json');
const sampleJson = fs.readFileSync(sampleDataPath, 'utf8');

console.log('=== Ad Auction Simulation Demo ===\n');

// Run basic auction with JSON string (unchanged)
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

console.log('\nDemo completed successfully! Basic mode uses highest bid; advanced incorporates qualityScore for realistic ranking.');
console.log('Implementation remains backward-compatible. Ready for more metrics (e.g., CTR weighting).');
