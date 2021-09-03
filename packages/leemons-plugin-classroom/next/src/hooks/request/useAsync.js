import { useState, useEffect } from 'react';

export default (f, ...args) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      f().then((res) => {
        setData(res);
        setLoading(false);
      });
    } catch (e) {
      setError(e);
    }
  }, [...args]);

  return [data, setData, error, loading];
};
