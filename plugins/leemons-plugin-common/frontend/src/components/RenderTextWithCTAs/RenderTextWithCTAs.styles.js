import { createStyles } from '@bubbles-ui/components';

export const useRenderTextWithCTAsStyles = createStyles((theme) => ({
  text: {
    ...theme.other.global.content.typo.body.lg,
    textAlign: 'center',
  },
  cta: {
    fontWeight: 600,
  },
}));

export default useRenderTextWithCTAsStyles;
