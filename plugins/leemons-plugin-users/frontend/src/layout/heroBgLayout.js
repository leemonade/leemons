import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray, isNil, isEmpty } from 'lodash';
import { todayQuoteRequest } from '@users/request';
import { Box, createStyles, ScrollArea } from '@bubbles-ui/components';
import { LoginBg } from '@users/components/LoginBg';
import { useLayout } from '@layout/context';

const HeroBgLayoutStyles = createStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  hero: {
    display: 'flex',
    flex: '0 1 35%',
    maxWidth: 1480 * 0.35,
  },
  body: {
    display: 'flex',
    flex: 1,
  },
  content: {
    display: 'flex',
    maxWidth: 1480 * 0.65,
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

function HeroBgLayout({ children, quote: quoteProp, dobleQuoted, heroImage }) {
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

  const { classes } = HeroBgLayoutStyles({}, { name: 'HeroBgLayout' });
  return (
    <Box className={classes.root}>
      <Box className={classes.hero}>
        <LoginBg
          author={quote?.a || ''}
          quote={quote?.q || ''}
          dobleQuoted={dobleQuoted}
          accentColor={!isEmpty(theme.mainColor) ? theme.mainColor : undefined}
          logoUrl={theme.logoUrl}
          heroImage={heroImage}
        />
      </Box>
      <Box className={classes.body}>
        <ScrollArea style={{ width: '100%' }}>
          <Box className={classes.content}>{children}</Box>
        </ScrollArea>
      </Box>
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
  heroImage: PropTypes.string,
};

export { HeroBgLayout };
