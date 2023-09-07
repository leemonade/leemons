import { createStyles } from '@bubbles-ui/components';

export const NavItemStyles = createStyles((theme, { lightMode }) => {
  // console.log(theme);
  const leemonsStyles = theme.other;
  const defaultDark = 'default--dark';
  const hoverDark = 'hover--dark';
  const activeDark = 'active--dark';
  const borderLeftLink = lightMode
    ? leemonsStyles.menu.border.color.sub.default
    : leemonsStyles.menu.border.color.sub[defaultDark];
  return {
    control: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      color: lightMode
        ? leemonsStyles.menu.background.color.main.hover
        : leemonsStyles.menu.background.color.main[hoverDark],
      fontSize: theme.fontSizes.sm,
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.active
          : leemonsStyles.menu.background.color.main[activeDark],
      },
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.hover
          : leemonsStyles.menu.background.color.main[hoverDark],
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
        ? leemonsStyles.menu.content.color.main[defaultDark]
        : leemonsStyles.menu.content.color.main.default,
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
        ? leemonsStyles.menu.content.color.default
        : leemonsStyles.menu.content.color.main[defaultDark],
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
        ? leemonsStyles.menu.background.color.main[defaultDark]
        : leemonsStyles.menu.content.color.main.default,
      borderLeft: `1px solid ${borderLeftLink}`,
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.active
          : leemonsStyles.menu.background.color.main[activeDark],
      },
      '&:hover': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.hover
          : leemonsStyles.menu.background.color.main[hoverDark],
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
        ? leemonsStyles.menu.background.color.main[defaultDark]
        : leemonsStyles.menu.background.color.main.default,
      borderLeft: `1px solid ${leemonsStyles.menu.border.color.sub.active}`,
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main.active
        : leemonsStyles.menu.background.color.main[activeDark],
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
    },
    chevron: {
      transition: 'transform 200ms ease',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
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
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultDark],
    },
  };
});
