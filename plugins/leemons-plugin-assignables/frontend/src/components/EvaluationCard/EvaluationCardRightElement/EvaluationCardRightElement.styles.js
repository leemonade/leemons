import { createStyles, pxToRem } from "@bubbles-ui/components";

const EvaluationCardRightElementStyles = createStyles((theme) => {
  const { cardEvaluation } = theme.other;
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      minWidth: pxToRem(160),
      maxWidth: pxToRem(160),
      height: pxToRem(212),
      backgroundColor: cardEvaluation.background.color.top,
      borderTopRightRadius: cardEvaluation.border.radius.sm,
      borderBottomRightRadius: cardEvaluation.border.radius.sm,
    },
  }
});

export default EvaluationCardRightElementStyles;
export { EvaluationCardRightElementStyles };