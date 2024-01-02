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
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
    marginBottom: theme.spacing[4],
  },
}));

export default useNyaStyles;
