import { useContext } from 'react';
import { LayoutContext } from './layout';

// eslint-disable-next-line import/prefer-default-export
export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('LayoutProvider was not found in tree');
  }

  return context;
}
