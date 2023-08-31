import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const LibraryNavbarStyles = createStyles((theme, { isExpanded }) => {
  return {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.other.core.color.white,
      paddingBottom: theme.spacing[3],
      borderRight: '1px solid ' + theme.other.core.color.neutral[100],
    },
    header: {
      gap: 4,
      padding: 24,
      paddingBottom: 30,
      display: 'flex',
      color: theme.colors.text01,
    },
    title: {
      fontSize: pxToRem(24),
      lineHeight: pxToRem(30),
      color: 'inherit',
    },
    uploadButton: {
      display: isExpanded && 'none',
      padding: `${pxToRem(24)} ${pxToRem(14)} ${pxToRem(0)} ${pxToRem(14)}`,
    },
    navbarBottom: {
      width: 'calc(100% - 20px)',
      marginTop: isExpanded ? 24 : 12,
      maxHeight: isExpanded ? 700 : 92,
      marginInline: 10,
      overflow: 'hidden',
      border: isExpanded ? `1px solid ${theme.colors.ui04}` : `1px solid transparent`,
      position: 'relative',
      zIndex: 2,
      borderRadius: 4,
      backgroundColor: isExpanded ? theme.colors.mainWhite : 'transparent',
    },
    navbarTopSubWrapper: {
      opacity: isExpanded ? 1 : 0,
      transition: 'opacity 0.2s ease-out',
    },
    fileUpload: {
      width: 'calc(100% - 20px)',
      marginInline: 10,
    },
    sectionTitle: {
      fontWeight: 500,
      fontSize: 15,
    },
    fileUploadWrapper: {
      paddingTop: 10,
      paddingBottom: 4,
      paddingLeft: 16,
      paddingRight: 10,
    },
    navbarTopList: {
      paddingBottom: theme.spacing[2],
      '& > span': {
        padding: 16,
      },
    },
    navItems: {
      // height: 300,
      flexGrow: 1,
      height: 1,
    },
  };
});
