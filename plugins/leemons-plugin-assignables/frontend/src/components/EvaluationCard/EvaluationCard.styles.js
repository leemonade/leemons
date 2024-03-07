import { createStyles, pxToRem, getBoxShadowFromToken } from '@bubbles-ui/components';

const EvaluationCardStyles = createStyles((theme, { color }) => {
  const { cardEvaluation } = theme.other;
  const getCardShadow = getBoxShadowFromToken(cardEvaluation.shadow.hover[0]);
  return {
    root: {
      borderRadius: cardEvaluation.border.radius.sm,
      border: `${cardEvaluation.border.width.sm} solid ${cardEvaluation.border.color.subtle}`,
      minHeight: pxToRem(194),
      maxHeight: pxToRem(194),
      maxWidth: pxToRem(488),
      minWidth: pxToRem(400),
      overflow: 'hidden',
      display: 'flex',
      flexWrap: 'inherit',

      justifyContent: 'space-between',
      '&:hover': {
        boxShadow: getCardShadow.boxShadow,
      },
      backgroundColor: cardEvaluation.background.color.default,
    },
    wrapper: {
      display: 'flex',
      position: 'relative',
    },
    color: {
      backgroundColor: color,
      width: 4,
      height: pxToRem(194),
    },
  };
});

export default EvaluationCardStyles;
export { EvaluationCardStyles };
