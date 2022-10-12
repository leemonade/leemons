import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const TextEditorInputStyles = createStyles((theme, { hasError, editorStyles }) => ({
  root: {
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  editor: {
    border: `1px solid ${hasError ? theme.colors.fatic01 : theme.colors.ui01}`,
    borderRadius: 4,
    margin: 0,
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    ...editorStyles,
    '&:disabled': {
      cursor: 'not-allowed',
      color: theme.colors.text06,
      background: theme.colors.ui03,
    },
    '&:focus': {
      borderColor: theme.colors.ui01,
      boxShadow: `0 0 0 3px ${theme.colors.interactive03h}`,
      background: theme.colors.uiBackground04,
    },
    '&:focus-within': {
      borderColor: theme.colors.ui01,
      boxShadow: `0 0 0 3px ${theme.colors.interactive03h}`,
    },

    '&::placeholder': {
      opacity: 1,
      color: theme.colors.text05,
    },
    '&[aria-invalid=true]': {
      borderColor: theme.colors.fatic01,
    },
  },
}));
