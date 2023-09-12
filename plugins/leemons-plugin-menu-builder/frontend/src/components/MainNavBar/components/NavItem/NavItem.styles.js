/* eslint-disable sonarjs/cognitive-complexity */
import { createStyles } from '@bubbles-ui/components';

export const NavItemStyles = createStyles((theme, { lightMode }) => {
  const leemonsStyles = theme.other;
  const hoverDark = 'hover--dark';
  const activeDark = 'active--dark';
  const defaultReverse = 'default--reverse';
  const borderLeftLink = leemonsStyles.menu.border.color.main.active;

  return {
    control: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '12px 16px 12px 18px',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
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
      padding: '12px 16px 12px 18px',
      fontSize: theme.fontSizes.sm,
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
      borderLeft: `2px solid ${borderLeftLink}`,
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main.active
        : leemonsStyles.menu.background.color.main[activeDark],
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
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
    },
    openIcon: {
      width: '12px',
      height: '12px',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
    },

    childOpenIcon: {
      minWidth: '12px',
      minHeight: '12px',
      marginTop: 4,
      marginRight: 6,
      marginLeft: 6,
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
    },
    link: {
      display: 'flex !important',
      justifyContent: 'space-between',
      alingItems: 'baseline !important',
      width: '100%',
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '16px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      maxHeight: '42px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
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
      display: 'flex !important',
      justifyContent: 'space-between',
      alingItems: 'baseline !important',
      width: '100%',
      ...leemonsStyles.menu.content.typo.md,
      lineHeight: '16px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      maxHeight: '42px',
      fontSize: theme.fontSizes.sm,
      cursor: 'pointer',
      // textDecoration: 'none !important',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
      borderLeft: `1px solid ${leemonsStyles.menu.border.color.sub.active}`,
      backgroundColor: lightMode
        ? leemonsStyles.menu.background.color.main.active
        : leemonsStyles.menu.background.color.main[activeDark],
      '&:active': {
        backgroundColor: lightMode
          ? leemonsStyles.menu.background.color.main.active
          : leemonsStyles.menu.background.color.main[activeDark],
      },
    },
    itemContainer: {
      display: 'flex',
    },
    chevron: {
      transition: 'transform 200ms ease',
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
    },
    chevronContainer: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    icon: {
      width: '18px',
      height: '18px',
      marginTop: 3,
      color: lightMode
        ? leemonsStyles.menu.content.color.main.default
        : leemonsStyles.menu.content.color.main[defaultReverse],
    },
  };
});
