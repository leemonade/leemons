import { createStyles } from "@bubbles-ui/components"

export const UserButttonStyles = createStyles((theme, { opened }) => ({
  control: {
    position: 'absolute',
    bottom: '0px',
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'row !important',
    alignItems: 'center',
    width: '100%',
    paddingRight: 16,
    paddingLeft: 8,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
  itemWrapper: {
    padding: 12,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row !important',

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
  chevron: {
    transition: 'transform 200ms ease',
  },
  menuItemsContainer: {
    position: 'absolute',
    bottom: 48,
    width: '100%'
  },
  link: {
    fontWeight: 400,
    width: '100%',
    display: 'block',
    textDecoration: 'none',
    padding: 8,
    paddingLeft: 16,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      width: '100%',
    },
  },
  childrenContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,

  }
}));