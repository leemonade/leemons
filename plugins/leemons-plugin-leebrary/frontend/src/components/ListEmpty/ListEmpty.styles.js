import { createStyles } from '@bubbles-ui/components';

export const useListEmptyStyles = createStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    ...theme.other.global.content.typo.heading.lg,
  },
  text: {
    ...theme.other.global.content.typo.body.lg,
    textAlign: 'center',
  },
}));

export default useListEmptyStyles;
