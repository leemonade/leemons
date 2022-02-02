import { useContext } from 'react';
import { LayoutContext } from './layout';

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('LayoutProvider was not found in tree');
  }

  return context;
}
