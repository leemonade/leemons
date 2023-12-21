import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailContentStyles = createStyles((theme) => ({
  root: {
    // ...getFontExpressive(theme.fontSizes['2']),
    // flex: 1,
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
  },
  tabPanel: {
    padding: pxToRem(24),
    display: 'flex',
    flexDirection: 'column',
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
    marginBottom: pxToRem(10),
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
}));

export default LibraryDetailContentStyles;
export { LibraryDetailContentStyles };
