import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Text, createStyles } from '@bubbles-ui/components';
import { AddIcon, PluginLearningPathsIcon } from '@bubbles-ui/icons/outline';

export const useEmptyStateStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: globalTheme.border.color.primary.subtle,
      marginBottom: globalTheme.spacing.gap.xlg,
    },
    title: {
      ...globalTheme.content.typo.heading.md,
      color: globalTheme.content.color.text.default,
      marginBottom: globalTheme.spacing.padding.lg,
    },
    description: {
      maxWidth: 561,
      textAlign: 'center',
      ...globalTheme.content.typo.body.md,
      color: globalTheme.content.color.text.muted,
      marginBottom: globalTheme.spacing.padding.md,
    },
  };
});

export function EmptyState({ onSelectAsset, localizations }) {
  const { classes } = useEmptyStateStyles();

  return (
    <Box className={classes.root}>
      <PluginLearningPathsIcon className={classes.icon} width={140} height="auto" />
      <Text className={classes.title}>{localizations?.emptyState?.title}</Text>
      <Text className={classes.description}>{localizations?.emptyState?.description}</Text>
      <Button variant="link" leftIcon={<AddIcon />} onClick={onSelectAsset}>
        {localizations?.buttons?.new}
      </Button>
    </Box>
  );
}

EmptyState.propTypes = {
  onSelectAsset: PropTypes.func,
  localizations: PropTypes.object,
};
