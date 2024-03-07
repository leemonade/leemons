import { createStyles, pxToRem } from '@bubbles-ui/components';

const introductionStyles = createStyles((theme) => {
  const { global } = theme.other;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: pxToRem(16),
    },
    title: {
      ...global.content.typo.heading['sm--semiBold'],
    },
    introduction: {
      ...global.content.typo.heading['sm--medium'],
    },
    resources: {
      maxWidth: pxToRem(440),
      minWidth: pxToRem(440),
    },
  };
});

export default introductionStyles;
export { introductionStyles };
