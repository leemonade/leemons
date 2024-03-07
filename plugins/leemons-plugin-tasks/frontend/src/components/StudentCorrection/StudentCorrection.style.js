import { createStyles } from '@bubbles-ui/components';

export const useStudentCorrectionStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding['2xlg'],
  },
  accordionPanel: {
    paddingLeft: 34,
    paddingRight: 16,
  },
}));

export default useStudentCorrectionStyles;
