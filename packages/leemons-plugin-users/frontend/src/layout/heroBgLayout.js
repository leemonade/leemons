import React from 'react';
import PropTypes from 'prop-types';
import { LoginBg, Box, createStyles } from '@bubbles-ui/components';

const HeroBgLayoutStyles = createStyles(() => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {},
}));

export default function HeroBgLayout({ children }) {
  const { classes } = HeroBgLayoutStyles();
  return (
    <Box className={classes.root}>
      <LoginBg />
      <Box className={classes.content}>{children}</Box>
    </Box>
  );

  /*
  const { classes } = HeroBgLayoutStyles({});

  return (
    <Box className={classes.root}>
      <LoginBg />
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
  */
}

HeroBgLayout.propTypes = {
  children: PropTypes.node,
};
