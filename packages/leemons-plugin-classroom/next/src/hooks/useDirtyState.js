import { useState, useEffect } from 'react';

/**
 * If calculateDirtyOnUpdate option is true, the returned isDirty property will
 * be a state, else, it will be a function, both will evaluate to boolean
 */
export default function useDirtyState(_defaultValue, { calculateDirtyOnUpdate = false } = {}) {
  const [defaultValue, setDefaultValue] = useState(_defaultValue);
  const [value, setValue] = useState(_defaultValue);
  const [dirty, setDirty] = useState(false);

  const isDirty = () => {
    if (typeof value === 'object' && typeof defaultValue === 'object') {
      return JSON.stringify(value) !== JSON.stringify(defaultValue);
    }
    return value !== defaultValue;
  };

  useEffect(() => {
    if (calculateDirtyOnUpdate) {
      setDirty(isDirty());
    }
  }, [value, defaultValue]);

  return {
    value,
    setValue,
    defaultValue,
    setDefaultValue,
    isDirty: calculateDirtyOnUpdate ? dirty : isDirty,
  };
}
