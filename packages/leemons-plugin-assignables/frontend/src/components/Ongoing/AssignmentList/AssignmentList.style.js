import { createStyles } from '@bubbles-ui/components';

export const useAssignmentListStyle = createStyles((theme) => ({
  root: {
    marginLeft: theme.spacing[10],
    marginRight: theme.spacing[8],
  },
  title: {
    position: 'relative',
    marginTop: theme.spacing[6],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}));

export default useAssignmentListStyle;
