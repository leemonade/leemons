import { createStyles } from '@bubbles-ui/components';

const StatusBadgesStyles = createStyles((theme) => {
  const badgeStyle = {
    border: '1px solid #878D96',
    borderRadius: '4px ',
    backgroundColor: 'transparent ',
    padding: '2px 8px',
    height: '18px',
  };
  const badgeTextStyle = {
    color: '#4D5358',
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '14px',
  };

  return {
    badge: {
      '& > div': {
        ...badgeStyle,
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    badgeText: {
      ...badgeTextStyle,
    },
    openActivityBadge: {
      '& > div': {
        ...badgeStyle,
        border: '1px solid #5CBC6A',
        backgroundColor: '#5CBC6A',
        '&:hover': {
          backgroundColor: '#5CBC6A',
        },
      },
    },
    openActivityBadgeText: { ...badgeTextStyle, color: '#ffffff' },
    archivedActivityBadge: {
      '& > div': {
        ...badgeStyle,
        backgroundColor: '#878D96',
        '&:hover': {
          backgroundColor: '#878D96',
        },
      },
    },
    archivedActivityBadgeText: { ...badgeTextStyle, color: '#ffffff' },
  };
});

export default StatusBadgesStyles;
