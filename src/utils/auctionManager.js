/**
 * Auction Manager Utility
 * Stateful manager for multi-round auctions with budget tracking.
 * Prevents exhausted advertisers (remainingBudget <= 0) from participating.
 * Tracks remainingBudget per advertiser (by id) across rounds.
 * Supports both basic and advanced auction modes.
 * This enables simulation of real campaigns with budget limits.
 */

const { validateAuctionInput } = require('./errorHandler');
const { runAuction, runAdvancedAuction } = require('../auction');  // Note: relative from utils

class AuctionManager {
  /**
   * Initialize with list of advertisers (bids with budget).
   * @param {Array} initialBids - Array of bid objects including budget
   */
  constructor(initialBids) {
    this.initialBids = [...initialBids];  // Copy
    // Track remaining budget by id (init from budget field)
    this.remainingBudgets = {};
    initialBids.forEach(bid => {
      if (bid.budget !== undefined) {
        this.remainingBudgets[bid.id] = bid.budget;
      }
    });
    this.round = 0;
  }

  /**
   * Runs one auction round: filters active (remainingBudget >= bidAmount) bidders, selects winner, deducts finalPrice.
   * Prevents overspend and exhausted bidders from participating.
   * @param {boolean} useAdvanced - If true, uses quality-weighted ranking
   * @returns {object} Auction result + round info + updated budgets
   */
  runRound(useAdvanced = false) {
    this.round++;
    const auctionFn = useAdvanced ? runAdvancedAuction : runAuction;

    // Get current *active* bids: remainingBudget >= bidAmount (prevents participation if can't cover potential finalPrice)
    // This addresses overspend and ensures real-system feasibility (filter before auction).
    const activeBids = this.initialBids.filter(bid => {
      const remaining = this.remainingBudgets[bid.id];
      return remaining !== undefined && remaining >= bid.bidAmount;
    });

    if (activeBids.length === 0) {
      return {
        round: this.round,
        message: 'No active bidders with sufficient remaining budget',
        winner: null,
        finalPrice: 0,
        remainingBudgets: { ...this.remainingBudgets }
      };
    }

    // Run auction on active only (re-uses existing logic/validation)
    const result = auctionFn(activeBids);

    // Deduct finalPrice from winner's remaining budget
    // Validate finalPrice <= remaining to prevent overspend (clamp if somehow exceeds, e.g., edge case)
    const winnerId = result.winnerId;
    if (this.remainingBudgets[winnerId] !== undefined) {
      const currentRemaining = this.remainingBudgets[winnerId];
      if (result.finalPrice > currentRemaining) {
        this.remainingBudgets[winnerId] = 0;  // Prevent overspend
      } else {
        this.remainingBudgets[winnerId] = currentRemaining - result.finalPrice;
      }
    }

    return {
      round: this.round,
      ...result,
      remainingBudgets: { ...this.remainingBudgets },
      activeBiddersCount: activeBids.length
    };
  }

  /**
   * Reset budgets to initial for new simulation.
   */
  reset() {
    this.initialBids.forEach(bid => {
      if (bid.budget !== undefined) {
        this.remainingBudgets[bid.id] = bid.budget;
      }
    });
    this.round = 0;
  }

  /**
   * Get current remaining budgets.
   */
  getRemainingBudgets() {
    return { ...this.remainingBudgets };
  }
}

module.exports = { AuctionManager };
