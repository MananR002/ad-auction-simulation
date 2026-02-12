/**
 * Small Demo for Ad Auction Library
 */

const { runAuction } = require('./index');
const fs = require('fs');
const path = require('path');

// Load sample data
const sampleDataPath = path.join(__dirname, 'data/sample-bids.json');
const sampleJson = fs.readFileSync(sampleDataPath, 'utf8');

console.log('=== Ad Auction Simulation Demo ===\n');

// Run auction with JSON string
console.log('Running auction with sample JSON input...');
const result = runAuction(sampleJson);
console.log('Auction Result:', result);

// Example with object input
console.log('\nRunning auction with direct object input...');
const bids = [
  { id: 'advX', name: 'TechCorp', bidAmount: 500 },
  { id: 'advY', name: 'AdVantage', bidAmount: 450 },
  { id: 'advZ', name: 'MarketPro', bidAmount: 600 }
];
const result2 = runAuction(bids);
console.log('Auction Result:', result2);

console.log('\nDemo completed successfully! The library selects the highest bidder.');
console.log('Ready for extension with more metrics like CTR, quality score, etc.');
