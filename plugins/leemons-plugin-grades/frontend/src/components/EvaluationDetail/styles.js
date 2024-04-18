import { createStyles, getFontExpressive } from '@bubbles-ui/components';

const EvaluationDetailStyles = createStyles((theme) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
  },
  containerFiftyPercent: {
    width: '50%',
  },
  containerTwentyPercent: {
    width: '20%',
  },
  inputsTableHeader: {
    display: 'flex',
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scalesDescription: {
    width: 362,
  },
  tableButton: {
    marginTop: 24,
  },
}));

export { EvaluationDetailStyles };
