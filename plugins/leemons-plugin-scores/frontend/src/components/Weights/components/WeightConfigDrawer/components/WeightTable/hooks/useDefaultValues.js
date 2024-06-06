import { useMemo } from 'react';

import { forEach, set } from 'lodash';

export default function useDefaultValues(data) {
  return useMemo(() => {
    const result = {
      data: data.weights,
      applySameValue: data.applySameValue ?? true,
      weights: {},
    };

    forEach(data.weights, ({ id, weight, isLocked }) => {
      set(result, `weights.${id}`, { weight: weight ?? 0, isLocked: !!isLocked });
    });

    return result;
  }, [data]);
}
