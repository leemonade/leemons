import { createStyles, pxToRem, getBoxShadowFromToken } from '@bubbles-ui/components';

const EvaluationCardStyles = createStyles((theme, { color, isHovered }) => {
  const { cardEvaluation } = theme.other
  const getCardShadow = getBoxShadowFromToken(cardEvaluation.shadow.hover[0])
  return {
    root: {
      borderRadius: cardEvaluation.border.radius.sm,
      border: `${cardEvaluation.border.width.sm} solid ${cardEvaluation.border.color.subtle}`,
      minHeight: pxToRem(212),
      maxHeight: pxToRem(212),
      width: 'auto',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: isHovered ? getCardShadow.boxShadow : 'none',
      display: 'flex'
    },
    wrapper: {
      display: 'flex',
    },
    color: {
      backgroundColor: color,
      width: 4,
      height: pxToRem(212),
    },
  };
});

export default EvaluationCardStyles;
export { EvaluationCardStyles };
