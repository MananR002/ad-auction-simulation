const { runAuction, runAdvancedAuction } = require('../index');  // Import from main index for full library API
const { AuctionError } = require('../src/utils/errorHandler');
const fs = require('fs');
const path = require('path');

// Sample bids updated to include qualityScore (for advanced tests; backward compat preserved)
const sampleBids = [
  {
    "id": "adv1",
    "name": "Advertiser A",
    "bidAmount": 100,
    "qualityScore": 0.8
  },
  {
    "id": "adv2",
    "name": "Advertiser B",
    "bidAmount": 150,
    "qualityScore": 0.9
  },
  {
    "id": "adv3",
    "name": "Advertiser C",
    "bidAmount": 120,
    "qualityScore": 1.0
  },
  {
    "id": "adv4",
    "name": "Advertiser D",
    "bidAmount": 200,
    "qualityScore": 0.7
  }
];

describe('Ad Auction Utility', () => {
  test('should select the highest bidder as winner from object input', () => {
    const result = runAuction(sampleBids);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
    expect(result.winnerId).toBe('adv4');
    expect(result.finalPrice).toBe(150);  // Second-highest bid (second-price logic)
  });

  test('should accept JSON string input and select winner', () => {
    const jsonInput = JSON.stringify(sampleBids);
    const result = runAuction(jsonInput);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
    expect(result.finalPrice).toBe(150);
  });

  test('should throw AuctionError for empty bids array', () => {
    expect(() => runAuction([])).toThrow(AuctionError);
    expect(() => runAuction([])).toThrow('Bids must be a non-empty array');
  });

  test('should throw AuctionError for invalid JSON', () => {
    expect(() => runAuction('invalid json')).toThrow(AuctionError);
    expect(() => runAuction('invalid json')).toThrow('Invalid JSON input');
  });

  test('should throw AuctionError for invalid bid data', () => {
    const invalidBids = [{ id: 'adv1', name: 'A', bidAmount: -10 }];
    expect(() => runAuction(invalidBids)).toThrow(AuctionError);
    expect(() => runAuction(invalidBids)).toThrow('has invalid bidAmount');
  });

  test('should handle tie by selecting first highest', () => {
    const tieBids = [
      { id: 'adv1', name: 'A', bidAmount: 100 },
      { id: 'adv2', name: 'B', bidAmount: 100 },
      { id: 'adv3', name: 'C', bidAmount: 100 }
    ];
    const result = runAuction(tieBids);
    expect(result.winner).toBe('A');
    expect(result.bidAmount).toBe(100);
    expect(result.finalPrice).toBe(100);  // Second is also 100
  });

  // Test with sample data file
  test('should work with sample dataset from file', () => {
    const filePath = path.join(__dirname, '../data/sample-bids.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const result = runAuction(fileContent);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
    expect(result.finalPrice).toBe(150);  // Second-highest bid
  });

  // Advanced auction tests (new functionality)
  test('should select winner by highest effective score (bid * qualityScore) in advanced mode', () => {
    // In sample: A=80, B=135, C=120, D=140 -> D wins (140)
    // Second by effective is B (135), so finalPrice = B's bid=150
    const result = runAdvancedAuction(sampleBids);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
    expect(result.effectiveScore).toBe(140);  // 200 * 0.7
    expect(result.qualityScore).toBe(0.7);
    expect(result.finalPrice).toBe(150);  // Second competitor's bid (second-price)
  });

  test('should accept JSON string in advanced auction', () => {
    const jsonInput = JSON.stringify(sampleBids);
    const result = runAdvancedAuction(jsonInput);
    expect(result.winner).toBe('Advertiser D');
    expect(result.effectiveScore).toBe(140);
    expect(result.finalPrice).toBe(150);
  });

  test('should throw AuctionError for invalid qualityScore in advanced mode', () => {
    const invalidBids = [{ id: 'adv1', name: 'A', bidAmount: 100, qualityScore: -0.5 }];
    expect(() => runAdvancedAuction(invalidBids)).toThrow(AuctionError);
    expect(() => runAdvancedAuction(invalidBids)).toThrow('invalid qualityScore');
  });

  test('should throw AuctionError for qualityScore >1 in advanced mode', () => {
    // Tightened range validation: must be 0 < qs <=1
    const invalidHighBids = [{ id: 'adv1', name: 'A', bidAmount: 100, qualityScore: 1.5 }];
    expect(() => runAdvancedAuction(invalidHighBids)).toThrow(AuctionError);
    expect(() => runAdvancedAuction(invalidHighBids)).toThrow('invalid qualityScore');
  });

  // Specific test case requested: 4 bidders with mixed qualityScores (2 >1 invalid, 2 valid 0-1)
  // Now filters to valids only (A/C), selects winner among them (C by effective score=108), no throw
  test('should select winner from valid bidders only in mixed qualityScores (some >1) with 4 bidders', () => {
    const mixedBids = [
      { id: 'adv1', name: 'Advertiser A', bidAmount: 100, qualityScore: 0.8 },  // valid, effective=80
      { id: 'adv2', name: 'Advertiser B', bidAmount: 150, qualityScore: 1.2 },  // >1 invalid -> filtered
      { id: 'adv3', name: 'Advertiser C', bidAmount: 120, qualityScore: 0.9 },  // valid, effective=108
      { id: 'adv4', name: 'Advertiser D', bidAmount: 200, qualityScore: 1.5 }   // >1 invalid -> filtered
    ];
    const result = runAdvancedAuction(mixedBids);
    expect(result.winner).toBe('Advertiser C');  // Highest effective among valids
    expect(result.bidAmount).toBe(120);
    expect(result.effectiveScore).toBe(108);  // 120 * 0.9
    expect(result.finalPrice).toBe(100);  // Second valid's bid (A)
    expect(result.qualityScore).toBe(0.9);
  });

  test('should default qualityScore to 1.0 in advanced mode for backward compat', () => {
    const noQualityBids = [
      { id: 'adv1', name: 'A', bidAmount: 100 },
      { id: 'adv2', name: 'B', bidAmount: 90 }
    ];
    const result = runAdvancedAuction(noQualityBids);
    expect(result.winner).toBe('A');
    expect(result.effectiveScore).toBe(100);  // bid * 1.0
    expect(result.finalPrice).toBe(90);  // Second competitor's bid
  });

  test('should handle ties in advanced effective score by selecting first', () => {
    const tieBids = [
      { id: 'adv1', name: 'A', bidAmount: 100, qualityScore: 1.0 },
      { id: 'adv2', name: 'B', bidAmount: 100, qualityScore: 1.0 }  // effective=100 (tie)
    ];
    const result = runAdvancedAuction(tieBids);
    expect(result.winner).toBe('A');
    expect(result.effectiveScore).toBe(100);
    expect(result.finalPrice).toBe(100);  // Second's bid
  });
});
