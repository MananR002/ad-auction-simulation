/**
 * Event Logger Utility
 * Centralized observability for auction events/timeline.
 * Clean separation: manager delegates logging here.
 * Events include type, timestamp, round, and details for debugging/monitoring.
 */

class EventLogger {
  constructor() {
    this.events = [];  // Full timeline across rounds
  }

  /**
   * Log an event.
   * @param {string} type - e.g. 'ROUND_STARTED'
   * @param {object} details - Event-specific data
   * @param {number} round - Current round
   */
  log(type, details = {}, round = 0) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      round,
      ...details
    };
    this.events.push(event);
    return event;  // Return for immediate use if needed
  }

  /**
   * Get all events (full timeline).
   */
  getEvents() {
    return [...this.events];
  }

  /**
   * Get events for specific round.
   */
  getEventsForRound(round) {
    return this.events.filter(e => e.round === round);
  }

  /**
   * Clear events (for reset).
   */
  clear() {
    this.events = [];
  }
}

module.exports = { EventLogger };
