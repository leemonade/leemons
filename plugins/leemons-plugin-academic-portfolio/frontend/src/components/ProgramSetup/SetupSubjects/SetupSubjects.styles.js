import { createStyles } from '@bubbles-ui/components';

export const SetupSubjectsStyles = createStyles((theme, {}) => {
  return {
    root: {},
    mathSymbol: {
      paddingTop: theme.spacing[3],
    },
    subjectID: {
      whiteSpace: 'nowrap',
    },
    subjectsID: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      paddingTop: theme.spacing[4],
    },
  };
});
