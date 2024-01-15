import { createStyles, pxToRem, getBoxShadowFromToken } from '@bubbles-ui/components';

const useEvaluationCardStyles = createStyles((theme, { color }) => {
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
      justifyContent: 'space-between',
      flexWrap: 'inherit',
      '&:hover': {
        boxShadow: getCardShadow.boxShadow,
      },
      backgroundColor: cardEvaluation.background.color.default,
    },
    color: {
      backgroundColor: color,
      width: 4,
      height: pxToRem(194),
    },
    leftContainer: {
      padding: `${cardEvaluation.spacing.padding.horizontal.md} ${cardEvaluation.spacing.padding.vertical.md}`,
      minWidth: pxToRem(324),
      maxWidth: pxToRem(362),
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      marginLeft: 0,
    },
    botLeftSection: {
      marginBottom: pxToRem(4),
    },
    activityName: {
      ...cardEvaluation.content.typo.lg,
      color: cardEvaluation.content.color.emphasis,
      marginRight: cardEvaluation.spacing.padding.vertical.md,
      width: 'auto',
      paddingBottom: cardEvaluation.spacing.gap.lg,
    },
    delivered: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo['sm--medium'],
    },
    footer: {
      display: 'flex',
      width: 'auto',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: pxToRem(16),
      right: pxToRem(16),
      left: pxToRem(16),
    },
  };
});

export default useEvaluationCardStyles;
export { useEvaluationCardStyles };
