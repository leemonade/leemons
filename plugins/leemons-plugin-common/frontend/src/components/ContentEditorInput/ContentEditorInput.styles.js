import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  const borderColor = globalTheme.border.color.line.muted;

  return {
    root: {
      marginTop: theme.spacing[1],
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      borderTop: `1px solid ${borderColor}`,
    },
    textEditorContainer: {
      position: 'relative',
      flex: 4,
      borderLeft: `1px solid ${borderColor}`,
    },
  };
});

export default ContentEditorInputStyles;
