import { useEffect } from 'react';

import { useWatch } from 'react-hook-form';

import applySameValue from '../helpers/applySameValue';
import areValuesDifferent from '../helpers/areValuesDifferent';

export default function useApplySameValue({ control, setValue, getValues }) {
  const items = useWatch({ control, name: 'weights' });
  const isApplySameValueActive = !!useWatch({ control, name: 'applySameValue' });

  useEffect(() => {
    if (isApplySameValueActive) {
      applySameValue({ getValues, setValue });
    }
  }, [isApplySameValueActive, getValues, setValue]);

  useEffect(() => {
    if (isApplySameValueActive && areValuesDifferent({ getValues, excludeLocked: true })) {
      setValue('applySameValue', false);
    }
  }, [items, getValues, setValue, isApplySameValueActive]);
}
