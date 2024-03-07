/* eslint-disable import/prefer-default-export */
import { createStyles, pxToRem } from '@bubbles-ui/components';

export const SubjectItemDisplayStyles = createStyles((theme) => {
  const sidStyles = theme.other.cardLibrary;
  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      gap: pxToRem(8),
    },
    text: {
      color: sidStyles.content.color.subje,
      ...sidStyles.content.typo.md,
      lineHeight: '20px',
    },
    msContainer: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      color: theme.other.core.color.neutral['500'],
    },
    textWrapper: {
      position: 'relative',
      width: '100%',
    },

    programName: {
      ...sidStyles.content.typo.md,
      lineHeight: '20px',
      color: sidStyles.content.color.muted,
      position: 'absolute',
      top: 16,
    },
  };
});
