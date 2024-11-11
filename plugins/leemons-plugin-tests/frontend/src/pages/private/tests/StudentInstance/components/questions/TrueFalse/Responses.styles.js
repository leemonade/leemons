import { createStyles } from '@bubbles-ui/components';

const useResponsesStyles = createStyles((theme) => {
  return {
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 416,
      '@media (min-width: 1440px)': {
        width: '48%',
        minWidth: 416,
      },
      height: 76,
      borderRadius: 8,
      border: `1px solid ${theme.other.global.border.color.line.subtle}`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.other.button.background.color.ghost.hover,
      },
    },
  };
});

export default useResponsesStyles;
