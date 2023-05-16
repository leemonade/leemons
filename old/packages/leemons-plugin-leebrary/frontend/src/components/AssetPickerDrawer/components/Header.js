import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton, Box, Text, createStyles } from '@bubbles-ui/components';
import { PluginLeebraryIcon, RemoveIcon } from '@bubbles-ui/icons/outline';

export const useHeaderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
      paddingLeft: globalTheme.spacing.padding.lg,
      paddingRight: globalTheme.spacing.padding.lg,
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.md,
      alignItems: 'center',
      justifyContent: 'start',
    },
    title: {
      ...globalTheme.content.typo.heading.sm,
      // TODO: Add color token
      color: '#676E79',
    },
  };
});

export function Header({ localizations, onClose }) {
  const { classes } = useHeaderStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.titleContainer}>
        <PluginLeebraryIcon className={classes.title} height={20} width={20} />
        <Text className={classes.title}>{localizations?.title}</Text>
      </Box>
      <ActionButton icon={<RemoveIcon />} tooltip={localizations?.close} onClick={onClose} />
    </Box>
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
  onClose: PropTypes.func,
};
