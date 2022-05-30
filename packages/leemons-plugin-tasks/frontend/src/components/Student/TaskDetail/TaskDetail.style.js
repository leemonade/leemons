import { createStyles } from '@bubbles-ui/components';

export const TaskDetailStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rootContent: {
    maxWidth: theme.breakpoints.sm,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepper: {
    minWidth: '276px',
    width: '276px',
    height: 'fit-content',
  },
  content: {
    maxWidth: theme.breakpoints.sm,
    marginLeft: theme.spacing[13],
    marginRight: theme.spacing[13],
    marginTop: theme.spacing[7],
    marginBottom: theme.spacing[7],
  },
  nav: {
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  sidebar: {
    minWidth: '280px',
    width: '280px',
    minHeight: '100%',
    backgroundColor: theme.colors.gray[3],
    padding: theme.spacing[4],
  },
}));

export default TaskDetailStyles;
