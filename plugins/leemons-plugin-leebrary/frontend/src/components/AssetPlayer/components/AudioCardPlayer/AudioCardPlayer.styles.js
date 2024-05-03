import { createStyles } from '@bubbles-ui/components';

const AudioCardPlayerStyles = createStyles((theme) => {
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
      borderRadius: 4,
    },
    audioCardCover: {
      width: 132,
      height: 132,
      marginBlock: 2,
      borderRadius: 4,
    },
    reactPlayer: {
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      left: 0,
    },
  };
});
export { AudioCardPlayerStyles };
