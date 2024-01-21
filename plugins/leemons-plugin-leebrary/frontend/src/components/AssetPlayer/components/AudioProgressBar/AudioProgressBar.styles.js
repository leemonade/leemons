import { createStyles, pxToRem } from '@bubbles-ui/components';

export const AudioProgressBarStyles = createStyles((theme, { useSpaceBetween }) => {
  const globalTheme = theme.other.global;

  return {
    progressBarWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
      padding: globalTheme.spacing.padding.md,
      paddingInline: 0,
    },
    progressBar: {
      WebkitAppearance: 'none',
      height: 8,
      width: '100%',
      backgroundColor: globalTheme.background.color.surface.emphasis,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      marginBlock: 2,
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
      height: 8,
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
        width: pxToRem(8),
        height: pxToRem(8),
        borderRadius: '50%',
        backgroundColor: theme.colors.mainBlack,
        cursor: 'pointer',
      },
      '::-moz-range-thumb': {
        visibility: 'hidden',
        MozAppearance: 'none',
        appearance: 'none',
        width: pxToRem(8),
        height: pxToRem(8),
        borderRadius: '50%',
        backgroundColor: theme.colors.mainBlack,
        cursor: 'pointer',
      },
    },
    buttonDurationWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    durationWrapper: {
      color: globalTheme.content.color.icon.muted,
      minWidth: pxToRem(46),
    },
    controlBar: {
      display: 'flex',
      gap: globalTheme.spacing.gap.xlg,
      justifyContent: useSpaceBetween ? 'space-between' : 'flex-end',
    },
    buttonWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      userSelect: 'none',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    controlIcon: {
      color: globalTheme.content.color.icon.emphasis,
    },
    title: {
      ...globalTheme.content.typo.heading.sm,
      color: globalTheme.content.color.text.default,
      marginTop: 8,
    },
    subtitle: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.subtle,
    },
  };
});
