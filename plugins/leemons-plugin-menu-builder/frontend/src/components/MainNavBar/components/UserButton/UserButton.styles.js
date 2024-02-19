/* eslint-disable import/prefer-default-export */
import { createStyles } from '@bubbles-ui/components';

export const UserButttonStyles = createStyles((theme, { opened }) => {
  const leemonsStyles = theme.other;
  return {
    control: {
      zIndex: 3,
      position: 'absolute',
      bottom: '0px',
      fontWeight: 500,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingRight: 16,
      paddingLeft: 4,
      fontSize: theme.fontSizes.sm,
      backgroundColor: leemonsStyles.menu.background.color.main.default,
      boxShadow: opened ? '0px 10px 36px 0px rgba(33, 39, 42, 0.12)' : 'none',
      '&:hover': {
        backgroundColor: leemonsStyles.menu.background.color.main.hover,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
    itemWrapper: {
      padding: 12,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      gap: '12px ',
      cursor: 'pointer',
      position: 'relative',
    },
    chevron: {
      transition: 'transform 200ms ease',
      color: leemonsStyles.menu.content.color.main.default,
    },
    nameContainer: {
      ...leemonsStyles.menu.content['typo--regular'],
      maxWidth: 140,
      color: leemonsStyles.menu.content.color.main.default,
      lineHeight: '24px',
      paddingLeft: 3,
    },
    menuItemsContainer: {
      backgroundColor: leemonsStyles.menu.background.color.main.default,
      position: 'absolute',
      bottom: 49,
      width: '100%',
      maxHeight: 260,
      overflowY: 'auto',
      boxShadow:
        '0px 10px 36px 0px rgba(26, 32, 43, 0.16), 0px 2px 0px 0px rgba(221, 225, 230, 0.24)',
    },
    menuItems: {
      paddingTop: leemonsStyles.menu.spacing.padding.xsm,
      paddingBottom: leemonsStyles.menu.spacing.padding.xsm,
      backgroundColor: leemonsStyles.menu.background.color.main.default,
      width: '100%',
    },
    link: {
      ...leemonsStyles.menu.content['typo--regular'],
      lineHeight: '24px',
      width: '100%',
      display: 'block',
      textDecoration: 'none',
      cursor: 'pointer',
      color: leemonsStyles.menu.content.color.main.default,
    },
    childrenContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: leemonsStyles.menu.background.color.main.default,
      color: leemonsStyles.menu.content.color.main.default,
      borderTopRightRadius: leemonsStyles.menu.border.radius.md,
      borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      '&:hover': {
        backgroundColor: leemonsStyles.menu.background.color.main.hover,
        width: '100%',
      },
      '&:active': {
        backgroundColor: leemonsStyles.menu.background.color.main.active,
      },
    },
    childrenContainerActive: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: leemonsStyles.menu.background.color.main.active,
      borderTopRightRadius: leemonsStyles.menu.border.radius.md,
      borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      '&:active': {
        backgroundColor: leemonsStyles.menu.background.color.main.active,
      },
    },
    openIcon: {
      width: '12px',
      height: '12px',
    },
  };
});
