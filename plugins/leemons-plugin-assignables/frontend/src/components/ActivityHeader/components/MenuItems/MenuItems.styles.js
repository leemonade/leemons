import { createStyles, pxToRem } from '@bubbles-ui/components';

const MenuItemsStyles = createStyles((theme, { showMenu }) => {
  const focusDefaultBorder = theme.other.global.focus['default-border'];
  const buttonIconCardStyles = theme.other.buttonIconCard;
  return {
    root: {
      marginLeft: theme.other.global.spacing.gap.lg,
    },
    ellipsisBox: {
      position: 'relative',
      width: pxToRem(24),
      height: pxToRem(24),
      padding: pxToRem(2),
      backgroundColor: showMenu ? '#4D5358B2' : theme.other.core.color.white,
      borderRadius: theme.other.button.border.radius.md,
      '&:hover': {
        backgroundColor: '#4D5358B2',
        '& svg': {
          color: theme.other.core.color.white,
        },
        '& > *': {
          color: theme.other.core.color.white,
        },
      },
      '&:focus-visible': {
        outline: 'none',
        backgroundColor: buttonIconCardStyles.background.color.primary.hover,
        border: `${focusDefaultBorder.width} ${focusDefaultBorder.style} ${focusDefaultBorder.color}`,
        borderRadius: buttonIconCardStyles.border.radius.md,
      },
    },
    menuIcon: {
      color: showMenu
        ? theme.other.core.color.white
        : theme.other.global.content.color.icon.default,
      zIndex: 10,
      position: 'absolute',
      marginBottom: 0,
      top: 4,
      right: 4,
    },
    menuItem: {
      '&:hover': {
        backgroundColor: theme.other.core.color.primary['100'],
      },
    },
  };
});

export { MenuItemsStyles };
