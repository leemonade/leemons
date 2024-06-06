import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const CalendarNewEventModalStyles = createStyles((theme, {}) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    dayType: {
      marginTop: 8,
    },
    withoutOrdinaryDays: {
      marginTop: 8,
    },
    buttonWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    nameInput: {
      width: '212px',
    },
  };
});
