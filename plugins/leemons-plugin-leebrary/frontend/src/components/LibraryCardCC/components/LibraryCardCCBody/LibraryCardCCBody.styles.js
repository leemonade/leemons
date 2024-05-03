import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryCardCCBodyStyles = createStyles((theme) => {
  const cardLibraryStyles = theme.other.cardLibrary;

  return {
    root: {
      padding: pxToRem(16),
      // paddingTop: pxToRem(24),
      // flex: fullHeight && 1,
      display: 'flex',
      flexDirection: 'column',
    },
    titleContainer: {
      paddingTop: pxToRem(8),
    },
    title: {
      ...cardLibraryStyles.content.typo.lg,
      lineHeight: '20px',
      color: cardLibraryStyles.content.color.emphasis,
      paddingTop: '0px !important',
    },
    description: {
      ...cardLibraryStyles.content.typo.md,
      lineHeight: '20px',
      color: cardLibraryStyles.content.color.default,
      paddingTop: pxToRem(4),
    },
  };
});

export { LibraryCardCCBodyStyles };
