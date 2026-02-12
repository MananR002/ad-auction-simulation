/**
 * Auction Utils
 * Pure utility functions for auction logic, separate from error handling and main flow.
 * This separation makes the code modular, testable, and easier to debug/extend.
 */

/**
 * Finds the winner based on highest bidAmount.
 * Handles ties by selecting the first highest bidder encountered.
 * (Kept for backward compatibility with basic auction flow.)
 * @param {Array} bids - Validated array of bid objects
 * @returns {object} Winner bid object
 */
function findHighestBidder(bids) {
  if (!Array.isArray(bids) || bids.length === 0) {
    // Should not reach here if validation passed, but defensive
    throw new Error('No bids to evaluate');
  }

  let winner = bids[0];
  for (let i = 1; i < bids.length; i++) {
    if (bids[i].bidAmount > winner.bidAmount) {
      winner = bids[i];
    }
  }
  return winner;
}

/**
 * Finds the winner based on effective score (bidAmount * qualityScore).
 * This simulates real-world ad auction ranking (e.g., Google Ads style)
 * where quality/relevance influences final rank beyond raw bid.
 * qualityScore (if provided) validated to 0 < qs <= 1.0; defaults to 1.0 if missing.
 * Handles ties by selecting first highest.
 * @param {Array} bids - Validated array of bid objects (with optional qualityScore)
 * @returns {object} Winner bid object
 */
function findHighestEffectiveScoreBidder(bids) {
  if (!Array.isArray(bids) || bids.length === 0) {
    // Should not reach here if validation passed, but defensive
    throw new Error('No bids to evaluate');
  }

  // Compute effective score for each (bid * quality; default quality=1.0 for backward compat)
  // (validation already ensures 0 < quality <=1 if provided)
  const scoredBids = bids.map(bid => {
    const quality = (typeof bid.qualityScore === 'number' && bid.qualityScore > 0) ? bid.qualityScore : 1.0;
    return {
      ...bid,
      effectiveScore: bid.bidAmount * quality
    };
  });

  let winner = scoredBids[0];
  for (let i = 1; i < scoredBids.length; i++) {
    if (scoredBids[i].effectiveScore > winner.effectiveScore) {
      winner = scoredBids[i];
    }
  }
  return winner;  // Return original bid (without temp effectiveScore)
}

module.exports = {
  findHighestBidder,
  findHighestEffectiveScoreBidder
};
