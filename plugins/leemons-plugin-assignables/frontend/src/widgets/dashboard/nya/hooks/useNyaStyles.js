import { createStyles } from '@bubbles-ui/components';

const useNyaStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '28px',
  },
}));

export default useNyaStyles;
