import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme, { editorStyles, fullWidth }) => {
  const globalTheme = theme.other.global;
  const borderColor = globalTheme.border.color.line.muted;

  const containerCenter = '50%';
  const pageWidth = '210mm';
  const sizeChangeButtonWidth = '40px';
  const sizeChangeButtonMargin = '6px';
  const buttonOffsetInPage = `(((${pageWidth} / 2) - ${sizeChangeButtonWidth}) + ${sizeChangeButtonMargin})`;
  const buttonOffsetInFullWidth = `${sizeChangeButtonWidth} + ${sizeChangeButtonMargin}`;

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
      width: fullWidth ? '100%' : pageWidth,
      minHeight: '297mm',
      height: 'max-content',
    },
    toolbarRoot: {
      padding: '8px 16px 16px 24px',
      backgroundColor: '#FFF',
      marginRight: 24,
    },
    textEditorContainer: {
      position: 'relative',
      flex: 4,
      borderLeft: `1px solid ${borderColor}`,
    },
    widthButton: fullWidth
      ? {
        right: `calc(${buttonOffsetInFullWidth})`,
        transform: 'translateY(100%)',
        position: 'absolute',
      }
      : {
        left: `calc(${containerCenter} + ${buttonOffsetInPage})`,
        transform: 'translate(-50%, 100%)',
        position: 'absolute',
      },
  };
});

export default ContentEditorInputStyles;
