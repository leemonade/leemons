import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailContentStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.other.core.color.white,
  },
  lowerContent: {
    flex: 1,
    padding: pxToRem(16),
  },
  tagsContainer: {
    minHeight: 38,
    display: 'flex',
    gap: pxToRem(10),
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: pxToRem(16),
  },
  tab: {
    '& button[aria-selected="true"]': {
      borderBottomColor: `${theme.other.button.background.color.primary.default} !important`,
    },
    '& button:hover': {
      backgroundColor: `${theme.other.button.background.color.ghost.hover} !important`,
      borderBottomColor: `${theme.other.button.background.color.ghost.hover} !important`,
    },
    '& button[aria-selected="true"]:hover': {
      backgroundColor: `${theme.other.button.background.color.ghost.hover} !important`,
      borderBottomColor: `${theme.other.button.background.color.primary.default} !important`,
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
    backgroundColor: theme.other.core.color.neutral['50'],
  },
  title: {
    color: theme.other.global.content.color.tertiary.default,
    fontSize: pxToRem(18),
    fontWeight: 500,
    lineHeight: '24px',
    fontStyle: 'normal',
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
    marginTop: pxToRem(16),
    width: '100%',
    backgroundColor: theme.other.core.color.white,
    padding: 8,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
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
    width: '80%',
  },
  canAccessTextContainer: {
    width: '20%',
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
