/**
 * Auction Utils
 * Pure utility functions for auction logic, separate from error handling and main flow.
 * This separation makes the code modular, testable, and easier to debug/extend.
 */

/**
 * Finds the winner based on highest bidAmount.
 * Handles ties by selecting the first highest bidder encountered.
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

module.exports = {
  findHighestBidder
};
