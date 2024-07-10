import { createStyles } from '@bubbles-ui/components';

const CalendarStyles = createStyles(() => ({
  root: {
    width: 380,
    '.react-calendar__tile': {
      maxWidth: '100%',
      padding: '10px 6.6667px 10px 6.667px !important',
      textAlign: 'center',
      font: 'inherit',
      fontSize: '0.833em',
      height: '54px',
      zIndex: 2,
      backgroundColor: 'transparent',
      pointerEvents: 'none',
    },
    '.react-calendar button': {
      margin: 0,
      border: 0,
      outline: 'none',
    },
    '.react-calendar__month-view__weekdays': {
      textAlign: 'center',
      font: 'inherit',
      fontSize: '0.75em',
      fontWeight: 'bold',
      textDecoration: 'none',
      paddingBottom: 8,
    },
    '.react-calendar__month-view__weekdays__weekday': {
      padding: '0.5em',
    },
    '.react-calendar__month-view__days__day--neighboringMonth': {
      color: '#757575',
    },
    '.react-calendar__tile--now > abbr': {
      color: 'white',
      backgroundColor: 'black',
      borderRadius: '3px',
      padding: '3px 4px',
    },
    'abbr[title]': {
      textDecoration: 'none',
    },
    '.currentWeek': {
      backgroundColor: '#F4F4F5',
      '&.weekStart': {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      },
      '&.weekEnd': {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      },
    },
    '.noLective': {
      position: 'relative',
      zIndex: 1,
      '&::before': {
        content: '" "',
        display: 'inline-block',
        minWidth: '32px',
        backgroundColor: '#e2f9f3',
        zIndex: -1,
        minHeight: '40px',
        position: 'absolute',
        right: '9px',
        top: '10px',
        borderRadius: '4px',
      },
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  weekButton: {
    width: 120,
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: 24,
  },
  currentWeekBall: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#E4E4E7',
  },
  dayOffBall: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#DCFAE6',
  },
}));

export { CalendarStyles };
