import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const LibraryDetailStyles = createStyles((theme, { drawer, open }) => {
  let drawerProps = {};
  if (drawer) {
    drawerProps = {
      border: `1px solid ${theme.colors.ui01}`,
      borderRight: 0,
      borderBottom: 0,
      borderRadius: '4px 0 0 0',
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
      transform: 'translateX(100%)',
      transition: 'transform 0.2s ease-in',
    },
    show: {
      transform: 'translateX(0)',
      transition: 'transform 0.2s ease-out',
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
  };
});
