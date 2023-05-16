/**
 * Returns the react-query configuration for the given caching strategy.
 *
 * This object will change how often the cache is garbageCollecten when it's not used.
 *
 * @see The leemons react-query docs
 *
 * @typedef {import('../types').TimeInMiliseconds} TimeInMiliseconds
 * @typedef {import('../types').CachingStrategies} CachingStrategies
 *
 * @param {CachingStrategies} strategy - Which caching strategy should be used
 *
 * @returns {{ cacheTime: TimeInMiliseconds }}
 */
export function cachingStrategy(strategy) {
  switch (strategy) {
    case 'cacheable':
      return { cacheTime: 300000 };
    case 'non-cacheable':
      return { cacheTime: 0 };
    default:
      throw new Error('The provided strategy is not valid');
  }
}

export default cachingStrategy;
