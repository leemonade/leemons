/* eslint-disable import/prefer-default-export */
import {
  createStyles,
  getFontExpressive,
  pxToRem,
  getBoxShadowFromToken,
} from '@bubbles-ui/components';

export const NYACardStyles = createStyles((theme) => {
  const cardShadow = getBoxShadowFromToken(theme.other.cardAssignments.shadow.hover);
  return {
    root: {
      ...getFontExpressive(theme.fontSizes['2']),
      border: `1px solid ${theme.other.cardLibrary.border.color.subtle}`,
      borderRadius: '4px',
      backgroundColor: theme.other.cardLibrary.background.color.default,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      minWidth: pxToRem(264),
      maxWidth: pxToRem(330),
      minHeight: pxToRem(480),
      '&:hover': {
        boxShadow: cardShadow.boxShadow,
      },
    },
  };
});
