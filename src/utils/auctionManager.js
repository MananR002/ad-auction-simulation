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

    // Get current *active* bids: remainingBudget > 0 (allows participation; rerun/disqualify handles if can't afford finalPrice post-auction)
    // This enables real-system fallback (disqualify + rerun if unaffordable).
    const activeBids = this.initialBids.filter(bid => {
      const remaining = this.remainingBudgets[bid.id];
      return remaining !== undefined && remaining > 0;
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

    // Run auction on active only (re-uses existing logic/validation).
    // If winner can't afford finalPrice (real-system case), disqualify them (set budget=0) and *rerun* (re-filter active).
    // Loop with safety limit to avoid infinite if all can't afford.
    let result;
    let rerunCount = 0;
    const maxReruns = 5;  // Prevent infinite loop in edge cases (all bidders can't afford)
    let currentActive = [...activeBids];  // Copy for potential re-filter in reruns
    do {
      // Run on current active
      result = auctionFn(currentActive);
      const winnerId = result.winnerId;
      const currentRemaining = this.remainingBudgets[winnerId];

      if (result.finalPrice <= currentRemaining) {
        // Can afford: deduct and done
        this.remainingBudgets[winnerId] = currentRemaining - result.finalPrice;
        break;
      } else {
        // Can't afford: disqualify (set 0), rerun among remaining active
        this.remainingBudgets[winnerId] = 0;
        rerunCount++;
        // Re-filter active (exclude now-disqualified)
        currentActive = currentActive.filter(bid => {
          const rem = this.remainingBudgets[bid.id];
          return rem !== undefined && rem >= bid.bidAmount;
        });
      }
    } while (rerunCount < maxReruns && currentActive.length > 0);

    if (rerunCount >= maxReruns || currentActive.length === 0) {
      // Fallback if too many reruns or no active left
      return {
        round: this.round,
        message: 'Max reruns reached or no affordable bidders left',
        winner: null,
        finalPrice: 0,
        remainingBudgets: { ...this.remainingBudgets },
        activeBiddersCount: activeBids.length
      };
    }

    return {
      round: this.round,
      ...result,
      remainingBudgets: { ...this.remainingBudgets },
      activeBiddersCount: activeBids.length,
      reruns: rerunCount  // For debug/insight
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
