import { createStyles } from '@bubbles-ui/components';

const TextEditorContentStyles = createStyles((theme, { editorStyles, fullWidth, compact }) => {
  const globalTheme = theme.other.global;
  const pageWidth = '928px';

  const calcExpandButton = () => {
    const containerCenter = '50%';
    const sizeChangeButtonWidth = '40px';
    const sizeChangeButtonMargin = '6px';
    const buttonOffsetInPage = `(((${pageWidth} / 2) - ${sizeChangeButtonWidth}) + ${sizeChangeButtonMargin})`;
    const buttonOffsetInFullWidth = `${sizeChangeButtonWidth} + ${sizeChangeButtonMargin}`;
    const commonProps = {
      position: 'absolute',
      zIndex: 1,
      top: 0,
    };
    const collapseWidth = {
      right: `calc(${buttonOffsetInFullWidth})`,
      transform: 'translateY(100%)',
      ...commonProps,
    };
    const expandedWidth = {
      left: `calc(${containerCenter} + ${buttonOffsetInPage})`,
      transform: 'translate(-50%, 100%)',
      ...commonProps,
    };
    return fullWidth ? collapseWidth : expandedWidth;
  };

  return {
    editor: {
      ...editorStyles,
      backgroundColor: 'white',
      borderRadius: 4,
      margin: 0,
      paddingBlock: 32,
      paddingInline: 48,
      width: fullWidth ? '100%' : pageWidth,
      minHeight: '100%',
      height: 'max-content',
    },
    editorContainer: {
      position: 'relative',
      paddingBlock: compact ? 0 : 32,
      paddingInline: compact ? 0 : 24,
      backgroundColor: theme.other.global.background.color.surface.subtle,
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      justifyContent: 'center',
      /*
      scrollbarGutter: 'stable',
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
      */
    },
    toolbarRoot: {
      padding: '8px 16px 16px 24px',
      backgroundColor: '#FFF',
      marginRight: 24,
    },
    expandButton: calcExpandButton(),
  };
});

export { TextEditorContentStyles };
