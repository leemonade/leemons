import React from 'react';
import { useLocation } from 'react-router-dom';

export function useSearchParams() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
