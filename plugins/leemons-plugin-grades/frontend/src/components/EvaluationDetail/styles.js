import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const EvaluationDetailStyles = createStyles((theme) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
  },
}));
