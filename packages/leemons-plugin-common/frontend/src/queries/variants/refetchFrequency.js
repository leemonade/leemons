/**
 * Returns the react-query configuration for the given type refetch frequency.
 *
 * This object will change how often the data is refethed and if should be refethed
 * on internet reconnection or when the users focus the page
 *
 * @see The leemons react-query docs
 *
 * @typedef {number} TimeInMiliseconds
 * @typedef {import('../types').RefetchFrequencies} RefetchFrequencies
 *
 * @param {RefetchFrequencies} strategies - Which staleTime strategy you want to use
 *
 * @returns {{
 * refetchInterval: undefined | TimeInMiliseconds | boolean,
 * refetchOnReconnect: undefined | boolean,
 * refetchOnWindowFocus: undefined | boolean
 * }}
 */
export function refetchFrequency(strategies) {
  if (strategies.includes('none') && strategies.length > 1) {
    throw new Error('Strategy none is non compatible with the other ones');
  }

  const obj = {};

  strategies.forEach((strategy) => {
    switch (strategy?.strategy ?? strategy) {
      case 'automatically':
        if (typeof strategy === 'string' || typeof strategy.frequency !== 'number') {
          throw new Error('The automatically strategy must be an object with a frequency time');
        }

        obj.refetchInterval = strategy.frequency;
        break;
      case 'onReconnect':
        obj.refetchOnReconnect = strategy?.enabled === undefined ? true : !!strategy.enabled;
        break;
      case 'onFocus':
        obj.refetchOnWindowFocus = strategy?.enabled === undefined ? true : !!strategy.enabled;
        break;
      case 'none':
        obj.refetchInterval = false;
        obj.refetchOnReconnect = false;
        obj.refetchOnWindowFocus = false;
        break;
      default:
        throw new Error('The provided strategy is not valid');
    }
  });

  return obj;
}

export default refetchFrequency;
