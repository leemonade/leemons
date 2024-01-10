import { createStyles, pxToRem } from '@bubbles-ui/components';

const resourceStyles = createStyles(() => ({
  root: {
    paddingTop: pxToRem(8),
    paddingBottom: pxToRem(16),
    paddingLeft: pxToRem(8),
  },
}));

export default resourceStyles;
export { resourceStyles };
