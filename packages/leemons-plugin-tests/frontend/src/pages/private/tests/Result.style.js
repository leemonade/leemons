import { createStyles } from '@bubbles-ui/components';

export const ResultStyles = createStyles((theme, {}) => ({
  container: {},
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
}));
