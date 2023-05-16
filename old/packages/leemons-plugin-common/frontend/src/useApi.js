import { useEffect, useState, useCallback } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useApi(uri, options) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const [seed, setSeed] = useState(new Date().getTime());

  // EN: Function to re-fetch data
  // ES: Función para re-consultar datos
  const refresh = useCallback(() => {
    setSeed(new Date().getTime());
  }, []);

  // EN: Function to fetch data
  // ES: Función para consultar datos
  useEffect(() => {
    let isActive = true;
    const func = typeof uri === 'function' ? () => uri(options) : () => leemons.api(uri, options);

    if (loading !== true) {
      setLoading(true);
    }

    let result;
    try {
      result = func();
    } catch (e) {
      result = e;
    }

    if (!result.then) {
      result = Promise.resolve(result);
    }

    result
      .then((d) => {
        if (isActive) {
          setData(d);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err);
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [uri, options, seed]);

  return [data, error, loading, refresh];
}
