import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';

export function Provider({ children }) {
  const [store] = useStore();

  return <>{children}</>;
}

Provider.propTypes = {
  children: PropTypes.node,
};
