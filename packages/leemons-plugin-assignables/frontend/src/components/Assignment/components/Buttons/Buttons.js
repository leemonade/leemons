import React from 'react';
import { Box, createStyles, Button } from '@bubbles-ui/components';

export const useButtonsStyles = createStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

export function Buttons({ localizations }) {
  const { classes } = useButtonsStyles();
  return (
    <Box className={classes.root}>
      <Button type="submit">{localizations?.assign}</Button>
    </Box>
  );
}
