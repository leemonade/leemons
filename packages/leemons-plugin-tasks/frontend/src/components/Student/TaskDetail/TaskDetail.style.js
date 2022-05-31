import { createStyles } from '@bubbles-ui/components';

export const TaskDetailStyles = createStyles((theme, { onlyNext }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepper: {
    minWidth: '276px',
    width: '276px',
    maxWidth: '276px',
    height: 'fit-content',
  },
  content: {
    width: '100%',
    maxWidth: theme.breakpoints.sm,
    marginLeft: theme.spacing[13],
    marginRight: theme.spacing[13],
    marginTop: theme.spacing[7],
    marginBottom: theme.spacing[7],
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: onlyNext ? 'flex-end' : 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
}));

export default TaskDetailStyles;
