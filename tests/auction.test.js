const { runAuction } = require('../index');  // Import from main index for full library API
const { AuctionError } = require('../src/utils/errorHandler');
const fs = require('fs');
const path = require('path');

const sampleBids = [
  {
    "id": "adv1",
    "name": "Advertiser A",
    "bidAmount": 100
  },
  {
    "id": "adv2",
    "name": "Advertiser B",
    "bidAmount": 150
  },
  {
    "id": "adv3",
    "name": "Advertiser C",
    "bidAmount": 120
  },
  {
    "id": "adv4",
    "name": "Advertiser D",
    "bidAmount": 200
  }
];

describe('Ad Auction Utility', () => {
  test('should select the highest bidder as winner from object input', () => {
    const result = runAuction(sampleBids);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
    expect(result.winnerId).toBe('adv4');
  });

  test('should accept JSON string input and select winner', () => {
    const jsonInput = JSON.stringify(sampleBids);
    const result = runAuction(jsonInput);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
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
  });

  // Test with sample data file
  test('should work with sample dataset from file', () => {
    const filePath = path.join(__dirname, '../data/sample-bids.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const result = runAuction(fileContent);
    expect(result.winner).toBe('Advertiser D');
    expect(result.bidAmount).toBe(200);
  });
});
