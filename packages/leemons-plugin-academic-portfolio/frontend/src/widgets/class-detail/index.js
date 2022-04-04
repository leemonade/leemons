/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';

function ClassDetailWidget({ classe }) {
  console.log(classe);
  return <Box>Usuarios</Box>;
}

ClassDetailWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default ClassDetailWidget;
