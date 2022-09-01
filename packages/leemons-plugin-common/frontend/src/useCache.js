import { isEqual } from 'lodash';
import { useRef } from 'react';

function useCache({ useHooks = true } = {}) {
  if (useHooks) {
    return useRef(useCache({ useHooks: false })).current;
  }
  let prevValue = null;

  return (newValue) => {
    if (isEqual(newValue, prevValue)) {
      return prevValue;
    }

    prevValue = newValue;
    return newValue;
  };
}

export { useCache };
