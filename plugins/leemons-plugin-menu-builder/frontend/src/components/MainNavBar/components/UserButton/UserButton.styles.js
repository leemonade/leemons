import { createStyles } from '@bubbles-ui/components';

export const UserButttonStyles = createStyles((theme, { lightMode }) => {
  const leemonsStyles = theme.other;
  const defaultDark = 'default--dark';
  const activeDark = 'active--dark';

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
      paddingLeft: 8,
      fontSize: theme.fontSizes.sm,
      borderTop: `1px solid ${leemonsStyles.menu.background.color.main.default}`,
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main[defaultDark]
        : leemonsStyles.menu.background.color.main.default,
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main['hover--dark']
          : leemonsStyles.core.color.neutral['50'],
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
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
    },
    nameContainer: {
      ...leemonsStyles.menu.content.typo.md,
      maxWidth: 140,
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
      lineHeight: '24px',
    },
    menuItemsContainer: {
      position: 'absolute',
      bottom: 48,
      width: '100%',
      boxShadow:
        '0px 10px 36px 0px rgba(26, 32, 43, 0.16), 0px 2px 0px 0px rgba(221, 225, 230, 0.24)',
      maxHeight: 182,
      overflowY: 'scroll',
    },
    link: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      width: '100%',
      display: 'block',
      textDecoration: 'none',
      cursor: 'pointer',
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
    },
    childrenContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main[defaultDark]
        : leemonsStyles.menu.background.color.main.default,
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main['hover--dark']
          : leemonsStyles.menu.background.color.main.hover,
        width: '100%',
      },
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[activeDark]
          : leemonsStyles.menu.background.color.main.active,
      },
    },
    childrenContainerActive: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main[activeDark]
        : leemonsStyles.menu.background.color.main.active,
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[activeDark]
          : leemonsStyles.menu.background.color.main.active,
      },
    },
    openIcon: {
      width: '12px',
      height: '12px',
    },
  };
});
