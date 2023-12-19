import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

const LibraryDetailPlayerStyles = createStyles((theme, { color }) => ({
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
}));

export default LibraryDetailPlayerStyles;
export { LibraryDetailPlayerStyles };
