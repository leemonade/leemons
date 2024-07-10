import { createStyles } from '@bubbles-ui/components';

const DayRowStyles = createStyles((theme, { dateWithDayoff }) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '116px 120px 1fr',
    minWidth: 'auto',
    alignItems: 'start',
    backgroundColor: dateWithDayoff ? '#ECFDF3' : 'transparent',
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
    gap: 16,
  },
  eventDescription: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    paddingTop: '20px',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
    gap: 16,
    width: '100%',
    minWidth: 0,
    marginLeft: 16,
  },
  timeWithBadge: {
    paddingTop: '10px',
  },
  badge: {
    position: 'absolute',
    left: 46,
  },
}));

export { DayRowStyles };
