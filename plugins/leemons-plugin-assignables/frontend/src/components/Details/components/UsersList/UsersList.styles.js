const { createStyles } = require('@bubbles-ui/components');

const useUserListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.lg,
    },
    filters: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.lg,
    },
    title: {
      ...globalTheme.content.typo.heading.md,
    },
  };
});

export default useUserListStyles;
