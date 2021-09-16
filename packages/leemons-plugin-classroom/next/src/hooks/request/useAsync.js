import { useState, useEffect, useRef } from 'react';

export default (f, ...args) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const request = (_args) => {
    setLoading(true);
    try {
      console.log('Updating with args', _args);
      f(..._args)
        .then((res) => {
          console.log('response:', res);
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
  };

  const argsRef = useRef(args);
  argsRef.current = args;

  useEffect(() => {
    console.log('Should update "useEffect"');
    request(args);
  }, [...args]);

  return [data, setData, error, loading, () => request(args)];
};
