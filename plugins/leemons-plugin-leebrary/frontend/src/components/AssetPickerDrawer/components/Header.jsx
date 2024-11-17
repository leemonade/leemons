import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton, Box, Stack, Title, createStyles } from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

export const useHeaderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      width: '100%',
      height: 72,
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
      paddingLeft: globalTheme.spacing.padding.lg,
      paddingRight: globalTheme.spacing.padding.lg,
      borderBottom: `1px solid ${theme.other.divider.background.color.default}`,
      backgroundColor: 'white',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.md,
      alignItems: 'center',
      justifyContent: 'start',
    },
  };
});

export function Header({ localizations, onClose }) {
  const { classes } = useHeaderStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.titleContainer}>
        <Title order={2}>{localizations?.title}</Title>
      </Box>
      <ActionButton icon={<RemoveIcon />} tooltip={localizations?.close} onClick={onClose} />
    </Box>
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
  onClose: PropTypes.func,
};
