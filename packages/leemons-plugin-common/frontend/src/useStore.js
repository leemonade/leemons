import { useEffect, useRef, useState } from 'react';

export function useStore(defaultValue = {}) {
  const ref = useRef({
    mounted: true,
    data: { ...defaultValue },
  });
  const [, setR] = useState();

  function render() {
    if (ref.current.mounted) {
      setR(new Date().getTime());
    }
  }

  useEffect(() => {
    ref.current.mounted = true;
    return () => {
      ref.current.mounted = false;
    };
  }, []);

  return [ref.current.data, render];
}
