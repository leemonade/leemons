import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LoginBg, Box, createStyles } from '@bubbles-ui/components';

const HeroBgLayoutStyles = createStyles(() => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

export default function HeroBgLayout({ children }) {
  const [quote, setQuote] = useState({});

  useEffect(async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    const data = await fetch('https://zenquotes.io/api/today', requestOptions);

    console.log(data);
  }, []);

  const { classes } = HeroBgLayoutStyles();
  return (
    <Box className={classes.root}>
      <LoginBg />
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
}

HeroBgLayout.propTypes = {
  children: PropTypes.node,
};
