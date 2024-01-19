import { createStyles } from '@bubbles-ui/components';

const useCurriculumRenderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    section: {
      marginLeft: globalTheme.spacing.padding.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
    },
    sectionTitle: {
      ...globalTheme.content.typo.heading.sm,
      marginBottom: globalTheme.spacing.md,
    },
  };
});

export default useCurriculumRenderStyles;
