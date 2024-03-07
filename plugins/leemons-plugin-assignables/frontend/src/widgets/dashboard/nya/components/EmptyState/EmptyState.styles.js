import { createStyles } from '@bubbles-ui/components';

export const useEmptyStateStyles = createStyles((theme) => ({
  root: {
    maxWidth: 956,
  },
  title: {
    ...theme.other.global.content.typo.heading.lg,
  },
  title2: {
    ...theme.other.global.content.typo.heading['md--semiBold'],
  },
  text: {
    ...theme.other.global.content.typo.body.lg,
    textAlign: 'center',
  },
  cardContainer: {
    gap: 100,
    maxWidth: 956,
  },
}));

export default useEmptyStateStyles;
