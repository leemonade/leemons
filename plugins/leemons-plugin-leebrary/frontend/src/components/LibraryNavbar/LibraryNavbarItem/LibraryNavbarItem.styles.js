import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

const LibraryNavbarItemStyles = createStyles((theme, { selected, disabled, loading, opened }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    cursor: 'pointer',
    justifyContent: 'space-between',
    backgroundColor: selected && theme.other.core.color.primary['200'],
    color: theme.other.core.color.secondary['100'],
    fontWeight: selected ? 500 : 400,
    padding: 12,
    marginInline: 8,
    width: 'calc(100% - 16px)',
    borderRadius: 8,
    '&:hover': {
      cursor: disabled ? 'not-allowed' : loading ? 'progress' : 'pointer',
      backgroundColor: !selected && !disabled && theme.other.core.color.primary['100'],
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
    color: theme.other.core.color.secondary['100'],
  },
  iconWrapper: {
    position: 'relative',
    width: pxToRem(16),
    height: pxToRem(16),
    color: theme.other.core.color.secondary['100'],
  },
  icon: {
    width: pxToRem(16),
    margin: '0 auto',
  },
}));

export { LibraryNavbarItemStyles };
