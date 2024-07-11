import { createStyles } from '@bubbles-ui/components';

const DayRowStyles = createStyles((theme, { dateWithDayoff }) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '116px 120px 1fr',
    minWidth: 'auto',
    alignItems: 'start',
    backgroundColor: dateWithDayoff ? theme.other.core.color.neutral['100'] : 'transparent',
  },
  date: {
    padding: '20px',
    paddingTop: '20px',
    boxSizing: 'border-box',
    alignSelf: 'start',
    width: 150,
  },
  hoursAndDuration: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    paddingTop: '20px',
    width: 160,
    boxSizing: 'border-box',
    alignSelf: 'start',
    gap: theme.other.core.dimension['200'],
  },
  eventDescription: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    paddingTop: '20px',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
    gap: theme.other.core.dimension['200'],
    width: '100%',
    minWidth: 0,
    marginLeft: theme.other.core.dimension['200'],
  },
  timeWithBadge: {
    paddingTop: '10px',
  },
  badge: {
    position: 'absolute',
    left: theme.other.core.dimension['600'],
  },
}));

export { DayRowStyles };
