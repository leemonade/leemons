/* eslint-disable import/prefer-default-export */
import {
  createStyles,
  getFontExpressive,
  pxToRem,
  getBoxShadowFromToken,
} from '@bubbles-ui/components';

export const LibraryCardStyles = createStyles((theme, { fullHeight, isHovered }) => {
  const cardShadow = getBoxShadowFromToken(theme.other.cardLibrary.shadow.hover);
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      border: `1px solid ${theme.other.cardLibrary.background.color.subtle}`,
      borderRadius: '4px',
      backgroundColor: theme.other.cardLibrary.background.color.default,
      height: fullHeight ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      minWidth: pxToRem(264),
      maxWidth: pxToRem(345),
      minHeight: pxToRem(396),
      boxShadow: isHovered ? cardShadow.boxShadow : 'none',
    },
  };
});
