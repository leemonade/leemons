import { createStyles } from '@bubbles-ui/components';

const ResultStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.interactive03,
    minHeight: '100%',
    paddingBottom: 300,
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
  generalInformation: {
    paddingBlock: 24,
    paddingInline: 36,
  },
  infoBox: {
    backgroundColor: theme.colors.mainWhite,
    paddingInline: 16,
    paddingBlock: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    borderRadius: 4,
  },
  infoText: {
    color: theme.colors.text01,
    fontSize: 32,
    fontWeight: 500,
    lineHeight: '24px',
  },
  question: {
    paddingBlock: 22,
    paddingInline: 16,
    backgroundColor: theme.colors.mainWhite,
    '*': {
      fontSize: 16,
    },
  },
}));

export default ResultStyles;
