/**
 * Error Handler Utility
 * Centralized error management for the ad-auction library.
 * Makes debugging easier by standardizing error types and messages.
 */

/**
 * Custom error class for auction validation issues.
 */
class AuctionError extends Error {
  constructor(message, code = 'AUCTION_ERROR') {
    super(message);
    this.name = 'AuctionError';
    this.code = code;
  }
}

/**
 * Throws a standardized error with optional code.
 * @param {string} message - Error message
 * @param {string} [code] - Error code for categorization
 * @throws {AuctionError}
 */
function throwAuctionError(message, code = 'AUCTION_ERROR') {
  throw new AuctionError(message, code);
}

/**
 * Validates input and throws standardized errors.
 * Extracted for reusability and clean code in main logic files.
 * @param {any} input - The input to validate
 * @returns {object|array} Parsed/validated bids
 * @throws {AuctionError}
 */
function validateAuctionInput(input) {
  let bids;

  // Accept JSON string or object
  if (typeof input === 'string') {
    try {
      bids = JSON.parse(input);
    } catch (e) {
      throwAuctionError('Invalid JSON input', 'INVALID_JSON');
    }
  } else if (typeof input === 'object' && input !== null) {
    bids = input;
  } else {
    throwAuctionError('Input must be a JSON string or object', 'INVALID_INPUT_TYPE');
  }

  // Validate bids array
  if (!Array.isArray(bids) || bids.length === 0) {
    throwAuctionError('Bids must be a non-empty array', 'EMPTY_BIDS');
  }

  // Validate each bid
  bids.forEach((bid, index) => {
    if (!bid || typeof bid !== 'object') {
      throwAuctionError(`Invalid bid at index ${index}`, 'INVALID_BID_OBJECT');
    }
    if (typeof bid.id !== 'string' || bid.id.trim() === '') {
      throwAuctionError(`Bid at index ${index} missing valid id`, 'MISSING_ID');
    }
    if (typeof bid.name !== 'string' || bid.name.trim() === '') {
      throwAuctionError(`Bid at index ${index} missing valid name`, 'MISSING_NAME');
    }
    if (typeof bid.bidAmount !== 'number' || bid.bidAmount <= 0) {
      throwAuctionError(`Bid at index ${index} has invalid bidAmount (must be positive number)`, 'INVALID_BID_AMOUNT');
    }
  });

  return bids;
}

module.exports = {
  AuctionError,
  throwAuctionError,
  validateAuctionInput
};
