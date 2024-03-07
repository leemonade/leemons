import { isEqual } from 'lodash';
import { useRef } from 'react';

function cacheBody() {
  const cache = new Map();

  return (key, value) => {
    const prevValue = cache.get(key);

    if (isEqual(value, prevValue)) {
      return prevValue;
    }

    cache.set(key, value);

    return value;
  };
}

function useCache({ useHooks = true } = {}) {
  if (useHooks) {
    return useRef(cacheBody()).current;
  }

  return cacheBody();
}

export { useCache };
