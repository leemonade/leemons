import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

const spaceBetween = 'space-between';

const LibraryCardCCCoverStyles = createStyles((theme, { color, subjectColor }) => {
  const buttonIconCardStyles = theme.other.buttonIconCard;
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      position: 'relative',
      height: 144,
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
    leftContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
    },

    color: {
      width: '100%',
      height: pxToRem(4),
      backgroundColor: color || 'transparent',
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
      backgroundColor: buttonIconCardStyles.content.color.primary.default,
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
    buttonIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  };
});

export { LibraryCardCCCoverStyles };
