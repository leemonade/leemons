/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import { SquareRootIcon } from '@bubbles-ui/icons/outline';

const MathIcon = ({ height, width }) => <SquareRootIcon height={height} width={width} />;

MathIcon.defaultProps = {
  height: 24,
  width: 24,
};

MathIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export { MathIcon };
