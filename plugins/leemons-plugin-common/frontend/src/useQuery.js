import React from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => {
    const urlParams = new URLSearchParams(search);
    const query = {};
    const entries = urlParams.entries();
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      // eslint-disable-next-line prefer-destructuring
      query[entry[0]] = entry[1];
    }
    return query;
  }, [search]);
}

export { useQuery };
