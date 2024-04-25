import { createStyles } from '@bubbles-ui/components';

const useActivityScoreDisplayStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      padding: globalTheme.spacing.padding.xsm,
      height: 78,
      borderBottom: `${globalTheme.border.width.sm} solid ${globalTheme.border.color.line.subtle}`,
    },
    noLink: {
      textDecoration: 'none',
      '&:hover': {
        background: theme.other.button.content.color.terciary.default,
      },
    },
    leftSide: {
      padding: globalTheme.spacing.padding.xsm,

      paddingTop: globalTheme.spacing.padding.sm,
      paddingBottom: globalTheme.spacing.padding.sm,
    },
    rightSide: {
      width: 66,
      padding: globalTheme.spacing.padding.xsm,
      paddingRight: 0,
    },

    activityName: {
      ...theme.other.table.content.typo.md,
      color: theme.other.cardAssignments.content.color.muted,
    },
    role: {
      fontFamily: theme.other.table.content.typo.md.fontFamily,
      fontWeight: 600,
      fontSize: 10,
      fontHeight: '14px',
      letterSpacing: '0.04em',
    },

    score: {
      ...globalTheme.content.typo.body.lg,
      color: theme.other.cardAssignments.content.color.muted,
      textAlign: 'center',
    },
    badge: {
      minHeight: 6,
    },
  };
});

export default useActivityScoreDisplayStyles;
