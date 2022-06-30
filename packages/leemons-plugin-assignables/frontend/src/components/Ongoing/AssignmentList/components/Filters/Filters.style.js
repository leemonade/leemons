import { createStyles, getFontExpressive } from '@bubbles-ui/components';

export const useFiltersStyle = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[8],
    gap: theme.spacing[8],
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
    maxWidth: '100%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  gap: {
    gap: theme.spacing[9],
  },
  multiRow: {
    flexWrap: 'wrap',
    '& > *': {
      marginBottom: theme.spacing[5],
    },
  },

  halfWidth: {
    minWidth: '50%',
  },

  segmentRoot: {
    height: '50px',
    padding: 0,
    backgroundColor: theme.colors.interactive03,
    border: `1px solid ${theme.colors.ui01}`,
  },
  segmentLabel: {
    ...getFontExpressive(),
    color: theme.colors.text05,
    boxSizing: 'border-box',
    alignItems: 'center',
    textAlign: 'center',
    display: 'flex',
    height: '100%',
    padding: theme.spacing[4],
    margin: 0,
    '&:hover': {
      color: theme.colors.text01,
    },
  },
  segmentLabelActive: {
    color: `${theme.colors.text01}!important`,
  },
  segmentActive: {
    backgroundColor: theme.white,
    top: 4,
    left: 4,
  },
  segmentControl: {
    border: 'none!important',
  },
}));

export default useFiltersStyle;
