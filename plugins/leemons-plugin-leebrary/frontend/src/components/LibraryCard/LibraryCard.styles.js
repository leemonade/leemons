/* eslint-disable import/prefer-default-export */
import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const LibraryCardStyles = createStyles((theme, { shadow, fullHeight }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '4px',
    '&:hover': {
      boxShadow:
        shadow &&
        '0px 10px 36px 0px rgba(26, 32, 43, 0.08), 0px 2px 0px 0px rgba(221, 225, 230, 0.08)',
    },
    backgroundColor: theme.colors.mainWhite,
    height: fullHeight ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));
