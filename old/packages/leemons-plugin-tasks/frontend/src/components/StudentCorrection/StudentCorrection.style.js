import { createStyles } from '@bubbles-ui/components';

export const studentCorrectionStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],
    minWidth: '100%',
    minHeight: '100%',
    backgroundColor: theme.colors.interactive03,
    paddingLeft: theme.spacing[9],
    paddingRight: theme.spacing[9],
    paddingTop: theme.spacing[8],
  },
  accordionPanel: {
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  feedbackContainer: {
    border: `1px solid ${theme.colors.ui01}`,
    padding: theme.spacing[5],
  },
  scoreFeedbackContent: {
    display: 'flex',
    minHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    marginLeft: theme.spacing[4],
  },
  notCorrected: {
    background: theme.white,
    padding: theme.spacing[4],
    borderRadius: theme.spacing[3],
  },
}));

export default studentCorrectionStyles;
