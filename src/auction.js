/**
 * Ad Auction Utility Library
 * Simple winner selection based on highest bid.
 * Delegates validation/errors and bidding logic to dedicated utility files
 * for clean separation of concerns, easier debugging, and extensibility.
 */

const { validateAuctionInput } = require('./utils/errorHandler');
const { findHighestBidder } = require('./utils/auctionUtils');

/**
 * Runs an ad auction and selects the winner based on highest bid.
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number }
 * @returns {object} { winner: string (name), bidAmount: number, winnerId: string }
 * @throws {AuctionError} if invalid input or no bids (from errorHandler utility)
 */
function runAuction(input) {
  // Use error handler utility for all validation (clean main logic)
  const bids = validateAuctionInput(input);

  // Use auction utils for core bidding logic
  const winner = findHighestBidder(bids);

  return {
    winner: winner.name,
    bidAmount: winner.bidAmount,
    winnerId: winner.id
  };
}

module.exports = { runAuction };
