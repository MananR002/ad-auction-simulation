/**
 * Ad Auction Utility Library
 * Simple winner selection based on highest bid (backward compatible).
 * Extended with advanced ranking using qualityScore for real-world scenarios.
 * Delegates validation/errors and bidding logic to dedicated utility files
 * for clean separation of concerns, easier debugging, and extensibility.
 */

const { validateAuctionInput } = require('./utils/errorHandler');
const { findHighestBidder, findHighestEffectiveScoreBidder } = require('./utils/auctionUtils');

/**
 * Runs an ad auction and selects the winner based on highest bid.
 * (Original implementation unchanged for backward compatibility.)
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number } (qualityScore optional)
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

/**
 * Runs an advanced ad auction selecting winner by effective score (bidAmount * qualityScore).
 * This extends basic functionality for real-world ranking (quality/relevance matters).
 * qualityScore is optional per-bid (defaults to 1.0 internally for compat).
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number, qualityScore?: number }
 * @returns {object} { winner: string (name), bidAmount: number, winnerId: string, effectiveScore: number }
 * @throws {AuctionError} if invalid input or no bids (from errorHandler utility)
 */
function runAdvancedAuction(input) {
  // Reuse validation (now supports qualityScore)
  const bids = validateAuctionInput(input);

  // Use extended auction utils for advanced scoring
  const winner = findHighestEffectiveScoreBidder(bids);

  // Compute and include effective score in output for transparency
  const quality = (typeof winner.qualityScore === 'number' && winner.qualityScore > 0) ? winner.qualityScore : 1.0;
  const effectiveScore = winner.bidAmount * quality;

  return {
    winner: winner.name,
    bidAmount: winner.bidAmount,
    winnerId: winner.id,
    effectiveScore,  // Added for advanced insight
    qualityScore: winner.qualityScore || 1.0
  };
}

module.exports = { runAuction, runAdvancedAuction };
