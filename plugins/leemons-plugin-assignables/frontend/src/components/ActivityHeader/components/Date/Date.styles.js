import { createStyles } from '@bubbles-ui/components';

export const useDateStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: globalTheme.spacing.gap.sm,
    },
    dates: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '> *': {
        '&:not(:last-child)': {
          borderRight: '1px solid #DDE1E6',
        },
        '&:last-child': {
          paddingRight: 0,
        },
        '&:first-child': {
          paddingLeft: 0,
        },
        padding: globalTheme.spacing.padding.xsm,
      },
    },
    icon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      color: '#878D96',
    },
    text: {
      fontSize: { ...globalTheme.content.typoMobile.body['sm--bold'] },
      color: globalTheme.content.color.text.default,
    },
    date: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.sm,
      alignItems: 'center',
    },
  };
});

export default useDateStyles;
