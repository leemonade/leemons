import { createStyles, pxToRem } from '@bubbles-ui/components';

const EvaluationCardBodyStyles = createStyles((theme) => {
  const { cardEvaluation } = theme.other;
  return {
    root: {
      minHeight: '100%',
      minWidth: pxToRem(324),
      maxWidth: pxToRem(362),
      padding: `${cardEvaluation.spacing.padding.horizontal.md} ${cardEvaluation.spacing.padding.vertical.md}`,
      backgroundColor: cardEvaluation.background.color.default,
      position: 'relative',
    },
    title: {
      ...cardEvaluation.content.typo.lg,
      color: cardEvaluation.content.color.emphasis,
      marginRight: cardEvaluation.spacing.padding.vertical.md,
      width: 'auto',
    },
    classroomContainer: {
      paddingTop: cardEvaluation.spacing.gap.lg,
      paddingBottom: cardEvaluation.spacing.gap.md,
    },
    deadline: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo['sm--medium'],
    },
  };
});

export default EvaluationCardBodyStyles;
export { EvaluationCardBodyStyles };
