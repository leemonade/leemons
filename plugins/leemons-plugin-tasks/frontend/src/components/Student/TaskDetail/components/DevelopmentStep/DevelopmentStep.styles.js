import { createStyles } from '@bubbles-ui/components';

const useDevelopmentStepStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.padding['2xlg'],
    },
  };
});

export default useDevelopmentStepStyles;
