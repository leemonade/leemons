import { createStyles, pxToRem } from '@bubbles-ui/components';

const useDashboardCardBodyStyles = createStyles((theme) => {
  const { cardModule } = theme.other;
  return {
    root: {
      padding: `${cardModule.spacing.padding.horizontal.md} ${cardModule.spacing.padding.vertical.md}`,
      borderRadius: cardModule.border.radius.sm,
      backgroundColor: cardModule.background.color.default,
      borderColor: cardModule.border.color.subtle,
      borderBottomRightRadius: cardModule.border.radius.sm,
      borderBottomLeftRadius: cardModule.border.radius.sm,
      borderLeftWidth: cardModule.border.width.sm,
      borderRightWidth: cardModule.border.width.sm,
      borderBottomWidth: cardModule.border.width.sm,
    },
    title: {
      color: cardModule.content.color.emphasis,
      ...cardModule.content.typo.lg,
      marginTop: pxToRem(12),
    },
    description: {
      color: cardModule.content.color.default,
      ...cardModule.content.typo.md,
      marginTop: pxToRem(4),
    },
    draftText: {
      color: '#4D5358',
      fontSize: '10px',
    },
    calificationBadge: {
      '& > div': {
        backgroundColor: '#F2F4F8',
        border: '1px solid #878D96',
        borderRadius: 4,
        fontSize: pxToRem(10),
        fontWeight: 500,

        '&:hover': {
          backgroundColor: '#F2F4F8',
          color: '#4D5358',
        },
        '& > span': {
          color: '#4D5358',
        },
      },
    },
    subject: {
      marginTop: pxToRem(16),
      marginBottom: pxToRem(26),
    },
  };
});

export default useDashboardCardBodyStyles;
export { useDashboardCardBodyStyles };
