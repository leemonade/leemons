import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';

const EmptyStateStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      borderRadius: 8,
      height: 400,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...globalTheme.content.typo.body.md,
    },
  };
});

const EmptyState = ({ label }) => {
  const { classes } = EmptyStateStyles({}, { name: 'BoardMessagesEmptyState' });
  return <Box className={classes.root}>{label}</Box>;
};

EmptyState.propTypes = {
  label: PropTypes.string,
};

// eslint-disable-next-line import/prefer-default-export
export { EmptyState };
