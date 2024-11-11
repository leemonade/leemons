import { createStyles } from '@bubbles-ui/components';

const PADDING = 18;
const BOX_SIZING = 'border-box';

const DayRowStyles = createStyles((theme, { dateWithDayoff, hasEvents }) => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: '116px 120px 1fr',
      minWidth: 'auto',
      alignItems: 'start',
      backgroundColor: dateWithDayoff ? theme.other.core.color.neutral['100'] : 'transparent',
    },
    date: {
      padding: PADDING,
      boxSizing: BOX_SIZING,
      alignSelf: 'start',
      width: 150,
    },
    hoursAndDuration: {
      display: 'flex',
      flexDirection: 'column',
      padding: PADDING,
      paddingTop: 20,
      width: 160,
      boxSizing: BOX_SIZING,
      alignSelf: 'start',
      gap: 19,
    },
    eventDescription: {
      display: 'flex',
      flexDirection: 'column',
      padding: PADDING,
      boxSizing: BOX_SIZING,
      alignSelf: 'stretch',
      gap: theme.other.core.dimension['200'],
      width: '100%',
      minWidth: 0,
      marginLeft: theme.other.core.dimension['200'],
    },
    eventItem: {
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    timeWithBadge: {
      paddingTop: '10px',
    },
    badge: {
      position: 'absolute',
      left: theme.other.core.dimension['600'],
    },
  };
});

export { DayRowStyles };
