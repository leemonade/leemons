import { createStyles } from '@bubbles-ui/components';

const CalendarStyles = createStyles((theme) => {
  return {
    root: {
      width: 380,
      '.react-calendar__tile': {
        maxWidth: '100%',
        paddingBottom: '16px !important',
        textAlign: 'center',
        font: 'inherit',
        fontSize: '0.833em',
        height: '48px',
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
        paddingBottom: theme.other.core.dimension['100'],
      },
      '.react-calendar__month-view__weekdays__weekday': {
        padding: '0.5em',
      },
      '.react-calendar__month-view__days__day--neighboringMonth': {
        color: theme.other.core.color.neutral['400'],
      },
      '.react-calendar__tile--now > abbr': {
        color: 'white',
        backgroundColor: 'black',
        borderRadius: '3px',
        padding: '2px 6px',
      },
      'abbr[title]': {
        textDecoration: 'none',
      },
      '.currentWeek': {
        backgroundColor: theme.other.core.color.primary['100'],
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
          backgroundColor: theme.other.core.color.neutral['100'],
          zIndex: -1,
          minHeight: '40px',
          position: 'absolute',
          right: '11px',
          top: '4px',
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
      width: 128,
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
      backgroundColor: theme.other.core.color.primary['100'],
    },
    dayOffBall: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: theme.other.core.color.neutral['100'],
    },
  };
});

export { CalendarStyles };

