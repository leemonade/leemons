import { createStyles } from '@bubbles-ui/components';
import { pxToRem } from '@bubbles-ui/components';
// import 'simplebar/dist/simplebar.min.css';

export const MainNavBarStyles = createStyles(
  (theme, { itemWidth, subNavWidth, lightMode, mainColor }) => {
    return {
      root: {
        display: 'flex',
        width: '100%',
        position: 'relative',
      },
      navWrapper: {
        position: 'relative',
        height: '100vh',
        width: pxToRem(itemWidth),
        // flex: 'none',
        // backgroundColor: lightMode ? theme.colors.mainWhite : mainColor,
        backgroundColor: 'transparent',
        zIndex: 30,
        overflow: 'hidden',
      },
      navItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      },
      linksInner: {
        overflow: 'scroll'
      },
      navWrapperBorder: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        width: 1,
        backgroundColor: lightMode ? theme.colors.ui01 : 'transparent',
        zIndex: 0,
      },
      navItemsWrapper: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        justifyContent: 'space-between',
      },
      logoUrl: {
        width: pxToRem(itemWidth),
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      logo: {
        width: pxToRem(31),
      },
      logoContainer: {
        margin: 'auto',
        padding: '16px 12px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      navItems: {
        flexGrow: 1,
        height: 1,
      },
      subNav: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: subNavWidth - itemWidth,
        marginLeft: itemWidth,
        zIndex: 20,
      },
      subNavHandler: {
        position: 'absolute',
        top: 0,
        left: itemWidth,
        zIndex: 40,
      },
      footer: {
        // overflow: 'hidden'
      }
    };
  }
);
