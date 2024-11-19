import { createStyles, pxToRem } from '@bubbles-ui/components';

const useEvaluationStateDisplayStyles = createStyles((theme) => {
  const font = theme.other.global.content.typo.body['xsm--semiBold'];

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: pxToRem(8),
      height: font.lineHeight,
    },
    icon: {
      marginTop: pxToRem(3),
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: pxToRem(8),
    },
    text: {
      ...font,
    },
  };
});

export default useEvaluationStateDisplayStyles;
export { useEvaluationStateDisplayStyles };
