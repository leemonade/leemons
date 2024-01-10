import { createStyles, pxToRem } from '@bubbles-ui/components';

const useEvaluationStateDisplayStyles = createStyles((theme) => {
  const { cardModule } = theme.other;
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: pxToRem(8),
    },
    icon: {
      color: cardModule.content.phatic.positive,
      marginTop: pxToRem(3),
    },
    container: {
      display: 'flex',
      gap: pxToRem(8),
    },
    text: {
      color: cardModule.content.phatic.positive,
      ...theme.other.global.content.typo.body['xsm--semiBold'],
    },
  };
});

export default useEvaluationStateDisplayStyles;
export { useEvaluationStateDisplayStyles };
