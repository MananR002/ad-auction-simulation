# Ad Auction Simulation Library

A clean Node.js utility library for simulating ad auctions. Currently selects the winner based on the highest bid amount. Designed to be extensible for future metrics like click-through rate (CTR), ad quality score, etc.

## Features

- Accepts input as JSON string or JavaScript object array
- Validates bid data (id, name, positive bidAmount)
- Selects winner with highest bid (handles ties by selecting first occurrence)
- Returns winner name, bid amount, and winner ID
- Basic tests and demo included
- Clean, modular structure

## Installation

```bash
npm install
```

## Usage

```javascript
const { runAuction } = require('ad-auction-simulation');

// Input as object
const bids = [
  { id: 'adv1', name: 'Advertiser A', bidAmount: 100 },
  { id: 'adv2', name: 'Advertiser B', bidAmount: 150 }
];

const result = runAuction(bids);
console.log(result); // { winner: 'Advertiser B', bidAmount: 150, winnerId: 'adv2' }

// Or as JSON string
const jsonInput = JSON.stringify(bids);
const result2 = runAuction(jsonInput);
```

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

- Support for multiple metrics (e.g., weighted score: bid * qualityScore)
- Second-price auction
- Reserve prices
- A/B testing different strategies
- More validation and error handling

## License

MIT
