import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const LibraryCardContentStyles = createStyles((theme, { fullHeight }) => {
  return {
    root: {
      // backgroundColor: theme.colors.mainWhite,
      flex: fullHeight && 1,
      display: 'flex',
      flexDirection: 'column',
    },
    mainContainer: {
      // minHeight: 86,
      padding: `${pxToRem(14)} ${pxToRem(16)}`,
      // backgroundColor: theme.colors.mainWhite,
      flex: 1,
    },
    description: {
      color: theme.colors.text02,
    },
    tagsContainer: {
      // minHeight: 38,
      display: 'flex',
      gap: pxToRem(10),
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: `${pxToRem(8)} ${pxToRem(16)}`,
    },
    label: {
      color: theme.colors.text05,
    },
    value: {
      color: theme.colors.text02,
    },
  };
});
