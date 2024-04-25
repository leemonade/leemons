import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

const AssetPlayerLibraryWrapperStyles = createStyles(
  (theme, { color, assetRole, isPDF, isDocumentButNotPDF }) => ({
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
    },
    color: {
      backgroundColor: color,
      height: pxToRem(4),
      width: '100%',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'baseline',
      padding: `${pxToRem(16)} ${pxToRem(16)} ${pxToRem(10)} ${pxToRem(16)}`,
      gap: pxToRem(16),
      backgroundColor: theme.colors.mainWhite,
    },
    title: {
      fontWeight: 600,
      flex: 1,
    },
    buttonIcon: {
      position: 'absolute',
      zIndex: 10,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    },
    activityContainer: {
      width: 576,
      height: 200,
      position: 'relative',
      cursor: assetRole || isPDF || isDocumentButNotPDF ? 'pointer' : 'no-drop',
    },
  })
);

export { AssetPlayerLibraryWrapperStyles };
