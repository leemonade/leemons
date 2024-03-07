import { createStyles } from '@bubbles-ui/components';

export const ActivityHeaderStyles = createStyles(
  (theme, { hovered, isExpandable, isExpanded, position }) => {
    const isFirst = position === 'first';
    const isLast = position === 'last';
    const isBetween = position === 'between';

    return {
      root: {
        width: '100%',
        display: 'flex',
        justifyContent: isExpandable && (hovered || isExpanded) ? 'space-between' : 'center',
        backgroundColor: isExpanded && theme.colors.interactive01v1,
        border: `1px solid ${isExpanded ? theme.colors.interactive01d : 'transparent'}`,
        borderRightColor: (isFirst || isBetween) && theme.colors.interactive01v1,
        borderLeftColor: (isLast || isBetween) && theme.colors.interactive01v1,
        '&:hover': {
          border: `1px solid ${theme.colors.interactive01d}`,
          borderRightColor: (isFirst || isBetween) && theme.colors.interactive01v1,
          borderLeftColor: (isLast || isBetween) && theme.colors.interactive01v1,
          backgroundColor: theme.colors.interactive01v1,
        },
      },
      header: {
        // padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
        // paddingTop: 64,
        height: 116,
        maxHeight: 116,
        position: 'relative',
        width: '100%',
        textAlign: 'center',
      },
      title: {
        marginTop: 48,
        height: 34,
        marginInline: 16,
      },
      info: {
        marginInline: 16,
      },
      expandedHeader: {
        marginLeft: 300,
      },
      expandBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.interactive01d,
        color: theme.colors.mainWhite,
        paddingInline: 6,
        cursor: 'pointer',
      },
      starIcon: {
        color: theme.colors.text04,
      },
    };
  }
);
