import React from 'react';
import { Box, createStyles } from '@bubbles-ui/components';

export const ContextButtonStyles = createStyles((theme, {}) => {
  console.log(theme);
  return {
    root: {
      position: 'fixed',
      zIndex: 5,
      bottom: theme.spacing[6],
      right: theme.spacing[6],
    },
  };
});

function ContextButton() {
  const { classes } = ContextButtonStyles({}, { name: 'ContextButton' });
  return <Box className={classes.root}>Hola?</Box>;
}

export { ContextButton };
export default ContextButton;
