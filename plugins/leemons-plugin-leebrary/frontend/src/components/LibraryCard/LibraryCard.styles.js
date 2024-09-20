/* eslint-disable import/prefer-default-export */
import {
  createStyles,
  getFontExpressive,
  pxToRem,
  getBoxShadowFromToken,
} from '@bubbles-ui/components';

export const LibraryCardStyles = createStyles(
  (theme, { fullHeight, autoHeight, isCreationPreview }) => {
    const cardTheme = theme.other.cardLibrary;
    const cardShadow = getBoxShadowFromToken(cardTheme.shadow.hover);

    return {
      root: {
        ...getFontExpressive(theme.fontSizes['2']),
        border: `1px solid ${cardTheme.border.color.subtle}`,
        borderRadius: cardTheme.border.radius.sm,
        backgroundColor: cardTheme.background.color.default,
        height: fullHeight ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        minWidth: pxToRem(264),
        maxWidth: pxToRem(330),
        minHeight: autoHeight ? 'auto' : pxToRem(396),
        '&:hover': {
          boxShadow: isCreationPreview ? 'none' : cardShadow.boxShadow,
        },
      },
    };
  }
);
