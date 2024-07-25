import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ColorBallStyles } from './ColorBall.styles';

const ColorBall = ({ number, color }) => {
  const { classes } = ColorBallStyles({}, { name: 'ColorBall' });
  if (number <= 0) return null;
  return (
    <Box className={classes.ballsContainer}>
      {number === 1 && (
        <Box className={classes.roundedBall} style={{ backgroundColor: color[0] }}></Box>
      )}
      {number === 2 && (
        <Box className={classes.twoEvents}>
          <Box className={classes.roundedBall} style={{ backgroundColor: color[0] }}></Box>
          <Box className={classes.roundedBall2} style={{ backgroundColor: color[1] }}></Box>
        </Box>
      )}
      {number > 2 && (
        <Box className={classes.blackBall}>
          <span className={classes.eventCount}>{number}</span>
        </Box>
      )}
    </Box>
  );
};

export { ColorBall };

ColorBall.propTypes = {
  number: PropTypes.number.isRequired,
  color: PropTypes.array.isRequired,
};
