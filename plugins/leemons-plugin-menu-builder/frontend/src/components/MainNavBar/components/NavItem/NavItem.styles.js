import { createStyles } from '@bubbles-ui/components';

export const NavItemStyles = createStyles((theme) => {
  const leemonsStyle = theme.other;

  return {
    itemWrapper: {
      paddingLeft: 16,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px ',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#F8F9FB',
        // backgroundColor: leemonsStyle.menu.background.color.main.hover,
      },
      '&:focus': {
        backgroundColor: 'red',
      },
      '&:active': {
        backgroundColor: '#DEF2F0',
      },
      position: 'relative',
    },
    control: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      fontSize: theme.fontSizes.sm,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

    link: {
      fontWeight: 400,
      display: 'block',
      textDecoration: 'none',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

    chevron: {
      transition: 'transform 200ms ease',
    },
    chevronContainer: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',

    },

    icon: {
      width: '18px',
      height: '18px',
      color: leemonsStyle.menu.content.color.main.default,
    },
  };
});
