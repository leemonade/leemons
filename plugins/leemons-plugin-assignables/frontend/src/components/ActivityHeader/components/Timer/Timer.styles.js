import { createStyles, keyframes } from '@bubbles-ui/components';

const blink = keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const useTimerStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.sm,
      alignItems: 'center',
    },
    icon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      color: '#878D96',
    },
    text: {
      fontSize: { ...globalTheme.content.typoMobile.body['sm--bold'] },
    },
    texColor: {
      color: globalTheme.content.color.text.default,
    },
    blinkText: {
      animation: `${blink} 0.5s linear infinite alternate`,
    },
  };
});

export default useTimerStyles;
