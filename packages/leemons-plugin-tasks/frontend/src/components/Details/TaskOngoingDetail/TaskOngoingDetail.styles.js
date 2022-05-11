import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const TaskOngoingDetailStyles = createStyles((theme, {}) => {
  return {
    root: {},
    header: {
      position: 'relative',
      height: 160,
      backgroundColor: theme.colors.interactive03,
    },
    verticalStepper: {
      width: 232,
    },
    mainContent: {
      display: 'flex',
    },
    detail: {
      paddingTop: 24,
      paddingInline: 143,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 48,
      width: '100%',
      overflow: 'hidden',
    },
    comments: { padding: 24, width: '100%' },
    scoreBarLeftLegend: {
      width: 190,
      'div:first-child': {
        marginBottom: 32,
      },
      marginRight: 32,
    },
    legend: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    scoreBarWrapper: {
      marginTop: 16,
      width: '100%',
      height: 180,
      display: 'flex',
    },
    assetPlayerWrapper: {
      height: 376,
    },
    submitButton: {
      textAlign: 'right',
    },
  };
});
