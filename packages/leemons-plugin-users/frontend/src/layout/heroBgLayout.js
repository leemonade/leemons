import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import { todayQuoteRequest } from '@users/request';
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
    const response = await todayQuoteRequest();
    if (isArray(response.data)) {
      const { a, q } = response.data[0];
      setQuote({ a, q });
    }
  }, []);

  const { classes } = HeroBgLayoutStyles();
  return (
    <Box className={classes.root}>
      <LoginBg author={quote.a} quote={quote.q} />
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
}

HeroBgLayout.propTypes = {
  children: PropTypes.node,
};
