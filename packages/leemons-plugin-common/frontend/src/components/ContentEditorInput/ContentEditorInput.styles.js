import { createStyles } from '@bubbles-ui/components';

export const ContentEditorInputStyles = createStyles((theme, { isSchemaOpened, editorStyles }) => {
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
      // backgroundColor: 'black',
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      justifyContent: 'center',
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
    },
    toolbarRoot: {
      padding: '8px 16px 16px 24px',
      backgroundColor: '#FFF',
    },
    textEditorContainer: {
      flex: 4,
      borderLeft: `1px solid ${borderColor}`,
    },
    schemaContainer: {
      minWidth: isSchemaOpened ? 125 : 40,
      maxWidth: isSchemaOpened ? 300 : 40,
      flex: 1,
      position: 'relative',
      transition: 'all 0.2s',
      overflow: 'hidden',
    },
    schemaTranslate: {
      transform: !isSchemaOpened && 'translateX(calc(-100% + 40px))',
      position: 'absolute',
      transition: 'transform 0.3s',
      width: '100%',
      height: '100%',
    },
    schemaHeader: {
      paddingBlock: 16,
      paddingLeft: isSchemaOpened ? 32 : 10,
      paddingRight: isSchemaOpened ? 16 : 10,
      borderBottom: `1px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    schema: {
      paddingBlock: 24,
      paddingLeft: 32,
      paddingRight: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: 'calc(100% - 53px)',
      overflowY: isSchemaOpened && 'auto',
    },
    schemaLabel: {
      color: globalTheme.content.color.text.emphasis,
      ...globalTheme.content.typo.heading.xsm,
    },
    title: {
      color: globalTheme.content.color.text.muted,
      ...globalTheme.content.typo.heading.xsm,
    },
    subtitle: {
      color: globalTheme.content.color.text.muted,
      ...globalTheme.content.typo.body.lg,
      paddingLeft: 8,
    },
    arrowIcon: {
      color: globalTheme.content.color.text.subtle,
      cursor: 'pointer',
      transform: isSchemaOpened && 'rotate(-180deg)',
      transition: 'transform 300ms',
      minHeight: 20,
      minWidth: 20,
    },
  };
});

export default ContentEditorInputStyles;
