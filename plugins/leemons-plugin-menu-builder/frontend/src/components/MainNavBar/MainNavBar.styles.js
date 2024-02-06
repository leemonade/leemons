/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

export const MainNavBarStyles = createStyles((theme, { itemWidth, isCollapsed }) => {
  const leemonsStyles = theme.other;
  const navBarBoxShadow = isCollapsed
    ? 'none'
    : '0px 10px 36px 0px rgba(26, 32, 43, 0.08), 0px 2px 0px 0px rgba(221, 225, 230, 0.08)';
  return {
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
    },
    navBar: {
      boxShadow: navBarBoxShadow,
      backgroundColor: leemonsStyles.menu.background.color.main.default,
      borderRight: `1px solid ${leemonsStyles.menu.border.color.main.default}`,
    },
    navTitle: {
      ...leemonsStyles.global.content.typo.heading.lg,
      lineHeight: '24px',
      // fontSize: leemonsStyles.core.font.size['500'],
      color: leemonsStyles.menu.content.color.main.default,
    },
    navWrapper: {
      position: 'relative',
      height: '100vh',
      width: pxToRem(itemWidth),
      backgroundColor: leemonsStyles.menu.background.color.main.default,
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
      overflow: 'auto',
      marginBottom: '180px',
      textDecoration: 'none',
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
      '> *': {
        flex: '1 0',
      },
    },
  };
});
