import { createStyles } from '@bubbles-ui/components';

const useTotalLayoutStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.xlg,
      alignItems: 'center',
    },
    activityMetadata: {
      height: 24,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      textWrap: 'nowrap',
      '> *': {
        '&:not(:last-child)': {
          borderRight: '1px solid #DDE1E6',
        },
        '&:last-child': {
          paddingRight: 0,
        },
        padding: globalTheme.spacing.padding.xsm,
      },
    },
    viewDetailButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

export default useTotalLayoutStyles;
