import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

export const LibraryDetailPlayerStyles = createStyles((theme, { color }) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    color: {
      backgroundColor: color,
      height: pxToRem(8),
      width: '100%',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'baseline',
      padding: `${pxToRem(16)} ${pxToRem(16)} ${pxToRem(10)} ${pxToRem(16)}`,
      gap: pxToRem(16),
      backgroundColor: theme.colors.mainWhite,
    },
    title: {
      fontWeight: 600,
      flex: 1,
    },
  };
});
