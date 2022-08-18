import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';

const useStyle = createStyles((theme, { colors, withBorder, rotate }) => ({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: 23,
    height: 23,
    borderRadius: '50%',
    border: withBorder ? `1px solid ${theme.colors.ui01}` : 'none',
    backgroundColor: colors[0],
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
      backgroundColor: colors[1],
    },
  },
}));

export default function ColorBall({ colors, withBorder, rotate = 0, ...props }) {
  const { classes } = useStyle({ colors, withBorder, rotate });

  return <Box {...props} className={classes.root} />;
}

ColorBall.propTypes = {
  colors: PropTypes.any,
  withBorder: PropTypes.bool,
  rotate: PropTypes.number,
};
