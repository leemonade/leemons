import { createStyles } from '@bubbles-ui/components';

const LikertResponseStyles = createStyles((theme) => ({
  numberElement: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 84,
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: 4,
    cursor: 'pointer',
    span: { fontSize: 24, fontWeight: 500 },
  },
  likertLabel: {
    fontWeight: 500,
  },
}));

export default LikertResponseStyles;
