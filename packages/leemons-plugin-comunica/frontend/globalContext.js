import React from 'react';
import PropTypes from 'prop-types';
import ContextButton from '@comunica/components/ContextButton';

export function Provider({ children }) {
  console.log('eeeeehhhh');
  return (
    <>
      <ContextButton />
      {children}
    </>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};
