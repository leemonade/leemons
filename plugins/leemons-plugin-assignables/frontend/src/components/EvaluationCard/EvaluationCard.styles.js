import { createStyles, pxToRem, getBoxShadowFromToken } from '@bubbles-ui/components';

const EvaluationCardStyles = createStyles((theme, { color, isHovered }) => {
  const { cardEvaluation } = theme.other;
  const getCardShadow = getBoxShadowFromToken(cardEvaluation.shadow.hover[0]);
  return {
    root: {
      borderRadius: cardEvaluation.border.radius.sm,
      border: `${cardEvaluation.border.width.sm} solid ${cardEvaluation.border.color.subtle}`,
      minHeight: pxToRem(212),
      maxHeight: pxToRem(212),
      maxWidth: pxToRem(536),
      minWidth: pxToRem(488),
      overflow: 'hidden',
      boxShadow: isHovered ? getCardShadow.boxShadow : 'none',
      display: 'flex',
      justifyContent: 'space-between',
    },
    wrapper: {
      display: 'flex',
      position: 'relative',
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
