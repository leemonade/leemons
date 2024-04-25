const { createStyles } = require('@bubbles-ui/components');

const useSubjectScoreColumnStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      width: 300,
      minWidth: 300,
      borderTop: `${globalTheme.border.width.lg} solid ${color}`,
      padding: globalTheme.spacing.padding.md,
      paddingTop: globalTheme.spacing.padding.xmsm,
      position: 'relative',
    },

    opener: {
      position: 'absolute',
      top: 20,
      right: 10,
      cursor: 'pointer',
    },
  };
});

export default useSubjectScoreColumnStyles;
