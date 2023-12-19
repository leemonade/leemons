import { createStyles, pxToRem } from '@bubbles-ui/components';

const LibraryDetailContentStyles = createStyles((theme) => ({
  root: {
    // ...getFontExpressive(theme.fontSizes['2']),
    // flex: 1,
  },
  lowerContent: {
    flex: 1,
    backgroundColor: theme.colors.ui03,
    padding: `${pxToRem(8)} ${pxToRem(8)} ${pxToRem(8)} ${pxToRem(8)}`,
  },
  tagsContainer: {
    minHeight: 38,
    display: 'flex',
    gap: pxToRem(10),
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: `${pxToRem(8)} ${pxToRem(8)}`,
  },
  tab: {
    '& button[aria-selected="true"]': {
      borderBottomColor: '#B4E600 !important',
    },
  },
  tabPanel: {
    padding: pxToRem(24),
  },
  title: {
    color: theme.other.global.content.color.tertiary.default,
    fontSize: pxToRem(18),
    fontWeight: 500,
    lineHeight: '24px',
    fontStyle: 'normal',
  },
}));

export default LibraryDetailContentStyles;
export { LibraryDetailContentStyles };
