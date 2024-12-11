import { createStyles } from '@bubbles-ui/components';

export const ScoreCellStyles = createStyles((theme, { isEditing, allowChange }) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid transparent',
    borderColor: isEditing && theme.colors.interactive01d,
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
    backgroundColor: theme.colors.interactive01v1,
    button: {
      height: '100%',
      width: '100%',
    },
    svg: {
      color: theme.colors.interactive01,
    },
  },
}));
