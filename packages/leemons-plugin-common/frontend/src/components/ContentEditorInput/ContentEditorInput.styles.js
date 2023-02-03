import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme, { editorStyles }) => {
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
    editorContainer: {
      paddingBlock: 32,
      paddingInline: 24,
      backgroundColor: theme.other.global.background.color.surface.subtle,
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      scrollbarGutter: 'stable',
      justifyContent: 'center',
      '::-webkit-scrollbar': {
        width: '12px',
        border: `1px solid ${globalTheme.border.color.line.muted}`,
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: globalTheme.background.color.surface.default,
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: globalTheme.background.color.surface.muted,
        borderRadius: 8,
      },
    },
    editor: {
      ...editorStyles,
      backgroundColor: 'white',
      borderRadius: 4,
      margin: 0,
      paddingBlock: 32,
      paddingInline: 48,
      width: '210mm',
      minHeight: '297mm',
      height: 'max-content',
    },
    toolbarRoot: {
      padding: '8px 16px 16px 24px',
      backgroundColor: '#FFF',
      marginRight: 24,
    },
    textEditorContainer: {
      flex: 4,
      borderLeft: `1px solid ${borderColor}`,
    },
  };
});

export default ContentEditorInputStyles;
