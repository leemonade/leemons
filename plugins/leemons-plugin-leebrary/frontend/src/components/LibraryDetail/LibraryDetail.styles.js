import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailStyles = createStyles((theme, { drawer, open }) => {
  let drawerProps = {};
  if (drawer) {
    drawerProps = {
      borderRight: 0,
      borderBottom: 0,
      backgroundColor: theme.colors.mainWhite,
    };
  }
  return {
    root: {
      position: 'relative',
      overflowX: 'hidden',
    },
    wrapper: {
      ...drawerProps,
      // transform: 'translateX(100%)',
      // transition: 'transform 0.2s ease-in',
    },
    layoutContainer: { overflow: 'auto', backgroundColor: 'white' },
    show: {
      // transform: 'translateX(0)',
      // transition: 'transform 0.2s ease-out',
    },
    button: {
      // transition: 'transform 0.2s ease-out',
      color: theme.colors.text05,
    },
    lastIcon: {
      position: 'absolute',
      right: theme.spacing[3],
      top: theme.spacing[4],
      zIndex: 99,
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    flip: {
      transform: 'rotateZ(180deg)',
    },
    stickRight: {
      right: 'auto',
      left: -50,
    },
    canAccessContainer: {
      marginTop: pxToRem(24),
      width: '100%',
    },
    canAccessItem: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      paddingLeft: pxToRem(8),
    },
    avatarWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: pxToRem(8),
      width: pxToRem(336),
    },
    canAccessText: {
      fontSize: pxToRem(14),
      fontWeight: 400,
      lineHeight: '20px',
      color: '#343A3F',
    },
    canAccessFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: pxToRem(64),
      width: '100%',
      borderTop: '1px solid #DDE1E6',
      position: 'sticky',
      bottom: '0%',
      left: 0,
      paddingRight: pxToRem(24),
      backgroundColor: 'white',
    },
    canAccessButton: {
      height: pxToRem(40),
    },
  };
});

export default LibraryDetailStyles;
export { LibraryDetailStyles };
