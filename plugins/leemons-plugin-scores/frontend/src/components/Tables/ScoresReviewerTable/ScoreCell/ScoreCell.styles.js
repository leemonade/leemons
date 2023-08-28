import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const ScoreCellStyles = createStyles((theme, { isEditing, allowChange }) => {
  return {
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid transparent',
      borderColor: isEditing && theme.colors.interactive01d,
    },
    inputContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
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
      backgroundColor: theme.colors.interactive01v1,
      button: {
        height: '100%',
        width: '100%',
      },
      svg: {
        color: theme.colors.interactive01,
      },
    },
  };
});
