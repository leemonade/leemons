import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

export const LibraryCardCoverStyles = createStyles(
  (theme, { color, height, blur, parentHovered, subjectColor }) => {
    return {
      root: {
        ...getFontExpressive(theme.fontSizes['2']),
        position: 'relative',
        height: height,
        width: '100%',
        borderRadius: '4px 2px 0 0',
      },
      titleWrapper: {
        padding: pxToRem(12),
      },
      title: {
        fontWeight: 600,
        lineHeight: pxToRem(20),
      },
      blurryBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        background: parentHovered ? 'rgba(247, 248, 250, 0.95)' : 'rgba(247, 248, 250, 0.8)',
        backdropFilter: `blur(${blur}px)`,
        justifyContent: 'space-between',
        borderRadius: '4px 0 0 0',
      },
      iconRow: {
        display: parentHovered ? 'flex' : 'none',
        alignItems: 'center',
        paddingTop: pxToRem(2),
        paddingInline: pxToRem(4),
      },
      menuIcon: {
        color: theme.colors.text05,
      },
      deadline: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        right: 0,
        zIndex: 2,
      },
      color: {
        width: '100%',
        height: pxToRem(8),
        backgroundColor: color || theme.colors.ui01,
        transition: 'all 0.2s ease-out',
        borderRadius: '2px 0 0 0',
      },
      fileIcon: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: theme.colors.interactive03h,
        padding: pxToRem(16),
        borderRadius: '4px 2px 0 0',
      },
      menuItem: {
        color: theme.colors.text04,
      },
      badge: {
        marginBottom: 8,
      },
      subject: {
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },
      subjectIcon: {
        backgroundColor: subjectColor,
        padding: 4,
        minHeight: 20,
        minWidth: 20,
        borderRadius: '50%',
        img: {
          filter: 'brightness(0) invert(1)',
        },
      },
    };
  }
);
