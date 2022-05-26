import { createStyles } from '@bubbles-ui/components';

export const SubjectCardStyles = createStyles(
  (theme, { corrected = false, selected = false } = {}) => ({
    root: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing[4],
      borderRadius: theme.spacing[3],
      backgroundColor: selected && theme.white,
    },
    imageContainer: {
      width: '40px',
      height: '40px',
      position: 'relative',
      marginRight: theme.spacing[4], // (correctionMarker.right + 4px)
    },
    correctionMarker: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '24px',
      height: '24px',
      top: '8px',
      right: '-12px', // - width / 2
      borderRadius: theme.fn.radius(24),
      backgroundColor: corrected ? theme.colors.fatic02 : theme.colors.ui01,
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

export default SubjectCardStyles;
