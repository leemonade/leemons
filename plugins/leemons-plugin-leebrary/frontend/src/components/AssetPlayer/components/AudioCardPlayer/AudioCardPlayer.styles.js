import { createStyles, pxToRem } from '@bubbles-ui/components';

export const AudioCardPlayerStyles = createStyles((theme, {}) => {
  const globalTheme = theme.other.global;

  return {
    audioCardRoot: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      paddingRight: 24,
      backgroundColor: globalTheme.background.color.surface.subtle,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      gap: 14,
    },
    audioCardCover: {
      width: 165,
      height: 158,
      marginBlock: 2,
    },
    reactPlayer: {
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      left: 0,
    },
  };
});
