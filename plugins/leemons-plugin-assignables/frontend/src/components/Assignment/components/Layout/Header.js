import React from 'react';
import PropTypes from 'prop-types';
import { Box, Title, createStyles } from '@bubbles-ui/components';

export const useLayoutHeaderStyles = createStyles((theme) => ({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    width: '100%',
    paddingLeft: theme.other.global.spacing.padding['3xlg'],
    paddingRight: theme.other.global.spacing.padding['3xlg'],
    paddingTop: theme.other.global.spacing.padding.xlg,
    paddingBottom: theme.other.global.spacing.padding.xlg,
    background: theme.other.global.background.color.surface.default,
    borderBottom: `1px solid ${theme.other.global.border.color.line.muted}`,
  },
  title: {
    ...theme.other.global.content.typo.heading.xlg,
    color: theme.other.global.content.color.text.emphasis,
  },
}));

export function LayoutHeader({ assign, name }) {
  const { classes } = useLayoutHeaderStyles();
  return (
    <Box className={classes.root}>
      <Title order={1} className={classes.title}>
        {assign}: {name}
      </Title>
    </Box>
  );
}

LayoutHeader.propTypes = {
  assign: PropTypes.string,
  name: PropTypes.string,
};
