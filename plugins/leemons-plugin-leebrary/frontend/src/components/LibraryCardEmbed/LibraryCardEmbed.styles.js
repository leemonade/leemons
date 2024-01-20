import { createStyles } from '@bubbles-ui/components';

const LibraryCardEmbedStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.mainWhite,
    minHeight: 66,
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
}));

export { LibraryCardEmbedStyles };
