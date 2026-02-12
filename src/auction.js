/**
 * Ad Auction Utility Library
 * Simple winner selection based on highest bid.
 */

/**
 * Runs an ad auction and selects the winner based on highest bid.
 * @param {string|object} input - Input JSON string or object containing array of bids.
 * Each bid should have: { id: string, name: string, bidAmount: number }
 * @returns {object} { winner: string (name), bidAmount: number, winnerId: string }
 * @throws {Error} if invalid input or no bids
 */
function runAuction(input) {
  let bids;

  // Accept JSON string or object
  if (typeof input === 'string') {
    try {
      bids = JSON.parse(input);
    } catch (e) {
      throw new Error('Invalid JSON input');
    }
  } else if (typeof input === 'object' && input !== null) {
    bids = input;
  } else {
    throw new Error('Input must be a JSON string or object');
  }

  // Validate bids array
  if (!Array.isArray(bids) || bids.length === 0) {
    throw new Error('Bids must be a non-empty array');
  }

  // Validate each bid
  bids.forEach((bid, index) => {
    if (!bid || typeof bid !== 'object') {
      throw new Error(`Invalid bid at index ${index}`);
    }
    if (typeof bid.id !== 'string' || bid.id.trim() === '') {
      throw new Error(`Bid at index ${index} missing valid id`);
    }
    if (typeof bid.name !== 'string' || bid.name.trim() === '') {
      throw new Error(`Bid at index ${index} missing valid name`);
    }
    if (typeof bid.bidAmount !== 'number' || bid.bidAmount <= 0) {
      throw new Error(`Bid at index ${index} has invalid bidAmount (must be positive number)`);
    }
  });

  // Find winner with highest bid
  let winner = bids[0];
  for (let i = 1; i < bids.length; i++) {
    if (bids[i].bidAmount > winner.bidAmount) {
      winner = bids[i];
    }
  }

  return {
    winner: winner.name,
    bidAmount: winner.bidAmount,
    winnerId: winner.id
  };
}

module.exports = { runAuction };
