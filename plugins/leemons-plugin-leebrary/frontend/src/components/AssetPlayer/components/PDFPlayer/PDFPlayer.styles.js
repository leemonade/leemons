import { createStyles, pxToRem } from '@bubbles-ui/components';

const PDFPlayerStyles = createStyles(
  (theme, { isThumbnailOpen, isCurrentPageRendered, thumbnailMode }) => {
    const globalTheme = theme.other.global;
    const borderColor = globalTheme.border.color.line.muted;
    return {
      document: {
        display: 'flex',
        marginBottom: 24,
        backgroundColor: globalTheme.background.color.surface.subtle,
        height: '100%',
        overflow: 'hidden',
      },
      thumbnailContainer: {
        position: 'relative',
        minWidth: isThumbnailOpen ? 218 : 52,
        maxWidth: isThumbnailOpen ? 218 : 52,
        flex: 1,
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        borderRight: 'none',
        transition: 'max-width 0.2s, min-width 0.2s',
        backgroundColor: globalTheme.background.color.surface.default,
      },
      thumbnailTranslate: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        minWidth: 218,
        maxWidth: 218,
        transform: isThumbnailOpen ? 'translateX(0%)' : 'translateX(calc(-100% + 52px))',
        transition: 'transform 0.2s',
      },
      thumbnailHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${borderColor}`,
        padding: 16,
      },
      schemaLabel: {
        color: globalTheme.content.color.text.emphasis,
        ...globalTheme.content.typo.heading.xsm,
      },
      thumbnails: {
        display: 'flex',
        flexDirection: thumbnailMode === 'thumbnail' ? 'row' : 'column',
        gap: 4,
        rowGap: 16,
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        padding: 16,
        transform: isThumbnailOpen ? 'translateX(0%)' : 'translateX(calc(-52px))',
        transition: 'transform 0.2s',
      },
      modeWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
        paddingRight: isThumbnailOpen ? 16 : 52,
        borderBottom: `1px solid ${borderColor}`,
        transition: 'padding 0.2s',
      },
      thumbnailWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: thumbnailMode === 'thumbnail' && 90,
        gap: 12,
      },
      thumbnailPage: {
        cursor: 'pointer',
      },
      pageLabel: {
        ...globalTheme.content.typo.body.md,
        color: globalTheme.content.color.text.default,
        lineHeight: '16px',
        cursor: thumbnailMode !== 'thumbnail' && 'pointer',
      },
      activeThumbnail: {
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
      },
      activePageContainer: {
        flex: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `1px solid ${borderColor}`,
        padding: 24,
        paddingBlock: 32,
        gap: 32,
        overflowY: 'auto',
        '::-webkit-scrollbar': {
          width: '12px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: globalTheme.background.color.surface.default,
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: globalTheme.background.color.surface.muted,
          borderRadius: 8,
        },
      },
      activePage: {
        visibility: !isCurrentPageRendered && 'hidden',
        '& canvas': {
          borderRadius: 4,
          backgroundColor: 'white',
        },
      },
      paginator: {
        paddingBlock: 8,
        paddingInline: 16,
        backgroundColor: globalTheme.background.color.surface.default,
        height: 52,
        display: 'flex',
        gap: 22,
        alignItems: 'center',
        borderRadius: 4,
        boxShadow: '0px 2px 0px rgba(217, 225, 237, 0.16), 0px 10px 36px rgba(26, 32, 43, 0.12)',
        userSelect: 'none',
      },
      paginatorIcon: {
        color: globalTheme.content.color.icon.default,
        cursor: 'pointer',
        '&:active': {
          transform: 'translateY(2px)',
        },
      },
      disabledIcon: {
        cursor: 'not-allowed',
        color: globalTheme.content.color.icon.muted,
      },
      paginatorLabel: {
        ...globalTheme.content.typo.heading.xsm,
        color: globalTheme.content.color.text.default,
      },
      arrowIcon: {
        cursor: 'pointer',
        transform: !isThumbnailOpen && 'rotate(-180deg)',
        transition: 'transform 300ms',
        minHeight: 20,
        minWidth: 20,
      },
    };
  }
);

export { PDFPlayerStyles };
