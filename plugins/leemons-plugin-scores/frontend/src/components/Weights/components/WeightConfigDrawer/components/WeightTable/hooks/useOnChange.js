import { useEffect } from 'react';

import { useWatch } from 'react-hook-form';
import { noop } from 'lodash';

export default function useOnChange({ control }, onChange = noop) {
  const [values, data, applySameValue] = useWatch({
    control,
    name: ['weights', 'data', 'applySameValue'],
  });

  useEffect(() => {
    const weightData = data.map((dataItem) => {
      const weight = values[dataItem.id];

      if (!weight) {
        return dataItem;
      }

      return {
        id: dataItem.id,
        weight: weight.weight,
        isLocked: !!weight.isLocked,
      };
    });

    onChange({ weight: weightData, applySameValue: !!applySameValue });
  }, [values, applySameValue, onChange, data]);
}
