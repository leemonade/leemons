import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, createStyles } from '@bubbles-ui/components';
import { HeroBgLayout } from './HeroBgLayout';

const PageStyles = createStyles((theme) => ({
  content: {
    paddingBlock: theme.spacing[7],
    marginInline: 90,
  },
}));

const AuthLayout = ({ children, quote, heroImage }) => {
  const [mounted, setMounted] = React.useState(false);
  const { classes } = PageStyles({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR flicker
  if (!mounted) {
    return null;
  }

  return (
    <HeroBgLayout quote={quote} heroImage={heroImage}>
      <Stack direction="column" fullHeight justifyContent="center">
        <Box className={classes.content}>{children}</Box>
      </Stack>
    </HeroBgLayout>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  quote: PropTypes.object,
  heroImage: PropTypes.string,
};

export { AuthLayout };
