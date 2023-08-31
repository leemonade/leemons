import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

export const LibraryNavbarItemStyles = createStyles(
  (theme, { selected, disabled, loading, opened }) => {
    return {
      root: {
        ...getFontExpressive(theme.fontSizes['2'], 500),
        display: 'flex',
        alignItems: 'center',

        cursor: 'pointer',
        justifyContent: 'space-between',
        backgroundColor: selected && theme.other.menuLibrary.background.color.main.active,
        color: disabled
          ? theme.other.menuLibrary.content.color.main.default
          : selected && theme.other.menuLibrary.content.color.main.active,
        padding: 16,
        marginInline: 8,
        width: 'calc(100% - 16px)',
        borderRadius: 8,
        '&:hover': {
          cursor: disabled ? 'not-allowed' : loading ? 'progress' : 'pointer',
          backgroundColor:
            !selected && !disabled && theme.other.menuLibrary.background.color.main.hover,
        },
      },
      item: {
        display: 'flex',
        gap: 12,
      },
      chev: {
        transition: '150ms',
        transform: opened ? 'rotate(0deg)' : 'rotate(180deg)',
      },
      label: {
        color: (selected || disabled) && 'inherit',
      },
      iconWrapper: {
        position: 'relative',
        width: pxToRem(16),
        height: pxToRem(16),
        color: disabled
          ? theme.colors.text06
          : selected
          ? theme.other.menuLibrary.content.color.main.active
          : theme.other.menuLibrary.content.color.main.default,
      },
      icon: {
        width: pxToRem(16),
        margin: '0 auto',
      },
    };
  }
);
