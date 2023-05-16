import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useStore(defaultValue = {}) {
  const ref = useRef({
    mounted: true,
    data: { ...defaultValue },
  });
  const [, setR] = useState();

  function render() {
    if (ref.current.mounted) {
      setR(new Date().getTime() + Math.floor(Math.random() * 1000000 + 1));
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
