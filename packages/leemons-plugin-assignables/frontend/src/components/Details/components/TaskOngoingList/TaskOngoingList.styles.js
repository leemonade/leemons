import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const TaskOngoingListStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    header: {
      position: 'relative',
      height: 224,
    },
    mainContent: {
      height: '370px',
      backgroundColor: theme.colors.mainWhite,
      display: 'flex',
    },
    leftSide: {
      width: '50%',
      padding: '16px 32px',
    },
    leftScoreBarWrapper: {
      height: 150,
      display: 'flex',
      marginTop: 48,
    },
    rightScoreBarWrapper: {
      height: '93%',
      width: '100%',
      marginTop: 24,
    },
    scoreBarLeftLegend: {
      display: 'flex',
      flexDirection: 'column',
      gap: 23,
      marginTop: 15,
      marginRight: 60,
    },
    legend: {
      display: 'flex',
      gap: 8,
      color: '#8E97A2',
    },
    rightSide: {
      width: '50%',
      padding: 24,
    },
  };
});
