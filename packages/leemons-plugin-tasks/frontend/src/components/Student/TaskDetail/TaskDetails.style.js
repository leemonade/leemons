import { createStyles } from '@bubbles-ui/components';

export const TaskDetailStyles = createStyles((theme) => ({
  root: {
    width: '100%',
  },
  stepper: {
    width: 276,
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
    width: 280,
    minHeight: '100%',
    backgroundColor: theme.colors.gray[3],
    padding: theme.spacing[4],
  },
}));

export default TaskDetailStyles;
