import { createStyles, pxToRem } from '@bubbles-ui/components';

export const LibraryCardEmbedStyles = createStyles(
  (theme, { showPlayer, fullScreenMode, color, variant, fileType }) => {
    const isMedia = variant === 'media';
    const isVideo = fileType === 'video';

    return {
      root: {
        backgroundColor: theme.colors.mainWhite,
        width: 'auto',
        minWidth: 420,
      },
      cardWrapper: {
        borderRadius: 4,
        border: `2px solid ${theme.colors.ui02}`,
      },
      imagePlaceholder: {
        width: 172,
        height: 156,
        backgroundColor: theme.colors.interactive03h,
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
        paddingBottom: pxToRem(16),
        paddingRight: pxToRem(16),
      },
      color: {
        backgroundColor: color,
        height: 8,
        width: '100%',
        borderTopRightRadius: 2,
      },
      content: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        paddingInline: pxToRem(12),
        gap: pxToRem(16),
      },
      title: {
        flex: 1,
        fontWeight: 600,
      },
      description: {
        padding: pxToRem(16),
        flex: 1,
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
    };
  }
);
