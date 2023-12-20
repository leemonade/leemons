import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme, { hasFooter }) => {
  const globalTheme = theme.other.global;
  const borderColor = globalTheme.border.color.line.muted;

  return {
    root: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
    },
    textEditorContainer: {
      position: 'relative',
      flex: 4,
      borderLeft: `1px solid ${borderColor}`,
      marginBottom: hasFooter ? 40 : 0,
    },
  };
});

export default ContentEditorInputStyles;
