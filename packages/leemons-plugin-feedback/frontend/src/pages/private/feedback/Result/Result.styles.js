import { createStyles } from '@bubbles-ui/components';

const ResultStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.interactive03,
  },
  container: {
    width: '100%',
    maxWidth: 710,
    marginTop: 28,
  },
  resultHeader: {
    backgroundColor: theme.colors.mainWhite,
    padding: 16,
    paddingTop: 12,
    borderRadius: 8,
  },
}));

export default ResultStyles;
