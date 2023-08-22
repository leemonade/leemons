import { createStyles } from '@bubbles-ui/components';

export const CorrectionStyles = createStyles((theme) => ({
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],
  },
  mainButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[3],
  },
  accordionPanel: {
    padding: `${theme.spacing[4]}px ${theme.spacing[5]}px`,
  },
  type: {
    padding: theme.spacing[4],
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[1],
  },
}));

export default CorrectionStyles;
