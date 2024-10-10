import { createStyles } from '@bubbles-ui/components';

const CalendarStyles = createStyles((theme) => {
  const { content, background } = theme.other.global;

  return {
    root: {
      width: 380,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 16,
      '.react-calendar__tile': {
        maxWidth: '100%',
        paddingBottom: '16px !important',
        textAlign: 'center',
        ...content.typo.body.sm,
        height: 48,
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
        ...content.typo.body['sm--bold'],
        textDecoration: 'none',
        paddingBottom: theme.other.core.dimension['100'],
      },
      '.react-calendar__month-view__weekdays__weekday': {
        padding: '0.5em',
      },
      '.react-calendar__month-view__days__day--neighboringMonth': {
        color: content.color.disabled,
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
        backgroundColor: background.color.primary.subtle,
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
          backgroundColor: background.color.surface.muted,
          zIndex: -1,
          minHeight: '40px',
          position: 'absolute',
          right: '11px',
          top: '4px',
          borderRadius: '4px',
        },
      },
    },

    weekButton: {
      width: 128,
    },

    currentWeekBall: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: background.color.primary.subtle,
    },
    dayOffBall: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: background.color.surface.muted,
    },
  };
});

export { CalendarStyles };
