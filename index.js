/**
 * Ad Auction Simulation Library
 * Main entry point. Uses dedicated utilities for error handling and logic
 * to keep the index clean and modular. Every component has its own utility
 * file for better organization and debugging.
 */

const { runAuction, runAdvancedAuction } = require('./src/auction');
const { AuctionError } = require('./src/utils/errorHandler');
const { AuctionManager } = require('./src/utils/auctionManager');

module.exports = {
  runAuction,  // Original basic (highest bid) - unchanged
  runAdvancedAuction,  // New: uses qualityScore for real-world ranking (bid * quality)
  AuctionManager,  // Stateful multi-round manager with budget tracking
  AuctionError,  // Exported for users to catch specific errors
  // Future metrics (e.g., more utils) can be added here
};
