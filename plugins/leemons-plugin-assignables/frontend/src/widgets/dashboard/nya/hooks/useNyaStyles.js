import { createStyles } from '@bubbles-ui/components';

const useNyaStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[8],
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[7],
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...theme.other.global.content.typo.heading.sm,
  },
}));

export default useNyaStyles;
