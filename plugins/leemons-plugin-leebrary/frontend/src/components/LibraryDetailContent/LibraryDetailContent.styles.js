import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailContentStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.other.core.color.white,
  },
  lowerContent: {
    flex: 1,
    backgroundColor: theme.colors.ui03,
    padding: pxToRem(16),
  },
  tagsContainer: {
    minHeight: 38,
    display: 'flex',
    gap: pxToRem(10),
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: pxToRem(24),
  },
  tab: {
    '& button[aria-selected="true"]': {
      borderBottomColor: '#B4E600 !important',
    },
    '& button:hover': {
      backgroundColor: '#F1FFBD !important',
      borderBottomColor: '#F1FFBD   !important',
    },
    '& button[aria-selected="true"]:hover': {
      backgroundColor: '#F1FFBD !important',
      borderBottomColor: '#B4E600 !important',
    },
  },
  tabPanel: {
    padding: pxToRem(24),
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  tabPanelPermissions: {
    padding: pxToRem(24),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'scroll',
    marginBottom: pxToRem(48),
  },
  title: {
    color: theme.other.global.content.color.tertiary.default,
    fontSize: pxToRem(18),
    fontWeight: 500,
    lineHeight: '24px',
    fontStyle: 'normal',
    paddingBottom: pxToRem(8),
  },
  description: {
    color: theme.other.global.content.color.tertiary.default,
    fontSize: pxToRem(14),
    fontWeight: 400,
    lineHeight: '20px',
    fontStyle: 'normal',
  },
  subjectItem: {
    display: 'flex',
    marginBottom: pxToRem(16),
    alignItems: 'center',
  },
  labelBadge: {
    '& > div': {
      backgroundColor: '#F2F4F8',
      border: '1px solid #F2F4F8',
      borderRadius: 4,
      fontSize: 12,
      '&:hover': {
        backgroundColor: '#F2F4F8',
        color: '#4D5358',
      },
      '& > span': {
        color: '#4D5358',
        fontWeight: 400,
      },
    },
  },

  canAccessContainer: {
    marginTop: pxToRem(24),
    width: '100%',
  },
  canAccessItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingLeft: pxToRem(8),
  },
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: pxToRem(8),
    width: pxToRem(336),
  },
  canAccessText: {
    fontSize: pxToRem(14),
    fontWeight: 400,
    lineHeight: '20px',
    color: '#343A3F',
  },
  canAccessFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: pxToRem(64),
    width: '100%',
    borderTop: '1px solid #DDE1E6',
    position: 'sticky',
    bottom: '0%',
    left: 0,
    paddingRight: pxToRem(24),
    backgroundColor: 'white',
  },
  canAccessButton: {
    height: pxToRem(40),
  },
}));

export default LibraryDetailContentStyles;
export { LibraryDetailContentStyles };
