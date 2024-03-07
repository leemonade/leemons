import { createStyles } from '@bubbles-ui/components';

export const useEmptyStateStyles = createStyles((theme) => ({
  title: {
    ...theme.other.global.content.typo.heading.lg,
  },
  text: {
    ...theme.other.global.content.typo.body.lg,
    textAlign: 'center',
  },
}));

export default useEmptyStateStyles;
