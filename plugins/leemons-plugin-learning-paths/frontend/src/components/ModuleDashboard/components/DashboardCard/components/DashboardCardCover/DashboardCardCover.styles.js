import { createStyles, pxToRem } from '@bubbles-ui/components';

const DashboardCardCoverStyles = createStyles((theme, { subjectColor }) => {
  const { ChipModule, cardEvaluation, cardModule } = theme.other;
  return {
    root: {
      width: '100%',
      height: pxToRem(144),
      minHeight: pxToRem(144),
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '4px 4px 0px 0px',
    },
    orderLabel: {
      position: 'absolute',
      left: 0,
      bottom: pxToRem(8),
      backgroundColor: ChipModule.background.color.default,
      borderRadius: '0px 4px 4px 0px',
      padding: `${pxToRem(8)} ${pxToRem(12)}`,
    },
    color: {
      width: '100%',
      height: pxToRem(4),
      backgroundColor: subjectColor || 'transparent',
      transition: 'all 0.2s ease-out',
      borderRadius: '2px 0 0 0',
    },
    commonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: pxToRem(144),
      minHeight: pxToRem(144),
      width: '100%',
      gap: pxToRem(8),
      backgroundColor: cardModule.background.color.top,
      position: 'relative',
    },
    labelPercentage: {
      display: 'flex',
      justifyContent: 'center',
    },
    textPercentage: {
      color: cardEvaluation.content.color.subje,
      ...cardEvaluation.content.typo['sm--medium'],
    },
  };
});

export default DashboardCardCoverStyles;
export { DashboardCardCoverStyles };
