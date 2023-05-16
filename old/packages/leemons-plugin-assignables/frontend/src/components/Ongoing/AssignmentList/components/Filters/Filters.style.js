import { createStyles } from '@bubbles-ui/components';

export const useFiltersStyle = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    gap: theme.spacing[5],
  },
  input: {
    flex: '1 0',
  },
  search: {
    flex: '2 0',
  },
}));

export default useFiltersStyle;
