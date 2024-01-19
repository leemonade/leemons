import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryCardEmbedStyles = createStyles(
  (theme, { showPlayer, fullScreenMode, color, variant, fileType }) => {
    const isMedia = variant === 'media';
    const isVideo = fileType === 'video';

    return {
      root: {
        backgroundColor: theme.colors.mainWhite,
        width: '100%',
        minHeight: 60,
        display: 'flex',
        justifyContent: 'flex-end',
      },
      cardWrapper: {
        borderBottom: `1px solid #DDE1E6`,
        width: '100%',
        minWidth: 440,
      },
      imagePlaceholder: {
        maxWidth: 72,
        maxHeight: 52,
        backgroundColor: theme.colors.interactive03h,
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
        paddingBottom: pxToRem(16),
        paddingRight: pxToRem(16),
        marginLeft: pxToRem(8),
      },
      imageStyles: {
        borderRadius: 4,
      },
      content: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      header: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
      },
      title: {
        paddingLeft: pxToRem(16),
        ...theme.other.table.content.typo.md,
      },
      description: {
        paddingLeft: pxToRem(16),
        ...theme.other.table.content.typo.md,
      },
      footer: {
        paddingLeft: pxToRem(16),
        paddingBlock: pxToRem(8),
        display: 'flex',
        gap: 24,
      },
      bookmarkButton: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
        span: {
          color: theme.colors.text04,
        },
        cursor: 'pointer',
      },
      fileTypeButtonContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
      },
    };
  }
);

export { LibraryCardEmbedStyles };
