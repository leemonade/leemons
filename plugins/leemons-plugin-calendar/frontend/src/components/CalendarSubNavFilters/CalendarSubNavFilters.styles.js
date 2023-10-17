/* eslint-disable import/prefer-default-export */
import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const CalendarSubNavFiltersStyles = createStyles((theme, { mainColor, lightMode }) => {
  const leemonsStyles = theme.other;
  return {
    subNav: {
      height: '100%',
      backgroundColor: leemonsStyles.core.color.white,
      borderRight: '1px solid #EDEFF5',
    },
    titleContainer: {
      marginLeft: theme.spacing[5],
      display: 'flex',
      alignItems: 'center',
      fontSize: '18px',
    },
    calendarIcon: {
      width: '24px',
      height: '24px',
      marginRight: theme.spacing[2],
      color: '#7E8795',
    },
    title: {
      ...getFontExpressive(),
      color: '#1F2633',
      fontWeight: 600,
      fontSize: '18px',
    },
    switchLabel: {
      color: lightMode ? theme.colors.text01 : theme.colors.text07,
      fontWeight: 500,
    },
    segmentRoot: {
      width: '100%',
      padding: 0,
      backgroundColor: !lightMode && mainColor,
    },
    segmentLabel: {
      ...getFontExpressive(),
      color: '#495465',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      display: 'flex',
      height: '100%',
      margin: 0,
      padding: '16px',
      borderRadius: 4,
      fontWeight: 400,
      '&:first-child': {
        borderRadius: '0 0 4px 4px',
      },
      '&:last-child': {
        borderRadius: '4px 4px 0 0',
      },
      '&:hover': {
        color: !lightMode && theme.colors.text07,
      },
    },
    segmentLabelActive: {
      color: '#307AE8 !important',
    },
    segmentActive: {
      color: '#307AE8 !important',
      border: '1px solid #307AE8',
      backgroundColor: lightMode ? theme.colors.mainWhite : 'rgba(255, 255, 255, 0.25)',
      '&:first-child': {
        borderRadius: '4px 4px 0 0',
      },
      '&:last-child': {
        borderRadius: '0 0 4px 4px',
      },
      top: 4,
      left: 4,
      boxShadow: 'none',
    },
    segmentControl: {
      border: 'none!important',
    },
    icon: {
      img: {
        filter: 'brightness(0) invert(1)',
      },
    },
  };
});
