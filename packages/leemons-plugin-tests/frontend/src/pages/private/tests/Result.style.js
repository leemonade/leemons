import { createStyles } from '@bubbles-ui/components';

export const ResultStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    gap: theme.spacing[10],
  },

  leftContent: {
    width: '332px',
    marginTop: theme.spacing[6],
  },
  rightContent: {
    width: '100%',
  },
  rightContentTeacher: {
    width: 'calc(100% - 332px)',
  },
  header: {
    textAlign: 'center',
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],
  },
  firstTableHeader: {
    paddingLeft: `${theme.spacing[6]}px !important`,
  },
  tableHeader: {
    backgroundColor: theme.colors.interactive03h,
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[6],
    paddingLeft: theme.spacing[5],
  },
  tableCell: {
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
  showTestBar: {
    backgroundColor: theme.colors.uiBackground01,
    padding: theme.spacing[4],
    display: 'flex',
    justifyContent: 'end',
  },
  feedbackUser: {
    border: '1px solid',
    borderColor: theme.colors.ui01,
    borderRadius: theme.spacing[1],
    padding: theme.spacing[4],
  },
}));

export default ResultStyles;
