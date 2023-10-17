import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, createStyles } from '@bubbles-ui/components';
import HeroBgLayout from '@users/layout/heroBgLayout';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

const HeroWrapper = ({ children, quote }) => {
  const { classes } = PageStyles({});

  return (
    <HeroBgLayout quote={quote} dobleQuoted={false}>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>{children}</Box>
      </Stack>
    </HeroBgLayout>
  );
};

HeroWrapper.propTypes = {
  quote: PropTypes.object,
  children: PropTypes.node,
};

export { HeroWrapper };
export default HeroWrapper;
