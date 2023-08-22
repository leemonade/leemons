import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray, isNil, isEmpty } from 'lodash';
import { todayQuoteRequest } from '@users/request';
import { Box, createStyles } from '@bubbles-ui/components';
import { LoginBg } from '@bubbles-ui/leemons';
import { useLayout } from '@layout/context';

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

export default function HeroBgLayout({ children, quote: quoteProp, dobleQuoted }) {
  const [quote, setQuote] = useState({});
  const { theme } = useLayout();

  useEffect(() => {
    let mounted = true;

    if (isNil(quoteProp) || isEmpty(quoteProp)) {
      (async () => {
        const response = await todayQuoteRequest();
        if (isArray(response.data)) {
          const { a, q } = response.data[0];
          if (mounted) setQuote({ a, q });
        }
      })();
    } else if (!isEmpty(quoteProp.a) && !isEmpty(quoteProp.q)) {
      setQuote(quoteProp);
    }
    return () => {
      mounted = false;
    };
  }, [quoteProp]);

  const { classes } = HeroBgLayoutStyles();
  return (
    <Box className={classes.root}>
      <LoginBg
        author={quote?.a || ''}
        quote={quote?.q || ''}
        dobleQuoted={dobleQuoted}
        accentColor={!isEmpty(theme.mainColor) ? theme.mainColor : undefined}
        logoUrl={theme.logoUrl}
      />
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
}
HeroBgLayout.defaultProps = {
  quote: null,
  dobleQuoted: true,
};
HeroBgLayout.propTypes = {
  children: PropTypes.node,
  quote: PropTypes.object,
  dobleQuoted: PropTypes.bool,
};
