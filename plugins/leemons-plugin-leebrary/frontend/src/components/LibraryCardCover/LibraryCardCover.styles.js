/* eslint-disable import/prefer-default-export */
import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

const spaceBetween = 'space-between';

export const LibraryCardCoverStyles = createStyles(
  (theme, { color, height, parentHovered, subjectColor, isFav }) => {
    const isParentHovered = parentHovered ? 'visible' : 'hidden';
    return {
      root: {
        ...getFontExpressive(theme.fontSizes['2']),
        position: 'relative',
        height,
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
      overlayTransparent: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        justifyContent: spaceBetween,
        borderRadius: '4px 0 0 0',
      },
      overlayGradient: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 0,
        background:
          'linear-gradient(180deg, #000 -65%, rgba(0, 0, 0, 0.00) 65%), transparent 50% / cover no-repeat',
        justifyContent: spaceBetween,
        borderRadius: '4px 0 0 0',
      },
      leftContainer: {
        display: 'flex',
      },
      iconRow: {
        zIndex: 3,
        display: 'flex',
        visibility: isParentHovered,
        alignItems: 'center',
        justifyContent: spaceBetween,
        paddingTop: pxToRem(2),
        paddingInline: pxToRem(4),
      },
      menuIcon: {
        color: '#FFFFFF',
      },
      menuButton: {
        backgroundColor: 'transparent !important',
      },
      favButton: {
        zIndex: 3,
        paddingRight: pxToRem(4),
        visibility: isFav ? 'visible' : isParentHovered,
      },
      favActive: {
        position: 'absolute',
        right: 0,
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
        height: pxToRem(4),
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
