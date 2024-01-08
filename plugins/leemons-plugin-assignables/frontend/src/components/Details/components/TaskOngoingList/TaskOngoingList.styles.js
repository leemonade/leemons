import { createStyles } from '@bubbles-ui/components';

const TaskOngoingListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.padding['2xlg'],
    },
    title: {
      ...globalTheme.content.typo.heading.md,
    },
  };
});

export { TaskOngoingListStyles };
export default TaskOngoingListStyles;
