import { createStyles } from '@bubbles-ui/components';

const useActivityScoreTotalStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      padding: globalTheme.spacing.padding.xsm,
      height: 78,
      background: '#F2F4F8',
      borderBottom: `${globalTheme.border.width.sm} solid ${globalTheme.border.color.line.subtle}`,
      borderTop: `${globalTheme.border.width.sm} solid ${globalTheme.border.color.line.subtle}`,
    },
    section: {
      padding: globalTheme.spacing.padding.sm,
    },
    rightSection: {
      width: 66,
    },

    finalGrade: {
      fontFamily: theme.other.table.content.typo.md.fontFamily,
      fontWeight: 600,
      fontSize: 10,
      fontHeight: '14px',
      letterSpacing: '0.04em',
    },
    scaleDescription: {
      ...theme.other.table.content.typo.md,
      color: theme.other.cardAssignments.content.color.muted,
    },
    score: {
      ...globalTheme.content.typoMobile.heading.xlg,
    },
  };
});

export default useActivityScoreTotalStyles;
