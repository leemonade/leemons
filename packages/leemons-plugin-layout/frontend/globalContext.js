import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LayoutContext, LayoutProvider } from './src/context/layout';

export function Provider({ children }) {
  const [state, setState] = useState({});

  return <LayoutProvider value={{ state, setState }}>{children}</LayoutProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LayoutContext;
