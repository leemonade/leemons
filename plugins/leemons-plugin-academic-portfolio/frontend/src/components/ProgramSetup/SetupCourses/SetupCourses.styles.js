import { createStyles } from '@bubbles-ui/components';

export const SetupCoursesStyles = createStyles((theme, { onlyOneCourse }) => {
  return {
    root: {},
    numInputHeader: {
      width: '60%',
    },
    onlyOneCourse: {
      visibility: onlyOneCourse && 'hidden',
      position: onlyOneCourse && 'absolute',
    },
  };
});
