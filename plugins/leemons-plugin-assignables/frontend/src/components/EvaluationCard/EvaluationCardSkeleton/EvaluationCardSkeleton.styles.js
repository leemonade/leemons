import { createStyles, pxToRem } from '@bubbles-ui/components';

const EvaluationCardSkeletonStyles = createStyles((theme) => {
  const cardEvaluation = theme?.other?.cardEvaluation;
  return {
    root: {
      width: '100%',
      borderRadius: cardEvaluation.border.radius.sm,
      border: `${cardEvaluation.border.width.sm} solid ${cardEvaluation.border.color.subtle}`,
      minHeight: pxToRem(212),
      maxHeight: pxToRem(212),
      maxWidth: pxToRem(536),
      minWidth: pxToRem(488),
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
    },
    wrapper: {
      display: 'flex',
    },
    color: {
      width: 4,
      height: pxToRem(212),
    },
    leftContent: {
      padding: pxToRem(12),
      minWidth: pxToRem(324),
      maxWidth: pxToRem(372),
      width: 372,
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: pxToRem(40),
    },
    footerWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: pxToRem(6),
    },
    rigthContent: {
      width: pxToRem(160),
      height: '100%',
    },
  };
});

export default EvaluationCardSkeletonStyles;
export { EvaluationCardSkeletonStyles };
