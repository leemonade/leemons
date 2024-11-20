import { createStyles } from '@bubbles-ui/components';

const LibraryCardEmbedStyles = createStyles((theme, { canPlay, fullWidth }) => ({
  root: {
    backgroundColor: theme.colors.mainWhite,
    border: `1px solid ${theme.other.table.border.color.default}`,
    borderRadius: 4,
    width: fullWidth ? '100%' : '432px',
    minWidth: 320,
    minHeight: 66,
    ...(canPlay && {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#F7F8FA',
      },
    }),
  },
  imagePlaceholder: {
    maxWidth: 72,
    minWidth: 72,
    height: '100%',
    maxHeight: 60,
    minHeight: 48,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive03h,
    overflow: 'hidden',
  },
  title: {
    ...theme.other.global.content.typo.body['md--bold'],
  },
  variantIcon: {
    padding: '12px 16px',
    height: '100%',
  },
}));

export { LibraryCardEmbedStyles };
