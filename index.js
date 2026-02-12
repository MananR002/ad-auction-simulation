/**
 * Ad Auction Simulation Library
 * Main entry point. Uses dedicated utilities for error handling and logic
 * to keep the index clean and modular. Every component has its own utility
 * file for better organization and debugging.
 */

const { runAuction } = require('./src/auction');
const { AuctionError } = require('./src/utils/errorHandler');

module.exports = {
  runAuction,
  AuctionError,  // Exported for users to catch specific errors
  // Future metrics (e.g., calculateScore utility) can be added here
};
