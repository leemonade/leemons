import { createStyles, pxToRem } from '@bubbles-ui/components';

export const MainNavBarStyles = createStyles((theme, { itemWidth, lightMode, isCollapsed }) => {
  const leemonsStyles = theme.other;
  return {
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
    },
    navBar: {
      borderRight: `1px solid ${leemonsStyles.menu.border.color.main.default}`,
      boxShadow: isCollapsed
        ? 'none'
        : '0px 10px 36px 0px rgba(26, 32, 43, 0.08), 0px 2px 0px 0px rgba(221, 225, 230, 0.08)',
    },
    navTitle: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      fontSize: leemonsStyles.core.font.size['500'],
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main['default--reverse'],
    },
    navWrapper: {
      position: 'relative',
      height: '100vh',
      width: pxToRem(itemWidth),
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.background.color.main['default--dark'],
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
      textDecoration: 'none',
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
      maxHeight: 40,
      maxWidth: 32,
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
