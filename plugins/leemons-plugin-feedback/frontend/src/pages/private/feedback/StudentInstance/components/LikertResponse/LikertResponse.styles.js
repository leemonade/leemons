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
    '&:hover': {
      borderColor: theme.other.core.color.neutral['300'],
      backgroundColor: theme.other.core.color.primary['100'],
    },
  },
  selectedNumberElement: {
    backgroundColor: `${theme.other.core.color.primary['200']} !important`,
    borderRadius: 4,
    borderColor: `${theme.other.core.color.neutral['300']} !important`,
    height: 84,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: { fontSize: 24, fontWeight: 500 },
  },
  likertLabel: {
    fontWeight: 500,
  },
}));

export default LikertResponseStyles;
