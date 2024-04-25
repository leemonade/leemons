import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryCardEmbedStyles = createStyles((theme, { canPlay }) => ({
  root: {
    backgroundColor: theme.colors.mainWhite,
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
    maxHeight: 58,
    minHeight: 58,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive03h,
    overflow: 'hidden',
  },
  imageStyles: {
    borderRadius: 4,
  },
  title: {
    ...theme.other.global.content.typo.body['md--bold'],
  },
  variantIcon: {
    marginRight: pxToRem(8),
  },
}));

export { LibraryCardEmbedStyles };
