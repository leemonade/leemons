/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem, getFontExpressive } from '@bubbles-ui/components';

export const EvaluationCardFooterStyles = createStyles((theme, { color }) => {
  const { cardEvaluation } = theme.other;
  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 38,
      width: '100%',
      bottom: 0,
      padding: `${pxToRem(16)}`,
      paddingTop: '0px',
      position: 'absolute',
      // backgroundColor: cardEvaluation.background.color.default,
    },
    date: {
      color: theme.colors.text04,
      fontSize: pxToRem(11),
    },
    FileIconRoot: {
      ...getFontExpressive(theme.fontSizes['2']),
      display: 'inline-flex',
      alignItems: 'center',
      color,
    },
    FileIconLabel: {
      ...theme.other.cardLibrary.content.typo.sm,
      color: theme.other.cardLibrary.content.color.muted,
      paddingLeft: pxToRem(8),
    },
    fileIconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    fileLabel: {
      paddingLeft: pxToRem(8),
      color: theme.other.cardLibrary.content.color.muted,
      fontSize: pxToRem(12),
    },
  };
});
