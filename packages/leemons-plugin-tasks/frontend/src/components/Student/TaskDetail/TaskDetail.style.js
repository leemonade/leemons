import { createStyles } from '@bubbles-ui/components';

export const TaskDetailStyles = createStyles((theme) => ({
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
    height: 'fit-content',
  },
  content: {
    minWidth: '50%',
    padding: `0 ${theme.spacing.lg}px`,
    margin: `${theme.spacing[4]}px auto`,
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
