const { createStyles } = require('@bubbles-ui/components');

const useFormComponentStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.xlg, // 24
      zIndex: 0,
      paddingBottom: 10,
    },
    leftColumn: {
      width: 928 - 266 - 24 * 2, // leftColumn + rightColumn
      '@media (min-width: 1920px)': {
        width: 1400 - 266 - 24 * 2,
      },
    },
    rightColumn: {
      minWidth: 266,
      height: 480,
    },
  };
});

export default useFormComponentStyles;
