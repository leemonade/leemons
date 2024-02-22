import { createStyles } from '@bubbles-ui/components';

export const SchemaStyles = createStyles((theme, { isSchemaOpened, compact }) => {
  const globalTheme = theme.other.global;
  const borderParams = '1px solid #DDE1E6';

  return {
    schemaContainer: {
      minWidth: isSchemaOpened ? 125 : 44,
      maxWidth: isSchemaOpened ? 300 : 44,
      flex: 1,
      position: 'relative',
      transition: 'all 0.2s',
      overflow: 'hidden',
      backgroundColor: 'white',
      top: compact ? 0 : 32,
      // border: borderParams,
      borderRight: borderParams,
      borderTop: !compact && borderParams,
      marginBottom: 2,
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
      paddingLeft: isSchemaOpened ? 24 : 10,
      paddingRight: isSchemaOpened ? 16 : 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: isSchemaOpened ? borderParams : 'none',
    },
    schema: {
      paddingBlock: 24,
      paddingLeft: 16,
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
    titleOne: {
      color: globalTheme.content.color.text.muted,
      ...globalTheme.content.typo.heading.sm,
    },
    titleTwo: {
      color: globalTheme.content.color.text.muted,
      ...globalTheme.content.typo.heading.xsm,
      paddingLeft: 8,
      fontSize: 16,
    },
    titleThree: {
      color: globalTheme.content.color.text.muted,
      ...globalTheme.content.typo.heading.xsm,
      paddingLeft: 16,
    },
    arrowIcon: {
      color: globalTheme.content.color.secondary.default,
      cursor: 'pointer',
      transform: !isSchemaOpened && 'rotate(-180deg)',
      transition: 'transform 300ms',
      minHeight: 20,
      minWidth: 20,
      marginLeft: !isSchemaOpened && 6,
    },
    schemaElement: {
      cursor: 'pointer',
    },
  };
});

export default SchemaStyles;
