import { createStyles } from '@bubbles-ui/components';

const useResultsGraphStyles = createStyles((theme) => {
  return {
    container: {
      gap: 24,
      marginBottom: 8,
    },
    headerContainer: {
      justifyContent: 'space-between',
      width: '100%',
    },
  };
});

export default useResultsGraphStyles;
