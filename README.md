# Ad Auction Simulation Library

A clean Node.js utility library for simulating ad auctions with real-world features (highest-bid, quality-weighted ranking, second-price payments, budget tracking, multi-round, observability events, filtering).

## Assumptions & Input Validation
- Input: Valid JSON string or object array of bids `{id, name, bidAmount (>0), qualityScore? (0 < qs <=1), budget? (>0)}`
- Invalid qs/budget bids are filtered/skipped (winner from valids if any; throw if none)
- Core fields (id/name/bid) must be valid or throw
- Second-price: Winner pays next competitor's bid (not own)
- Budgets: Tracked across rounds; filter active (remaining >0); disqualify+rerun if unaffordable finalPrice
- Events: Full timeline per round for observability/debug
- Backward compatible with basic single-run

## Features
- Accepts input as JSON string or JS object array
- Validates/filters bid data (positive bidAmount; optional qs/budget)
- Selects winner: highest bid (basic) or bid*quality effective score (advanced)
- **Second-price**: Winner pays next highest competitor's bid
- **Budget tracking & multi-round**: `AuctionManager` exhausts budgets, skips depleted, disqualifies+reruns unaffordable
- **Observability**: Event timeline (ROUND_STARTED, BIDDERS_FILTERED, DISQUALIFIED, etc. with timestamps/details)
- Handles edges (ties, mixed invalid, exhaustion, no active)
- Basic tests, full demos, modular utilities, backward compatibility
- Clean structure for extensibility (future metrics like CTR)

## Installation

```bash
npm install
```

## Usage

```javascript
const { runAuction, runAdvancedAuction, AuctionManager } = require('ad-auction-simulation');

// Basic: highest bid + second-price
const bids = [
  { id: 'adv1', name: 'Advertiser A', bidAmount: 100, qualityScore: 0.9, budget: 500 },  // qs/budget optional
  { id: 'adv2', name: 'Advertiser B', bidAmount: 150 }
];
const basicResult = runAuction(bids);
console.log(basicResult);  // {..., finalPrice: ... }

// Advanced + events
const advResult = runAdvancedAuction(bids);
console.log(advResult);  // Includes effectiveScore, finalPrice

// Multi-round with budgets + observability
const manager = new AuctionManager(bids);
const roundRes = manager.runRound(true);  // Advanced
console.log(roundRes.events);  // Full timeline array
```

**Note**: Backward compatible (extended outputs). Sample includes qs/budget. Filters invalid, second-price payment, budget exhaustion with disqualify+rerun, full events for observability. See demos/ for all scenarios.

## Sample Dataset

See `data/sample-bids.json` for example advertisers with bids.

## Running Demos

```bash
npm run demo          # Basic demo
node demos/full-demo.js  # Full scenarios + events timeline
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
│       ├── errorHandler.js  # Centralized error handling & input validation (now filters invalid qs/budgets)
│       ├── auctionUtils.js  # Pure bidding logic (e.g., winner selection, runner-up)
│       └── auctionManager.js  # Stateful multi-round + budget tracking
├── data/
│   └── sample-bids.json     # Sample dataset
├── tests/
│   └── auction.test.js      # Test cases (covers errors too)
├── demo.js                  # Basic demo
├── demos/
│   └── full-demo.js         # Comprehensive demo (all features + events)
├── package.json
└── README.md
```

## Future Enhancements

- Reserve prices
- A/B testing strategies
- Multi-metric scoring (e.g., CTR + relevance weighting)
- Advanced GSP payment formulas
- Integration with real ad platforms
- More observability/metrics

## License

MIT
