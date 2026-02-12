# Ad Auction Simulation Library

A clean Node.js utility library for simulating ad auctions. Currently selects the winner based on the highest bid amount. Designed to be extensible for future metrics like click-through rate (CTR), ad quality score, etc.

## Features

- Accepts input as JSON string or JavaScript object array
- Validates bid data (id, name, positive bidAmount; qualityScore 0<qs<=1 if present)
- Selects winner with highest bid (basic) or quality-weighted effective score (advanced)
- **Second-price auction**: Winner pays *next highest competitor's bid* (not own bid) for realism
- Returns winner details + `finalPrice` (second-price payment)
- Basic tests, demo, and full backward compatibility
- Clean, modular structure

## Installation

```bash
npm install
```

## Usage

```javascript
const { runAuction, runAdvancedAuction } = require('ad-auction-simulation');

// Basic (unchanged): highest bid wins
const bids = [
  { id: 'adv1', name: 'Advertiser A', bidAmount: 100, qualityScore: 0.9 },  // quality optional; 0 < qs <=1 if provided
  { id: 'adv2', name: 'Advertiser B', bidAmount: 150 }
];

const basicResult = runAuction(bids);
console.log(basicResult); // Includes finalPrice (second-highest bid)

// Advanced: real-world ranking with qualityScore influence (bid * qualityScore) + second-price
const advResult = runAdvancedAuction(bids);
console.log(advResult); // Includes effectiveScore + finalPrice
```

**Note**: Backward compatible (original outputs extended with `finalPrice`); basic ignores qualityScore. Sample includes it. Second-price makes winner pay competitor's bid.

## Sample Dataset

See `data/sample-bids.json` for example advertisers with bids.

## Running Demo

```bash
npm run demo
```

## Running Tests

```bash
npm test
```

## Project Structure

```
ad-auction-simulation/
├── index.js                 # Main library export (re-exports utilities/errors)
├── src/
│   ├── auction.js           # Core auction runner (thin, delegates to utils)
│   └── utils/
│       ├── errorHandler.js  # Centralized error handling & input validation
│       └── auctionUtils.js  # Pure bidding logic (e.g., winner selection)
├── data/
│   └── sample-bids.json     # Sample dataset
├── tests/
│   └── auction.test.js      # Test cases (covers errors too)
├── demo.js                  # Demo script
├── package.json
└── README.md
```

## Future Enhancements

- **Implemented**: Quality score weighting in `runAdvancedAuction` (bid * qualityScore for realistic ranking)
- Second-price auction
- Reserve prices
- A/B testing different strategies
- Multi-metric scoring (e.g., combine CTR, relevance)
- More validation and error handling

## License

MIT
