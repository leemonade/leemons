import { createStyles } from '@bubbles-ui/components';

const useFiltersStyles = createStyles((theme, { classID }) => ({
  title: {
    fontSize: theme.fontSizes[2],
    fontWeight: 500,
  },
  widthContainer: {
    width: classID ? 375 : 750,
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[5],
  },
  inputs: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing[1],
    gap: theme.spacing[5],
    alignItems: 'center',
    '& > *': {
      maxWidth: classID ? '100%' : `calc(50% - ${theme.spacing[5] / 2}px)`, // 50% - inputs.gap
      flexGrow: 1,
    },
  },
}));

export default useFiltersStyles;
