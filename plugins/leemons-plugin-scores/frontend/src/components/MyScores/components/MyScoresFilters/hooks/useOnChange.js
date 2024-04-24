import { useEffect } from 'react';

import { useWatch } from 'react-hook-form';

export default function useOnChange({ control, onChange }) {
  const values = useWatch({ control });

  useEffect(() => {
    onChange(values);
  }, [onChange, values]);
}
