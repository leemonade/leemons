import { createStyles, pxToRem } from '@bubbles-ui/components';

const useScoreFeedbackStyles = createStyles((theme, { color: _c, fullSize }) => {
  const { cardEvaluation, badge, global } = theme.other;
  let color;
  switch (_c) {
    case 'error':
      color = theme.other.global.content.color.negative;
      break;
    case 'warning':
      color = theme.other.global.content.color.attention;
      break;
    case 'success':
      color = theme.other.global.content.color.positive;
      break;
    default:
      color = undefined;
  }

  return {
    root: {
      height: fullSize ? '100%' : pxToRem(194),
      maxWidth: fullSize ? '100%' : pxToRem(160),
      minWidth: fullSize ? '100%' : pxToRem(125),
      backgroundColor: cardEvaluation.background.color.top,
      display: 'flex',
      flexDirection: 'column',
      borderTopRightRadius: theme.other.global.border.radius.md,
      borderBottomRightRadius: theme.other.global.border.radius.md,
      position: 'relative',
    },
    containerGrade: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      gap: pxToRem(8),
    },
    containerNumber: {
      display: 'flex',
      alignItems: 'baseline',
    },
    containerFeedback: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: pxToRem(16),
    },
    textFeedback: {
      color: global.content.color.text.default,
      ...global.content.typo.body.xsm,
    },
    gradeNumber: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo.xxl,
      fontSize: pxToRem(48),
    },
    gradeDecimals: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo.xl,
      fontSize: pxToRem(24),
    },
    descriptionGrade: {
      textAlign: 'center',
      paddingLeft: pxToRem(12),
      paddingRight: pxToRem(12),
    },
    containerArrow: {
      marginLeft: pxToRem(8),
    },
    feedback: {
      flex: '1 0',
      background: color?.default,
    },
    icon: {
      position: 'relative',
      height: 46,
      width: 51,
    },
    iconText: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      ...theme.other.score.content.typo['2xlg'],
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
    submitedNumber: {
      color: cardEvaluation.content.color.muted,
      ...cardEvaluation.content.typo.sm,
    },
  };
});

export default useScoreFeedbackStyles;
export { useScoreFeedbackStyles };
