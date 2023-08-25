import { createStyles, pxToRem } from '@bubbles-ui/components';

export const LibraryDetailToolbarStyles = createStyles((theme, {}) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      color: theme.colors.text05,
      padding: pxToRem(16),
      gap: pxToRem(8),
      backgroundColor: theme.colors.mainWhite,
    },
    button: {
      transition: 'transform 0.2s ease-out',
      color: theme.colors.text05,
    },
  };
});
