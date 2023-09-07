import { createStyles } from '@bubbles-ui/components';

export const NavItemStyles = createStyles((theme, { lightMode }) => {
  console.log(theme);
  const leemonsStyles = theme.other;
  const defaultDark = 'default--dark';
  const hoverDark = 'hover--dark';
  const activeDark = 'active--dark';
  const borderLeftLink = lightMode
    ? leemonsStyles.menu.border.color.sub['default--dark']
    : leemonsStyles.menu.border.color.sub.default;
  return {
    control: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      color: lightMode
        ? leemonsStyles.menu.background.color.main[hoverDark]
        : leemonsStyles.menu.background.color.main.hover,
      fontSize: theme.fontSizes.sm,
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[activeDark]
          : leemonsStyles.menu.background.color.main.active,
      },
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[hoverDark]
          : leemonsStyles.menu.background.color.main.hover,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
    controlActive: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      fontSize: theme.fontSizes.sm,
      backgroundColor: lightMode
        ? leemonsStyles.core.color.neutral['50']
        : leemonsStyles.menu.content.color.main[defaultDark],
      borderLeft: `2px solid ${borderLeftLink}`,
    },
    itemWrapper: {
      paddingLeft: 16,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px ',
      cursor: 'pointer',
      position: 'relative',
    },
    labelContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    labelText: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      color: lightMode
        ? leemonsStyles.core.color.neutral['50']
        : leemonsStyles.menu.content.color.main.default[defaultDark],
    },
    link: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      maxHeight: '42px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
      borderLeft: `1px solid ${borderLeftLink}`,
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[activeDark]
          : leemonsStyles.menu.background.color.main.active,
      },
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main[hoverDark]
          : leemonsStyles.menu.background.color.main.hover,
      },
    },
    linkActive: {
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '24px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      maxHeight: '42px',
      fontSize: theme.fontSizes.sm,
      cursor: 'pointer',
      color: lightMode
        ? leemonsStyles.menu.background.color.main.default
        : leemonsStyles.menu.background.color.main[defaultDark],
      borderLeft: `1px solid ${leemonsStyles.menu.border.color.sub.active}`,
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main[activeDark]
        : leemonsStyles.menu.background.color.main.active,
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
    },
    chevron: {
      transition: 'transform 200ms ease',
      color: lightMode
        ? leemonsStyles.core.color.neutral['50']
        : leemonsStyles.menu.content.color.main.default,
    },
    chevronContainer: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    icon: {
      width: '18px',
      height: '18px',
      color: lightMode
        ? leemonsStyles.core.color.neutral['50']
        : leemonsStyles.menu.content.color.main.default,
    },
  };
});
