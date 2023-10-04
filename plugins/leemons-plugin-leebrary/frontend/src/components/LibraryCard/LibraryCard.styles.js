/* eslint-disable import/prefer-default-export */
import { createStyles, getFontExpressive, pxToRem } from '@bubbles-ui/components';

export const LibraryCardStyles = createStyles((theme, { fullHeight }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '4px',
    backgroundColor: theme.colors.mainWhite,
    height: fullHeight ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: pxToRem(254),
    maxWidth: pxToRem(345),
  },
}));
