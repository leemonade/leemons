import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const ScoresPeriodFormStyles = createStyles((theme) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    selectWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
    },
    buttonWrapper: {
      marginTop: theme.spacing[4],
    },
    periodWrapper: {
      marginTop: theme.spacing[2],
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      border: `1px solid ${theme.colors.ui01}`,
      borderRadius: theme.spacing[1],
    },
    datePicker: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
      div: {
        flex: 1,
      },
    },
    period: {
      border: `1px solid ${theme.colors.ui01}`,
      borderRadius: theme.spacing[1],
      padding: theme.spacing[4],
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
      cursor: 'pointer',
    },
    periodsList: {
      marginTop: theme.spacing[2],
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
    },
    customPeriodTitle: {
      marginTop: theme.spacing[2],
    },
    selectedPeriod: {
      borderColor: theme.colors.interactive01d,
      backgroundColor: theme.colors.interactive01v1,
    },
    closeButton: {
      flex: 1,
      display: 'flex',
      justifyContent: 'end',
    },
    createContent: {
      marginTop: theme.spacing[6],
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[4],
    },
  };
});
