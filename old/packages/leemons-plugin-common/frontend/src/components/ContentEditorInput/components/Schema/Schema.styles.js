import { createStyles } from '@bubbles-ui/components';

export const SchemaStyles = createStyles((theme, { isSchemaOpened }) => {
  const globalTheme = theme.other.global;
  const borderColor = globalTheme.border.color.line.muted;
  return {
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
      '::-webkit-scrollbar': {
        width: '12px',
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: globalTheme.background.color.surface.subtle,
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: globalTheme.background.color.surface.muted,
        borderRadius: 8,
      },
    },
    schemaLabel: {
      maxWidth: isSchemaOpened ? 200 : 0,
      color: globalTheme.content.color.text.emphasis,
      ...globalTheme.content.typo.heading.xsm,
      transition: 'max-width 300ms',
      overflow: 'hidden',
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
    schemaElement: {
      cursor: 'pointer',
    },
  };
});

export default SchemaStyles;
