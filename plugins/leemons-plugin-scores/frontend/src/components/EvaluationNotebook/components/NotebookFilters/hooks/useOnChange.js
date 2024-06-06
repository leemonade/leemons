import { useEffect, useRef } from 'react';

import { useWatch } from 'react-hook-form';
import { noop } from 'lodash';

export default function useOnChange({ onChange = noop, control }) {
  const isFirstRender = useRef(true);
  const values = useWatch({ control });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onChange(values);
  }, [values, onChange]);
}
