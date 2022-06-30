import { createStyles } from '@bubbles-ui/components';

export const TaskDetailStyles = createStyles((theme, { onlyNext, marginTop }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepper: {
    minWidth: '276px',
    width: '276px',
    maxWidth: '276px',
    height: 'fit-content',
  },
  stepperFixed: {
    position: 'absolute',
    top: marginTop,
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
  sidebar: {
    minWidth: '280px',
    maxWidth: '280px',
  },
  sidebarFixed: {
    height: `calc(100vh - ${marginTop}px)`,
    position: 'absolute',
    top: marginTop,
    right: 0,
  },
}));

export default TaskDetailStyles;
