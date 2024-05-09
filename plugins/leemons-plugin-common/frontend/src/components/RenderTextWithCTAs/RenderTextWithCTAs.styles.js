import { createStyles } from '@bubbles-ui/components';

export const useRenderTextWithCTAsStyles = createStyles((theme, { align = 'center' } = {}) => ({
  text: {
    ...theme.other.global.content.typo.body.lg,
    textAlign: align,
  },
  cta: {
    fontWeight: 600,
  },
}));

export default useRenderTextWithCTAsStyles;
