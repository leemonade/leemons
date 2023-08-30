import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const ActivityContainerStyles = createStyles((theme, { isScrolled }) => {
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      overflowY: 'auto',
      maxHeight: '100vh',
    },
    header: {
      display: 'flex',
      position: 'fixed',
      minHeight: isScrolled ? 64 : 204,
      height: isScrolled ? 64 : 204,
      top: 0,
      transition: 'height 0.3s ease-in-out',
      zIndex: 9,
    },
    taskHeaderWrapper: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      zIndex: 5,
      marginLeft: 30,
    },
    taskHeader: {
      zIndex: 1,

      // width: !isScrolled && '50%',
      minWidth: 690,
    },
    deadline: {
      zIndex: 1,
      position: 'absolute',
      right: isScrolled ? 0 : 8,
      top: 8,
    },
  };
});
