import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryNavbarItemStyles = createStyles((theme, { selected, disabled, loading, opened, canOpen }) => ({
  root: {
    display: 'flex',
    alignItems: !canOpen ? 'center' : 'flex-start',
    height: 48,
    cursor: 'pointer',
    justifyContent: 'space-between',
    backgroundColor: selected && theme.other.core.color.primary['200'],
    color: theme.other.core.color.secondary['100'],
    fontWeight: selected ? 500 : 400,
    padding: 12,
    paddingTop: canOpen ? 8 : 12,
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
    alignItems: 'center',
    gap: 12,
  },
  chev: {
    transition: '150ms',
    transform: opened ? 'rotate(0deg)' : 'rotate(180deg)',
    lineHeight: 0,
  },
  label: {
    color: theme.other.core.color.secondary['100'],
  },
  iconWrapper: {
    position: 'relative',
    minWidth: 16,
    width: 16,
    height: 16,
    color: theme.other.core.color.secondary['100'],
    top: 0,
  },
  icon: {
    width: pxToRem(16),
    margin: '0 auto',
  },
}));

export { LibraryNavbarItemStyles };
