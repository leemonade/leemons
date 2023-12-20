const { createStyles } = require('@bubbles-ui/components');

const useFormComponentStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.xlg, // 24
      zIndex: 0,
    },
    leftColumn: {
      maxWidth: 928 - 266 - 24 * 2, // leftColumn + rightColumn
    },
    rightColumn: {
      minWidth: 266,
      height: 480,
    },
  };
});

export default useFormComponentStyles;
