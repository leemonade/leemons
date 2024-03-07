/* eslint-disable import/prefer-default-export */
/* eslint-disable sonarjs/cognitive-complexity */
import { createStyles } from '@bubbles-ui/components';

export const NavItemStyles = createStyles((theme) => {
  const leemonsStyles = theme.other;

  const borderLeftLink = leemonsStyles.menu.border.color.main.default;
  const spaceBetween = 'space-between';
  const typoRegular = leemonsStyles.menu.content['typo--regular'];

  return {
    control: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '12px 16px 12px 18px',
      color: leemonsStyles.menu.content.color.main.default,
      fontSize: theme.fontSizes.sm,
      borderLeft: `2px solid transparent`,
      '&:active': {
        backgroundColor: leemonsStyles.menu.background.color.main.active,
        borderTopRightRadius: leemonsStyles.menu.border.radius.md,
        borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      },
      '&:hover': {
        backgroundColor: leemonsStyles.menu.background.color.main.hover,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderTopRightRadius: leemonsStyles.menu.border.radius.md,
        borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      },
    },
    controlActive: {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '12px 16px 12px 18px',
      fontSize: theme.fontSizes.sm,
      color: leemonsStyles.menu.content.color.main.default,
      borderLeft: `2px solid ${leemonsStyles.menu.border.color.main.active}`,
      backgroundColor: leemonsStyles.menu.background.color.main.active,
      borderTopRightRadius: leemonsStyles.menu.border.radius.md,
      borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
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
      justifyContent: spaceBetween,
      alignItems: 'center',
      paddingLeft: 4,
    },
    labelText: {
      ...typoRegular,
      lineHeight: '24px',
      color: leemonsStyles.menu.content.color.main.default,
    },
    /*
    badgeNew: {
      '& > div': {
        backgroundColor: '#307AE8 !important',
        border: '1px solid #307AE8 !important',
        padding: '0px 8px 2px 8px',
        height: '18px',
        marginRight: '6px',
      },
    },
    newText: {
      color: 'white',
      fontSize: '8px',
      fontWeight: 600,
      padding: 0,
      margin: 0,
    },
    */
    openIcon: {
      width: '12px',
      height: '12px',
      color: leemonsStyles.menu.content.color.main.default,
      marginRight: 4,
      marginTop: 4,
    },

    childOpenIcon: {
      position: 'absolute',
      right: 10,
      top: 10,
      width: '12px',
      minWidth: '12px',
      height: '12px',
      color: leemonsStyles.menu.content.color.main.default,
    },
    link: {
      display: 'flex',
      justifyContent: spaceBetween,
      alingItems: 'baseline',
      width: '100%',
      ...typoRegular,
      lineHeight: '16px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      paddingRight: 24,
      maxHeight: '42px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: leemonsStyles.menu.content.color.main.default,
      borderLeft: `1px solid ${borderLeftLink}`,
      '&:active': {
        backgroundColor: leemonsStyles.menu.background.color.main.active,
        borderTopRightRadius: leemonsStyles.menu.border.radius.md,
        borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      },
      '&:hover': {
        backgroundColor: leemonsStyles.menu.background.color.main.hover,
        borderTopRightRadius: leemonsStyles.menu.border.radius.md,
        borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      },
    },
    linkActive: {
      display: 'flex',
      justifyContent: spaceBetween,
      alingItems: 'baseline',
      width: '100%',
      ...typoRegular,
      lineHeight: '16px',
      padding: 8,
      paddingLeft: 30,
      marginLeft: 25,
      maxHeight: '42px',
      fontSize: theme.fontSizes.sm,
      cursor: 'pointer',
      color: leemonsStyles.menu.content.color.main.default,
      borderLeft: `1px solid ${leemonsStyles.menu.border.color.main.active}`,
      backgroundColor: leemonsStyles.menu.background.color.main.active,
      borderTopRightRadius: leemonsStyles.menu.border.radius.md,
      borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      '&:active': {
        backgroundColor: leemonsStyles.menu.background.color.main.active,
        borderTopRightRadius: leemonsStyles.menu.border.radius.md,
        borderBottomRightRadius: leemonsStyles.menu.border.radius.md,
      },
    },
    itemContainer: {
      display: 'flex',
      position: 'relative',
    },
    badgeNew: {
      '& > div': {
        backgroundColor: '#307AE8 !important',
        border: '1px solid #307AE8 !important',
        padding: '0px 8px 6px 8px',
        height: '18px',
        marginRight: '6px',
      },
    },
    newText: {
      color: 'white',
      fontSize: '8px',
      fontWeight: 600,
      padding: 0,
      marginTop: -10,
    },
    chevron: {
      transition: 'transform 200ms ease',
      color: leemonsStyles.menu.content.color.main.default,
      marginTop: 2,
    },
    chevronContainer: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    icon: {
      width: '18px',
      height: '18px',
      marginTop: 3,
      color: leemonsStyles.menu.content.color.main.default,
    },
  };
});
