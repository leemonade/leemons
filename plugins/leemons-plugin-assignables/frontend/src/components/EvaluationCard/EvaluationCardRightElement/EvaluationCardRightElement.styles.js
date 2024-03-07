/* eslint-disable sonarjs/no-duplicate-string */
import { createStyles, pxToRem } from '@bubbles-ui/components';

const EvaluationCardRightElementStyles = createStyles((theme) => {
  const { cardEvaluation, badge, cardAssignments } = theme.other;
  return {
    root: {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      maxWidth: pxToRem(160),
      minWidth: pxToRem(125),
      height: pxToRem(194),
      backgroundColor: cardEvaluation.background.color.top,
      borderTopRightRadius: cardEvaluation.border.radius.sm,
      borderBottomRightRadius: cardEvaluation.border.radius.sm,
    },
    badgeText: {
      ...badge.content.typo.caption,
      lineHeight: '14px',
    },
    calificationBadge: {
      position: 'absolute',
      top: pxToRem(16),
      right: pxToRem(16),
      display: 'flex',
      justifyContent: 'flex-end',
      '& > div': {
        backgroundColor: badge.background.color.neutral.white,
        borderRadius: 4,
        border: `1px solid ${badge.border.color.white}}`,
        color: badge.content.color.default,
        fontSize: 10,
        lineHeight: '14px',
        '&:hover': {
          backgroundColor: `${badge.background.color.neutral.white} !important`,
          color: 'red',
        },
      },
    },
    module: {},
    commonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      gap: pxToRem(8),
      marginTop: pxToRem(16),
    },
    labelPercentage: {
      display: 'flex',
      justifyContent: 'center',
    },
    textPercentage: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo['sm--medium'],
    },
    submitedNumber: {
      ...cardEvaluation.content.typo['sm--medium'],
      fontSize: pxToRem(48),
      fontWeight: 500,
      lineHeight: '40px',
      letterSpacing: '-0.96px',
      color: cardAssignments.content.color.subje,
    },
    separator: {
      ...cardEvaluation.content.typo['sm--medium'],
      fontSize: pxToRem(24),
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '28px',
      color: cardAssignments.content.color.subje,
    },
    pendigLabelContainer: {
      width: 100,
      textAlign: 'center',
      lineHeight: '16px',
    },
    pendingLabel: {
      ...cardEvaluation.content.typo.sm,
      color: cardAssignments.content.color.subje,
    },
  };
});

export default EvaluationCardRightElementStyles;
export { EvaluationCardRightElementStyles };
