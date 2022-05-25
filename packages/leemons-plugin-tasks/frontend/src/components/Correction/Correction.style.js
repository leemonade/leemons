import { createStyles } from '@bubbles-ui/components';

export const CorrectionStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.interactive03,
    minHeight: '100%',
  },
  aside: {
    marginTop: theme.spacing[10],
    background: theme.colors.uiBackground04,
    width: '332px',
    minHeight: '100%',
  },
  main: {
    margin: theme.spacing[10],
    width: '100%',
    overflow: 'auto',
  },
  accordionPanel: {
    padding: `${theme.spacing[4]}px ${theme.spacing[5]}px`,
  },
}));

export default CorrectionStyles;
