/**
 * Returns the react-query configuration for the given type modification trend.
 *
 * This object will change how often the data is considered as stale
 *
 * @see The leemons react-query docs
 *
 * @typedef {number} TimeInMiliseconds
 * @typedef {import('../types').ModificationTrends} ModificationTrends
 *
 * @param {ModificationTrends} strategy - Which staleTime strategy you want to use
 * @returns {{ staleTime: TimeInMiliseconds }}
 */
export function modificationTrend(strategy) {
  switch (strategy) {
    case 'constantly':
      return { staleTime: 0 };
    case 'frequently':
      return { staleTime: 20000 };
    case 'standard':
      return { staleTime: 120000 };
    case 'lazy':
      return { staleTime: 300000 };
    case 'occasionally':
      return { staleTime: Infinity };
    default:
      throw new Error('The provided strategy is not valid');
  }
}

export default modificationTrend;
