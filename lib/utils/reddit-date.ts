import { formatDate } from './date'

/**
 * Format a numeric timestamp in the "X days/hours/minutes ago" format
 * @param {number} timestamp - The timestamp to format
 * @returns {string} - The formatted date string
 */
export function formatRedditDate(timestamp: number): string {
  return formatDate(timestamp)
}
