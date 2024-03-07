import { createStyles } from '@bubbles-ui/components';

export const useProgramBarSelectorStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    height: '80px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '24px',
    paddingRight: '24px',
    gap: theme.spacing[4],
  },
}));

export default useProgramBarSelectorStyles;
