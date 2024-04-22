import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { noop } from 'lodash';

export default function useOnChange({ onChange = noop, control }) {
  const values = useWatch({ control });

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
}
