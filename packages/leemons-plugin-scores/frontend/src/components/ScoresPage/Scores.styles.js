import {
  createStyles,
  pxToRem,
  getPaddings,
  getFontExpressive,
  getFontProductive,
} from '@bubbles-ui/components';

export const ScoresStyles = createStyles((theme, { isOpened }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    display: 'flex',
  },

  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: isOpened ? 'calc(100% - 370px)' : '100%',
    transition: 'width 0.3s ease-in-out',
  },
  mainContentTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.interactive03h,
    padding: 4,
    paddingInline: 8,
  },
  tabHeader: {
    backgroundColor: theme.colors.interactive03h,
    width: '100%',
  },
  tableFilters: {
    backgroundColor: theme.colors.interactive03,
    display: 'flex',
    alignItems: 'center',
    padding: 8,
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
}));

export default ScoresStyles;
