import { createStyles, pxToRem } from '@bubbles-ui/components';

export const MainNavBarStyles = createStyles((theme, { itemWidth, lightMode }) => {
  const leemonsStyles = theme.other;
  return {
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
    },
    navTitle: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      fontSize: leemonsStyles.core.font.size['500'],
      color: lightMode
        ? leemonsStyles.core.color.neutral['50']
        : leemonsStyles.menu.content.color.main['default--dark'],
    },
    navWrapper: {
      position: 'relative',
      height: '100vh',
      width: pxToRem(itemWidth),
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main['default--dark']
        : leemonsStyles.menu.background.color.main.default,
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
      overflow: 'scroll',
      marginBottom: '180px',
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
      justifyContent: 'space-between',
    },
    logoUrl: {
      width: pxToRem(itemWidth),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    logo: {
      maxWidth: pxToRem(31),
      minWidth: pxToRem(31),
    },
    logoContainer: {
      margin: 'auto',
      padding: '16px 12px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  };
});
