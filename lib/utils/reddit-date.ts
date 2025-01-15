import { formatDate } from './date';

// Dedicated function for Reddit date formatting
export function formatRedditDate(timestamp: number): string {
  return formatDate(timestamp);
}