import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

export const LibraryDetailContentStyles = createStyles((theme, {}) => {
  return {
    root: {
      // ...getFontExpressive(theme.fontSizes['2']),
      flex: 1,
    },
    lowerContent: {
      flex: 1,
      backgroundColor: theme.colors.ui03,
      padding: `${pxToRem(8)} ${pxToRem(8)} ${pxToRem(8)} ${pxToRem(8)}`,
    },
    tagsContainer: {
      minHeight: 38,
      display: 'flex',
      gap: pxToRem(10),
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: `${pxToRem(8)} ${pxToRem(8)}`,
    },
  };
});
