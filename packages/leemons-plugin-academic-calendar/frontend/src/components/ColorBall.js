import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { Box, createStyles } from '@bubbles-ui/components';

const useStyle = createStyles((theme, { colors, withBorder, rotate, isSquare, withArrow }) => ({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: withArrow ? 18 : 23,
    height: 23,
    minWidth: 24,
    minHeight: 24,
    borderRadius: isSquare ? '4px' : '50%',
    border:
      (withBorder && !isSquare) || withArrow
        ? `1px solid ${withArrow ? 'black' : theme.colors.ui01}`
        : 'none',
    borderTopRightRadius: withArrow && 0,
    borderBottomRightRadius: withArrow && 0,
    borderRight: withArrow && 'none',
    marginRight: withArrow && '21px !important',
    backgroundColor: isString(colors) ? colors : colors[0],
    overflow: !withArrow && 'hidden',
    position: 'relative',
    transform: `rotate(${rotate}deg)`,
    '&:before': isString(colors)
      ? {}
      : {
          content: '""',
          position: 'absolute',
          top: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: colors[1],
        },
  },
  rightArrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    bottom: -1,
    right: -4,
    // backgroundColor: 'red',
    borderStyle: 'solid',
    borderWidth: '11.5px 0 11.5px 4px',
    borderColor: `transparent transparent transparent ${colors}`,
    '&:before': {
      content: "''",
      position: 'absolute',
      top: -1,
      left: -4,
      width: 1,
      height: 11.5,
      backgroundColor: 'black',
      transform: `rotate(15deg)`,
      transformOrigin: 'bottom',
    },
    '&:after': {
      content: "''",
      position: 'absolute',
      left: -4,
      width: 1,
      height: 11.5,
      backgroundColor: 'black',
      bottom: 0,
      transform: `rotate(-15deg)`,
      transformOrigin: 'top',
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

export default function ColorBall({
  colors,
  withBorder,
  rotate = 0,
  isSquare,
  withArrow,
  ...props
}) {
  const { classes, cx } = useStyle({ colors, withBorder, rotate, isSquare, withArrow });

  return (
    <Box {...props} className={classes.root}>
      {withBorder && isSquare && !withArrow ? (
        <>
          <Box className={cx(classes.square, classes.square1)} />
          <Box className={cx(classes.square, classes.square2)} />
          <Box className={cx(classes.square, classes.square3)} />
          <Box className={cx(classes.square, classes.square4)} />
        </>
      ) : null}
      {withArrow && isSquare && <Box className={classes.rightArrow} />}
    </Box>
  );
}

ColorBall.propTypes = {
  colors: PropTypes.any,
  withBorder: PropTypes.bool,
  rotate: PropTypes.number,
  isSquare: PropTypes.bool,
  withArrow: PropTypes.bool,
};
