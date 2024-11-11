import { createStyles, pxToRem } from '@bubbles-ui/components';

const useDashboardCardFooterStyles = createStyles((theme) => {
  const leemonsStyles = theme.other;
  const { cardModule } = leemonsStyles;
  return {
    root: {
      position: 'absolute',
      bottom: 16,
      width: '100%',
    },
    icon: {
      width: 16,
      height: 16,
      position: 'relative',
      color: cardModule.content.color.muted,
    },
    role: {
      display: 'flex',
      gap: pxToRem(8),
      marginBottom: pxToRem(16),
    },
    buttonFull: {
      width: '90%',
    },
    buttonContainer: {
      display: 'flex',
      width: '90%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    type: {
      color: cardModule.content.color.muted,
      ...cardModule.content.typo.sm,
    },
  };
});

export default useDashboardCardFooterStyles;
export { useDashboardCardFooterStyles };
