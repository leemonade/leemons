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
      padding: '36px 24px 24px 24px',
    },
    dayType: {
      marginTop: 8,
    },
    withoutOrdinaryDays: {
      marginTop: 8,
    },
    buttonWrapper: {
      marginTop: 16,
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
});
