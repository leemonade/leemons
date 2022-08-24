import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { Box, createStyles } from '@bubbles-ui/components';

const useStyle = createStyles((theme, { colors, withBorder, rotate, isSquare }) => ({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: 23,
    height: 23,
    borderRadius: isSquare ? '4px' : '50%',
    border: withBorder && !isSquare ? `1px solid ${theme.colors.ui01}` : 'none',
    backgroundColor: isString(colors) ? colors : colors[0],
    overflow: 'hidden',
    position: 'relative',
    transform: `rotate(${rotate}deg)`,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      width: '100%',
      height: '100%',
      zIndex: 1,
      backgroundColor: isString(colors) ? colors : colors[1],
    },
  },
  square: {
    position: 'absolute',
    height: 8,
    width: 8,
    borderColor: 'black',
    zIndex: 1,
  },
  square1: {
    borderTop: '2px solid',
    borderLeft: '2px solid',
    top: 0,
    left: 0,
    borderTopLeftRadius: 4,
  },
  square2: {
    borderTop: '2px solid',
    borderRight: '2px solid',
    top: 0,
    right: 0,
    borderTopRightRadius: 4,
  },
  square3: {
    borderBottom: '2px solid',
    borderLeft: '2px solid',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 4,
  },
  square4: {
    borderBottom: '2px solid',
    borderRight: '2px solid',
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 4,
  },
}));

export default function ColorBall({ colors, withBorder, rotate = 0, isSquare, ...props }) {
  const { classes, cx } = useStyle({ colors, withBorder, rotate, isSquare });

  return (
    <Box {...props} className={classes.root}>
      {withBorder && isSquare ? (
        <>
          <Box className={cx(classes.square, classes.square1)} />
          <Box className={cx(classes.square, classes.square2)} />
          <Box className={cx(classes.square, classes.square3)} />
          <Box className={cx(classes.square, classes.square4)} />
        </>
      ) : null}
    </Box>
  );
}

ColorBall.propTypes = {
  colors: PropTypes.any,
  withBorder: PropTypes.bool,
  rotate: PropTypes.number,
  isSquare: PropTypes.bool,
};
