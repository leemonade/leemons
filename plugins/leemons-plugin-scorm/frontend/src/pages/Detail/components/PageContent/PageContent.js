import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';

export const PageContentStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      backgroundColor: globalTheme.background.color.surface.subtle,
      paddingLeft: 48,
      paddingRight: 36,
      paddingBottom: 52,
      flex: 1,
    },
    header: {
      paddingTop: 24,
      ...globalTheme.content.typo.heading.sm,
      color: globalTheme.content.color.text.muted,
    },
    content: {
      backgroundColor: globalTheme.background.color.surface.default,
      flex: 1,
      borderRadius: 4,
      maxWidth: 1280,
      padding: '32px',
    },
  };
});

const PageContent = ({ title, children }) => {
  const { classes } = PageContentStyles({});
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>{title}</Box>
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
};

PageContent.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export { PageContent };
