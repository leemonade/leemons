import { useState, useEffect, useRef } from 'react';

export default (f, ...args) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const refArgs = useRef(args);
  const requestId = useRef(null);

  const request = useRef(() => {
    const id = new Date().getTime();
    requestId.current = id;

    const _args = refArgs.current;
    setLoading(true);
    f(..._args)
      .then((res) => {
        if (requestId.current !== null && id >= requestId.current) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (requestId.current !== null && id >= requestId.current) {
          setLoading(false);
          setError(e);
        }
      })
      .finally(() => {
        if (requestId.current !== null && id >= requestId.current) {
          requestId.current = null;
        }
      });
  });

  useEffect(() => {
    refArgs.current = args;
    request.current();
  }, [...args]);

  return [data, setData, error, loading, request.current];
};
