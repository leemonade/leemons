import { createStyles, pxToRem } from '@bubbles-ui/components';

const useDashboardCardStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'space-between',
      // padding: globalTheme.spacing.padding.xsm,
      background: globalTheme.background.color.surface.default,
      borderRadius: globalTheme.border.radius.md,
      width: '100%',
      maxWidth: pxToRem(320),
      minWidth: pxToRem(264),
      height: pxToRem(428),

      // gap: globalTheme.spacing.gap.lg,
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      // gap: globalTheme.spacing.gap.lg,
    },

    contentContainer: {
      paddingLeft: globalTheme.spacing.padding['2xsm'],
      paddingRight: globalTheme.spacing.padding['2xsm'],
    },

    name: {
      ...globalTheme.content.typo.body['lg--bold'],
      color: globalTheme.content.color.text.emphasis,
    },
    description: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.muted,
      marginTop: globalTheme.spacing.padding['2xsm'],
    },

    dataContainer: {
      marginTop: globalTheme.spacing.padding.md,
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.lg,
    },
    dataBold: {
      ...globalTheme.content.typo.body['sm--bold'],
      color: globalTheme.content.color.text.muted,
    },
    data: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.muted,
    },

    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: globalTheme.spacing.padding.md,
      paddingLeft: globalTheme.spacing.padding['2xsm'],
      paddingRight: globalTheme.spacing.padding['2xsm'],
    },
    role: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.sm,
      alignContent: 'center',
    },
    roleText: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.default,
    },
    icon: {
      width: 16,
      height: 16,
      position: 'relative',
      color: theme.other.buttonIcon.content.color.secondary.default,
    },
  };
});

export default useDashboardCardStyles;
export { useDashboardCardStyles };
