import { useContext } from 'react';
import CommonContext from './common';

// eslint-disable-next-line import/prefer-default-export
export function useCommon() {
  const context = useContext(CommonContext);

  if (!context) {
    throw new Error('CommonProvider was not found in tree');
  }

  return context;
}
