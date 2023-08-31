import { createStyles } from '@bubbles-ui/components';

export const DatasetItemDrawerStyles = createStyles((theme, {}) => {
  return {
    preview: {
      backgroundColor: theme.colors.uiBackground01,
      display: 'block',
    },
    previewTitle: {
      color: theme.colors.text04,
      textTransform: 'uppercase',
    },
    grid: {
      margin: 0,
    },
    leftColContainer: {
      height: '100vh',
      backgroundColor: theme.colors.ui02,
    },
    rightColContainer: {
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: 0,
      paddingBottom: 92,
    },
    rightColContent: {
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box',
      padding: theme.spacing[7],
      paddingTop: theme.spacing[13],
    },
    divider: {
      marginTop: theme.spacing[5],
      marginBottom: theme.spacing[5],
    },
    saveSection: {
      boxSizing: 'border-box',
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '100%',
      padding: theme.spacing[5],
      backgroundColor: theme.colors.uiBackground01,
      justifyContent: 'end',
      display: 'flex',
    },
  };
});
