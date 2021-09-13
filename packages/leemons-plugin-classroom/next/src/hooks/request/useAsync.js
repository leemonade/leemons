import { useState, useEffect, useRef } from 'react';

export default (f, ...args) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const request = useRef(() => {
    setLoading(true);
    try {
      f()
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
        });
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  });

  useEffect(() => {
    request.current();
  }, [...args]);

  return [data, setData, error, loading, request.current];
};
