import { createStyles, pxToRem } from '@bubbles-ui/components';

const ProgressBarStyles = createStyles((theme, {}) => {
  const globalTheme = theme.other.global;

  return {
    progressBarWrapper: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.lg,
      padding: globalTheme.spacing.padding.md,
      left: 16,
      right: 16,
      bottom: 5,
      zIndex: 2,
      borderRadius: 4,
      backgroundColor: theme.other.buttonIconCard.background.color.primary.default,
      '&:hover': {
        backgroundColor: theme.other.buttonIconCard.background.color.primary.hover,
      },
    },
    progressBar: {
      WebkitAppearance: 'none',
      height: 5,
      width: '100%',
      backgroundColor: '#FFF',
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      marginRight: 14,
    },
    progressBarValue: {
      height: '100%',
      backgroundColor: globalTheme.background.color.primary.default,
      transition: 'width 0.1s linear',
      position: 'relative',
    },
    progressBarSeekSlider: {
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      width: '100%',
      position: 'absolute',
      backgroundColor: 'transparent',
      height: 5,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      margin: 0,
      cursor: 'pointer',
      '::-webkit-slider-thumb': {
        visibility: 'hidden',
        WebkitAppearance: 'none',
        appearance: 'none',
        width: pxToRem(5),
        height: pxToRem(5),
        borderRadius: '50%',
        backgroundColor: theme.colors.mainBlack,
        cursor: 'pointer',
      },
      '::-moz-range-thumb': {
        visibility: 'hidden',
        MozAppearance: 'none',
        appearance: 'none',
        width: pxToRem(5),
        height: pxToRem(5),
        borderRadius: '50%',
        backgroundColor: theme.colors.mainBlack,
        cursor: 'pointer',
      },
    },
    duration: {
      color: theme.colors.mainWhite,
      minWidth: pxToRem(46),
    },
    controlBar: {
      display: 'flex',
      gap: globalTheme.spacing.gap.lg,
      alignItems: 'center',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      userSelect: 'none',
    },
    whiteIcon: {
      color: 'white',
      cursor: 'pointer',
    },
  };
});

export { ProgressBarStyles };
