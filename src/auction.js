/**
 * Ad Auction Utility Library
 * Simple winner selection based on highest bid (backward compatible).
 * Extended with advanced ranking using qualityScore for real-world scenarios.
 * Delegates validation/errors and bidding logic to dedicated utility files
 * for clean separation of concerns, easier debugging, and extensibility.
 */

const { validateAuctionInput } = require('./utils/errorHandler');
const { 
  findHighestBidder, 
  findHighestEffectiveScoreBidder, 
  findRunnerUp 
} = require('./utils/auctionUtils');

/**
 * Runs an ad auction and selects the winner based on highest bid.
 * Now uses second-price logic: winner pays the next highest competitor's bid
 * (common in real ad systems like Vickrey auctions; not their own bid).
 * (Backward compatible; finalPrice added to output.)
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number, budget?: number (positive, optional for multi-round) } (qualityScore optional, 0<qs<=1 if present)
 * @returns {object} { winner: string (name), bidAmount: number, winnerId: string, finalPrice: number }
 * @throws {AuctionError} if invalid input or no bids (from errorHandler utility)
 */
function runAuction(input) {
  // Use error handler utility for all validation (clean main logic)
  const bids = validateAuctionInput(input);

  // Use auction utils for core bidding logic
  const winner = findHighestBidder(bids);

  // Second-price: find runner-up by bidAmount, winner pays their bid (0 if solo)
  const runnerUp = findRunnerUp(bids, bid => bid.bidAmount);
  const finalPrice = runnerUp ? runnerUp.bidAmount : 0;

  return {
    winner: winner.name,
    bidAmount: winner.bidAmount,
    winnerId: winner.id,
    finalPrice  // What winner actually pays (second-highest bid)
  };
}

/**
 * Runs an advanced ad auction selecting winner by effective score (bidAmount * qualityScore).
 * This extends basic functionality for real-world ranking (quality/relevance matters).
 * Now also uses second-price logic: winner pays next highest competitor's bid
 * (not their own; common in GSP/Vickrey-style auctions).
 * qualityScore is optional per-bid (validated 0 < qs <= 1.0 if present; invalid qs bids are filtered/skipped so winner can be selected from valids).
 * Defaults to 1.0 internally for compat.
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number, qualityScore?: number (0<qs<=1 if present) }
 * @returns {object} { winner: string (name), bidAmount: number, winnerId: string, effectiveScore: number, finalPrice: number, qualityScore: number }
 * @throws {AuctionError} if invalid input or no bids (from errorHandler utility)
 */
function runAdvancedAuction(input) {
  // Reuse validation (now supports qualityScore)
  const bids = validateAuctionInput(input);

  // Use extended auction utils for advanced scoring
  const winner = findHighestEffectiveScoreBidder(bids);

  // Compute and include effective score in output for transparency
  // (quality already validated in errorHandler; use directly or default 1.0)
  const quality = winner.qualityScore || 1.0;
  const effectiveScore = winner.bidAmount * quality;

  // Second-price for advanced: runner-up by *effective score* ranking, but pay their raw bidAmount
  // (simple GSP variant; winner pays what next competitor bid)
  const effectiveScoreFn = bid => {
    const q = bid.qualityScore || 1.0;
    return bid.bidAmount * q;
  };
  const runnerUp = findRunnerUp(bids, effectiveScoreFn);
  const finalPrice = runnerUp ? runnerUp.bidAmount : 0;

  return {
    winner: winner.name,
    bidAmount: winner.bidAmount,
    winnerId: winner.id,
    effectiveScore,  // Added for advanced insight
    qualityScore: quality,
    finalPrice  // What winner actually pays (next competitor's bid)
  };
}

module.exports = { runAuction, runAdvancedAuction };
