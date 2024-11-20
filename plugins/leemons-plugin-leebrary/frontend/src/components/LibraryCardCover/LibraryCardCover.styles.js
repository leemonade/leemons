/* eslint-disable import/prefer-default-export */
import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

const spaceBetween = 'space-between';

export const LibraryCardCoverStyles = createStyles(
  (theme, { color, height, parentHovered, subjectColor, showMenu }) => {
    const isParentHovered = parentHovered ? 'visible' : 'hidden';
    const buttonIconCardStyles = theme.other.buttonIconCard;
    const focusDefaultBorder = theme.other.global.focus['default-border'];
    return {
      root: {
        ...getFontExpressive(theme.fontSizes['2']),
        position: 'relative',
        height,
        width: '100%',
        borderRadius: '4px 2px 0 0',
        overflow: height ? 'hidden' : 'visible',
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
      leftContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
      },
      iconRow: {
        zIndex: 3,
        display: 'flex',
        visibility: isParentHovered,
        alignItems: 'center',
        justifyContent: spaceBetween,
        paddingTop: pxToRem(8),
        paddingInline: pxToRem(8),
      },
      menuIcon: {
        color: buttonIconCardStyles.content.color.primary.default,
        zIndex: 10,
        position: 'absolute',
        marginBottom: 0,
        top: 3.5,
        right: 4,
        height: 17,
      },
      color: {
        width: '100%',
        height: pxToRem(4),
        backgroundColor: color || 'transparent',
        transition: 'all 0.2s ease-out',
        borderRadius: '2px 0 0 0',
        position: 'absolute',
        top: 0,
        left: 0,
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
        backgroundColor: buttonIconCardStyles.content.color.primary.default,
      },
      ellipsisBox: {
        position: 'relative',
        width: pxToRem(24),
        height: pxToRem(24),
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: `${focusDefaultBorder.width} solid transparent`,
          backgroundColor: !showMenu
            ? buttonIconCardStyles.background.color.primary.default
            : buttonIconCardStyles.background.color.primary.down,

          borderRadius: !showMenu
            ? buttonIconCardStyles.border.radius.md
            : `${buttonIconCardStyles.border.radius.md} ${buttonIconCardStyles.border.radius.md} 0px 0px`,

          backdropFilter: 'blur(2px)',
          zIndex: -10,
        },
        '&:hover::before': {
          backgroundColor: buttonIconCardStyles.background.color.primary.hover,
        },
        '&:focus-visible': {
          outline: 'none',
          backgroundColor: buttonIconCardStyles.background.color.primary.hover,
          border: `${focusDefaultBorder.width} ${focusDefaultBorder.style} ${focusDefaultBorder.color}`,
          borderRadius: buttonIconCardStyles.border.radius.md,
        },
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
