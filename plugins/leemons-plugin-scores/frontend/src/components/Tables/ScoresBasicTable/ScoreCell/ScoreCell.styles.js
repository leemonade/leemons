import { createStyles } from '@bubbles-ui/components';

export const ScoreCellStyles = createStyles((theme, { isEditing, allowChange }) => {
  const globalTheme = theme.other.global;

  return ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px solid transparent',
      borderColor: isEditing && globalTheme.focus.default.color,
    },
    score: {
      width: '100%',
    },
    inputContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 0,
      alignItems: 'center',
      cursor: 'pointer',
      textAlign: 'center',
      input: {
        height: 46,
        borderRadius: 0,
      },
    },
    expandIcon: {
      height: '100%',
      width: 40,
      minWidth: 40,
      button: {
        height: '100%',
        width: '100%',
      },
      svg: {
        color: globalTheme.content.color.primary.strong,
      },
    },
  });
});
